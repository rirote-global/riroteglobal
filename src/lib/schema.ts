// Builders for schema.org JSON-LD nodes shared across pages.
import { SITE, SOCIAL_PROFILES, absoluteUrl } from '../data/site';
import { SERVICES } from '../data/services';

export type SchemaNode = Record<string, unknown>;

export const ORGANIZATION_ID = absoluteUrl('/#organization');
export const WEBSITE_ID = absoluteUrl('/#website');

/** Reference to the Organization node defined on the homepage. */
export const organizationRef = (): SchemaNode => ({ '@id': ORGANIZATION_ID });

export function organization(): SchemaNode {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORGANIZATION_ID,
    name: SITE.name,
    url: absoluteUrl('/'),
    logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/brand/logo-light-1200.png'), width: 1200, height: 388 },
    image: absoluteUrl(SITE.defaultImage.path),
    email: SITE.email,
    description:
      'Software company in Jaipur, India: websites and web apps (full-stack development), AI assistants and automation, ERP integration, and cloud hosting. Makers of our own software products.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.legal.city,
      addressRegion: SITE.legal.state,
      addressCountry: 'IN',
    },
    areaServed: 'Worldwide',
    knowsAbout: [
      'Full-stack web development', 'Next.js', 'NestJS', 'Node.js', 'React',
      'AI agents', 'LLM integration', 'ERPNext', 'Frappe', 'ERP integration',
      'AWS', 'DevOps', 'PostgreSQL', 'Data pipelines',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      availableLanguage: 'English',
    },
    makesOffer: SERVICES.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service.name, description: service.summary },
    })),
    sameAs: [...SOCIAL_PROFILES],
  };
}

/** The page itself, typed and tied to the WebSite node. */
export function webPage(input: {
  path: string;
  name: string;
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage';
  about?: SchemaNode;
}): SchemaNode {
  return {
    '@type': input.type ?? 'WebPage',
    '@id': `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    isPartOf: { '@id': WEBSITE_ID },
    ...(input.about && { about: input.about }),
  };
}

export function aboutPage(path: string): SchemaNode {
  return webPage({ path, name: `About ${SITE.name}`, type: 'AboutPage', about: organizationRef() });
}

export function website(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: absoluteUrl('/'),
    publisher: organizationRef(),
    inLanguage: 'en',
  };
}

/** Organization reference with its name, for nodes where search engines read the author or publisher directly. */
const namedOrganization = (): SchemaNode => ({ '@type': 'Organization', '@id': ORGANIZATION_ID, name: SITE.name, url: absoluteUrl('/') });

/** Case study write-up. Dates are left out on purpose: the site publishes none. */
export function article(input: { path: string; headline: string; description: string }): SchemaNode {
  const url = absoluteUrl(input.path);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    image: absoluteUrl(SITE.defaultImage.path),
    author: namedOrganization(),
    publisher: namedOrganization(),
  };
}

/** A product of ours that has no hand-built page, using only what its page says. */
export function softwareApplication(input: {
  path: string;
  name: string;
  description?: string;
  category: string;
  license?: string;
  sameAs?: string;
  /** For downloadable apps, e.g. "macOS 13 or later". */
  operatingSystem?: string;
  /** Free to download and use: adds a zero-price offer. */
  free?: boolean;
  /** Direct download. Only pass it once the file actually exists. */
  downloadUrl?: string;
  softwareVersion?: string;
}): SchemaNode {
  const url = absoluteUrl(input.path);
  return {
    '@type': 'SoftwareApplication',
    '@id': `${url}#app`,
    name: input.name,
    applicationCategory: input.category,
    url,
    ...(input.description && { description: input.description }),
    ...(input.license && { license: input.license, isAccessibleForFree: true }),
    ...(input.sameAs && { sameAs: input.sameAs }),
    ...(input.operatingSystem && { operatingSystem: input.operatingSystem }),
    ...(input.free && { isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }),
    ...(input.downloadUrl && { downloadUrl: input.downloadUrl }),
    ...(input.softwareVersion && { softwareVersion: input.softwareVersion }),
    creator: namedOrganization(),
    publisher: namedOrganization(),
  };
}

/** Service page node, provided by the homepage Organization. */
export function service(input: { name: string; serviceType?: string; description: string; path: string }): SchemaNode {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(input.path)}#service`,
    name: input.name,
    serviceType: input.serviceType ?? input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: organizationRef(),
    areaServed: 'Worldwide',
  };
}

/** ItemList of links, e.g. the services on the /services hub. */
export function itemList(items: Array<{ name: string; path: string }>): SchemaNode {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage from the same items the page shows, so the two never drift apart. */
export function faqPage(items: FaqItem[]): SchemaNode {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** BreadcrumbList from [name, path] pairs, starting at Home. */
export function breadcrumbs(...items: Array<[name: string, path: string]>): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}
