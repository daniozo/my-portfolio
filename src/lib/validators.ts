import { z } from 'zod';

/**
 * ==============================================
 * SCHÉMAS DE VALIDATION ZOD
 * ==============================================
 *
 * Ce fichier contient tous les schémas de validation Zod
 * pour sécuriser les entrées utilisateur et les données externes.
 */

/**
 * Validation pour les paramètres de recherche
 */
export const searchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(2, 'La recherche doit contenir au moins 2 caractères')
    .max(100, 'La recherche ne peut pas dépasser 100 caractères')
    .regex(
      /^[a-zA-Z0-9àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ\s\-']+$/,
      'La recherche contient des caractères non autorisés'
    ),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

/**
 * Validation pour les slugs (articles, projets)
 */
export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Le slug ne peut pas être vide')
  .max(200, 'Le slug est trop long')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
  );

export type Slug = z.infer<typeof slugSchema>;

/**
 * Validation pour les IDs de documents
 */
export const documentIdSchema = z
  .string()
  .trim()
  .min(1, "L'ID du document ne peut pas être vide")
  .max(100, "L'ID du document est trop long")
  .regex(/^[a-zA-Z0-9_-]+$/, "L'ID du document contient des caractères non autorisés");

export type DocumentId = z.infer<typeof documentIdSchema>;

/**
 * Validation pour les paramètres de pagination
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive().max(1000, 'Numéro de page trop élevé')),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(
      z
        .number()
        .int()
        .positive()
        .min(1, 'La taille de page doit être au moins 1')
        .max(100, 'La taille de page ne peut pas dépasser 100')
    ),
});

export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Validation pour les filtres (tags, etc.)
 */
export const filterSchema = z.object({
  tag: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9\s-]+$/)
    .optional(),
});

export type Filter = z.infer<typeof filterSchema>;

/**
 * Validation pour les URLs externes
 */
export const externalUrlSchema = z
  .string()
  .url('URL invalide')
  .startsWith('http', "L'URL doit commencer par http:// ou https://");

export type ExternalUrl = z.infer<typeof externalUrlSchema>;

/**
 * Validation pour les emails
 */
export const emailSchema = z
  .string()
  .email('Adresse email invalide')
  .toLowerCase()
  .max(255, "L'adresse email est trop longue");

export type Email = z.infer<typeof emailSchema>;

/**
 * ==============================================
 * FONCTIONS UTILITAIRES
 * ==============================================
 */

/**
 * Parse et valide des données avec gestion d'erreurs
 * @param schema Schéma Zod à utiliser
 * @param data Données à valider
 * @returns Résultat de la validation avec données ou erreurs
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((err: z.ZodIssue) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
}

/**
 * Parse et valide des données (throw en cas d'erreur)
 * @param schema Schéma Zod à utiliser
 * @param data Données à valider
 * @returns Données validées
 * @throws {z.ZodError} Si la validation échoue
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Nettoie une chaîne pour la recherche (supprime les caractères spéciaux)
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\sàâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ\-']/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 100);
}

/**
 * Valide et nettoie un slug
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 200);
}
