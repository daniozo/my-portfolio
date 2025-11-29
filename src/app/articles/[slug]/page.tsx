import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

// ISR: Régénère la page toutes les heures
export const revalidate = 3600;

import { Button } from '@/components/ui/button';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { TagList } from '@/components/ui/tag-list';
import { Markdown } from '@/components/markdown/markdown';
import { TableOfContents } from '@/components/markdown/table-of-contents';
import { MathJaxProvider } from '@/components/markdown/mathjax-provider';
import { ErrorDisplay } from '@/components/ui/error-display';
import { SiteFooter } from '@/components/layout/site-footer';
import dataService from '@/lib/data';
import { formatDateFr } from '@/lib/utils';
import type { Article } from '@/types';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string): Promise<Article | null> {
  // Vérifier d'abord la santé de Strapi
  const isStrapiHealthy = await dataService.isHealthy();

  if (!isStrapiHealthy) {
    // Retourner null pour indiquer que le serveur est indisponible
    return null;
  }

  try {
    return await dataService.articles.findBySlug(slug);
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article non disponible',
      description: "Cet article n'est pas disponible actuellement.",
    };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.description,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Vérifier la santé avant de charger
  const isStrapiHealthy = await dataService.isHealthy();

  if (!isStrapiHealthy) {
    return (
      <div className="container max-w-2xl xl:max-w-4xl px-4 py-12">
        <ErrorDisplay
          title="Serveur indisponible"
          message="Le serveur de contenu est actuellement injoignable. L'article sera à nouveau disponible dès que la connexion sera rétablie."
        />
      </div>
    );
  }

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const publicationDate = article.createdAt
    ? formatDateFr(article.createdAt)
    : 'Date non disponible';

  return (
    <MathJaxProvider>
      <div className="mb-6">
        <article className="container max-w-2xl xl:max-w-4xl px-4 py-12 relative">
          <div className="mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                className="pl-0 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour aux articles
              </Button>
            </Link>
          </div>
          <div className="py-2 max-w-none xl:mx-0 xl:grid prose dark:prose-invert xl:grid-cols-[1fr_64px] xl:py-10 xl:gap-20">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{publicationDate}</span>
              </div>

              <h1 className="text-4xl font-light font-serif tracking-tight mb-6">
                {article.title}
              </h1>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mb-6 not-prose">
                  <TagList
                    items={article.tags}
                    variant="secondary"
                  />
                </div>
              )}

              <div>
                <Markdown content={article.content} />

                {/* Footer d'article dynamique */}
                {article.articleFooterMessage && (
                  <>
                    <hr className="border-t my-8" />
                    <div className="prose prose-slate dark:prose-invert prose-pre:p-0 prose-a:text-primary">
                      <Markdown content={article.articleFooterMessage} />
                    </div>
                  </>
                )}
              </div>

              <ScrollToTop className="bottom-[9.2rem] md:bottom-20" />
            </div>
            <TableOfContents content={article.content} />
          </div>
        </article>

        {/* Footer */}
        <SiteFooter />
      </div>
    </MathJaxProvider>
  );
}
