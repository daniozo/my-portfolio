import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Markdown } from '@/components/markdown/markdown';
import { ErrorDisplay } from '@/components/ui/error-display';
import { SiteFooter } from '@/components/layout/site-footer';
import dataService from '@/lib/data';
import { formatDateFr } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales et informations juridiques du site.',
};

export default async function LegalPage() {
  // Vérifier la santé de Strapi avant de charger
  const isStrapiHealthy = await dataService.isHealthy();

  if (!isStrapiHealthy) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ErrorDisplay
          title="Serveur indisponible"
          message="Le serveur est actuellement injoignable. Les mentions légales seront à nouveau disponibles dès que la connexion sera rétablie."
        />
        <SiteFooter />
      </div>
    );
  }

  const legalData = await dataService.legal.getLegalPages();

  if (!legalData) {
    notFound();
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <nav className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="pl-0 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour à l&apos;accueil
            </Button>
          </Link>
        </nav>

        {/* En-tête */}
        <header className="mb-12 border-b pb-8 border-gray-200 dark:border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {legalData?.title || 'Mentions légales'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {legalData?.description || 'Informations juridiques et légales concernant ce site web.'}
          </p>
          {legalData?.lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              Dernière mise à jour : {formatDateFr(legalData.lastUpdated)}
            </p>
          )}
        </header>

        {/* Contenu des mentions légales */}
        <div>
          {legalData?.content ? (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <Markdown content={legalData.content} />
            </div>
          ) : (
            <section className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Les mentions légales ne sont pas encore disponibles.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Le contenu sera ajouté prochainement.
              </p>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}