// Site-wide facts. Change them here, never in individual pages.

export interface ShareImage {
  path: string;
  width: number;
  height: number;
  alt: string;
}

export const SITE = {
  name: 'Rirote Global',
  url: 'https://riroteglobal.com',
  email: 'info@riroteglobal.com',
  /** The design gallery (separate static site, built from ~/startup/designs). */
  designsUrl: 'https://designs.riroteglobal.com',
  legal: {
    name: 'Rirote Global',
    type: 'Sole proprietorship',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
  },
  defaultImage: {
    path: '/assets/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'Rirote Global logo',
  } satisfies ShareImage,
} as const;

/** Google Analytics 4 measurement ID. Loads only after the visitor accepts cookies (ConsentBanner).
 *  Leave empty to remove analytics and the consent banner. */
export const GA_ID = 'G-W050S5NEBB';

/** Official company profiles: linked in every footer and listed as schema.org sameAs. */
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/rirote-global/' },
  { label: 'YouTube', url: 'https://www.youtube.com/channel/UCl11RgCfdXUcOZxbbplZIXA' },
  { label: 'Instagram', url: 'https://www.instagram.com/riroteglobal/' },
  { label: 'X', url: 'https://x.com/riroteglobal' },
  { label: 'GitHub', url: 'https://github.com/rirote-global' },
] as const;

export const SOCIAL_PROFILES = SOCIAL_LINKS.map((link) => link.url);

/** Company track record, shown on the homepage, About and Projects pages. */
export const COMPANY_STATS = {
  projects: { value: '11+', label: 'Projects Delivered' },
  industries: { value: '5+', label: 'Industries Served' },
  regions: { value: '3', label: 'Regions: India, US & Middle East' },
} as const;

/** Absolute URL on the live domain, e.g. absoluteUrl('/products') → https://riroteglobal.com/products */
export const absoluteUrl = (path: string): string => new URL(path, SITE.url).href;

/** Link to the contact page with the form pre-filled (read by site.js; the page's canonical stays /contact). */
export const contactUrl = (input: { service?: string; message?: string } = {}): string => {
  const q = new URLSearchParams();
  if (input.service) q.set('service', input.service);
  if (input.message) q.set('message', input.message);
  const qs = q.toString();
  return qs ? `/contact?${qs}` : '/contact';
};
