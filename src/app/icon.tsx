// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ImageResponse } from 'next/og';

// Configuration du favicon
// Note: Utilise `fetch` directement car le runtime edge ne supporte pas toutes les dépendances du strapiClient
export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default async function Icon() {
  try {
    // Configuration
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const strapiToken = process.env.STRAPI_API_TOKEN; // Variable privée (serveur uniquement)

    // Récupère les paramètres globaux depuis Strapi
    const response = await fetch(`${strapiUrl}/api/global?populate=favicon`, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
      next: { revalidate: 3600 }, // Cache pendant 1 heure
    });

    if (!response.ok) {
      return new Response(null, { status: 404 });
    }

    const data = await response.json();
    const faviconUrl = data?.data?.favicon.url;
    const faviconMime = data?.data?.favicon.mime;

    // Si pas de favicon, retourner 404
    if (!faviconUrl || !faviconMime) {
      return new Response(null, { status: 404 });
    }

    // Construire l'URL complète si elle est relative
    const fullFaviconUrl = faviconUrl.startsWith('http')
      ? faviconUrl
      : `${strapiUrl}${faviconUrl}`;

    // Valider que le fichier est bien une image
    const validImageTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
      'image/x-icon',
      'image/vnd.microsoft.icon',
    ];
    if (!validImageTypes.includes(faviconMime)) {
      console.warn(`Invalid favicon type: ${faviconMime}. Expected an image.`);
      return new Response(null, { status: 404 });
    }

    // Récupérer le favicon depuis Strapi
    const faviconResponse = await fetch(fullFaviconUrl);
    if (!faviconResponse.ok) {
      return new Response(null, { status: 404 });
    }

    const blob = await faviconResponse.blob();
    const arrayBuffer = await blob.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': blob.type,
        'Cache-Control': 'public, max-age=3600, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating favicon:', error);
    return new Response(null, { status: 404 });
  }
}
