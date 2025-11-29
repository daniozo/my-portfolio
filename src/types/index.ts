// ==============================================
// TYPES ET INTERFACES POUR LE PORTFOLIO
// ==============================================

/**
 * Interface de base pour tous les contenus
 */
export interface BaseContent {
  id: string;
  documentId?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Interface pour les articles
 */
export interface Article extends BaseContent {
  title: string;
  description: string;
  slug: string;
  content: string;
  tags?: string[];
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  articleFooterMessage?: string;
}

/**
 * Interface pour les projets
 */
/**
 * Interface pour les médias dans les projets
 */
export interface ProjectMedia {
  url: string;
  alt: string;
  type: 'image' | 'video';
}

/**
 * Interface pour les éléments de galerie
 */
export interface GalleryItem extends ProjectMedia {
  caption: string;
}

/**
 * Interface pour les étapes de l'histoire du projet
 */
export interface ProjectStoryStep {
  title: string;
  media?: ProjectMedia;
  description: string;
}

/**
 * Interface pour les liens du projet
 */
export interface ProjectLink {
  url: string;
  type: 'depot' | 'site' | 'demo' | 'rapport' | 'autre';
}

/**
 * Interface pour les dates du projet
 */
export interface ProjectDate {
  start: string;
  end?: string | null;
}

/**
 * Interface pour les projets
 */
export interface Project extends BaseContent {
  title: string;
  slug: string;
  date: ProjectDate;
  summary: string;
  coverMedia?: ProjectMedia;
  problemStatement: string;
  solution: string;
  story: ProjectStoryStep[];
  gallery?: GalleryItem[];
  conclusion: string;
  links: ProjectLink[];
  tags: string[];
}

/**
 * Interface pour les informations "À propos" - Alignée sur le schéma Strapi
 */
export interface AboutInfo extends BaseContent {
  // Champs obligatoires dans Strapi
  fullName: string;
  biography: string;

  // Champs optionnels dans Strapi
  currentLocation?: string;
  jobTitle?: string;
  currentCompany?: string;
  profileImage?: MediaAsset;

  // Composants avec contrôle d'affichage au niveau section
  resume?: AboutResume;
  educations?: EducationSection;
  experiences?: ExperienceSection;
  skills?: SkillsSection;
}


/**
 * Interface pour le composant Resume
 */
export interface AboutResume {
  file: MediaAsset;
  show: boolean;
}

/**
 * Interface pour une compétence individuelle
 */
export interface SkillItem {
  name: string;
}

/**
 * Interface pour une catégorie de compétences
 */
export interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

/**
 * Interface pour la section compétences
 */
export interface SkillsSection {
  categories: SkillCategory[];
  show: boolean;
}

/**
 * Interface pour une formation
 */
export interface EducationItem {
  degree: string;
  school: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

/**
 * Interface pour la section formations
 */
export interface EducationSection {
  educations: EducationItem[];
  show: boolean;
}

/**
 * Interface pour une expérience
 */
export interface ExperienceItem {
  position: string;
  company?: string;
  type?: 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Personnel';
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

/**
 * Interface pour la section expériences
 */
export interface ExperienceSection {
  experiences: ExperienceItem[];
  show: boolean;
}

/**
 * Interface pour les pages légales
 */
export interface Legal extends BaseContent {
  title: string;
  description: string;
  content: string;
  lastUpdated?: Date;
}

/**
 * Interface pour les paramètres globaux
 */
export interface GlobalSettings extends BaseContent {
  siteName: string;
  siteDescription: string;
  logo?: MediaAsset;
  favicon?: MediaAsset;
  defaultSeo?: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords?: string[];
    shareImage?: MediaAsset;
  };
}

/**
 * Interface pour les résultats de recherche
 */
export interface SearchResult {
  id: string;
  type: 'article' | 'project';
  title: string;
  description: string;
  slug: string;
  url: string;
  tags?: string[];
  publishedAt?: Date;
}

/**
 * Interface pour les médias
 */
export interface MediaAsset {
  id: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  size?: number;
  mime?: string;
}

/**
 * Options de recherche génériques
 */
export interface SearchOptions {
  status?: 'published' | 'draft';
  limit?: number;
  offset?: number;
  sort?: string[];
  populate?: string[];
  filters?: Record<string, any>;
}

/**
 * Réponse de recherche paginée
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Réponse simple pour un seul élément
 */
export interface SingleResponse<T> {
  data: T;
  meta?: Record<string, any>;
}

/**
 * Interface d'erreur standardisée
 */
export interface APIError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Configuration de l'API
 */
export interface APIConfig {
  baseURL: string;
  token?: string;
  timeout?: number;
  retries?: number;
}

/**
 * Repository interface générique
 */
export interface Repository<T> {
  findMany(options?: SearchOptions): Promise<T[]>;
  findOne(id: string, options?: SearchOptions): Promise<T | null>;
  findBySlug(slug: string, options?: SearchOptions): Promise<T | null>;
}

/**
 * Repository spécialisé pour les articles
 */
export interface ArticleRepository extends Repository<Article> {
  findPublished(options?: SearchOptions): Promise<Article[]>;
  getTotalCount(options?: SearchOptions): Promise<number>;
}

/**
 * Repository spécialisé pour les projets
 */
export interface ProjectRepository extends Repository<Project> {
  getTotalCount(options?: SearchOptions): Promise<number>;
}

/**
 * Repository pour les pages légales
 */
export interface LegalRepository {
  getLegalPages(): Promise<Legal | null>;
}

/**
 * Repository pour les informations statiques
 */
export interface StaticRepository {
  getAboutInfo(): Promise<AboutInfo | null>;
  getSocialLinks(): Promise<SocialLinks | null>;
  getGlobalSettings(): Promise<GlobalSettings | null>;
}

/**
 * Interface principale du data service
 */
export interface DataService {
  articles: ArticleRepository;
  projects: ProjectRepository;
  static: StaticRepository;
  legal: LegalRepository;
  isHealthy(): Promise<boolean>;
}

/**
 * Types utilitaires pour les transformations
 */
export type StrapiData<T> = {
  id: number;
  documentId: string;
  attributes: T;
  meta?: Record<string, any>;
};

export type StrapiResponse<T> = {
  data: StrapiData<T> | StrapiData<T>[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

/**
 * Interface pour la configuration d'affichage des liens sociaux dans le footer
 */
export interface FooterSocialConfig {
  showEmail: boolean;
  showPhone: boolean;
  showLinkedin: boolean;
  showTwitter: boolean;
  showGithub: boolean;
  showInstagram: boolean;
  showFacebook: boolean;
  showYoutube: boolean;
}

/**
 * Interface pour les liens sociaux et informations de contact
 */
export interface SocialLinks extends BaseContent {
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;

  // Configuration d'affichage via composant
  footerConfiguration: FooterSocialConfig;
} /**
 * Interface pour le composant SEO
 */
export interface SeoComponent {
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[]; // Mots-clés SEO pour les métadonnées
  shareImage?: MediaAsset;
}

/**
 * Interface pour les paramètres globaux
 */
export interface GlobalSettings extends BaseContent {
  siteName: string;
  siteDescription: string;
  favicon?: MediaAsset;
  defaultSeo?: SeoComponent;
}

/**
 * Données globales pour l'application
 */
export interface GlobalData {
  globalSettings: GlobalSettings | null;
  socialLinks: SocialLinks | null;
}
