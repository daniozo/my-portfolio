/**
 * Rate Limiting System
 *
 * Simple in-memory rate limiting for API routes.
 * For production with multiple instances, consider using Redis/Upstash.
 */

interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory storage for rate limit data
 * Key: identifier (IP, user ID, etc.)
 * Value: { count, resetTime }
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries every 5 minutes
 */
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupTimer) {
    return;
  }

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => rateLimitStore.delete(key));

    if (rateLimitStore.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, CLEANUP_INTERVAL);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  /** Search API: 30 requests per minute */
  SEARCH: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  /** General API: 100 requests per minute */
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  /** Strict limit: 10 requests per minute */
  STRICT: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 *
 * @example
 * ```typescript
 * const identifier = getClientIP(request);
 * const result = rateLimit(identifier, RATE_LIMITS.SEARCH);
 *
 * if (!result.success) {
 *   return new Response('Too Many Requests', {
 *     status: 429,
 *     headers: {
 *       'X-RateLimit-Limit': result.limit.toString(),
 *       'X-RateLimit-Remaining': result.remaining.toString(),
 *       'X-RateLimit-Reset': result.reset.toString(),
 *       'Retry-After': result.retryAfter?.toString() || '60',
 *     },
 *   });
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.API
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Start cleanup timer if needed
  if (rateLimitStore.size > 0) {
    startCleanup();
  }

  // No entry or expired entry - create new one
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: resetTime,
    };
  }

  // Entry exists and not expired - increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: entry.resetTime,
      retryAfter,
    };
  }

  // Within limit
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Extract client IP from request headers
 *
 * @param request - Next.js request object
 * @returns Client IP address or 'unknown'
 */
export function getClientIP(request: Request): string {
  // Try to get IP from various headers
  const headers = new Headers(request.headers);

  // Check X-Forwarded-For (most common)
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return xForwardedFor.split(',')[0].trim();
  }

  // Check X-Real-IP
  const xRealIP = headers.get('x-real-ip');
  if (xRealIP) {
    return xRealIP.trim();
  }

  // Check CF-Connecting-IP (Cloudflare)
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // Fallback to 'unknown'
  return 'unknown';
}

/**
 * Create rate limit response headers
 *
 * @param result - Rate limit result
 * @returns Headers object
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };

  if (result.retryAfter !== undefined) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Clear all rate limit data (useful for testing)
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
}

/**
 * Get current rate limit store size (useful for monitoring)
 */
export function getRateLimitStoreSize(): number {
  return rateLimitStore.size;
}
