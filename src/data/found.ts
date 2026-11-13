// "Found Everywhere": what every website we build includes, shown on the Websites & Web Apps page
// (components/FoundEverywhere.astro), the homepage band and the sample launch report.
// Every claim here is something we deliver on every website. Do not add one we cannot show.

export const FOUND_PATH = '/services/full-stack-development#found';
export const LAUNCH_REPORT_PATH = '/launch-report';

export const FOUND = {
  name: 'Found Everywhere',
  title: ['A website now has', 'three visitors.'],
  lead: 'Your customer, Google and ChatGPT. More and more people ask an AI assistant before they search, so your website has to answer all three. Every website we build does.',
  promises: [
    {
      id: 'fast',
      name: 'Fast',
      line: 'For your customer',
      text: 'Pages open at once, even on slow mobile data. Nothing to install or update, so there is less to break or get hacked.',
      tech: 'Built with Astro: plain HTML, almost no JavaScript',
    },
    {
      id: 'found',
      name: 'Found',
      line: 'For Google',
      text: 'Google understands what you sell, where and when, and can show it right in the search result.',
      tech: 'Titles, descriptions, schema.org data, sitemap, Search Console',
    },
    {
      id: 'answered',
      name: 'Answered',
      line: 'For ChatGPT and other AI assistants',
      text: 'When someone asks an AI about your trade in your city, it has your facts in plain words, and your business is set up on ChatGPT\'s Business Hub.',
      tech: 'llms.txt, AI crawlers allowed, ChatGPT Business Hub',
    },
  ],
  /** "Included in every website", grouped by promise. */
  checklist: [
    { promise: 'fast', items: [
      ['Pages that open instantly', 'Built with Astro, so a page is plain HTML instead of an app the phone must run first.'],
      ['Images sized for every screen', 'Each photo is resized and compressed, so phones never download a desktop-sized picture.'],
      ['Every phone, down to 360 px', 'Checked on small phones, large phones, tablets and desktops before launch.'],
      ['No plugins to keep updating', 'Nothing like a WordPress plugin that breaks or needs security patches every month.'],
    ] },
    { promise: 'found', items: [
      ['A title and description for every page', 'Written for the search result, within the length Google shows.'],
      ['Structured data', 'Your business, address, hours, services and FAQs in the schema.org format Google reads.'],
      ['Sitemap sent to Google', 'Search Console set up in your name, so you can see how people find you.'],
      ['Links that look right when shared', 'A share image and title for WhatsApp, LinkedIn and other apps.'],
      ['Your old pages kept', 'When we replace a site, old addresses forward to the new ones, so you keep the traffic you have.'],
    ] },
    { promise: 'answered', items: [
      ['An llms.txt file', 'A plain-text guide to your business for AI assistants, built from your pages so it never falls out of date.'],
      ['AI crawlers welcome', 'Your robots.txt lets ChatGPT, Claude, Perplexity and Google\'s AI read the site.'],
      ['Facts in words, not only pictures', 'Prices, areas served and opening hours written as text an AI can quote, not only inside images.'],
      ['Answers to real questions', 'An FAQ written from the questions your customers actually ask.'],
      ['Your ChatGPT business profile', 'We set up your business on ChatGPT\'s Business Hub, so you are listed from the start as it rolls out.'],
    ] },
  ] as Array<{ promise: string; items: Array<[title: string, text: string]> }>,
  handover: [
    ['A launch report', 'Every check above, run on your live site, with the results in writing.'],
    ['You own everything', 'The code, the domain and every account are in your name.'],
  ] as Array<[title: string, text: string]>,
} as const;
