/**
 * Single source of truth for site-wide identity, contact points and nav.
 * Change the domain here once and every canonical URL, sitemap entry,
 * OG tag and JSON-LD block follows.
 *
 * PRIVACY: never add passport number, date of birth or home address here.
 * This file is public in the repo and rendered into indexable HTML.
 */

export const SITE = {
  url: 'https://josesebastian.com',
  name: 'Jose Sebastian',
  title: 'Jose Sebastian — Web Developer & SEO Specialist in Dubai',
  tagline: 'IT Manager · Web Developer · SEO Specialist',
  description:
    'Dubai-based IT Manager and web developer building fast, secure, search-optimised websites in WordPress, Next.js and Astro. 7+ years across web development, IT infrastructure and SEO.',
  locale: 'en_AE',
  lang: 'en',
  city: 'Dubai',
  region: 'Dubai',
  country: 'AE',
  countryName: 'United Arab Emirates',
  timezone: 'Asia/Dubai',
  postsPerPage: 9,
} as const;

export const CONTACT = {
  email: 'iamjoseph.sebastian@gmail.com',
  // E.164 for tel:/wa.me links, plus a display form.
  phone: '+971589202967',
  phoneDisplay: '+971 58 920 2967',
  whatsapp: '971589202967',
  whatsappMessage:
    "Hi Jose, I found your site and I'd like to talk about a project.",
  // Optional — leave empty to hide the booking button.
  bookingUrl: '',
} as const;

export const SOCIAL = [
  { name: 'GitHub', url: 'https://github.com/josesebastian445', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/josesebastian445', icon: 'linkedin' },
  { name: 'Email', url: `mailto:${CONTACT.email}`, icon: 'mail' },
] as const;

export const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Hero typewriter rotation. */
export const ROTATING_WORDS = [
  'WordPress',
  'Next.js',
  'Astro',
  'React',
  'SEO',
  'Cloud',
  'Security',
] as const;

/** Trust strip — counted up when scrolled into view. */
export const STATS = [
  { value: 7, suffix: '+', label: 'Years experience' },
  { value: 40, suffix: '+', label: 'Projects delivered' },
  { value: 99, suffix: '.9%', label: 'Uptime maintained' },
] as const;

/** Marquee of tools, kept as plain text so there are zero logo requests. */
export const STACK = [
  'WordPress',
  'Next.js',
  'Astro',
  'React',
  'TypeScript',
  'Tailwind',
  'WooCommerce',
  'MySQL',
  'SQL Server',
  'AWS',
  'Hetzner',
  'Cloudflare',
  'FortiGate',
  'Ahrefs',
  'SEMrush',
  'Screaming Frog',
  'Google Analytics',
  'Search Console',
  'GitHub Actions',
  'Office 365',
] as const;

/** Fallback social card. Generated at build time by src/pages/og/[...route].ts. */
export const OG_DEFAULT = '/og/page/home.png';
