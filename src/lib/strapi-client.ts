import { strapi } from '@strapi/client';
import type { APIError, StrapiResponse } from '@/types';
import { getAPIConfig, isAPIConfigured, logger } from '@/lib/config';

class StrapiClient {
  private client: any;
  private config: ReturnType<typeof getAPIConfig>;
  private isConfigured: boolean;

  constructor() {
    this.config = getAPIConfig();
    this.isConfigured = isAPIConfigured();

    if (this.isConfigured && this.config) {
      this.client = strapi({
        baseURL: this.config.baseURL,
        auth: this.config.token,
      });
    } else {
      this.client = null;
    }
  }

  /**
   * Vérifie si l'API est accessible
   */
  async isHealthy(): Promise<boolean> {
    // Si pas de configuration, on retourne false immédiatement
    if (!this.isConfigured || !this.config) {
      return false;
    }

    try {
      // Utilise l'endpoint officiel de health check de Strapi (en dehors de /api)
      const response = await fetch(`${this.config.baseURL.replace('/api', '')}/_health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (_error) {
      return false;
    }
  }

  /**
   * Exécute une requête avec gestion d'erreur et retry
   */
  async executeRequest<T>(
    operation: () => Promise<T>,
    retries: number = this.config?.retries || 3
  ): Promise<T> {
    // Si pas de configuration, on lance une erreur claire
    if (!this.isConfigured || !this.config) {
      throw this.handleError(new Error('API not configured'));
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.debug(`Strapi request attempt ${attempt}/${retries}`);
        const result = await Promise.race([operation(), this.createTimeoutPromise()]);

        logger.debug(`Strapi request successful on attempt ${attempt}`);
        return result;
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Strapi request failed on attempt ${attempt}:`, error);

        if (attempt === retries) {
          break;
        }

        // Attendre avant de réessayer (backoff exponentiel)
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw this.handleError(lastError!);
  }

  /**
   * Crée une promesse de timeout
   */
  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), this.config?.timeout || 5000);
    });
  }

  /**
   * Délai d'attente
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Gère les erreurs et les transforme en APIError
   */
  private handleError(error: Error): APIError {
    logger.error('Strapi client error:', error);

    if (error.message.includes('not configured') || error.message.includes('API not configured')) {
      return {
        status: 503,
        name: 'NotConfiguredError',
        message: 'Le serveur de contenu n\'est pas configuré',
        details: { originalError: error.message },
      };
    }

    if (error.message.includes('timeout')) {
      return {
        status: 408,
        name: 'TimeoutError',
        message: 'La requête a pris trop de temps',
        details: { originalError: error.message },
      };
    }

    if (error.message.includes('Network')) {
      return {
        status: 503,
        name: 'NetworkError',
        message: 'Impossible de contacter le serveur',
        details: { originalError: error.message },
      };
    }

    return {
      status: 500,
      name: 'UnknownError',
      message: "Une erreur inattendue s'est produite",
      details: { originalError: error.message },
    };
  }

  /**
   * Récupère une collection avec gestion d'erreur
   */
  async getCollection(
    collectionName: string,
    options: Record<string, any> = {}
  ): Promise<StrapiResponse<any>> {
    return this.executeRequest(async () => {
      const collection = this.client.collection(collectionName);
      const response = await collection.find(options);
      return response;
    });
  }

  /**
   * Récupère un élément unique avec gestion d'erreur
   */
  async getSingle(
    singleName: string,
    options: Record<string, any> = {}
  ): Promise<StrapiResponse<any>> {
    return this.executeRequest(async () => {
      const single = this.client.single(singleName);
      const response = await single.find(options);
      return response;
    });
  }

  /**
   * Récupère un élément par slug avec gestion d'erreur
   */
  async getBySlug(
    collectionName: string,
    slug: string,
    options: Record<string, any> = {}
  ): Promise<StrapiResponse<any>> {
    return this.executeRequest(async () => {
      const collection = this.client.collection(collectionName);
      // Utiliser find avec filtre pour récupérer la version publiée
      const response = await collection.find({
        ...options,
        filters: {
          slug: slug,
          publishedAt: {
            $notNull: true,
          },
          ...options.filters,
        },
      });
      return response;
    });
  }

  /**
   * Recherche dans plusieurs collections
   */
  async search(
    query: string,
    collections: string[] = ['articles', 'projects'],
  ): Promise<Record<string, StrapiResponse<any>>> {
    return this.executeRequest(async () => {
      const results: Record<string, StrapiResponse<any>> = {};

      logger.info(`StrapiClient: Searching for "${query}" in collections:`, collections);

      // Recherche parallèle dans toutes les collections
      await Promise.all(
        collections.map(async (collectionName) => {
          try {
            // Construire l'URL avec les filtres selon le type de collection
            const params = new URLSearchParams();
            params.append('filters[publishedAt][$notNull]', 'true');

            // Champs de recherche selon la collection
            if (collectionName === 'articles') {
              params.append('filters[$or][0][title][$containsi]', query);
              params.append('filters[$or][1][description][$containsi]', query);
              params.append('filters[$or][2][tags][name][$containsi]', query);
            } else if (collectionName === 'projects') {
              params.append('filters[$or][0][title][$containsi]', query);
              params.append('filters[$or][1][summary][$containsi]', query);
              params.append('filters[$or][2][tags][name][$containsi]', query);
            }

            const url = `${this.config!.baseURL}/${collectionName}?${params.toString()}`;

            logger.info(`StrapiClient: Fetching URL:`, url);

            const response = await fetch(url, {
              headers: {
                Authorization: `Bearer ${this.config!.token}`,
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            logger.info(
              `StrapiClient: ${collectionName} returned ${data.data?.length || 0} results`
            );

            results[collectionName] = data;
          } catch (error) {
            logger.warn(`Search failed for collection ${collectionName}:`, error);
            results[collectionName] = { data: [] };
          }
        })
      );

      return results;
    });
  }
}

// Instance singleton
const strapiClient = new StrapiClient();

export default strapiClient;
