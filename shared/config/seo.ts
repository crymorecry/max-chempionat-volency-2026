const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

export const SEO_CONFIG = {
  siteUrl: SITE_URL,
  siteName: 'Домовик',
  defaultLocale: 'ru' as const,
  locales: ['ru', 'en'] as const,
  ogImage: '/default_og.jpg',
}

export function getLocalizedUrl(path: string, locale: string): string {
  const base = path.startsWith('/') ? path : `/${path}`
  if (locale === SEO_CONFIG.defaultLocale) {
    return base === '/' ? base : base
  }
  return `/${locale}${base === '/' ? '' : base}`
}
