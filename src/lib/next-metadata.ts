import type { Metadata } from 'next';
import { getGlobalSettingsFromEnv, getLogoPath, getLogoAlt } from '@/lib/env-config';
import dataService from '@/lib/data';

/**
 * Génère les métadonnées de fallback basées sur les variables d'environnement
 */
function generateFallbackMetadata(settings: ReturnType<typeof getGlobalSettingsFromEnv>): Metadata {
  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    // Le favicon est géré par src/app/icon.tsx
    // SEO par défaut si configuré
    ...(settings.defaultSeo && {
      openGraph: {
        title: settings.defaultSeo.metaTitle,
        description: settings.defaultSeo.metaDescription,
        siteName: settings.siteName,
        locale: 'fr_FR',
        type: 'website',
        ...(settings.defaultSeo.shareImage
          ? {
            images: [
              {
                url: settings.defaultSeo.shareImage.url,
                width: settings.defaultSeo.shareImage.width,
                height: settings.defaultSeo.shareImage.height,
                alt: settings.defaultSeo.shareImage.alternativeText || settings.siteName,
              },
            ],
          }
          : getLogoPath()
            ? {
              images: [
                {
                  url: getLogoPath()!,
                  alt: getLogoAlt(),
                },
              ],
            }
            : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: settings.defaultSeo.metaTitle,
        description: settings.defaultSeo.metaDescription,
        ...(settings.defaultSeo.shareImage
          ? { images: [settings.defaultSeo.shareImage.url] }
          : getLogoPath()
            ? { images: [getLogoPath()!] }
            : {}),
      },
    }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    manifest: '/manifest.json',
    generator: 'Next.js',
    applicationName: settings.siteName,
    referrer: 'origin-when-cross-origin',
    keywords: settings.defaultSeo?.metaKeywords || [], // Mots-clés depuis Strapi ou vides par défaut
    creator: settings.siteName,
    publisher: settings.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

/**
 * Génère les métadonnées globales du site basées sur les données Strapi
 * Avec fallback sur les variables d'environnement en cas d'erreur
 */
export async function generateGlobalMetadata(): Promise<Metadata> {
  try {
    // Récupère les paramètres depuis Strapi
    const settings = await dataService.static.getGlobalSettings();

    // Fallback sur .env si Strapi n'est pas disponible
    if (!settings) {
      console.warn('Global settings from Strapi not available, using .env fallback');
      const envSettings = getGlobalSettingsFromEnv();
      return generateFallbackMetadata(envSettings);
    }

    // Métadonnées de base
    const metadata: Metadata = {
      title: {
        default: settings.siteName,
        template: `%s | ${settings.siteName}`,
      },
      description: settings.siteDescription,

      // Le favicon est géré par src/app/icon.tsx
      // Ne pas définir icons ici pour éviter les conflits

      // SEO par défaut si configuré
      ...(settings.defaultSeo && {
        openGraph: {
          title: settings.defaultSeo.metaTitle,
          description: settings.defaultSeo.metaDescription,
          siteName: settings.siteName,
          locale: 'fr_FR',
          type: 'website',
          // Utilise shareImage de Strapi ou fallback vers le logo des env vars
          ...(settings.defaultSeo.shareImage
            ? {
              images: [
                {
                  url: settings.defaultSeo.shareImage.url,
                  width: settings.defaultSeo.shareImage.width,
                  height: settings.defaultSeo.shareImage.height,
                  alt: settings.defaultSeo.shareImage.alternativeText || settings.siteName,
                },
              ],
            }
            : getLogoPath()
              ? {
                images: [
                  {
                    url: getLogoPath()!,
                    alt: getLogoAlt(),
                  },
                ],
              }
              : {}),
        },
        twitter: {
          card: 'summary_large_image',
          title: settings.defaultSeo.metaTitle,
          description: settings.defaultSeo.metaDescription,
          // Utilise shareImage de Strapi ou fallback vers le logo des env vars
          ...(settings.defaultSeo.shareImage
            ? { images: [settings.defaultSeo.shareImage.url] }
            : getLogoPath()
              ? { images: [getLogoPath()!] }
              : {}),
        },
      }),

      // Autres métadonnées importantes
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Manifest et autres
      manifest: '/manifest.json',

      // Métadonnées génériques
      generator: 'Next.js',
      applicationName: settings.siteName,
      referrer: 'origin-when-cross-origin',
      keywords: settings.defaultSeo?.metaKeywords || [], // Mots-clés depuis Strapi ou vides par défaut
      creator: settings.siteName,
      publisher: settings.siteName,

      // Formatage de la page
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
    };

    return metadata;
  } catch (error) {
    console.error('Erreur lors de la génération des métadonnées globales:', error);

    // Fallback en cas d'erreur - utilise les variables d'environnement
    const fallbackSettings = getGlobalSettingsFromEnv();
    return generateFallbackMetadata(fallbackSettings);
  }
}

/**
 * Métadonnées par défaut pour les pages qui n'ont pas accès aux Global Settings
 */
export const defaultMetadata: Metadata = {
  title: getGlobalSettingsFromEnv().siteName,
  description: getGlobalSettingsFromEnv().siteDescription,
  // Le favicon est géré par src/app/icon.tsx
};

/**
 * Crée des métadonnées personnalisées en héritant des paramètres globaux
 */
export function createMetadata(options?: Partial<Metadata>): Metadata {
  return {
    ...defaultMetadata,
    ...options,
  };
}
