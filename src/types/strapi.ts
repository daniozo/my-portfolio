/**
 * Types TypeScript pour l'API Strapi
 *
 * Ces types décrivent la structure des réponses de l'API Strapi v5.
 * Ils permettent d'avoir une typage strict au lieu d'utiliser `any`.
 *
 * @see https://docs.strapi.io/dev-docs/api/rest
 */

/**
 * Structure de base d'une entité Strapi
 */
export interface StrapiBase {
  id?: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string;
}

/**
 * Structure d'un fichier média dans Strapi
 */
export interface StrapiMediaFile {
  id?: number;
  documentId?: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, StrapiMediaFormat>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Format d'image (thumbnail, small, medium, large)
 */
export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

/**
 * Wrapper pour les médias dans les relations
 */
export interface StrapiMediaRelation {
  data?: StrapiMediaFile | StrapiEntityWithAttributes<StrapiMediaFile> | null;
}

/**
 * Wrapper pour une entité avec ses attributs (format Strapi v4/v5)
 */
export interface StrapiEntityWithAttributes<T> {
  id?: number;
  documentId?: string;
  attributes?: T;
}

/**
 * Wrapper pour les relations (one-to-one ou many-to-one)
 */
export interface StrapiRelation<T> {
  data?: StrapiEntityWithAttributes<T> | T | null;
}

/**
 * Wrapper pour les relations multiples (one-to-many ou many-to-many)
 */
export interface StrapiRelationMany<T> {
  data?: Array<StrapiEntityWithAttributes<T> | T>;
}

/**
 * Attributs d'un tag (pour articles et projets)
 */
export interface StrapiTagAttributes extends StrapiBase {
  name: string;
  slug?: string;
}

/**
 * Attributs d'une technologie
 */
export interface StrapiTechnologyAttributes extends StrapiBase {
  name: string;
  slug?: string;
  icon?: string;
  url?: string;
}

/**
 * Composant média (utilisé dans les projets)
 */
export interface StrapiComponentMedia {
  id?: number;
  file?: StrapiMediaFile;
  alt?: string;
  caption?: string;
  type?: 'image' | 'video';
  url?: string;
}

/**
 * Composant étape de story (utilisé dans les projets)
 */
export interface StrapiComponentStoryStep {
  id?: number;
  title: string;
  description: string;
  media?: StrapiComponentMedia;
}

/**
 * Composant lien (utilisé dans les projets)
 */
export interface StrapiComponentLink {
  id?: number;
  label?: string;
  url: string;
  type?: 'depot' | 'demo' | 'site' | 'rapport';
}

/**
 * Composant date (utilisé dans les projets)
 */
export interface StrapiComponentDate {
  start: string;
  end?: string | null;
}

/**
 * Attributs d'un article
 */
export interface StrapiArticleAttributes extends StrapiBase {
  title: string;
  description: string;
  slug: string;
  content: string;
  tags?: StrapiRelationMany<StrapiTagAttributes>;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  articleFooterMessage?: string;
}

/**
 * Attributs d'un projet
 */
export interface StrapiProjectAttributes extends StrapiBase {
  title: string;
  slug: string;

  // Nouveaux champs obligatoires
  date?: StrapiComponentDate;
  summary?: string;
  coverMedia?: StrapiComponentMedia;
  problemStatement?: string;
  solution?: string;
  story?: StrapiComponentStoryStep[];
  gallery?: StrapiComponentMedia[];
  conclusion?: string;
  links?: StrapiComponentLink[];
  tags?: StrapiRelationMany<StrapiTagAttributes>;
}

/**
 * Composant Resume
 */
export interface StrapiComponentResume {
  file?: StrapiMediaRelation;
  show?: boolean;
}

/**
 * Composant Skill Item
 */
export interface StrapiComponentSkillItem {
  name: string;
}

/**
 * Composant Skill Category
 */
export interface StrapiComponentSkillCategory {
  category: string;
  skills?: StrapiComponentSkillItem[];
}

/**
 * Composant Skills Section
 */
export interface StrapiComponentSkillsSection {
  categories?: StrapiComponentSkillCategory[];
  show?: boolean;
}

/**
 * Composant Education Item
 */
export interface StrapiComponentEducationItem {
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

/**
 * Composant Education Section
 */
export interface StrapiComponentEducationSection {
  educations?: StrapiComponentEducationItem[];
  show?: boolean;
}

/**
 * Composant Experience Item
 */
export interface StrapiComponentExperienceItem {
  position: string;
  company?: string;
  type?: 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Personnel';
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

/**
 * Composant Experience Section
 */
export interface StrapiComponentExperienceSection {
  experiences?: StrapiComponentExperienceItem[];
  show?: boolean;
}

/**
 * Attributs de About Info
 */
export interface StrapiAboutInfoAttributes extends StrapiBase {
  fullName: string;
  biography: string;
  currentLocation?: string;
  jobTitle?: string;
  currentCompany?: string;
  profileImage?: StrapiMediaRelation;
  resume?: StrapiComponentResume;
  educations?: StrapiComponentEducationSection;
  experiences?: StrapiComponentExperienceSection;
  skills?: StrapiComponentSkillsSection;
}

/**
 * Composant de configuration du footer
 */
export interface StrapiComponentFooterConfiguration {
  showEmail?: boolean;
  showPhone?: boolean;
  showLinkedin?: boolean;
  showTwitter?: boolean;
  showGithub?: boolean;
  showInstagram?: boolean;
  showFacebook?: boolean;
  showYoutube?: boolean;
}

/**
 * Attributs des liens sociaux
 */
export interface StrapiSocialLinksAttributes extends StrapiBase {
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  footerConfiguration?: StrapiComponentFooterConfiguration;
}

/**
 * Composant SEO par défaut
 */
export interface StrapiComponentDefaultSeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string; // Chaîne de mots-clés séparés par des virgules
  shareImage?: StrapiMediaRelation;
}

/**
 * Attributs des paramètres globaux
 */
export interface StrapiComponentLogo {
  file?: StrapiMediaRelation;
  alt?: string;
}

export interface StrapiGlobalSettingsAttributes extends StrapiBase {
  siteName: string;
  siteDescription: string;
  logo?: StrapiComponentLogo;
  favicon?: StrapiMediaRelation;
  defaultSeo?: StrapiComponentDefaultSeo;
}

/**
 * Attributs d'une page légale
 */
export interface StrapiLegalAttributes extends StrapiBase {
  title: string;
  description?: string;
  slug: string;
  content: string;
  lastUpdated?: string;
}

/**
 * Type union pour les entités Strapi (support v4 et v5)
 *
 * En Strapi v4, les données sont dans `data.attributes`
 * En Strapi v5, les données sont directement dans `data`
 */
export type StrapiEntity<T> = T | StrapiEntityWithAttributes<T>;

/**
 * Type union pour les données Strapi (single ou collection)
 */
export type StrapiData<T> = StrapiEntity<T> | StrapiEntity<T>[];
