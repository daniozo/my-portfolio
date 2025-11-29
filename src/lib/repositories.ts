import type {
  Article,
  Project,
  AboutInfo,
  Legal,
  SocialLinks,
  GlobalSettings,
  ArticleRepository,
  ProjectRepository,
  StaticRepository,
  LegalRepository,
  SearchOptions,
} from '@/types';
import strapiClient from '@/lib/strapi-client';
import {
  transformArticles,
  transformProjects,
  transformAboutInfo,
  transformSocialLinks,
  transformGlobalSettings,
  transformLegal,
} from '@/lib/transformers';
import { logger } from '@/lib/config';

/**
 * Repository pour les articles
 */
export class StrapiArticleRepository implements ArticleRepository {
  async findMany(options: SearchOptions = {}): Promise<Article[]> {
    const response = await strapiClient.getCollection('articles', {
      filters: {
        publishedAt: {
          $notNull: true,
        },
        ...options.filters,
      },
      populate: ['tags'],
      pagination: {
        limit: options.limit || 25,
        start: options.offset || 0,
      },
      sort: options.sort || ['publishedAt:desc'],
    });

    return transformArticles(response);
  }

  async findOne(id: string, options: SearchOptions = {}): Promise<Article | null> {
    const response = await strapiClient.getCollection('articles', {
      filters: {
        documentId: id,
        publishedAt: {
          $notNull: true,
        },
        ...options.filters,
      },
      populate: ['tags'],
    });

    const articles = transformArticles(response);
    return articles.length > 0 ? articles[0] : null;
  }

  async findBySlug(slug: string, options: SearchOptions = {}): Promise<Article | null> {
    const response = await strapiClient.getBySlug('articles', slug, {
      filters: options.filters,
      populate: ['tags'],
    });

    const articles = transformArticles(response);
    const found = articles.find(a => a.slug === slug);
    return found || null;
  }

  async findPublished(options: SearchOptions = {}): Promise<Article[]> {
    return this.findMany(options);
  }

  /**
   * Récupère le nombre total d'articles publiés
   * Utilise pagination[limit]=1 pour minimiser les données transférées
   * et récupérer uniquement meta.pagination.total
   */
  async getTotalCount(options: SearchOptions = {}): Promise<number> {
    const response = await strapiClient.getCollection('articles', {
      filters: {
        publishedAt: {
          $notNull: true,
        },
        ...options.filters,
      },
      pagination: {
        limit: 1, // On ne charge qu'un seul élément pour récupérer le total
      },
    });

    return response.meta?.pagination?.total || 0;
  }
}

/**
 * Repository pour les projets
 */
export class StrapiProjectRepository implements ProjectRepository {
  async findMany(options: SearchOptions = {}): Promise<Project[]> {
    const response = await strapiClient.getCollection('projects', {
      filters: {
        publishedAt: {
          $notNull: true,
        },
        ...options.filters,
      },
      pagination: {
        limit: options.limit || 25,
        start: options.offset || 0,
      },
      sort: options.sort || ['publishedAt:desc'],
      populate: options.populate || {
        coverMedia: {
          populate: 'file',
        },
        story: {
          populate: {
            media: {
              populate: 'file',
            },
          },
        },
        gallery: {
          populate: 'file',
        },
        date: true,
        tags: true,
        links: true,
      },
    });

    return transformProjects(response);
  }

  async findOne(id: string, options: SearchOptions = {}): Promise<Project | null> {
    const response = await strapiClient.getCollection('projects', {
      filters: {
        documentId: id,
        publishedAt: {
          $notNull: true,
        },
        ...options.filters,
      },
      populate: options.populate || '*',
    });
    const projects = transformProjects(response);
    return projects.length > 0 ? projects[0] : null;
  }

  async findBySlug(slug: string, options: SearchOptions = {}): Promise<Project | null> {
    const response = await strapiClient.getBySlug('projects', slug, {
      filters: {
        ...options.filters,
      },
      populate: options.populate || {
        coverMedia: {
          populate: 'file',
        },
        story: {
          populate: {
            media: {
              populate: 'file',
            },
          },
        },
        gallery: {
          populate: 'file',
        },
        date: true,
        tags: true,
        links: true,
      },
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const projects = transformProjects(response);
      return projects.length > 0 ? projects[0] : null;
    }

    return null;
  }

  /**
   * Récupère le nombre total de projets publiés
   * Utilise pagination[limit]=1 pour minimiser les données transférées
   * et récupérer uniquement meta.pagination.total
   */
  async getTotalCount(options: SearchOptions = {}): Promise<number> {
    const response = await strapiClient.getCollection('projects', {
      filters: {
        publishedAt: {
          $notNull: true,
        },
        ...options.filters,
      },
      pagination: {
        limit: 1, // On ne charge qu'un seul élément pour récupérer le total
      },
    });

    return response.meta?.pagination?.total || 0;
  }
}

/**
 * Repository pour les données statiques
 */
export class StrapiStaticRepository implements StaticRepository {
  async getAboutInfo(): Promise<AboutInfo | null> {
    const response = await strapiClient.getSingle('about', {
      populate: {
        profileImage: true,
        resume: {
          populate: 'file',
        },
        educations: {
          populate: {
            educations: true,
          },
          // Filtre conditionnel : ne récupère que si show = true
          filters: {
            show: {
              $eq: true,
            },
          },
        },
        experiences: {
          populate: {
            experiences: true,
          },
          // Filtre conditionnel : ne récupère que si show = true
          filters: {
            show: {
              $eq: true,
            },
          },
        },
        skills: {
          populate: {
            categories: {
              populate: 'skills',
            },
          },
          // Filtre conditionnel : ne récupère que si show = true
          filters: {
            show: {
              $eq: true,
            },
          },
        },
      },
    });

    if (response.data) {
      try {
        const transformed = transformAboutInfo(response);
        return transformed;
      } catch (transformError) {
        console.error('AboutPage - Transform error:', transformError);
        throw transformError;
      }
    }

    return null;
  }

  async getSocialLinks(): Promise<SocialLinks | null> {
    const response = await strapiClient.getSingle('social-links');

    if (response.data) {
      return transformSocialLinks(response);
    }

    return null;
  }

  async getGlobalSettings(): Promise<GlobalSettings | null> {
    const response = await strapiClient.getSingle('global', {
      populate: {
        logo: { populate: 'file' },
        favicon: true,
        defaultSeo: { populate: 'shareImage' },
      },
    });

    if (response.data) {
      return transformGlobalSettings(response);
    }

    return null;
  }
}

/**
 * Repository pour les pages légales
 */
export class StrapiLegalRepository implements LegalRepository {
  async getLegalPages(): Promise<Legal | null> {
    const response = await strapiClient.getSingle('legal');

    if (response.data) {
      return transformLegal(response);
    }

    return null;
  }
}

/**
 * Repository pour la recherche
 */
export class SearchRepository {
  async search(query: string): Promise<{ articles: Article[]; projects: Project[] }> {
    try {
      const trimmedQuery = query.trim();

      // Minimum 2 caractères requis
      if (!trimmedQuery || trimmedQuery.length < 2) {
        return { articles: [], projects: [] };
      }

      logger.info('SearchRepository: Searching for:', trimmedQuery);
      const results = await strapiClient.search(trimmedQuery, ['articles', 'projects']);
      logger.info('SearchRepository: Raw results:', JSON.stringify(results, null, 2));

      const articles = results.articles?.data
        ? transformArticles({ data: results.articles.data })
        : [];

      const projects = results.projects?.data
        ? transformProjects({ data: results.projects.data })
        : [];

      logger.info(
        `SearchRepository: Found ${articles.length} articles and ${projects.length} projects`
      );

      return { articles, projects };
    } catch (error) {
      logger.error('Error searching content:', error);
      return { articles: [], projects: [] };
    }
  }
}

// Export de l'instance par défaut
export { StrapiStaticRepository as StaticRepository, StrapiLegalRepository as LegalRepository };
