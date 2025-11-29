import type { DataService } from '@/types';
import {
  StrapiArticleRepository,
  StrapiProjectRepository,
  StrapiStaticRepository,
  StrapiLegalRepository,
  SearchRepository,
} from '@/lib/repositories';
import strapiClient from '@/lib/strapi-client';
import { logger } from '@/lib/config';

/**
 * Service principal de données
 */
class PortfolioDataService implements DataService {
  public articles: StrapiArticleRepository;
  public projects: StrapiProjectRepository;
  public static: StrapiStaticRepository;
  public legal: StrapiLegalRepository;
  public search: SearchRepository;

  constructor() {
    this.articles = new StrapiArticleRepository();
    this.projects = new StrapiProjectRepository();
    this.static = new StrapiStaticRepository();
    this.legal = new StrapiLegalRepository();
    this.search = new SearchRepository();
  }

  /**
   * Vérifie si Strapi est disponible
   */
  async isHealthy(): Promise<boolean> {
    try {
      const isHealthy = await strapiClient.isHealthy();
      return isHealthy;
    } catch (error) {
      logger.error('Server health check failed:', error);
      return false;
    }
  }

  /**
   * Initialise le service et effectue des vérifications
   */
  async initialize(): Promise<void> {
    logger.info('Initializing portfolio data service...');

    const isHealthy = await this.isHealthy();

    if (!isHealthy) {
      logger.warn('API is not available');
    } else {
      logger.info('Data service initialized successfully');
    }
  }
}

// Instance singleton du service de données
const dataService = new PortfolioDataService();

export default dataService;

// Export des types pour compatibilité
export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  content: string;
}

export type Project = {
  id: string;
  title: string;
  slug: string;
  date: string;
  role: string;
  excerpt: string;
  content: string;
};
