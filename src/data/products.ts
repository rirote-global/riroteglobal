// Every product and open-source project. To add one, add an entry here: it then appears on /products,
// gets its own page (generatedPage) and joins the sitemap. ERPTick has its own hand-built page.
import type { ProblemId } from './cases';

/** A screenshot or a short muted clip. Paths are site-relative; `srcset` is for images only. */
export interface ProductMedia {
  kind: 'image' | 'video';
  src: string;
  /** Video still, shown before it plays, under reduced motion and when the clip cannot load. */
  poster?: string;
  srcset?: string;
  alt: string;
  width: number;
  height: number;
}

/** One feature on a product page: text beside its own screenshot or clip. */
export interface ProductFeature {
  id: string;
  title: string;
  text: string;
  points?: string[];
  media?: ProductMedia;
}

export interface Product {
  id: string;
  name: string;
  short: string;
  /** Shown as a badge. Leave out when there is nothing to flag. */
  status?: 'In development' | 'Open source' | 'Free · Early version';
  group: 'Products' | 'Open source';
  tags: ProblemId[];
  /** Relative page path, or a full URL when the project lives elsewhere. */
  path: string;
  generatedPage?: boolean;
  line: string;
  points: string[];
  heading?: [string, string];
  intro?: string;
  note?: string;
  metaTitle?: string;
  description?: string;
  /** Option in the contact form's service list. */
  formService?: string;
  cta?: string;
  link?: { href: string; label: string };
  services?: string[];
  /** schema.org applicationCategory for the generated page. Defaults to BusinessApplication. */
  appCategory?: string;
  /** Licence URL, for open-source projects. */
  license?: string;
  /** Screenshot beside the product's row on the homepage and /products. Without it the row shows its key points. */
  shot?: ProductMedia & { href?: string; hrefLabel?: string; playLabel?: string };
  /** Second button on the product's row, after "Explore". */
  rowCta?: { href: string; label: string };
  /** Clip or screenshot beside the title on the product page. */
  hero?: ProductMedia;
  features?: ProductFeature[];
  /** What a computer needs to run it. `optional` marks things only some features need. */
  requirements?: Array<{ label: string; value: string; optional?: boolean }>;
  /** Download button. While `available` is false it shows disabled, marked "coming soon". */
  download?: { label: string; href: string; available: boolean; platformLine: string; size?: string; version?: string };
  /** First-run steps after installing. */
  firstRun?: string[];
  /** Plain-text credits and terms line shown near the end of the page. */
  credits?: string;
  /** schema.org operatingSystem, for downloadable apps. */
  os?: string;
  /** Free to download and use: adds a zero-price offer to the page's structured data. */
  free?: boolean;
  /** Contact panel wording on the product page, for products that are neither in development nor AI tools. */
  contact?: { eyebrow: string; title: string; lead: string; message: string };
}

/** CSS class for a status badge: oss (open source), free (free download) or dev (in development). */
export const badgeClass = (status?: Product['status']): string =>
  status === 'Open source' ? 'oss' : status === 'Free · Early version' ? 'free' : 'dev';

export const PRODUCTS: Product[] = [
  {
    id: 'erptick', name: 'ERPTick Service Desk', short: 'ERPTick', group: 'Products',
    tags: ['service', 'erp', 'reports'], path: '/products/erptick',
    line: 'The service desk for equipment makers, connected to ERPNext. Breakdown calls, engineer visits, AMC contracts, quotations and response deadlines in one place, with customers, machines and stock taken straight from your ERP.',
    points: ['Tickets with SLA clocks & routing', 'Field visits with customer sign-off', 'AMC contracts & quotations', 'Customer portal, email & WhatsApp'],
    formService: 'ERPTick (our product)',
    shot: {
      kind: 'image', src: '/assets/products/erptick/posters/01-tickets.webp',
      srcset: '/assets/products/erptick/posters/01-tickets-720.webp 720w, /assets/products/erptick/posters/01-tickets.webp 1280w',
      alt: 'ERPTick ticket screen with stage progress, SLA status and AMC coverage.', width: 1280, height: 800,
      href: '/products/erptick#promo', hrefLabel: 'Watch the 90-second ERPTick overview', playLabel: 'Watch the 90-sec overview',
    },
    rowCta: { href: '/products/erptick#get-started', label: 'Talk to Us' },
  },
  {
    id: 'roomcraftr', name: 'Roomcraftr', short: 'Roomcraftr', status: 'In development', group: 'Products',
    tags: ['custom'], path: '/products/roomcraftr', generatedPage: true,
    line: 'Quotes, orders and dealer commissions for curtain and blind shops.',
    points: ['Measure a window, price it and share the quote', 'Orders, payments and fitting visits in one place', 'Dealers quote under your rules, commission tracked in a ledger'],
    heading: ['Quotes, orders and dealers', 'for curtain and blind shops.'],
    intro: 'Software for curtain and blind shops in India. It is still being built, and we will write to you when it is ready.',
    note: 'Roomcraftr is not public yet, so this page shows only what is settled. Screens and a demo will be added here when they exist.',
    metaTitle: 'Roomcraftr: Quotes & Orders for Curtain and Blind Shops',
    description: 'Roomcraftr is software for curtain and blind shops in India: measure, quote, track orders and manage dealer commissions. In development, from Rirote Global.',
    formService: 'Roomcraftr (our product)', cta: 'Tell us you are interested', services: ['full-stack-development'],
  },
  {
    // Facts below come from the app's own README and tauri.conf.json (v0.1.0). Media was recorded from the
    // real app on a demo copy; long waits in the clips are sped up and the text says so.
    id: 'rirote-vision', name: 'RIROTE VISION', short: 'RIROTE VISION', status: 'Free · Early version', group: 'Products',
    tags: ['ai', 'custom'], path: '/products/rirote-vision', generatedPage: true,
    line: 'An AI video studio for Mac. Describe the video, refine it on a timeline, and export it. Free to download.',
    points: [
      'Make a video from a sentence, a script or a reference video',
      'Edit on a timeline, or cut by deleting words from the transcript',
      'Voices, music, captions and cut-outs run on your Mac',
      'Export MP4, MOV, WebM or GIF, checked before and after',
    ],
    heading: ['An AI video studio', 'for your Mac.'],
    intro: 'Describe the video in chat, or start from a script or a reference video. Then refine it on a timeline and export it. Free to download.',
    metaTitle: 'RIROTE VISION: Free AI Video Studio for Mac',
    description: 'RIROTE VISION is a free AI video studio for macOS. Describe a video, edit it on a timeline or its transcript, and export it. Voices and music run on your Mac.',
    formService: 'RIROTE VISION (our product)',
    services: ['ai-integration', 'full-stack-development'],
    appCategory: 'MultimediaApplication', license: 'https://opensource.org/licenses/MIT',
    os: 'macOS 13 or later', free: true,
    shot: {
      kind: 'image', src: '/assets/products/rirote-vision/editor.webp',
      srcset: '/assets/products/rirote-vision/editor-720.webp 720w, /assets/products/rirote-vision/editor.webp 1280w',
      alt: 'RIROTE VISION editor: the assistant beside a preview of a launch video, with scenes, music and sound effects on the timeline.',
      width: 1280, height: 764, href: '/products/rirote-vision#features', hrefLabel: 'See how RIROTE VISION works', playLabel: 'See how it works',
    },
    hero: {
      kind: 'image', src: '/assets/products/rirote-vision/editor.webp',
      srcset: '/assets/products/rirote-vision/editor-720.webp 720w, /assets/products/rirote-vision/editor.webp 1280w',
      alt: 'RIROTE VISION editor playing a 20-second launch video it built, with its timeline below.', width: 1280, height: 764,
    },
    download: {
      label: 'Download for Mac', available: true, version: '0.1.0', size: '7.5 MB',
      href: 'https://github.com/rishabhsisodiya/rirote-vision/releases/download/v0.1.0/RIROTE-VISION-0.1.0-mac.dmg',
      platformLine: 'macOS 13 or later · Apple Silicon and Intel',
    },
    features: [
      { id: 'make', title: 'Make a video from a sentence',
        text: 'Describe the video. The assistant plans the scenes, builds them with a music bed and timed sound effects, and shows you the timeline. In this clip it made a 20-second launch video from real screenshots of our site; the nine-minute build is sped up.',
        points: ['Portrait 9:16, landscape 16:9 or square 1:1', 'Start from a prompt, a script or a reference'],
        media: { kind: 'video', src: '/assets/products/rirote-vision/make.mp4', poster: '/assets/products/rirote-vision/make-poster.webp', alt: 'Clip, sped up: a prompt is typed, the assistant builds the video, and the finished launch video plays.', width: 1280, height: 764 } },
      { id: 'script', title: 'Start from your script',
        text: 'Paste your words and pick a voice, or keep the words on screen. The script stays exactly as you wrote it.',
        media: { kind: 'image', src: '/assets/products/rirote-vision/script.webp', srcset: '/assets/products/rirote-vision/script-720.webp 720w, /assets/products/rirote-vision/script.webp 1280w', alt: 'The Script tab: a script box, a narration choice and the video shape.', width: 1280, height: 764 } },
      { id: 'reference', title: 'Learn a format from a video',
        text: 'Drop in a video or paste a link. The app finds its shots, transcribes the speech and works out the format: pacing, scene kinds, the hook and text on screen. Your video is then built new in that format; nothing of the reference is copied. Here it studies our own ERPTick promo, sped up.',
        media: { kind: 'video', src: '/assets/products/rirote-vision/reference.mp4', poster: '/assets/products/rirote-vision/reference-poster.webp', alt: 'Clip, partly sped up: a video is studied, then its structure is shown as hook, problem, demo and call to action with timings.', width: 1280, height: 764 } },
      { id: 'brand-kits', title: 'Brand kits',
        text: "Keep a business's colours, fonts, logo and tone once, and apply them to any new or existing video.",
        media: { kind: 'image', src: '/assets/products/rirote-vision/brand-kits.webp', srcset: '/assets/products/rirote-vision/brand-kits-720.webp 720w, /assets/products/rirote-vision/brand-kits.webp 1280w', alt: 'A brand kit for Rirote Global with three colours, heading and body fonts, tone and website.', width: 1280, height: 764 } },
      { id: 'timeline', title: 'Edit on a real timeline',
        text: 'Drag clips to move them and drag edges to trim. Split, duplicate, delete, and change track, volume and speed. Every change can be undone.',
        points: ['Waveforms and filmstrips inside clips', 'A keyboard shortcut for every edit'],
        media: { kind: 'video', src: '/assets/products/rirote-vision/timeline.mp4', poster: '/assets/products/rirote-vision/timeline-poster.webp', alt: 'Clip: a sound clip is moved, split at the playhead, trimmed, then each step is undone.', width: 1280, height: 764 } },
      { id: 'transcript', title: 'Cut by deleting words',
        text: 'Transcribe a clip on your Mac, then select words to cut them from the video. Remove filler words and shorten long pauses in one click.',
        media: { kind: 'video', src: '/assets/products/rirote-vision/transcript.mp4', poster: '/assets/products/rirote-vision/transcript-poster.webp', alt: 'Clip: a clip is transcribed, a sentence is selected and cut by its words.', width: 1280, height: 764 } },
      { id: 'captions', title: 'Captions, looks and ready-made blocks',
        text: 'Captions made from the transcript in ready-made styles, tested colour looks for video and images, and transitions, titles, overlays and charts added to the project as editable source.',
        media: { kind: 'image', src: '/assets/products/rirote-vision/captions.webp', srcset: '/assets/products/rirote-vision/captions-720.webp 720w, /assets/products/rirote-vision/captions.webp 1280w', alt: 'The captions library with styles such as Word-Sweep Highlight and Camera Follow Captions.', width: 1280, height: 764 } },
      { id: 'media', title: 'Voices, music and sound, free',
        text: 'Free voices and music beds made on your Mac, sound effects and music from Openverse with each credit saved in the project, and background cut-outs for people in footage.',
        media: { kind: 'image', src: '/assets/products/rirote-vision/media.webp', srcset: '/assets/products/rirote-vision/media-720.webp 720w, /assets/products/rirote-vision/media.webp 1280w', alt: 'The media bin listing the project files, with finished jobs below.', width: 1280, height: 764 } },
      { id: 'assistant', title: 'Ask for any edit',
        text: 'Ask in plain words. The assistant works on the open project, explains its choices, and each request can be undone as one step from History. The wait is sped up here.',
        points: ['Choose how much it may do without asking', 'It uses free sources only, never a paid account'],
        media: { kind: 'video', src: '/assets/products/rirote-vision/assistant.mp4', poster: '/assets/products/rirote-vision/assistant-poster.webp', alt: 'Clip, partly sped up: a request is typed and the assistant adds a video to the timeline.', width: 1280, height: 764 } },
      { id: 'export', title: 'Export, checked',
        text: 'MP4, MOV, WebM or GIF, in draft, standard or delivery quality. The video is checked before rendering and verified after, and exports run in a queue while you keep editing. The render is sped up here.',
        media: { kind: 'video', src: '/assets/products/rirote-vision/export.mp4', poster: '/assets/products/rirote-vision/export-poster.webp', alt: 'Clip, partly sped up: a draft MP4 export runs and finishes at 1920 by 1080, 75.5 seconds.', width: 1280, height: 764 } },
    ],
    requirements: [
      { label: 'Mac', value: 'macOS 13 (Ventura) or later, on Apple Silicon or Intel. So far it has been tested on Apple Silicon.' },
      { label: 'Claude Code', value: "Installed and signed in with your own paid Claude plan. Each request counts against your plan's usage." },
      { label: 'Node.js, FFmpeg and Git', value: 'Used by the video engine. Check Setup finds them but cannot install them.' },
      { label: 'Disk space', value: 'About 120 MB for the video engine.' },
      { label: 'Internet', value: 'For the assistant, reference downloads and sound search. Voices, music, captions, cut-outs and exports run on your Mac.' },
      { label: 'Voiceover and music', value: 'About 400 MB, downloaded once from Check Setup.', optional: true },
      { label: 'Reference links', value: 'yt-dlp, installed from Check Setup.', optional: true },
    ],
    firstRun: [
      'Open the disk image and drag RIROTE VISION into Applications.',
      'The first time, macOS blocks it because the app is not signed by an Apple developer account. Open System Settings > Privacy & Security and click Open Anyway.',
      'In the app, choose RIROTE VISION > Check Setup and install the video engine and the video skills.',
      'Optionally install voiceover and music, and yt-dlp for reference links.',
    ],
    credits: 'Built on HyperFrames, which renders video from HTML. The assistant runs on Claude Code with your own sign-in, so the app stores no API key. RIROTE VISION is not affiliated with or endorsed by HeyGen (HyperFrames) or Anthropic (Claude), and using your Claude plan through it is subject to Anthropic’s terms.',
    contact: { eyebrow: 'Talk to Us', title: 'Want a tool like this built for you?', lead: 'We build desktop and web apps with AI inside. Tell us what you need.', message: 'I would like to talk about building an app with AI.' },
  },
  {
    id: 'stop-guessing', name: 'stop-guessing', short: 'stop-guessing', status: 'Open source', group: 'Open source',
    tags: ['ai', 'team'], path: '/products/stop-guessing', generatedPage: true,
    line: 'Agent Skills that stop a coding agent from inventing decisions nobody made, and from calling a job done when it is not. Free under the MIT licence.',
    points: ['Decisions get written down before the agent builds', 'The work survives a new session or a new machine', 'The same discipline we bring to AI features in client products'],
    heading: ['Guardrails for', 'AI coding agents.'],
    intro: 'Our open-source agent skills stop a coding agent from inventing decisions nobody made, and from calling a job done when it isn’t.',
    metaTitle: 'stop-guessing: Open-Source Guardrails for AI Coding Agents',
    description: 'stop-guessing is a free, MIT-licensed set of Agent Skills that stops AI coding agents from inventing decisions or calling a job done when it is not.',
    cta: 'Talk about AI in your product', link: { href: 'https://github.com/rirote-global/stop-guessing', label: 'View on GitHub' }, services: ['ai-integration'],
    appCategory: 'DeveloperApplication', license: 'https://opensource.org/licenses/MIT',
  },
  {
    id: 'distinctive-ui', name: 'Distinctive UI', short: 'Distinctive UI', status: 'Open source', group: 'Open source',
    tags: ['custom', 'team'], path: '/products/distinctive-ui', generatedPage: true,
    line: 'A Claude Code plugin that runs a real design process, so an AI-built interface looks like your product and not a template. Free under the MIT licence.',
    points: [
      'Reads your code first, then asks only what is missing',
      'Three genuinely different art directions, with a recommendation',
      'Checks its own work in a real browser and fixes what it finds',
      'An honest handover: what was tested and what was not',
    ],
    heading: ['A creative director', 'for Claude Code.'],
    intro: 'Most AI-built interfaces look the same. Our open-source plugin runs intake, a brief, three art directions, the build and a real-browser review, so the result could only belong to your product.',
    metaTitle: 'Distinctive UI: Open-Source Design Plugin for Claude Code',
    description: 'Distinctive UI is a free, MIT-licensed Claude Code plugin that gives AI-built interfaces a distinct identity through intake, art directions, a build and a real-browser review.',
    cta: 'Talk about your product design', link: { href: 'https://github.com/rirote-global/distinctive-ui', label: 'View on GitHub' }, services: ['ai-integration', 'full-stack-development'],
    appCategory: 'DeveloperApplication', license: 'https://opensource.org/licenses/MIT',
  },
  {
    id: 'crack-the-prep', name: 'CrackThePrep', short: 'CrackThePrep', status: 'Open source', group: 'Open source',
    tags: ['team'], path: 'https://rirote-global.github.io/crack-the-prep/',
    line: 'Interview preparation for web developers: notes, questions and worked examples on JavaScript, React, Node.js, system design, data structures and behavioural rounds.',
    points: [],
  },
];
