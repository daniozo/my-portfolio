import dataService from '@/lib/data';
import { getGlobalSettingsFromEnv } from '@/lib/env-config';
import type { Article } from '@/types';

export async function GET() {
  try {
    // Vérifier si Strapi est disponible
    const isHealthy = await dataService.isHealthy();

    if (!isHealthy) {
      return new Response('Service temporairement indisponible', {
        status: 503,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    // Récupérer les articles
    const articles = await dataService.articles.findMany();
    const globalSettings = getGlobalSettingsFromEnv();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const currentDate = new Date().toUTCString();

    // Générer le flux RSS
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${globalSettings.siteName}</title>
    <link>${siteUrl}</link>
    <description>${globalSettings.siteDescription}</description>
    <language>fr</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss" rel="self" type="application/rss+xml" />
    ${articles
        .map(
          (article: Article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/articles/${article.slug}</link>
      <guid>${siteUrl}/articles/${article.slug}</guid>
      <pubDate>${article.publishedAt ? new Date(article.publishedAt).toUTCString() : currentDate}</pubDate>
      <description>${escapeXml(article.description || '')}</description>
      ${article.tags?.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`
        )
        .join('\n')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la génération du flux RSS:', error);
    return new Response('Erreur lors de la génération du flux RSS', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}

/**
 * Échappe les caractères spéciaux XML
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
