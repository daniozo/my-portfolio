/**
 * Rate Limiter in-memory simple
 * Track les requêtes par IP et bloque les IPs trop agressives
 * 
 * Configuration via .env:
 * - RATE_LIMIT_MAX_REQUESTS: Nombre max de requêtes (défaut: 10)
 * - RATE_LIMIT_WINDOW_SECONDS: Fenêtre de temps en secondes (défaut: 60)
 * - RATE_LIMIT_BLOCK_DURATION_MINUTES: Durée du blocage en minutes (défaut: 5)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockedUntil?: number;
}

// Configuration depuis .env avec valeurs par défaut
const CONFIG = {
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60', 10) * 1000,
  BLOCK_DURATION_MS: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION_MINUTES || '5', 10) * 60 * 1000,
  CLEANUP_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes (fixe)
};

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Nettoyer périodiquement les anciennes entrées
    this.startCleanup();
  }

  /**
   * Vérifie si une IP peut faire une requête
   */
  check(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(ip);

    // Vérifier si l'IP est bloquée
    if (entry?.blocked) {
      if (entry.blockedUntil && now < entry.blockedUntil) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.blockedUntil,
        };
      }
      // Débloquer si le temps est écoulé
      this.requests.delete(ip);
    }

    // Nouvelle IP ou fenêtre expirée
    if (!entry || now > entry.resetTime) {
      this.requests.set(ip, {
        count: 1,
        resetTime: now + CONFIG.WINDOW_MS,
        blocked: false,
      });
      return {
        allowed: true,
        remaining: CONFIG.MAX_REQUESTS - 1,
        resetTime: now + CONFIG.WINDOW_MS,
      };
    }

    // Incrémenter le compteur
    entry.count++;

    // Vérifier si on dépasse la limite
    if (entry.count > CONFIG.MAX_REQUESTS) {
      entry.blocked = true;
      entry.blockedUntil = now + CONFIG.BLOCK_DURATION_MS;
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
      };
    }

    return {
      allowed: true,
      remaining: CONFIG.MAX_REQUESTS - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Nettoie les entrées expirées
   */
  private cleanup() {
    const now = Date.now();
    for (const [ip, entry] of this.requests.entries()) {
      // Supprimer les entrées expirées et non bloquées
      if (now > entry.resetTime && !entry.blocked) {
        this.requests.delete(ip);
      }
      // Supprimer les entrées bloquées dont le blocage est terminé
      if (entry.blocked && entry.blockedUntil && now > entry.blockedUntil) {
        this.requests.delete(ip);
      }
    }
  }

  /**
   * Démarre le nettoyage périodique
   */
  private startCleanup() {
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
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Réinitialise toutes les entrées (utile pour les tests)
   */
  reset() {
    this.requests.clear();
  }

  /**
   * Obtient les statistiques
   */
  getStats() {
    return {
      totalIPs: this.requests.size,
      blockedIPs: Array.from(this.requests.values()).filter((e) => e.blocked).length,
      config: {
        maxRequests: CONFIG.MAX_REQUESTS,
        windowSeconds: CONFIG.WINDOW_MS / 1000,
        blockDurationMinutes: CONFIG.BLOCK_DURATION_MS / (60 * 1000),
      },
    };
  }
}

// Instance singleton
export const rateLimiter = new RateLimiter();

// Helper pour extraire l'IP de la requête
export function getClientIP(request: Request): string {
  // Vérifier les headers de proxy (production)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // En développement local, utiliser une IP fictive mais unique
  // basée sur le User-Agent pour différencier les clients
  if (process.env.NODE_ENV === 'development') {
    const userAgent = request.headers.get('user-agent') || 'unknown-browser';
    // Créer un hash simple pour avoir une "IP" unique par navigateur
    const hash = Array.from(userAgent).reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    return `dev-${Math.abs(hash) % 255}.${Math.abs(hash >> 8) % 255}.${Math.abs(hash >> 16) % 255}.1`;
  }

  // Fallback pour la production (devrait rarement arriver)
  console.warn('⚠️ Unable to determine client IP, using fallback');
  return 'unknown';
}
