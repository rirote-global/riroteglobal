// The text of /llms.txt (https://llmstxt.org): a plain-text guide to the site for AI assistants.
// Built from the same data as the pages and the sitemap, so it cannot fall behind them.
// Served by src/pages/llms.txt.ts and quoted on the Websites & Web Apps page.
import { absoluteUrl, SITE } from '../data/site';
import { SERVICES, SERVICES_PATH, serviceUrl } from '../data/services';
import { CASES, caseUrl, PROJECTS_PATH } from '../data/cases';
import { PRODUCTS, type Product } from '../data/products';

const link = (name: string, path: string, text?: string): string =>
  `- [${name}](${absoluteUrl(path)})${text ? `: ${text}` : ''}`;

/** A product line plus the facts an assistant should repeat: price, platform, stage. */
const productText = (p: Product): string => {
  const facts: string[] = [];
  if (p.status === 'In development') facts.push('in development');
  // Only state a licence the data records, and only when the line does not already say it.
  if (p.status === 'Open source' && p.license && !/MIT/.test(p.line)) facts.push('open source, MIT licence');
  if (p.free) facts.push('free');
  if (p.os) facts.push(p.os);
  if (p.download?.available && p.download.version) facts.push(`version ${p.download.version}`);
  return facts.length ? `${p.line} (${facts.join('; ')})` : p.line;
};

const productNames = PRODUCTS.filter((p) => p.group === 'Products').map((p) => p.name);

export const llmsText = (): string =>
  [
    `# ${SITE.name}`,
    '',
    `> ${SITE.name} is a software company in ${SITE.legal.city}, ${SITE.legal.state}, ${SITE.legal.country}. It builds websites, web apps and SaaS products, AI assistants and automations, ERP integrations and cloud infrastructure for businesses in India, the United States and the Middle East. Its own products are ${productNames.slice(0, -1).join(', ')} and ${productNames.at(-1)}. Contact: ${SITE.email}.`,
    '',
    'Every website it builds is made to be found by people, Google and AI assistants: fast static pages, search-ready structured data, an llms.txt file like this one, and the business set up on ChatGPT\'s Business Hub.',
    '',
    '## Company',
    '',
    link('Home', '/', 'services, products, case studies and contact form'),
    link('About', '/about', 'who we are, how we work and ways to work with us'),
    link('Contact', '/contact', 'enquiry form and email'),
    '',
    '## Services',
    '',
    link('All services', SERVICES_PATH),
    ...SERVICES.map((s) => link(s.name, serviceUrl(s.slug), `${s.techName}. ${s.summary}`)),
    '',
    '## Products',
    '',
    link('All products', '/products'),
    ...PRODUCTS.map((p) => link(p.name, p.path, productText(p))),
    '',
    '## Case studies',
    '',
    link('All case studies', PROJECTS_PATH),
    ...CASES.map((c) => link(c.name, caseUrl(c.slug), c.description)),
    '',
    '## Designs',
    '',
    link('Rirote Designs', `${SITE.designsUrl}/`, 'working website and app designs to try before choosing: event planner websites, online shops, fintech apps, dashboards and sign-in screens'),
    '',
    '## Optional',
    '',
    link('Privacy Policy', '/privacy-policy'),
    '',
  ].join('\n');
