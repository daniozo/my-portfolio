import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDateFr(date: Date | string, formatString: string = 'dd MMMM yyyy') {
  const dateObject = typeof date === 'string' ? new Date(date) : date;

  let options: Intl.DateTimeFormatOptions;

  switch (formatString) {
    case 'MMMM yyyy':
      options = { month: 'long', year: 'numeric' };
      break;
    case 'd MMMM yyyy':
    case 'dd MMMM yyyy':
    default:
      options = { day: 'numeric', month: 'long', year: 'numeric' };
      break;
  }

  return dateObject.toLocaleDateString('fr-FR', options);
}

/**
 * Formate une plage de dates pour les projets
 * Si end est null, affiche seulement la date de début ou "En cours" selon le contexte
 * Si start === end, affiche seulement une date (projet réalisé en un jour)
 */
export function formatProjectDateRange(startDate: string | null, endDate?: string | null) {
  if (!startDate) {
    return 'Date non définie';
  }

  const start = formatDateFr(startDate);

  // Si pas de date de fin, on considère que c'est "En cours"
  if (!endDate) {
    return `${start} - En cours`;
  }

  const end = formatDateFr(endDate);

  // Si les dates sont identiques, afficher seulement une date
  if (startDate === endDate) {
    return start;
  }

  return `${start} - ${end}`;
}

/**
 * Convertit un titre en slug.
 * Cette fonction est déterministe et gère les caractères spéciaux français.
 *
 * @param {string} title - Le titre à convertir en slug
 * @param {number} suffix - Suffixe numérique optionnel pour garantir l'unicité
 * @return {string} - Le slug généré
 */
export function titleToSlug(title: string, suffix?: number) {
  if (!title) {
    return '';
  }

  // Table de correspondance pour les caractères accentués et spéciaux français
  const accentMap: Record<string, string> = {
    à: 'a',
    á: 'a',
    â: 'a',
    ä: 'a',
    ã: 'a',
    å: 'a',
    æ: 'ae',
    ç: 'c',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ñ: 'n',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    ö: 'o',
    õ: 'o',
    ø: 'o',
    œ: 'oe',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    ý: 'y',
    ÿ: 'y',
    À: 'a',
    Á: 'a',
    Â: 'a',
    Ä: 'a',
    Ã: 'a',
    Å: 'a',
    Æ: 'ae',
    Ç: 'c',
    È: 'e',
    É: 'e',
    Ê: 'e',
    Ë: 'e',
    Ì: 'i',
    Í: 'i',
    Î: 'i',
    Ï: 'i',
    Ñ: 'n',
    Ò: 'o',
    Ó: 'o',
    Ô: 'o',
    Ö: 'o',
    Õ: 'o',
    Ø: 'o',
    Œ: 'oe',
    Ù: 'u',
    Ú: 'u',
    Û: 'u',
    Ü: 'u',
    Ý: 'y',
    Ÿ: 'y',
    '€': 'euro',
    '£': 'livre',
    '¥': 'yen',
    '©': 'c',
    '®': 'r',
    '™': 'tm',
  };

  // 1. Conversion en minuscules
  let slug = title.toLowerCase();

  // 2. Remplacement des caractères accentués et spéciaux
  slug = slug
    .split('')
    .map((char) => accentMap[char] || char)
    .join('');

  // 3. Remplacer tous les caractères non alphanumériques par des tirets
  slug = slug.replace(/[^a-z0-9]+/g, '-');

  // 4. Supprimer les tirets en début et fin
  slug = slug.replace(/^-+|-+$/g, '');

  // 5. Limiter la longueur et s'assurer qu'il n'y a pas de tirets consécutifs
  slug = slug.replace(/-{2,}/g, '-');

  // 6. Ajouter le suffixe si spécifié (pour gérer les doublons)
  if (suffix !== undefined && suffix > 0) {
    slug = `${slug}-${suffix}`;
  }

  return slug;
}

/**
 * Crée un générateur de slugs qui garantit l'unicité des IDs
 * @returns Une fonction qui génère des slugs uniques
 */
export function createUniqueSlugGenerator() {
  const slugCounts = new Map<string, number>();

  return (title: string): string => {
    const baseSlug = titleToSlug(title);
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);

    // Le premier titre n'a pas de suffixe, les suivants ont -1, -2, etc.
    return count === 0 ? baseSlug : titleToSlug(title, count);
  };
}
