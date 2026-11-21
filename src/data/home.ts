// Homepage-only content: the "What we build" showcase and the look of each work card. Case facts themselves
// (titles, results, links) come from cases.ts so the homepage and the case pages never disagree.

export interface ShowcaseTab {
  id: string;
  label: string;
  /** Browser-frame media: a still, or a muted clip with its still. */
  browser: { label: string; src: string; poster?: string; video?: boolean; alt: string; width: number; height: number };
  /** Overlapping element: a phone screen, a client logo chip or the Code Vaidya alert. */
  extra?:
    | { kind: 'phone'; src: string; alt: string; light?: boolean }
    | { kind: 'logo'; src: string; alt: string; value: string; label: string }
    | { kind: 'alert'; title: string };
  kicker: string;
  title: string;
  lead: string;
  results: Array<[string, string]>;
  links: Array<{ href: string; label: string; external?: boolean }>;
  /** What comes with this kind of work: "found" shows Found Everywhere, "aftercare" shows Code Vaidya. */
  offer?: 'found' | 'aftercare';
}

/** After launch: Code Vaidya, in beta. Only claims the owner confirmed (no "a person checks every fix" yet). */
export const AFTERCARE = {
  title: 'After launch · Code Vaidya',
  status: 'In beta testing',
  lead: 'Your app keeps being watched once it is live. When something breaks, we know before your customers call.',
  items: [
    ['Captures it', 'The error, the steps that led to it and the server logs, in one place.'],
    ['Alerts us', 'An email the moment it happens, readable on a phone.'],
    ['Points to the fix', 'The likely cause, and a drafted fix for us to work from.'],
    ['Tells you', 'A short note on what broke and what changed, automatically and on request.'],
  ] as Array<[string, string]>,
  link: { href: '/products/code-vaidya', label: 'How Code Vaidya works →' },
};

export const SHOWCASE: ShowcaseTab[] = [
  {
    id: 'web', label: 'Websites',
    browser: { label: 'theangaraa.com', src: '/assets/home/angaraa-live.webp', alt: 'The ANGARAA website on a laptop', width: 1440, height: 900 },
    extra: { kind: 'phone', src: '/assets/home/angaraa-phone.webp', alt: 'The ANGARAA website on a phone' },
    kicker: 'ANGARAA · Jaipur · live',
    title: 'A charcoal brand’s new website, where every order goes straight to WhatsApp.',
    lead: 'Designed and developed by us on Astro, with a price dial, a kitchen calculator and an order slip.',
    results: [['84 → 99', 'phone speed, old site against the new one'], ['12', 'pages listed for search engines, up from none']],
    offer: 'found',
    links: [
      { href: 'https://theangaraa.com', label: 'Visit theangaraa.com ↗', external: true },
      { href: '/projects/angaraa-charcoal-website', label: 'Read the case study →' },
    ],
  },
  {
    id: 'app', label: 'Web apps',
    browser: { label: 'getnimnim.com', src: '/assets/home/nimnim-web.webp', alt: 'The NimNim website on a laptop', width: 1440, height: 900 },
    extra: { kind: 'phone', src: '/assets/home/nimnim-phone.webp', alt: 'The NimNim website on a phone', light: true },
    kicker: 'NimNim · USA · live laundry platform',
    title: 'Six live apps for a laundry business, made faster, cheaper and safer while customers kept ordering.',
    lead: 'A customer website, partner, driver, buildings and admin apps, and the server behind them. We also build service desks and platforms connected to your ERP.',
    results: [['50%', 'lower AWS bill'], ['4 → 2', 'servers across production and dev, now hardened']],
    offer: 'aftercare',
    links: [
      { href: 'https://getnimnim.com/', label: 'Visit getnimnim.com ↗', external: true },
      { href: '/projects/nimnim', label: 'Read the case study →' },
    ],
  },
  {
    id: 'ai', label: 'AI solutions',
    browser: { label: 'RIROTE VISION', src: '/assets/products/rirote-vision/make.mp4', poster: '/assets/products/rirote-vision/make-poster.webp', video: true, alt: 'RIROTE VISION making a video from a sentence', width: 1280, height: 764 },
    kicker: 'RIROTE VISION · our AI video studio',
    title: 'AI that does real work, with clear rules about what it may do alone.',
    lead: 'Assistants that answer from your own documents, automations with clear rules about what they may do alone, and our own AI video studio for Mac.',
    results: [['Free', 'RIROTE VISION: describe a video, edit it on a timeline, export it'], ['3', 'open-source tools for people building with AI']],
    links: [
      { href: '/services/ai-integration', label: 'AI assistants & automation →' },
      { href: '/products/rirote-vision', label: 'About RIROTE VISION →' },
    ],
  },
];

/** How each case looks on its homepage work card. Cases not listed here are not on the homepage. */
export const WORK_CARDS: Array<{ slug: string; line?: string; visual: { kind: 'image'; src: string; alt: string } | { kind: 'nimnim' } | { kind: 'infra' } | { kind: 'delivery' } | { kind: 'number'; value: string; label: string; tone: string } }> = [
  { slug: 'angaraa-charcoal-website', line: 'Designed and developed by us, on Astro.', visual: { kind: 'image', src: '/assets/home/angaraa-live.webp', alt: 'The new ANGARAA website' } },
  { slug: 'nimnim', visual: { kind: 'nimnim' } },
  { slug: 'unified-erp-service-platform', visual: { kind: 'infra' } },
  { slug: 'multi-service-delivery-platform', visual: { kind: 'delivery' } },
];
