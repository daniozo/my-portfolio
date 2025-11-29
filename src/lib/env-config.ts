/**
 * Configuration des données Global depuis les variables d'environnement
 * Remplace la récupération depuis Strapi
 */

import type { GlobalSettings, SocialLinks } from '@/types';

function getMimeTypeFromUrl(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'ico':
      return 'image/x-icon';
    case 'webp':
      return 'image/webp';
    default:
      // Par défaut, on peut retourner un type générique ou gérer l'erreur
      return 'application/octet-stream';
  }
}

/**
 * Récupère les paramètres globaux depuis .env
 */
export function getGlobalSettingsFromEnv(): GlobalSettings {
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL;
  const faviconUrl = process.env.NEXT_PUBLIC_FAVICON;
  const shareImageUrl = process.env.NEXT_PUBLIC_SEO_SHARE_IMAGE;

  return {
    id: 'env-global',
    documentId: 'env-global',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'My Portfolio',
    siteDescription:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      'Personal portfolio - Articles, projects and achievements',
    logo: logoUrl
      ? {
        id: 'logo',
        url: logoUrl,
        alternativeText: process.env.NEXT_PUBLIC_SITE_NAME || 'Logo',
        width: 120,
        height: 40,
        mime: getMimeTypeFromUrl(logoUrl),
      }
      : undefined,
    favicon: faviconUrl
      ? {
        id: 'favicon',
        url: faviconUrl,
        alternativeText: 'Favicon',
        width: 32,
        height: 32,
        mime: getMimeTypeFromUrl(faviconUrl),
      }
      : undefined,
    defaultSeo: {
      metaTitle:
        process.env.NEXT_PUBLIC_SEO_META_TITLE || 'My Portfolio',
      metaDescription:
        process.env.NEXT_PUBLIC_SEO_META_DESCRIPTION ||
        'Discover my projects, articles and professional journey',
      metaKeywords: process.env.NEXT_PUBLIC_SEO_META_KEYWORDS
        ? process.env.NEXT_PUBLIC_SEO_META_KEYWORDS.split(',').map(k => k.trim())
        : undefined,
      shareImage: shareImageUrl
        ? {
          id: 'share-image',
          url: shareImageUrl,
          alternativeText: 'Image de partage',
          width: 1200,
          height: 630,
          mime: getMimeTypeFromUrl(shareImageUrl),
        }
        : undefined,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  };
}

/**
 * Récupère les liens sociaux depuis .env
 */
export function getSocialLinksFromEnv(): SocialLinks {
  return {
    id: 'env-social',
    documentId: 'env-social',
    email: process.env.NEXT_PUBLIC_EMAIL || undefined,
    phone: process.env.NEXT_PUBLIC_PHONE || undefined,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN || undefined,
    twitter: process.env.NEXT_PUBLIC_TWITTER || undefined,
    github: process.env.NEXT_PUBLIC_GITHUB || undefined,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || undefined,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || undefined,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE || undefined,
    footerConfiguration: {
      showEmail: process.env.NEXT_PUBLIC_FOOTER_SHOW_EMAIL === 'true',
      showPhone: process.env.NEXT_PUBLIC_FOOTER_SHOW_PHONE === 'true',
      showLinkedin: process.env.NEXT_PUBLIC_FOOTER_SHOW_LINKEDIN !== 'false',
      showTwitter: process.env.NEXT_PUBLIC_FOOTER_SHOW_TWITTER !== 'false',
      showGithub: process.env.NEXT_PUBLIC_FOOTER_SHOW_GITHUB !== 'false',
      showInstagram: process.env.NEXT_PUBLIC_FOOTER_SHOW_INSTAGRAM !== 'false',
      showFacebook: process.env.NEXT_PUBLIC_FOOTER_SHOW_FACEBOOK !== 'false',
      showYoutube: process.env.NEXT_PUBLIC_FOOTER_SHOW_YOUTUBE !== 'false',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  };
}

/**
 * Récupère la langue par défaut du site (attribut lang du HTML)
 * @returns Code langue ISO (ex: 'fr', 'en')
 */
export function getDefaultLang(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_LANG || 'fr';
}

/**
 * Récupère le chemin du logo
 * @returns Chemin du fichier logo ou undefined
 */
export function getLogoPath(): string | undefined {
  return process.env.NEXT_PUBLIC_LOGO_PATH || undefined;
}

/**
 * Récupère le texte alternatif du logo
 * @returns Texte alt du logo
 */
export function getLogoAlt(): string {
  return process.env.NEXT_PUBLIC_LOGO_ALT || process.env.NEXT_PUBLIC_SITE_NAME || 'Logo';
}

/**
 * Récupère le nom du site
 * @returns Nom du site
 */
export function getSiteName(): string {
  return process.env.NEXT_PUBLIC_SITE_NAME || 'My Portfolio';
}

/**
 * Récupère le chemin du favicon
 * @returns Chemin du favicon
 */
export function getFaviconPath(): string {
  return process.env.NEXT_PUBLIC_FAVICON || '/favicon.ico';
}
