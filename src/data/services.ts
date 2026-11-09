// The services Rirote Global offers: one entry per homepage service card, each with its own page
// at /services/<slug>. Every claim here must be backed by the case studies on /projects or the
// homepage. Never add a client name, figure or result that the site doesn't already state.
import type { FaqItem } from '../lib/schema';

export const SERVICES_PATH = '/services';

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceProof {
  kicker: string;
  title: string;
  text: string;
  stats?: ServiceStat[];
  link?: { href: string; label: string };
}

export interface Service {
  slug: string;
  /** Card and menu name, in plain words for non-technical buyers. */
  name: string;
  /** The technical name for the same service: shown in the page breadcrumb and as schema serviceType. */
  techName: string;
  /** H1, split so the second line takes the accent colour. */
  heading: [string, string];
  /** <title>, under 65 characters. */
  metaTitle: string;
  /** Meta description, under 160 characters. */
  description: string;
  /** One sentence, used on cards and in schema.org offers. */
  summary: string;
  /** Hero paragraph. */
  intro: string;
  includes: Array<{ title: string; text: string }>;
  proof: ServiceProof[];
  faq: FaqItem[];
  related: string[];
  /** Optional row linking to the design gallery (designs.riroteglobal.com). */
  designs?: { title: string; text: string; links: Array<{ path: string; label: string; text: string }> };
}

export const serviceUrl = (slug: string): string => `${SERVICES_PATH}/${slug}`;

/** How every engagement runs, shown on each service page. */
export const SERVICE_STEPS: Array<{ title: string; text: string }> = [
  { title: 'Understand', text: 'We start from what has to change for the business: the problem, the people who will use the software and the systems it must connect to.' },
  { title: 'Decide', text: 'What the software must do, and the trade-offs, are written down and agreed before building, so nobody has to guess later.' },
  { title: 'Build', text: 'Small releases you can see and test, with security, monitoring and performance built in rather than added at the end.' },
  { title: 'Run', text: 'The same team deploys and supports what it built, with no hand-offs where context gets lost.' },
];

/** Ways to work with us, shown on /about and /services. */
export const ENGAGEMENTS: Array<{ title: string; text: string; href?: string }> = [
  { title: 'Fixed-scope projects', text: 'A clear outcome, scope and timeline, from a first version to a full product.' },
  { title: 'Dedicated developers', text: 'Experienced developers who join your team full-time or part-time, vetted and managed by us.', href: '/services/dedicated-engineers' },
  { title: 'Ready-built products', text: 'Software like ERPTick, set up and adapted to the way your team works.', href: '/products' },
];

const caseLink = (slug: string) => ({ href: `/projects/${slug}`, label: 'Read the case study →' });

const UNIFIED_ERP: ServiceProof = {
  kicker: 'Case study · Enterprise ERP · India',
  title: 'One platform for 9 business entities',
  text: 'An infrastructure group ran service ticketing and executive reporting as two separate apps on two servers, with dashboards querying 5 ERPNext sites one after another. Delivered with an agency partner, we replaced both with one platform: a NestJS ticketing engine with a 9-state SLA workflow, two-way ERPNext sync, and 11 role-based dashboards on a parallel multi-site middleware with Redis caching.',
  stats: [
    { value: '<500ms', label: 'Dashboard loads, down from 5s+' },
    { value: '2 → 1', label: 'Apps and servers merged' },
    { value: '11', label: 'Role-based dashboards' },
  ],
  link: caseLink('unified-erp-service-platform'),
};

const NIMNIM: ServiceProof = {
  kicker: 'Case study · SaaS · USA',
  title: 'A live laundry platform, stabilised and rebuilt',
  text: 'NimNim runs on-demand laundry and dry-cleaning across Boston, New York and Miami. We took over a production platform spread across loosely secured EC2 instances, consolidated it onto one hardened server behind Nginx and Cloudflare, fixed slow MongoDB queries, secured the API and delivered a full revamp while customers kept ordering.',
  stats: [
    { value: '50%', label: 'Lower AWS bill' },
    { value: '50%', label: 'Faster API responses' },
    { value: '1', label: 'Hardened server replacing many' },
  ],
  link: caseLink('nimnim'),
};

const FOUNDRY: ServiceProof = {
  kicker: 'Case study · Manufacturing ERP · India',
  title: 'A foundry ERP that talks to ERPNext safely',
  text: 'A domain-specific ERP for a foundry, from sales order to dispatch across a 17-module map, with heat-number genealogy as the traceability key. It integrates with the client’s existing ERPNext only for finance and payroll, through a REST-only boundary with idempotent correlation-ID calls, retry and backoff queues, and a nightly reconciliation run for one-sided records.',
  link: caseLink('foundry-operations-erp'),
};

const MULTI_SERVICE: ServiceProof = {
  kicker: 'Case study · Logistics & delivery',
  title: 'Food, parcels and rides on one platform',
  text: 'A unified platform for food delivery, parcel logistics and ride booking, built on microservices so each vertical scales on its own. We led the engineering team, drove product decisions and owned features from API design through production support.',
  link: caseLink('multi-service-delivery-platform'),
};

const ECOMMERCE: ServiceProof = {
  kicker: 'Case study · E-commerce · India',
  title: 'A monolith-to-microservices plan for a high-traffic store',
  text: 'For a high-traffic Indian e-commerce platform, we designed the system architecture, planned the migration from a monolith to microservices, led the redesign and improved backend performance, working directly with business stakeholders.',
  link: caseLink('high-traffic-ecommerce-platform'),
};

const SHOPIFY: ServiceProof = {
  kicker: 'Case study · E-commerce',
  title: 'Shopify stores built, sped up and automated',
  text: 'End-to-end Shopify work for fashion, lifestyle and homeware brands: bespoke themes, custom apps and faster stores, with bulk product listing automated through Google Sheets to save hours of manual work.',
  link: caseLink('shopify-store-projects'),
};

const STOP_GUESSING: ServiceProof = {
  kicker: 'Open source · MIT',
  title: 'stop-guessing: guardrails for AI coding agents',
  text: 'Our open-source agent skills stop a coding agent from inventing decisions nobody made, and from calling a job done when it isn’t. Decisions get written down first, and the work survives a new session or a new machine. It is the same discipline we bring to AI features in client products.',
  link: { href: '/products/stop-guessing', label: 'About stop-guessing →' },
};

const ERPTICK: ServiceProof = {
  kicker: 'Our product',
  title: 'ERPTick Service Desk',
  text: 'We build on ERPNext ourselves. ERPTick is our service desk for equipment makers: tickets, field visits, AMC contracts and quotations, with customers, machines and stock read from ERPNext and draft invoices written back only when you switch it on.',
  link: { href: '/products/erptick', label: 'Explore ERPTick →' },
};

export const SERVICES: Service[] = [
  {
    slug: 'full-stack-development',
    name: 'Websites & Web Apps',
    techName: 'Full-stack development',
    heading: ['Websites &', 'Web Apps'],
    metaTitle: 'Website & Web App Development (Full-Stack) | Rirote Global',
    description: 'Websites, web apps and online products for businesses, from a first version to a busy live product. Planned, built and looked after by one Jaipur team.',
    summary: 'Websites, web apps and online products, built to grow from a first version to a busy, live product.',
    intro: 'We build websites, web apps and online products for businesses, from a simple first version to software your customers and staff use every day. One team plans it, builds it, puts it live and looks after it afterwards.',
    includes: [
      { title: 'Planning the first version', text: 'We agree what the software must do and what can wait, and write it down before building, so you get what your business actually needs.' },
      { title: 'Web apps and online products', text: 'Fast, mobile-friendly screens your customers and staff can use on any device, including as an app on their phone.' },
      { title: 'The system behind the screens', text: 'The databases and connections that store your data, control who can see what, and keep a record of every change.' },
      { title: 'Logins and security', text: 'Secure sign-in, permission checks on every screen, and passwords and keys kept out of the code.' },
      { title: 'Taking over existing software', text: 'If another team built it, we first make it stable and fix the urgent problems, then improve it without stopping your business.' },
      { title: 'Launch and support', text: 'We put it live, watch it and fix issues afterwards, so the people who built it are the ones who keep it running.' },
    ],
    proof: [UNIFIED_ERP, NIMNIM, MULTI_SERVICE, SHOPIFY],
    faq: [
      { question: 'Can you take over a product another team built?', answer: 'Yes. We start by stabilising what is live: infrastructure, urgent bugs and security. Then we plan improvements or a revamp that keeps the product running for its users, as we did for NimNim.' },
      { question: 'Do you build MVPs or only large platforms?', answer: 'Both. We scope a first version around the one outcome the business needs, and design the data model and APIs so the product can grow without a rewrite.' },
      { question: 'Who owns the code?', answer: 'You do. The code, the infrastructure accounts and the documentation are yours, and we can work inside your repositories from day one.' },
    ],
    related: ['ai-integration', 'cloud-devops', 'technical-leadership'],
    designs: {
      title: 'Designs you can try',
      text: 'Open a working design on your phone before you decide. Each one is a full page with placeholder content, ready to be built with your own photos and words.',
      links: [
        { path: '/event-planner/', label: 'Event planner websites', text: 'Six homepages for wedding planners and event managers, with enquiries straight to WhatsApp.' },
        { path: '/shop/', label: 'Online shops', text: 'A made-to-order shop with a gift builder and WhatsApp orders.' },
        { path: '/', label: 'All designs', text: 'Websites, dashboards, fintech apps and sign-in screens.' },
      ],
    },
  },
  {
    slug: 'ai-integration',
    name: 'AI Assistants & Automation',
    techName: 'AI agents and LLM integration',
    heading: ['AI Assistants &', 'Automation'],
    metaTitle: 'AI Integration & Automation Services, India | Rirote Global',
    description: 'AI assistants and automations that work with your own documents and data, with clear rules and checks so you can trust the answers.',
    summary: 'AI assistants and automations that work with your own documents and data, with checks so you can trust the answers.',
    intro: 'We add AI to your business software: assistants that answer from your own documents and records, and automations that handle repetitive steps. Every AI feature gets clear rules about what it may do, and checks so its answers can be trusted.',
    includes: [
      { title: 'Choosing where AI helps', text: 'Finding the tasks where AI saves real time, and being clear about the ones where it should not act alone.' },
      { title: 'Assistants that know your business', text: 'Chat and search that answer from your own documents and records, and show where each answer came from.' },
      { title: 'Automating multi-step work', text: 'AI that carries out a series of steps in your systems with limited permissions, and asks a person when a decision is needed.' },
      { title: 'AI inside your existing screens', text: 'Summaries, drafts, sorting and data extraction built into the software your team already uses.' },
      { title: 'Rules and checks', text: 'Written rules for what the AI may and may not do, plus tests that catch mistakes before your users see them.' },
      { title: 'Cost and quality tracking', text: 'Reports on what each AI feature costs and how often it gets things right.' },
    ],
    proof: [STOP_GUESSING],
    faq: [
      { question: 'Which AI models do you work with?', answer: 'We choose the model for the task, its cost and where your data is allowed to go. The integration is built so the model can be changed later without rewriting the feature.' },
      { question: 'How do you stop an AI feature from making things up?', answer: 'By narrowing what it is asked to do, grounding answers in your own data with sources shown, checking outputs before they reach users, and keeping a person in the loop for decisions that matter.' },
      { question: 'Can you add AI to our existing product?', answer: 'Yes. Most of our AI work sits inside an existing product or workflow, connected through your current APIs and permissions rather than as a separate tool.' },
    ],
    related: ['full-stack-development', 'data-pipelines', 'dedicated-engineers'],
  },
  {
    slug: 'erp-integration',
    name: 'ERP Integration',
    techName: 'ERP integration and custom modules',
    heading: ['ERP', 'Integration'],
    metaTitle: 'ERP Integration & Custom ERP Development | Rirote Global',
    description: 'Connect your ERP to your other software, add custom modules and build management dashboards, from a Jaipur team that builds its own software products.',
    summary: 'Connect your ERP to your other software, add the modules it\'s missing, and get dashboards your management can use.',
    intro: 'We connect your ERP to the rest of your software, build the modules your business needs when your standard ERP doesn\'t fit, and set up dashboards for your management team. Data moves safely between systems and stays the same everywhere. We also build software products of our own.',
    includes: [
      { title: 'Connecting your ERP to your other apps', text: 'Data flows both ways between your ERP and your other software through its official connections, so its rules and permissions still apply.' },
      { title: 'Custom modules', text: 'Modules for work your standard ERP doesn\'t cover, such as foundry operations, service tickets or engineer visits, linked to your ERP for accounts.' },
      { title: 'Management dashboards', text: 'Dashboards for each head of department, pulling from one or several ERP sites and loading in under a second.' },
      { title: 'Several sites or companies', text: 'One view across several ERP sites or companies, with user roles kept in step between them.' },
      { title: 'Safe data updates', text: 'Every update is tracked, retried if it fails and checked overnight, so records are never left half-saved.' },
      { title: 'Service and field work', text: 'Tickets, service deadlines, AMC contracts and engineer visits, linked to the customers, machines and stock already in your ERP.' },
    ],
    proof: [UNIFIED_ERP, FOUNDRY, ERPTICK],
    faq: [
      { question: 'Do you write directly to the ERPNext database?', answer: 'No. Writes go through ERPNext’s REST API so its validation and permission rules apply. We read from the database only where read-only access is agreed, for example for nightly master-data pulls.' },
      { question: 'Do you work with Frappe Cloud and self-hosted ERPNext?', answer: 'Yes. Our unified ERP platform for an infrastructure group runs across 5 ERPNext v15 sites on Frappe Cloud, and the same approach works for self-hosted installs.' },
      { question: 'Should we customise ERPNext or build a separate app?', answer: 'It depends on how far the process is from standard ERP. Small changes belong in ERPNext. A process with its own data and rules, like foundry operations or field service, is often better as a separate app that syncs with ERPNext.' },
    ],
    related: ['data-pipelines', 'full-stack-development', 'technical-leadership'],
  },
  {
    slug: 'cloud-devops',
    name: 'Hosting, Speed & Security',
    techName: 'Cloud and DevOps',
    heading: ['Hosting, Speed &', 'Security'],
    metaTitle: 'Cloud Hosting, Speed & Security (DevOps) | Rirote Global',
    description: 'Lower cloud bills, faster load times and locked-down servers on AWS or DigitalOcean, without taking your product offline.',
    summary: 'Faster, safer and cheaper hosting on AWS or DigitalOcean, without taking your software offline.',
    intro: 'We make your software faster, safer and cheaper to run. That means cutting your cloud bill, fixing slow pages, locking down servers and setting up automatic releases on AWS or DigitalOcean, all without taking your product offline.',
    includes: [
      { title: 'Hosting check-up', text: 'A look at what you run, what it costs and where it\'s exposed, with a ranked list of fixes instead of a rebuild.' },
      { title: 'Lower cloud bills', text: 'Removing idle servers and paying only for the size you need, measured against your monthly bill.' },
      { title: 'Locked-down servers', text: 'Servers protected by a firewall and Cloudflare, with unused access closed and passwords kept out of the code.' },
      { title: 'Faster pages', text: 'Finding the slow database queries and requests, then fixing them with better indexes, caching and running work in parallel.' },
      { title: 'Automatic releases', text: 'Repeatable, automatic builds and releases, so going live doesn\'t depend on one person\'s laptop.' },
      { title: 'Monitoring and support', text: 'Uptime checks, logs and alerts, plus support when something breaks.' },
    ],
    proof: [NIMNIM, UNIFIED_ERP, ECOMMERCE],
    faq: [
      { question: 'Can you reduce our cloud bill without downtime?', answer: 'Usually, yes. For NimNim we consolidated several EC2 instances onto one hardened server and halved the AWS bill while customers kept ordering.' },
      { question: 'Do you only work on AWS?', answer: 'No. We work on AWS and DigitalOcean, and the same practices apply to other providers.' },
      { question: 'Where do you start with a slow application?', answer: 'With measurement. We find which queries and calls take the time, fix the biggest ones first, and confirm the gain with before-and-after numbers.' },
    ],
    related: ['full-stack-development', 'technical-leadership', 'data-pipelines'],
  },
  {
    slug: 'technical-leadership',
    name: 'Technical Advice & Team Leadership',
    techName: 'Architecture and technical leadership',
    heading: ['Technical Advice &', 'Team Leadership'],
    metaTitle: 'Software Architecture & Technical Leadership | Rirote Global',
    description: 'Advice before you build, step-by-step plans for big system changes, and a senior engineer to lead your developers day to day.',
    summary: 'Advice before you build, plans for big changes, and a senior engineer to lead your developers.',
    intro: 'We help you plan software before you spend money building it: what to build, what to buy, and how to change a system without stopping the business. If you need it, a senior engineer can also lead your development team day to day.',
    includes: [
      { title: 'System review', text: 'A clear look at your current software: where it will struggle as you grow, what to keep and what to fix first.' },
      { title: 'Build, buy or extend?', text: 'Whether to build, buy or extend what you have, such as your ERP, with the cost and risk of each option written down.' },
      { title: 'Plans for big changes', text: 'Step-by-step plans to split up a large system, or move from spreadsheets to an ERP, without stopping the business.' },
      { title: 'From requirements to a plan', text: 'Turning a list of what the business needs into a design and a delivery plan your team can follow.' },
      { title: 'Leading your developers', text: 'A senior engineer leading your team day to day: reviewing work, mentoring, making technical decisions and planning releases.' },
      { title: 'ERP planning', text: 'Deciding what belongs inside ERPNext and what should be a connected app, before custom work starts.' },
    ],
    proof: [ECOMMERCE, MULTI_SERVICE, FOUNDRY],
    faq: [
      { question: 'Do you only advise, or do you also build?', answer: 'Both. We can review and plan on their own, but most clients ask us to stay and lead or build the work, so the plan and the code stay in step.' },
      { question: 'Can you lead our in-house team?', answer: 'Yes. A senior engineer can lead your developers day to day: setting technical direction, reviewing code and owning releases alongside your product team.' },
      { question: 'Is a microservices migration always the right move?', answer: 'No. We recommend it only when parts of the system need to scale or ship independently. Often a cleaner monolith with clear modules is the cheaper answer.' },
    ],
    related: ['full-stack-development', 'cloud-devops', 'erp-integration'],
  },
  {
    slug: 'data-pipelines',
    name: 'Reports & Dashboards',
    techName: 'Data pipelines and reporting',
    heading: ['Reports &', 'Dashboards'],
    metaTitle: 'Dashboards, Reports & Data Pipelines | Rirote Global',
    description: 'Dashboards and reports that bring the numbers from your ERP and your other software into one place, defined once and fast to load.',
    summary: 'Dashboards and reports that bring numbers from your ERP and apps into one place, so leadership can act on them.',
    intro: 'We bring the numbers from your ERP and other software into one place and turn them into dashboards and reports your management team can act on. Each figure is defined once, so every screen shows the same answer, and it loads fast.',
    includes: [
      { title: 'Collecting your data', text: 'Scheduled jobs that copy data from ERPNext, apps and databases into one reporting database, checking for missing and duplicate records.' },
      { title: 'Dashboards for each head', text: 'Dashboards for heads of sales, finance, manufacturing and the MD, each showing the numbers that role is accountable for.' },
      { title: 'One version of the numbers', text: 'Every dashboard, app and export uses the same agreed figures, so no two screens disagree.' },
      { title: 'Service reports', text: 'Response and resolution times, comparisons by region, and reports sent automatically by email.' },
      { title: 'Several sources at once', text: 'Reports that combine several ERP sites or databases and still load quickly.' },
      { title: 'Decision views', text: 'Progress against targets, sales funnels that show where deals get stuck, and a click through to the deal or ticket behind any number.' },
    ],
    proof: [UNIFIED_ERP, ERPTICK],
    faq: [
      { question: 'Can you report across several ERPNext sites?', answer: 'Yes. Our multi-site middleware queries up to 5 ERPNext sites in parallel and caches each widget, bringing dashboard loads under 500ms from more than 5 seconds.' },
      { question: 'Do we need a data warehouse?', answer: 'Not always. For a handful of sources, well-indexed PostgreSQL and a reporting API are often enough. A warehouse like Redshift earns its place when data volume or the number of sources grows.' },
      { question: 'Can reports arrive by email?', answer: 'Yes. Any report can be scheduled to arrive by email, for example as a CSV each morning.' },
    ],
    related: ['erp-integration', 'ai-integration', 'cloud-devops'],
  },
  {
    slug: 'dedicated-engineers',
    name: 'Hire Dedicated Developers',
    techName: 'Resource outsourcing',
    heading: ['Dedicated developers', 'for your team'],
    metaTitle: 'Hire Dedicated Developers from India | Rirote Global',
    description: 'Experienced full-stack, AI, ERP and cloud developers who join your team full-time, part-time or per project. Vetted and managed by us.',
    summary: 'Experienced developers who join your team full-time or part-time, vetted and managed by us.',
    intro: 'Experienced developers and specialists who join your team full-time, part-time or for one project. They\'re tested on real projects before they start, and we stay responsible for the quality of their work. Agencies, startups and larger companies use them to add people quickly, without a long hiring process.',
    includes: [
      { title: 'Full-stack developers', text: 'Developers for websites, web apps and online products, working in React, Next.js, Node.js and TypeScript.' },
      { title: 'AI engineers', text: 'Developers who add AI assistants and automation to your software, with checks so the results can be trusted.' },
      { title: 'Backend developers', text: 'Developers for the systems behind your apps: databases, connections and data work, in NestJS or FastAPI.' },
      { title: 'ERP developers', text: 'ERP modules, and connections between your ERP and your other software.' },
      { title: 'Cloud and DevOps engineers', text: 'Engineers who set up and look after your hosting, releases and servers on AWS and Docker.' },
      { title: 'Technical leads', text: 'Senior engineers who plan the system and lead the team on projects that need someone in charge.' },
    ],
    proof: [
      {
        kicker: 'How it works',
        title: 'Vetted and managed by us',
        text: 'Every engineer is tested on real projects before joining a client. Engagements can be full-time, part-time or for one project, and engineers are usually ready to start within a few days. Agencies can use us white-label to scale delivery without adding headcount. We are India-based and work with clients in the United States and the Middle East.',
      },
      { ...UNIFIED_ERP, kicker: 'Case study · Delivered with an agency partner' },
    ],
    faq: [
      { question: 'How quickly can an engineer start?', answer: 'Usually within days. Tell us the role, the stack and the hours you need, and we will propose someone who has already worked on similar projects.' },
      { question: 'Can agencies use your engineers under their own brand?', answer: 'Yes. We supply engineers white-label to digital agencies who need to scale delivery without scaling headcount.' },
      { question: 'What engagement models do you offer?', answer: 'Dedicated full-time, part-time or project-based. You decide, and the arrangement can change as your needs do.' },
    ],
    related: ['full-stack-development', 'ai-integration', 'erp-integration'],
  },
];

export const serviceBySlug = (slug: string): Service | undefined => SERVICES.find((s) => s.slug === slug);
