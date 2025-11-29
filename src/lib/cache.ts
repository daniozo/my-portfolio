/**
 * Cache in-memory simple avec TTL
 * Évite de faire des requêtes identiques à Strapi
 * 
 * Configuration via .env:
 * - CACHE_TTL_MINUTES: Durée de vie des entrées (défaut: 5)
 * - CACHE_CLEANUP_INTERVAL_MINUTES: Intervalle de nettoyage (défaut: 10)
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// Configuration depuis .env avec valeurs par défaut
const CONFIG = {
  DEFAULT_TTL_MS: parseInt(process.env.CACHE_TTL_MINUTES || '5', 10) * 60 * 1000,
  CLEANUP_INTERVAL_MS: parseInt(process.env.CACHE_CLEANUP_INTERVAL_MINUTES || '10', 10) * 60 * 1000,
};

class SimpleCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(private ttlMs: number = CONFIG.DEFAULT_TTL_MS) {
    this.startCleanup();
  }

  /**
   * Récupère une valeur du cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Vérifier si l'entrée a expiré
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Ajoute une valeur au cache
   */
  set(key: string, value: T, customTTL?: number): void {
    const ttl = customTTL ?? this.ttlMs;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Vérifie si une clé existe et est valide
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Supprime une entrée du cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Nettoie les entrées expirées
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Démarre le nettoyage périodique
   */
  private startCleanup(): void {
    if (this.cleanupInterval) {
      return;
    }
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, CONFIG.CLEANUP_INTERVAL_MS);
  }

  /**
   * Arrête le nettoyage périodique
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Obtient les statistiques du cache
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now <= entry.expiresAt) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      config: {
        ttlMinutes: this.ttlMs / (60 * 1000),
        cleanupIntervalMinutes: CONFIG.CLEANUP_INTERVAL_MS / (60 * 1000),
      },
    };
  }
}

// Instance singleton pour les résultats de recherche (utilise la config par défaut)
export const searchCache = new SimpleCache<unknown>();

/**
 * Génère une clé de cache normalisée pour une recherche
 */
export function generateSearchCacheKey(query: string, type?: string): string {
  const normalizedQuery = query.trim().toLowerCase();
  return type ? `search:${type}:${normalizedQuery}` : `search:all:${normalizedQuery}`;
}
