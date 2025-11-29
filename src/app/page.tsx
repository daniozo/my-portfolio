import { capitalizeFirstLetter, formatDateFr } from '@/lib/utils';
import { ArticleCard } from '@/components/ui/article-card';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Pagination } from '@/components/ui/pagination';
import { SiteFooter } from '@/components/layout/site-footer';
import dataService from '@/lib/data';
import type { Article } from '@/types';

// ISR: Régénère la page toutes les heures
export const revalidate = 3600;

const ARTICLES_PER_PAGE = 15;

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // ÉTAPE 1: Vérifier si Strapi est disponible
  const isStrapiHealthy = await dataService.isHealthy();

  // CAS 1: Strapi indisponible → Message clair
  if (!isStrapiHealthy) {
    return (
      <div className="w-full mx-auto px-8 max-w-7xl py-6 lg:py-10">
        <ErrorDisplay
          title="Serveur indisponible"
          message="Le serveur de contenu est actuellement injoignable. Les articles seront disponibles dès que la connexion sera rétablie."
        />
        <SiteFooter />
      </div>
    );
  }

  // ÉTAPE 2: Strapi est OK, charger les articles avec pagination
  try {
    // Récupérer le nombre total d'articles (1 seule requête)
    const totalArticles = await dataService.articles.getTotalCount();

    // Calculer le nombre de pages
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

    // Si la page demandée est hors limites, utiliser la page 1
    const validPage = currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

    // Calculer l'offset pour la pagination
    const offset = (validPage - 1) * ARTICLES_PER_PAGE;

    // Charger uniquement les articles de la page courante
    const articles = await dataService.articles.findPublished({
      limit: ARTICLES_PER_PAGE,
      offset,
    });

    // CAS 2: Strapi OK mais vraiment 0 articles
    if (totalArticles === 0) {
      return (
        <div className="w-full mx-auto px-8 max-w-7xl py-6 lg:py-10">
          <div className="my-4 md:my-12 space-y-2 pb-10">
            <h1 className="text-5xl font-serif">Blog</h1>
          </div>
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Aucun article publié pour le moment.</p>
          </div>
          <SiteFooter />
        </div>
      );
    }

    // CAS 3: Afficher les articles

    // Utilisez une Map pour un groupement plus efficace
    const groupedArticlesMap = new Map();

    for (const article of articles) {
      const date = article.publishedAt ? new Date(article.publishedAt) : new Date();
      const monthYear = formatDateFr(date, 'MMMM yyyy');

      if (!groupedArticlesMap.has(monthYear)) {
        groupedArticlesMap.set(monthYear, []);
      }

      groupedArticlesMap.get(monthYear).push(article);
    }

    // Convertir en objet pour maintenir la compatibilité avec le reste du code
    const groupedArticles = Object.fromEntries(groupedArticlesMap);

    // Trier les mois efficacement
    const sortedMonths = [...groupedArticlesMap.keys()].sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');

      // Comparaison d'abord par année puis par mois
      if (yearA !== yearB) {
        return parseInt(yearB) - parseInt(yearA);
      }

      // Liste des mois en français pour trier correctement
      const months = [
        'janvier',
        'février',
        'mars',
        'avril',
        'mai',
        'juin',
        'juillet',
        'août',
        'septembre',
        'octobre',
        'novembre',
        'décembre',
      ];
      return months.indexOf(monthB.toLowerCase()) - months.indexOf(monthA.toLowerCase());
    });

    return (
      <div className="w-full mx-auto mb-6 px-8 max-w-7xl py-6 lg:py-10">
        <div className="my-4 md:my-12 space-y-2 pb-10">
          <h1 className="text-5xl font-serif">Blog</h1>
        </div>
        <div className="space-y-12">
          {sortedMonths.map((monthYear) => (
            <div key={monthYear}>
              <section key={`section-${monthYear}`} className="grid xl:grid-cols-2">
                <h2 className="text-muted-foreground py-1 xl:py-0">
                  {capitalizeFirstLetter(monthYear)}
                </h2>
                <div className="flex flex-col space-y-6">
                  {groupedArticles[monthYear].map((article: Article) => (
                    <ArticleCard
                      key={`${article.publishedAt}-${article.title}`}
                      article={article}
                    />
                  ))}
                </div>
              </section>
              <hr className="border-t-[0.5px] border-gray-100 dark:border-gray-900 my-12" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination currentPage={validPage} totalPages={totalPages} basePath="/" />

        {/* Footer */}
        <SiteFooter />
      </div>
    );
  } catch (error) {
    // En cas d'erreur inattendue lors du chargement des articles
    console.error('Critical error in Home page:', error);

    return (
      <div className="w-full mx-auto px-8 max-w-7xl py-6 lg:py-10">
        <ErrorDisplay
          title="Erreur inattendue"
          message="Une erreur technique est survenue lors du chargement des articles. Veuillez réessayer."
        />
        <SiteFooter />
      </div>
    );
  }
}
