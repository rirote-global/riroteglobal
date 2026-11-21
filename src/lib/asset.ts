// Versioned URLs for the site's own CSS and JS: "/assets/site.css" → "/assets/site.css?v=<hash of the file>".
// The files are cached by browsers, so a new build must change the URL or visitors keep the old styles for up to
// an hour (a page built for new CSS then shows with old CSS: icons and layouts break). The hash only changes
// when the file does, so unchanged files stay cached. Runs at build time.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const cache = new Map<string, string>();
export function asset(path: string): string {
  if (!cache.has(path)) {
    let v = '';
    try { v = createHash('sha1').update(readFileSync(join(process.cwd(), 'public', path))).digest('hex').slice(0, 10); } catch { /* missing file: plain URL */ }
    cache.set(path, v ? `${path}?v=${v}` : path);
  }
  return cache.get(path)!;
}
