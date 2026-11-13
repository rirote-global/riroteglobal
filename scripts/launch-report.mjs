#!/usr/bin/env node
// Launch report: checks a live website the way Google and AI assistants read it, and writes the
// results as JSON for the launch report page (src/pages/launch-report.astro).
//
//   node scripts/launch-report.mjs https://riroteglobal.com src/data/launch-reports/riroteglobal.json
//   add --no-lighthouse to skip the speed test (about two minutes)
//
// Reads only: it fetches public pages and runs Google Lighthouse from this machine. Node 22+.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const [BASE, OUT] = args.filter((a) => !a.startsWith('--'));
const LIGHTHOUSE = !args.includes('--no-lighthouse');
if (!BASE || !OUT) {
  console.error('usage: node scripts/launch-report.mjs <https://site> <out.json> [--no-lighthouse]');
  process.exit(2);
}
const origin = new URL(BASE).origin;
const UA = 'Mozilla/5.0 (compatible; RiroteLaunchReport/1.0)';

const get = async (url, opts = {}) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: opts.redirect ?? 'follow' });
  return { status: res.status, url: res.url, location: res.headers.get('location'), type: res.headers.get('content-type') ?? '', text: opts.body === false ? '' : await res.text() };
};

const first = (html, re) => (html.match(re) || [])[1]?.trim() ?? null;
const decode = (s) => s && s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** schema.org types in a page's JSON-LD, including @graph items and multi-type arrays. */
const schemaTypes = (html) => {
  const types = new Set();
  for (const [, block] of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const json = JSON.parse(block);
      const items = Array.isArray(json) ? json : json['@graph'] ?? [json];
      for (const item of items) [].concat(item['@type'] ?? []).forEach((t) => types.add(t));
    } catch { types.add('(unreadable)'); }
  }
  return [...types];
};

function checkPage(path, html, status) {
  const title = decode(first(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const description = decode(first(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i));
  const h1s = html.match(/<h1[\s>]/gi)?.length ?? 0;
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((tag) => !/\salt(\s|=|\/?>)/i.test(tag)).length; // a bare alt (decorative) counts
  const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
  const page = {
    path, status, title, description,
    canonical: first(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
    shareImage: Boolean(first(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)),
    lang: first(html, /<html[^>]*\blang=["']([^"']*)["']/i),
    h1s, images: imgs.length, imagesWithoutAlt: noAlt, noindex,
    schema: schemaTypes(html),
  };
  page.issues = [
    status !== 200 && `answers ${status}`,
    !title && 'no title',
    title && title.length > 65 && `title is ${title.length} characters (over 65 gets cut off)`,
    !description && 'no description',
    description && description.length > 160 && `description is ${description.length} characters (over 160 gets cut off)`,
    !page.canonical && 'no canonical address',
    !page.shareImage && 'no share image',
    h1s !== 1 && `${h1s} main headings (should be 1)`,
    noAlt > 0 && `${noAlt} images without alt text`,
    page.schema.length === 0 && 'no structured data',
    noindex && 'hidden from search (noindex) but listed in the sitemap',
  ].filter(Boolean);
  return page;
}

function lighthouse(url, strategy) {
  const dir = mkdtempSync(join(tmpdir(), 'lr-'));
  const file = join(dir, 'lh.json');
  try {
    execFileSync('npx', ['-y', 'lighthouse@12.2.1', url, '--quiet', '--output=json', `--output-path=${file}`,
      '--chrome-flags=--headless=new', ...(strategy === 'desktop' ? ['--preset=desktop'] : [])], { stdio: 'ignore', timeout: 240_000 });
    const lh = JSON.parse(readFileSync(file, 'utf8'));
    const score = (k) => Math.round((lh.categories[k]?.score ?? 0) * 100);
    const ms = (k) => Math.round(lh.audits[k]?.numericValue ?? 0);
    return {
      strategy,
      performance: score('performance'), accessibility: score('accessibility'), bestPractices: score('best-practices'), seo: score('seo'),
      firstPaintMs: ms('first-contentful-paint'), mainContentMs: ms('largest-contentful-paint'),
      layoutShift: Number((lh.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)),
      pageKB: Math.round((lh.audits['total-byte-weight']?.numericValue ?? 0) / 1024),
    };
  } catch (error) {
    return { strategy, error: String(error.message).slice(0, 200) };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

/** Lighthouse scores swing between runs, so run it three times and keep the median run by speed score. */
function lighthouseMedian(url, strategy, runs = 3) {
  const ok = Array.from({ length: runs }, () => lighthouse(url, strategy)).filter((r) => !('error' in r));
  if (!ok.length) return lighthouse(url, strategy);
  ok.sort((a, b) => a.performance - b.performance);
  return { ...ok[Math.floor(ok.length / 2)], runs: ok.length, performanceRange: [ok[0].performance, ok.at(-1).performance] };
}

// ── Site files ──
// A preview address (e.g. *.workers.dev) still names the final domain in robots.txt and the sitemap,
// so every address found there is moved onto the site being checked.
const onSite = (url) => { const u = new URL(url, origin); return origin + u.pathname + u.search; };
const robots = await get(`${origin}/robots.txt`);
const sitemapUrl = onSite(first(robots.text, /^sitemap:\s*(\S+)/im) ?? `${origin}/sitemap.xml`);
const sitemap = await get(sitemapUrl);
let locs = sitemap.status === 200 ? [...sitemap.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => onSite(m[1])) : [];
// A sitemap index lists other sitemaps; read those too.
if (/<sitemapindex/i.test(sitemap.text)) {
  const nested = await Promise.all(locs.map((u) => get(u)));
  locs = nested.flatMap((s) => [...s.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => onSite(m[1])));
}
// No sitemap: check the homepage at least.
const noSitemap = locs.length === 0;
if (noSitemap) locs = [`${origin}/`];
const llms = await get(`${origin}/llms.txt`);
const missing = await get(`${origin}/this-page-does-not-exist-${Date.now()}`, { body: false });
const plain = await get(origin.replace(/^https:/, 'http:') + '/', { redirect: 'manual', body: false });

/** robots.txt as groups: the user-agents a group names, and whether it disallows the whole site. */
function robotsGroups(text) {
  const groups = [];
  let current = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/#.*/, '').trim();
    const [, key, value] = line.match(/^([a-z-]+)\s*:\s*(.*)$/i) ?? [];
    if (!key) continue;
    if (key.toLowerCase() === 'user-agent') {
      if (!current || current.rulesStarted) groups.push((current = { agents: [], blocksAll: false, rulesStarted: false }));
      current.agents.push(value.toLowerCase());
    } else if (current) {
      current.rulesStarted = true;
      if (key.toLowerCase() === 'disallow' && value === '/') current.blocksAll = true;
    }
  }
  return groups;
}

// AI crawlers we expect to be allowed. A crawler follows the group that names it, or else the "*" group.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];
const groups = robotsGroups(robots.status === 200 ? robots.text : '');
const blockedBots = AI_BOTS.filter((bot) => {
  const own = groups.find((g) => g.agents.includes(bot.toLowerCase())) ?? groups.find((g) => g.agents.includes('*'));
  return Boolean(own?.blocksAll);
});

const site = {
  https: plain.status >= 300 && plain.status < 400 && (plain.location ?? '').startsWith('https://'),
  robots: robots.status === 200,
  aiCrawlersAllowed: robots.status === 200 && blockedBots.length === 0,
  blockedBots,
  sitemap: sitemap.status === 200 && !noSitemap,
  sitemapUrl,
  llms: llms.status === 200 && /^#\s+\S/.test(llms.text.trim()),
  llmsLines: llms.status === 200 ? llms.text.trim().split('\n').length : 0,
  notFoundAnswers404: missing.status === 404,
};

// ── Pages, a few at a time ──
const pages = [];
for (let i = 0; i < locs.length; i += 6) {
  const batch = await Promise.all(locs.slice(i, i + 6).map(async (loc) => {
    const r = await get(loc);
    return checkPage(new URL(loc).pathname, r.text, r.status);
  }));
  pages.push(...batch);
}

const speed = LIGHTHOUSE ? [lighthouseMedian(`${origin}/`, 'mobile'), lighthouseMedian(`${origin}/`, 'desktop')] : [];

const report = {
  site: origin,
  checkedAt: new Date().toISOString(),
  tool: 'scripts/launch-report.mjs with Lighthouse 12.2.1 (median of 3 runs)',
  site_files: site,
  speed,
  pages,
  summary: {
    pages: pages.length,
    pagesWithIssues: pages.filter((p) => p.issues.length).length,
    schemaTypes: [...new Set(pages.flatMap((p) => p.schema))].sort(),
  },
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ site: report.site_files, speed, summary: report.summary, issues: pages.filter((p) => p.issues.length).map((p) => [p.path, p.issues]) }, null, 1));
