import type {
  Article,
  Project,
  AboutInfo,
  Legal,
  MediaAsset,
  SocialLinks,
  GlobalSettings,
  StrapiResponse,
  SkillItem,
  SkillCategory,
  SkillsSection,
  EducationItem,
  EducationSection,
  ExperienceItem,
  ExperienceSection,
} from '@/types';
import type {
  StrapiMediaFile,
  StrapiMediaRelation,
  StrapiEntity,
  StrapiArticleAttributes,
  StrapiProjectAttributes,
  StrapiAboutInfoAttributes,
  StrapiSocialLinksAttributes,
  StrapiGlobalSettingsAttributes,
  StrapiLegalAttributes,
  StrapiComponentMedia,
  StrapiTagAttributes,
} from '@/types/strapi';
import { getMediaURL } from '@/lib/config';

/**
 * Transforme une réponse média Strapi en MediaAsset
 */
function transformMedia(
  strapiMedia: StrapiMediaRelation | StrapiMediaFile | undefined | null
): MediaAsset | undefined {
  if (!strapiMedia) {
    return undefined;
  }

  // Support Strapi v4 et v5
  let media: StrapiMediaFile;

  if ('data' in strapiMedia && strapiMedia.data) {
    // C'est une StrapiMediaRelation
    const mediaData = strapiMedia.data;
    media =
      'attributes' in mediaData && mediaData.attributes
        ? mediaData.attributes
        : (mediaData as StrapiMediaFile);
  } else {
    // C'est directement un StrapiMediaFile
    media = strapiMedia as StrapiMediaFile;
  }

  if (!media || !media.url) {
    return undefined;
  }

  const baseURL = getMediaURL();

  return {
    id: media.id?.toString() || media.documentId || 'unknown',
    url: media.url.startsWith('http') ? media.url : `${baseURL}${media.url}`,
    alternativeText: media.alternativeText,
    caption: media.caption,
    width: media.width,
    height: media.height,
    size: media.size,
    mime: media.mime,
  };
}

/**
 * Transforme les données Strapi communes
 */
function transformBaseContent(strapiData: StrapiEntity<any>) {
  // Support Strapi v4 et v5
  const data = 'attributes' in strapiData ? strapiData.attributes : strapiData;

  return {
    id: data?.documentId || strapiData.documentId || strapiData.id?.toString() || 'unknown',
    documentId: data?.documentId || strapiData.documentId,
    createdAt: new Date(data?.createdAt || strapiData.createdAt || Date.now()),
    updatedAt: new Date(data?.updatedAt || strapiData.updatedAt || Date.now()),
    publishedAt:
      data?.publishedAt || strapiData.publishedAt
        ? new Date(data.publishedAt || strapiData.publishedAt)
        : undefined,
  };
}

/**
 * Transforme un article Strapi en Article
 */
export function transformArticle(strapiData: StrapiEntity<StrapiArticleAttributes>): Article {
  const base = transformBaseContent(strapiData);
  // Support Strapi v4 et v5
  const attrs: StrapiArticleAttributes =
    'attributes' in strapiData && strapiData.attributes
      ? strapiData.attributes
      : (strapiData as StrapiArticleAttributes);

  // Gérer les deux formats possibles de tags
  let tags: string[] = [];
  if (attrs.tags) {
    // Format avec { data: [...] } (relation standard)
    if ('data' in attrs.tags && Array.isArray(attrs.tags.data)) {
      tags = attrs.tags.data.map((tag) => {
        const tagData: StrapiTagAttributes =
          'attributes' in tag && tag.attributes
            ? tag.attributes
            : (tag as StrapiTagAttributes);
        return tagData.name;
      });
    }
    // Format direct array d'objets (Strapi v5 avec populate simple)
    else if (Array.isArray(attrs.tags)) {
      tags = attrs.tags.map((tag: any) => tag.name);
    }
  }


  return {
    ...base,
    title: attrs.title,
    description: attrs.description,
    slug: attrs.slug,
    content: attrs.content,
    tags,
    readingTime: attrs.readingTime,
    metaTitle: attrs.metaTitle,
    metaDescription: attrs.metaDescription,
    articleFooterMessage: attrs.articleFooterMessage,
  };
}

/**
 * Transforme un média de composant Strapi
 */
function transformStrapiComponentMedia(
  componentMedia: StrapiComponentMedia | undefined | null
): { url: string; alt: string; type: 'image' | 'video' } | null {
  if (!componentMedia) {
    return null;
  }

  const file = componentMedia.file;
  if (!file || !file.url) {
    return null;
  }

  const baseURL = getMediaURL();
  const url = file.url.startsWith('http') ? file.url : `${baseURL}${file.url}`;

  return {
    url,
    alt: componentMedia.alt || file.alternativeText || '',
    type: componentMedia.type || 'image',
  };
}

/**
 * Transforme un projet Strapi en Project
 */
export function transformProject(strapiData: StrapiEntity<StrapiProjectAttributes>): Project {
  const base = transformBaseContent(strapiData);
  // Support Strapi v4 et v5
  const attrs: StrapiProjectAttributes =
    'attributes' in strapiData && strapiData.attributes
      ? strapiData.attributes
      : (strapiData as StrapiProjectAttributes);

  return {
    ...base,
    title: attrs.title,
    slug: attrs.slug,

    // Nouveaux champs obligatoires avec valeurs par défaut temporaires
    date: attrs.date || { start: new Date().toISOString(), end: null },
    summary: attrs.summary || 'Résumé non disponible',
    coverMedia: transformStrapiComponentMedia(attrs.coverMedia) || undefined,
    problemStatement: attrs.problemStatement || 'Problématique non définie',
    solution: attrs.solution || 'Solution non définie',
    story:
      attrs.story?.map((step) => {
        const media = transformStrapiComponentMedia(step.media);
        return {
          title: step.title,
          description: step.description,
          ...(media ? { media } : {}),
        };
      }) || [],
    gallery:
      attrs.gallery
        ?.map((item) => {
          const media = transformStrapiComponentMedia(item);
          return media
            ? {
              url: media.url,
              alt: media.alt,
              type: media.type,
              caption: item.caption || '',
            }
            : null;
        })
        .filter(
          (item): item is { url: string; alt: string; type: 'image' | 'video'; caption: string } =>
            item !== null
        ) || [],
    conclusion: attrs.conclusion || 'Non disponible',
    links:
      attrs.links?.map((link) => ({
        url: link.url,
        type: link.type || 'autre',
      })) || [],
    tags:
      attrs.tags?.data?.map((tag) => {
        const tagData: StrapiTagAttributes =
          'attributes' in tag && tag.attributes ? tag.attributes : (tag as StrapiTagAttributes);
        return tagData.name;
      }) ||
      // Fallback pour Strapi v5 format direct
      (Array.isArray(attrs.tags) ? attrs.tags.map((tag: any) => tag.name) : []),
  };
}

/**
 * Transforme un skill item Strapi
 */
function transformSkillItem(item: any): SkillItem {
  return {
    name: item.name,
  };
}

/**
 * Transforme une skill category Strapi
 */
function transformSkillCategory(category: any): SkillCategory {
  return {
    category: category.category,
    skills: category.skills?.map(transformSkillItem) || [],
  };
}

/**
 * Transforme la section skills Strapi
 */
function transformSkillsSection(section: any): SkillsSection | undefined {
  if (!section || section.show === false) {
    return undefined;
  }

  return {
    categories: section.categories?.map(transformSkillCategory) || [],
    show: section.show ?? true,
  };
}

/**
 * Transforme un education item Strapi
 */
function transformEducationItem(item: any): EducationItem {
  return {
    degree: item.degree,
    school: item.school,
    location: item.location,
    startDate: new Date(item.startDate),
    endDate: item.endDate ? new Date(item.endDate) : undefined,
    description: item.description,
  };
}

/**
 * Transforme la section education Strapi
 */
function transformEducationSection(section: any): EducationSection | undefined {
  if (!section || section.show === false) {
    return undefined;
  }

  // Tri automatique par date (plus récent en premier)
  const sortedEducations = (section.educations || [])
    .map(transformEducationItem)
    .sort((a: EducationItem, b: EducationItem) =>
      b.startDate.getTime() - a.startDate.getTime()
    );

  return {
    educations: sortedEducations,
    show: section.show ?? true,
  };
}

/**
 * Transforme un experience item Strapi
 */
function transformExperienceItem(item: any): ExperienceItem {
  return {
    position: item.position,
    company: item.company,
    type: item.type,
    location: item.location,
    startDate: new Date(item.startDate),
    endDate: item.endDate ? new Date(item.endDate) : undefined,
    description: item.description,
  };
}

/**
 * Transforme la section experience Strapi
 */
function transformExperienceSection(section: any): ExperienceSection | undefined {
  if (!section || section.show === false) {
    return undefined;
  }

  // Tri automatique par date (plus récent en premier)
  const sortedExperiences = (section.experiences || [])
    .map(transformExperienceItem)
    .sort((a: ExperienceItem, b: ExperienceItem) =>
      b.startDate.getTime() - a.startDate.getTime()
    );

  return {
    experiences: sortedExperiences,
    show: section.show ?? true,
  };
}

/**
 * Transforme les informations "À propos" Strapi en AboutInfo
 */
export function transformAboutInfo(response: StrapiResponse<StrapiAboutInfoAttributes>): AboutInfo {
  // Pour les types "single", la data est un objet unique, pas un array
  const strapiData = response.data as StrapiEntity<StrapiAboutInfoAttributes>;

  // En Strapi v5, les données sont directement dans strapiData, pas dans strapiData.attributes
  const attrs: StrapiAboutInfoAttributes =
    'attributes' in strapiData && strapiData.attributes
      ? strapiData.attributes
      : (strapiData as StrapiAboutInfoAttributes);

  // Base content pour Strapi v5
  const base = {
    id: strapiData.documentId || (strapiData as any).id?.toString() || 'unknown',
    documentId: strapiData.documentId,
    createdAt: new Date((strapiData as any).createdAt || Date.now()),
    updatedAt: new Date((strapiData as any).updatedAt || Date.now()),
    publishedAt: (strapiData as any).publishedAt
      ? new Date((strapiData as any).publishedAt)
      : undefined,
  };
  return {
    ...base,
    // Champs obligatoires du nouveau schéma
    fullName: attrs.fullName,
    biography: attrs.biography,

    // Champs optionnels du nouveau schéma
    currentLocation: attrs.currentLocation,
    jobTitle: attrs.jobTitle,
    currentCompany: attrs.currentCompany,
    profileImage: transformMedia(attrs.profileImage),

    // Composants avec leurs sections
    resume:
      attrs.resume && attrs.resume.file && attrs.resume.show !== false
        ? {
          file: transformMedia(attrs.resume.file)!,
          show: attrs.resume.show ?? true,
        }
        : undefined,

    // Nouvelles sections avec tri automatique
    educations: transformEducationSection(attrs.educations),
    experiences: transformExperienceSection(attrs.experiences),
    skills: transformSkillsSection(attrs.skills),
  };
}

/**
 * Transforme une réponse Strapi en array d'articles
 */
export function transformArticles(response: StrapiResponse<StrapiArticleAttributes>): Article[] {
  if (Array.isArray(response.data)) {
    return response.data.map(transformArticle);
  }
  return [transformArticle(response.data as StrapiEntity<StrapiArticleAttributes>)];
}

/**
 * Transforme une réponse Strapi en array de projets
 */
export function transformProjects(response: StrapiResponse<StrapiProjectAttributes>): Project[] {
  if (Array.isArray(response.data)) {
    return response.data.map(transformProject);
  }
  return [transformProject(response.data as StrapiEntity<StrapiProjectAttributes>)];
}

/**
 * Transforme les liens sociaux Strapi en SocialLinks
 */
export function transformSocialLinks(
  response: StrapiResponse<StrapiSocialLinksAttributes>
): SocialLinks {
  const strapiData = response.data as StrapiEntity<StrapiSocialLinksAttributes>;
  const attrs: StrapiSocialLinksAttributes =
    'attributes' in strapiData && strapiData.attributes
      ? strapiData.attributes
      : (strapiData as StrapiSocialLinksAttributes);

  const base = {
    id: strapiData.documentId || (strapiData as any).id?.toString() || 'unknown',
    documentId: strapiData.documentId,
    createdAt: new Date((strapiData as any).createdAt || Date.now()),
    updatedAt: new Date((strapiData as any).updatedAt || Date.now()),
    publishedAt: (strapiData as any).publishedAt
      ? new Date((strapiData as any).publishedAt)
      : undefined,
  };

  return {
    ...base,
    email: attrs.email,
    phone: attrs.phone,
    linkedin: attrs.linkedin,
    twitter: attrs.twitter,
    github: attrs.github,
    instagram: attrs.instagram,
    facebook: attrs.facebook,
    youtube: attrs.youtube,

    // Configuration d'affichage via composant
    footerConfiguration: {
      showEmail: attrs.footerConfiguration?.showEmail ?? true,
      showPhone: attrs.footerConfiguration?.showPhone ?? false,
      showLinkedin: attrs.footerConfiguration?.showLinkedin ?? true,
      showTwitter: attrs.footerConfiguration?.showTwitter ?? true,
      showGithub: attrs.footerConfiguration?.showGithub ?? true,
      showInstagram: attrs.footerConfiguration?.showInstagram ?? false,
      showFacebook: attrs.footerConfiguration?.showFacebook ?? false,
      showYoutube: attrs.footerConfiguration?.showYoutube ?? false,
    },
  };
}

/**
 * Transforme les paramètres globaux Strapi en GlobalSettings
 */
export function transformGlobalSettings(
  response: StrapiResponse<StrapiGlobalSettingsAttributes>
): GlobalSettings {
  const strapiData = response.data as StrapiEntity<StrapiGlobalSettingsAttributes>;
  const attrs: StrapiGlobalSettingsAttributes =
    'attributes' in strapiData && strapiData.attributes
      ? strapiData.attributes
      : (strapiData as StrapiGlobalSettingsAttributes);

  const base = {
    id: strapiData.documentId || (strapiData as any).id?.toString() || 'unknown',
    documentId: strapiData.documentId,
    createdAt: new Date((strapiData as any).createdAt || Date.now()),
    updatedAt: new Date((strapiData as any).updatedAt || Date.now()),
    publishedAt: (strapiData as any).publishedAt
      ? new Date((strapiData as any).publishedAt)
      : undefined,
  };

  return {
    ...base,
    siteName: attrs.siteName,
    siteDescription: attrs.siteDescription,
    logo:
      attrs.logo && attrs.logo.file
        ? (() => {
          const media = transformMedia(attrs.logo.file);
          if (!media) { return undefined; }
          return {
            ...media,
            alternativeText: attrs.logo.alt || media.alternativeText || '',
          };
        })()
        : undefined,
    favicon: transformMedia(attrs.favicon),
    defaultSeo: attrs.defaultSeo
      ? {
        metaTitle: attrs.defaultSeo.metaTitle,
        metaDescription: attrs.defaultSeo.metaDescription,
        metaKeywords: attrs.defaultSeo.metaKeywords
          ? attrs.defaultSeo.metaKeywords.split(',').map(k => k.trim()).filter(Boolean)
          : undefined,
        shareImage: transformMedia(attrs.defaultSeo.shareImage),
      }
      : undefined,
  };
}

/**
 * Transforme les pages légales Strapi en Legal
 */
export function transformLegal(response: StrapiResponse<StrapiLegalAttributes>): Legal {
  // Pour les types "single", la data est un objet unique, pas un array
  const strapiData = response.data as StrapiEntity<StrapiLegalAttributes>;

  // En Strapi v5, les données sont directement dans strapiData, pas dans strapiData.attributes
  const attrs: StrapiLegalAttributes =
    'attributes' in strapiData && strapiData.attributes
      ? strapiData.attributes
      : (strapiData as StrapiLegalAttributes);

  // Base content pour Strapi v5
  const base = {
    id: strapiData.documentId || (strapiData as any).id?.toString() || 'unknown',
    documentId: strapiData.documentId,
    createdAt: new Date((strapiData as any).createdAt || Date.now()),
    updatedAt: new Date((strapiData as any).updatedAt || Date.now()),
    publishedAt: (strapiData as any).publishedAt
      ? new Date((strapiData as any).publishedAt)
      : undefined,
  };

  return {
    ...base,
    title: attrs.title || 'Mentions Légales',
    description: attrs.description || '',
    content: attrs.content || '',
    lastUpdated: attrs.lastUpdated ? new Date(attrs.lastUpdated) : undefined,
  };
}

/**
 * Extrait les métadonnées de pagination depuis une réponse Strapi
 */
export function extractPagination(response: StrapiResponse<any>) {
  return (
    response.meta?.pagination || {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: Array.isArray(response.data) ? response.data.length : 1,
    }
  );
}
