import { type Metadata } from 'next';
import { ProjectCard } from '@/components/ui/project-card';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Pagination } from '@/components/ui/pagination';
import { SiteFooter } from '@/components/layout/site-footer';
import dataService from '@/lib/data';
import { type Project } from '@/types';

// ISR: Régénère la page toutes les heures
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Découvrez mes projets et contributions récents.',
};

const PROJECTS_PER_PAGE = 9;

interface ProjectsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
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
          message="Le serveur de contenu est actuellement injoignable. Les projets seront disponibles dès que la connexion sera rétablie."
        />
        <SiteFooter />
      </div>
    );
  }

  // ÉTAPE 2: Strapi est OK, charger les projets avec pagination
  // Récupérer le nombre total de projets (optimisé: 1 seule requête)
  const totalProjects = await dataService.projects.getTotalCount();

  // Calculer le nombre de pages
  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);

  // Si la page demandée est hors limites, utiliser la page 1
  const validPage = currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

  // Calculer l'offset pour la pagination
  const offset = (validPage - 1) * PROJECTS_PER_PAGE;

  // Charger uniquement les projets de la page courante
  const projects = await dataService.projects.findMany({
    limit: PROJECTS_PER_PAGE,
    offset,
  });

  // CAS 2: Strapi OK mais 0 projets
  if (totalProjects === 0) {
    return (
      <div className="w-full mx-auto px-8 max-w-7xl py-6 lg:py-10">
        <div className="my-4 md:my-12 space-y-2 pb-10">
          <h1 className="text-5xl font-serif">Projets</h1>
          <p className="text-lg text-muted-foreground">
            Découvrez mes projets et contributions récents.
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Aucun projet publié pour le moment.</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // CAS 3: Afficher les projets

  return (
    <div className="w-full mx-auto px-8 max-w-7xl mb-6 py-6 lg:py-10">
      <div className="my-4 md:my-12 space-y-2 pb-10">
        <h1 className="text-5xl font-serif">Projets</h1>
        <p className="text-lg text-muted-foreground">
          Découvrez mes projets et contributions récents.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
        {projects.map((project: Project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={validPage} totalPages={totalPages} basePath="/projects" />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
