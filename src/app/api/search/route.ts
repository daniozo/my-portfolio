import { NextResponse, type NextRequest } from 'next/server';
import dataService from '@/lib/data';
import { searchQuerySchema, safeValidate } from '@/lib/validators';
import { rateLimiter, getClientIP } from '@/lib/rate-limiter';
import { searchCache, generateSearchCacheKey } from '@/lib/cache';

// Configuration depuis .env
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10);

export async function GET(request: NextRequest) {
  try {
    // 1. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimiter.check(clientIP);

    // Ajouter les headers de rate limit
    const headers = new Headers({
      'X-RateLimit-Limit': MAX_REQUESTS.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
    });

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      headers.set('Retry-After', retryAfter.toString());

      return NextResponse.json(
        {
          error: 'Trop de requêtes. Veuillez réessayer plus tard.',
          retryAfter,
        },
        {
          status: 429,
          headers,
        }
      );
    }

    // 2. Validation de la requête
    const searchParams = request.nextUrl.searchParams;
    const queryParam = searchParams.get('q');

    // Validation avec Zod
    const validation = safeValidate(searchQuerySchema, { q: queryParam });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Paramètres de recherche invalides',
          details: validation.errors,
          articles: [],
          projects: [],
        },
        {
          status: 400,
          headers,
        }
      );
    }

    const { q: query } = validation.data;

    // Générer la clé de cache
    const cacheKey = generateSearchCacheKey(query);

    // Vérifier le cache d'abord
    const cachedResults = searchCache.get(cacheKey);
    if (cachedResults) {
      headers.set('X-Cache', 'HIT');
      return NextResponse.json(cachedResults, { headers });
    }

    // Effectuer la recherche
    const results = await dataService.search.search(query);

    // Mettre en cache les résultats
    searchCache.set(cacheKey, results);
    headers.set('X-Cache', 'MISS');

    return NextResponse.json(results, { headers });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', articles: [], projects: [] },
      { status: 500 }
    );
  }
}
