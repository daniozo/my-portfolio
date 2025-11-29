import type { APIConfig } from '@/types';

/**
 * Configuration par défaut de l'API
 */
const DEFAULT_CONFIG: Partial<APIConfig> = {
  timeout: 5000,
  retries: 3,
};

/**
 * Récupère la configuration de l'API depuis les variables d'environnement
 */
export function getAPIConfig(): APIConfig {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!baseURL) {
    throw new Error('NEXT_PUBLIC_API_URL is required');
  }

  return {
    ...DEFAULT_CONFIG,
    baseURL,
    token,
    timeout: process.env.NEXT_PUBLIC_API_TIMEOUT
      ? parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT, 10)
      : DEFAULT_CONFIG.timeout!,
  };
}

/**
 * Vérifie si on est en mode développement
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Vérifie si les logs de debug sont activés
 */
export function isDebugMode(): boolean {
  return process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
}

/**
 * Vérifie si les erreurs API doivent être affichées
 */
export function shouldShowAPIErrors(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_API_ERRORS === 'true' && isDevelopment();
}

/**
 * Récupère l'URL de base pour les médias
 */
export function getMediaURL(): string {
  return (
    process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''
  );
}

/**
 * Récupère la durée de cache pour les articles
 */
export function getArticlesCacheDuration(): number {
  return process.env.NEXT_PUBLIC_ARTICLES_CACHE_DURATION
    ? parseInt(process.env.NEXT_PUBLIC_ARTICLES_CACHE_DURATION, 10)
    : 3600;
}

/**
 * Récupère la durée de cache pour les données statiques
 */
export function getStaticCacheDuration(): number {
  return process.env.NEXT_PUBLIC_STATIC_CACHE_DURATION
    ? parseInt(process.env.NEXT_PUBLIC_STATIC_CACHE_DURATION, 10)
    : 86400;
}

/**
 * Logger configuré selon l'environnement
 */
export const logger = {
  debug: (...args: any[]) => {
    if (isDebugMode()) {
      console.debug('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment()) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
    if (shouldShowAPIErrors()) {
      // En développement, on peut ajouter plus de contexte
      console.trace();
    }
  },
};
