// Case studies. Sector and place only, unless the client may be named (`website` then links to them). Every
// figure here was already stated on the site. /projects lists them and /projects/<slug> shows one.
export const PROJECTS_PATH = '/projects';

export const PROBLEMS = [
  { id: 'service', label: 'Service tickets, visits & AMC' },
  { id: 'erp', label: 'Connect or extend your ERP' },
  { id: 'ai', label: 'AI for my documents & data' },
  { id: 'custom', label: 'A new app or product' },
  { id: 'reports', label: 'Dashboards & reports' },
  { id: 'speed', label: 'Slow, costly or insecure hosting' },
  { id: 'team', label: 'Developers or a tech lead' },
] as const;
export type ProblemId = (typeof PROBLEMS)[number]['id'];

export interface CaseStudy {
  slug: string;
  /** Short project name, used in the breadcrumb. */
  name: string;
  sector: string;
  place?: string;
  via?: string;
  /** The client's own site, only for clients we may name. */
  website?: { href: string; label: string };
  title: string;
  metaTitle: string;
  description: string;
  tags: ProblemId[];
  problem: string;
  built: string;
  achievements: string[];
  responsibilities?: string[];
  results: Array<[value: string, label: string]>;
  stack: string[];
  /** Service slugs this work backs up. */
  services: string[];
}

export const caseUrl = (slug: string): string => `${PROJECTS_PATH}/${slug}`;

export const CASES: CaseStudy[] = [
  {
    slug: 'unified-erp-service-platform',
    name: 'Unified ERP & Service Platform',
    sector: 'Infrastructure group',
    place: 'India',
    via: 'Delivered with an agency partner',
    title: 'One platform for 9 business entities',
    metaTitle: 'Unified ERP & Service Platform Case Study | Rirote Global',
    description: 'One platform for 9 business entities across 5 ERPNext sites: a service ticketing engine and 11 role-based dashboards loading in under 500ms.',
    tags: ['erp', 'service', 'reports'],
    problem: 'An infrastructure group ran service ticketing and executive reporting as two separate apps on two servers, with dashboards querying 5 ERPNext sites one after another.',
    built: 'One unified platform, delivered end to end: one PostgreSQL database, one auth and role system and one Next.js frontend, for 9 business entities across 5 ERPNext v15 Frappe Cloud sites.',
    achievements: [
      'Ticketing engine on NestJS and Prisma: 8 creation sources into a single service and a 9-state workflow, with a responsive PWA field service visit flow and 15 email and SMS notification triggers',
      'Two-way ERPNext integration: a read-only nightly master pull, REST-API-only writes (Stock Entry, draft Sales Invoice) and an inbound webhook, with no direct database writes, so the Frappe permission engine is respected',
      '11 role-specific dashboards for heads of sales, finance and manufacturing, the MD and more, on Next.js and React',
      'Node.js middleware with ERPNext role sync, parallel fan-out across up to 5 sites and Redis per-widget caching: under 500ms against 5s+ before',
      'Sales dashboard with pace-to-target, a pipeline funnel with bottleneck detection and a deal drawer with activity timeline',
    ],
    results: [['<500ms', 'Dashboard loads, down from 5s+'], ['2 → 1', 'Apps and servers merged'], ['11', 'Role-based dashboards'], ['9', 'Business entities on one platform']],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'NestJS', 'Node.js', 'Prisma', 'PostgreSQL', 'Redis', 'MariaDB', 'ERPNext v15', 'JWT', 'PWA'],
    services: ['erp-integration', 'data-pipelines'],
  },
  {
    slug: 'nimnim',
    name: 'NimNim Laundry Platform',
    sector: 'NimNim · On-demand laundry',
    place: 'USA',
    website: { href: 'https://www.getnimnim.com', label: 'Visit getnimnim.com' },
    title: 'NimNim: a live laundry platform, stabilised and rebuilt',
    metaTitle: 'NimNim On-Demand Laundry Platform Case Study | Rirote Global',
    description: 'How we stabilised and rebuilt NimNim, a live US laundry platform: one hardened server, a 50% lower AWS bill and 50% faster API responses.',
    tags: ['speed', 'custom'],
    problem: 'NimNim runs on-demand laundry and dry-cleaning across Boston, New York and Miami. Its six apps ran on two EC2 servers as development servers with no process manager and no memory buffer. A firewall audit found the database and internal app ports reachable from the internet, bypassing Cloudflare. When a memory spike crashed the server, every app stayed down until someone restarted it by hand.',
    built: 'We moved the whole stack onto one hardened server. The web apps are now prebuilt and served by Nginx instead of running as Node processes, the API restarts itself after a crash or reboot, and a swap buffer absorbs memory spikes. The firewall now allows only web traffic through Cloudflare and SSH from known addresses. We also optimised slow MongoDB queries, fixed high-priority bugs and delivered a full platform revamp, all while customers kept ordering.',
    achievements: [
      'Closed the firewall to everything except web traffic through Cloudflare and SSH from known addresses',
      'Cut the memory the full stack needs from 4.4 GB across two servers to 0.66 GB on one',
      'Automatic restarts after a crash or reboot, so one failure no longer means a manual recovery',
      'Fixed rate limiting, which had treated every visitor as one user, by passing real visitor addresses through Cloudflare and Nginx',
      'Delivered a full platform revamp on the stabilised setup',
    ],
    responsibilities: ['Security audit and firewall hardening', 'Infrastructure setup and configuration', 'Deployment management', 'Bug fixing and hotfixes', 'Feature implementation', 'Performance optimisation'],
    results: [['50%', 'Lower AWS bill'], ['50%', 'Faster API responses'], ['85%', 'Less memory for the full stack'], ['4 → 2', 'Servers across production and dev']],
    stack: ['React', 'Node.js', 'MongoDB', 'AWS EC2', 'Nginx', 'Cloudflare'],
    services: ['cloud-devops', 'full-stack-development'],
  },
  {
    slug: 'foundry-operations-erp',
    name: 'Foundry Operations ERP',
    sector: 'Foundry',
    place: 'India',
    title: 'A foundry ERP that talks to ERPNext safely',
    metaTitle: 'Foundry ERP & ERPNext Integration Case Study | Rirote Global',
    description: 'A 17-module foundry ERP with heat-number traceability, joined to ERPNext for finance and payroll through a safe REST boundary and nightly reconciliation.',
    tags: ['erp', 'custom'],
    problem: 'A foundry needed an ERP for its own operations, from sales order to dispatch, with heat-number traceability, while finance and payroll already lived in ERPNext.',
    built: 'A domain-specific ERP that owns all foundry data end to end: sales order to dispatch, production planning, melting and metallurgy, quality, inventory, maintenance and costing, with heat-number genealogy as the traceability key. It integrates with ERPNext only for finance and payroll.',
    achievements: [
      'Translated a 100+ doctype functional specification into a NestJS, Prisma and PostgreSQL backend and a Next.js and React frontend',
      'Delivered the role-based access foundation with admin-configurable roles and segregation-of-duties rules, audit logging and 12+ master-data modules',
      'Short-lived JWT access tokens backed by rotating, hash-only-stored refresh tokens with replay protection',
      'ERPNext boundary over REST only, with idempotent correlation-ID calls, retry and backoff queues and a nightly reconciliation run for one-sided records',
    ],
    results: [['17', 'Modules, order to dispatch'], ['100+', 'Doctype specification translated'], ['REST-only', 'Boundary with ERPNext']],
    stack: ['Next.js', 'React', 'TypeScript', 'NestJS', 'Prisma', 'PostgreSQL', 'SWR', 'Tailwind CSS', 'JWT', 'ERPNext'],
    services: ['erp-integration', 'technical-leadership'],
  },
  {
    slug: 'multi-service-delivery-platform',
    name: 'Multi-Service Delivery Platform',
    sector: 'Logistics & delivery',
    title: 'Food, parcels and rides on one platform',
    metaTitle: 'Multi-Service Delivery Platform Case Study | Rirote Global',
    description: 'A unified platform for food delivery, parcel logistics and ride booking, built on microservices so each service scales on its own.',
    tags: ['custom', 'team'],
    problem: 'Food delivery, parcel logistics and ride booking needed to share one platform, with each service able to scale on its own.',
    built: 'We built and maintained a unified platform on microservices. We led the engineering team, drove product decisions and owned features end to end, from API design through to production deployment and support.',
    achievements: ['Delivered a unified platform across 3 service verticals on microservices', 'Designed a scalable database schema for multi-service operations', 'Provided ongoing production stability'],
    responsibilities: ['Team management and mentoring', 'Product management and roadmap planning', 'Feature development', 'Production support', 'REST API development', 'Database design', 'Technical consulting'],
    results: [['3', 'Service verticals on one platform']],
    stack: ['React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'DigitalOcean', 'Microservices'],
    services: ['full-stack-development', 'technical-leadership'],
  },
  {
    slug: 'high-traffic-ecommerce-platform',
    name: 'High-Traffic E-Commerce Platform',
    sector: 'E-commerce',
    place: 'India',
    title: 'A monolith-to-microservices plan for a high-traffic store',
    metaTitle: 'High-Traffic E-Commerce Case Study | Rirote Global',
    description: 'Redesign and modernisation of a high-traffic Indian e-commerce platform: a monolith-to-microservices migration plan and better backend performance.',
    tags: ['team', 'speed', 'custom'],
    problem: 'A high-traffic Indian e-commerce platform had outgrown its monolithic stack and needed better scalability and developer velocity.',
    built: 'We led the redesign and modernisation: designing the system architecture, planning the migration from a monolith to microservices and improving backend performance, while working directly with business stakeholders.',
    achievements: ['Planned the monolith to microservices migration roadmap', 'Led the full platform redesign', 'Improved backend performance and scalability'],
    responsibilities: ['System architecture design', 'Backend service development', 'DigitalOcean infrastructure setup', 'Performance improvements', 'Stakeholder discussions'],
    results: [['Plan', 'Monolith to microservices'], ['Led', 'The full platform redesign']],
    stack: ['React', 'Node.js', 'PostgreSQL', 'DigitalOcean', 'Microservices'],
    services: ['technical-leadership', 'cloud-devops'],
  },
  {
    slug: 'angaraa-charcoal-website',
    name: 'ANGARAA',
    sector: 'ANGARAA · Wooden charcoal',
    place: 'Jaipur',
    website: { href: 'https://theangaraa.com', label: 'Visit theangaraa.com' },
    title: 'ANGARAA: a charcoal brand that takes orders on WhatsApp',
    metaTitle: 'ANGARAA Charcoal Website Case Study | Rirote Global',
    description: 'A new website for ANGARAA, a Jaipur charcoal brand: a weighing-scale product picker, a kitchen calculator and an order slip that sends orders on WhatsApp.',
    tags: ['custom'],
    problem: 'ANGARAA was already selling wooden charcoal to kitchens around Jaipur, but its website still said "Launching soon". Visitors could not see the bag sizes or rates, work out how much charcoal they needed, or place an order from the site.',
    built: 'A new website built with Astro and hosted on Cloudflare. Visitors pick a charcoal line and bag size on a weighing-scale picker, see the rate per kilo, and add it to a paper-style order slip that sends a ready-written order on WhatsApp. A kitchen calculator works out the cheapest mix of bags for a kitchen’s daily use, and every Tandoor bag size has its own page, so people searching for a size land on the right one.',
    achievements: [
      'Weighing-scale product picker for three charcoal lines, showing the rate per kilo',
      'An order slip on every page that turns the basket into a ready-written WhatsApp message',
      'A kitchen calculator: kilos per day and number of days in, the cheapest mix of bags out',
      'Six Tandoor bag sizes with their own pages, plus pages for businesses, the founder and why ANGARAA',
      'FAQ, delivery area and opening hours written from the owner’s own answers, with matching search markup',
      'Self-hosted fonts and modern image formats, so the site loads quickly on mobile data',
    ],
    responsibilities: ['Design and copy', 'Astro development', 'Search setup: sitemap, structured data, clean URLs', 'Hosting on Cloudflare'],
    results: [['WhatsApp', 'Orders arrive ready-written'], ['6', 'Bag-size pages'], ['3', 'Charcoal lines']],
    stack: ['Astro', 'TypeScript', 'JavaScript', 'Cloudflare Pages', 'Schema.org'],
    services: ['full-stack-development'],
  },
  {
    slug: 'shopify-store-projects',
    name: 'Shopify Store Projects',
    sector: 'Fashion, lifestyle & homeware',
    title: 'Shopify stores built, sped up and automated',
    metaTitle: 'Shopify Development Case Study | Rirote Global',
    description: 'End-to-end Shopify work for fashion, lifestyle and homeware brands: bespoke themes, custom apps, faster stores and bulk product automation.',
    tags: ['custom', 'speed'],
    problem: 'Fashion, lifestyle, homeware and food brands needed stores that fit how they sell, load quickly and do not need hours of manual product work.',
    built: 'End-to-end Shopify solutions: bespoke theme development, custom app integrations, performance optimisation and workflow automation, each tailored to the client’s business.',
    achievements: [
      'Built a custom Shopify app with bespoke storefront features for a homeware brand',
      'Developed a "Make Your Own Mix" product configurator for a food brand',
      'Significantly improved store loading speed and Core Web Vitals',
      'Automated bulk product listing through Google Sheets, saving hours of manual work',
      'Launched multiple fashion brand stores with custom Liquid templates',
      'Retained clients on maintenance contracts for long-term support',
    ],
    responsibilities: ['Custom Shopify app development', 'Theme customisation', 'End-to-end store setup', 'Third-party app integrations', 'Store speed optimisation', 'Bulk product workflow automation', 'Ongoing maintenance and support'],
    results: [['Multiple', 'Brand stores launched']],
    stack: ['Shopify', 'Liquid', 'JavaScript', 'Custom Apps', 'Google Apps Script', 'REST APIs'],
    services: ['full-stack-development'],
  },
];

export const caseBySlug = (slug: string): CaseStudy | undefined => CASES.find((c) => c.slug === slug);
