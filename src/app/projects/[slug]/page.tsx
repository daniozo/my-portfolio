import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ExternalLink, FolderGit2, Globe, FileText } from 'lucide-react';
import Image from 'next/image';
import { Markdown } from '@/components/markdown/markdown';
import { ImageZoom } from '@/components/markdown/image-zoom';
import { Button } from '@/components/ui/button';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { TagList } from '@/components/ui/tag-list';
import { MediaGallery } from '@/components/ui/media-gallery';
import { ErrorDisplay } from '@/components/ui/error-display';
import { SiteFooter } from '@/components/layout/site-footer';
import type { GalleryItem, ProjectLink, Project } from '@/types';
import dataService from '@/lib/data';
import { formatProjectDateRange } from '@/lib/utils';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}


async function getProject(slug: string): Promise<Project | null> {
  // Vérifier d'abord la santé de Strapi
  const isStrapiHealthy = await dataService.isHealthy();

  if (!isStrapiHealthy) {
    // Retourner null pour indiquer que le serveur est indisponible
    return null;
  }

  try {
    return await dataService.projects.findBySlug(slug);
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Projet non disponible',
      description: "Cet projet n'est pas disponible actuellement.",
    };
  }

  const title = project.title;
  const description = project.summary;

  // Préparation des métadonnées OpenGraph et Twitter de base
  const openGraph: Metadata['openGraph'] = {
    title,
    description,
    type: 'article',
  };

  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
  };

  // Gestion explicite du média de couverture (image ou vidéo)
  if (project.coverMedia && project.coverMedia.url) {
    if (project.coverMedia.type === 'video') {
      // Si c'est une vidéo, on l'ajoute aux métadonnées OpenGraph
      openGraph.videos = [{ url: project.coverMedia.url }];
      // Pour Twitter, il n'y a pas de support direct équivalent à og:video.
      // On se fie donc à l'image de fallback définie dans le layout global.
    } else {
      // Si c'est une image, on l'ajoute à OpenGraph et Twitter
      const imageUrl = project.coverMedia.url;
      openGraph.images = [{ url: imageUrl }];
      twitter.images = [imageUrl];
    }
  }
  // S'il n'y a pas de coverMedia, les champs `images` ou `videos` ne sont pas définis.
  // Next.js utilisera alors correctement les métadonnées de fallback du layout racine.

  return {
    title,
    description,
    openGraph,
    twitter,
  };
}


const LinkIcon = ({ type, className }: { type: ProjectLink['type']; className?: string }) => {
  switch (type) {
    case 'depot':
      return <FolderGit2 className={className} />;
    case 'site':
      return <Globe className={className} />;
    case 'rapport':
      return <FileText className={className} />;
    case 'demo':
    default:
      return <ExternalLink className={className} />;
  }
};

const getLinkText = (type: ProjectLink['type']) => {
  switch (type) {
    case 'depot':
      return 'Dépôt';
    case 'site':
      return 'Site web';
    case 'rapport':
      return 'Rapport';
    case 'demo':
      return 'Démo';
    default:
      return 'Voir le lien';
  }
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  // Vérifier la santé avant de charger
  const isStrapiHealthy = await dataService.isHealthy();

  if (!isStrapiHealthy) {
    return (
      <div className="container max-w-4xl px-4 py-12">
        <ErrorDisplay
          title="Serveur indisponible"
          message="Le serveur est actuellement injoignable. Le projet sera à nouveau disponible dès que la connexion sera rétablie."
        />
      </div>
    );
  }

  const project = await dataService.projects.findBySlug(slug);

  if (!project) {
    notFound();
  }

  const dateDisplay = formatProjectDateRange(project.date.start, project.date.end);


  return (
    <div className="min-h-screen mb-6">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <nav className="mb-8">
          <Link href="/projects">
            <Button
              variant="ghost"
              className="pl-0 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </Button>
          </Link>
        </nav>

        {/* En-tête du projet */}
        <header className="mb-12 border-b pb-8 border-gray-200 dark:border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{project.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{project.summary}</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-gray-500 dark:text-gray-500">
            <time>{dateDisplay}</time>
            {project.tags && project.tags.length > 0 && (
              <TagList
                items={project.tags}
                variant="outline"
              />
            )}
          </div>
        </header>

        {/* Corps du projet */}
        <div className="space-y-16">
          {/* Image de couverture */}
          {project.coverMedia?.url && (
            <div className="mb-12">
              <ImageZoom src={project.coverMedia.url} alt={project.coverMedia.alt || project.title}>
                <Image
                  src={project.coverMedia.url}
                  alt={project.coverMedia.alt || ''}
                  width={1200}
                  height={675}
                  className="rounded-lg object-cover border border-gray-200 dark:border-gray-800 max-h-96 lg:max-h-[500px] w-full"
                  priority
                />
              </ImageZoom>
            </div>
          )}

          {/* Section Problème */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-gray-300 dark:border-gray-600 pl-4">
              Le défi
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <Markdown content={project.problemStatement} />
            </div>
          </section>

          {/* Section Solution */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-gray-400 dark:border-gray-500 pl-4">
              La solution
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <Markdown content={project.solution} />
            </div>
          </section>

          {/* Section Story */}
          {project.story && project.story.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-8 border-l-4 border-gray-500 dark:border-gray-400 pl-4">
                Les étapes du projet
              </h2>
              <div className="space-y-12">
                {project.story.map((step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-8 ${step.media?.url ? 'md:flex-row' : ''}`}
                  >
                    {step.media?.url && (
                      <div className="md:w-1/3">
                        <ImageZoom src={step.media.url} alt={step.media.alt || step.title}>
                          <Image
                            src={step.media.url}
                            alt={step.media.alt || ''}
                            width={400}
                            height={300}
                            className="rounded-lg object-cover border border-gray-200 dark:border-gray-800"
                          />
                        </ImageZoom>
                      </div>
                    )}
                    <div className={step.media?.url ? 'md:w-2/3' : 'w-full'}>
                      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                      <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        <Markdown content={step.description} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section Conclusion */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-gray-600 dark:border-gray-300 pl-4">
              Conclusion
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <Markdown content={project.conclusion} />
            </div>
          </section>

          {/* Section Galerie */}
          {project.gallery && project.gallery.length > 0 && (
            <MediaGallery items={project.gallery as GalleryItem[]} />
          )}

          {/* Liens du projet */}
          {project.links && project.links.length > 0 && (
            <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Liens</h2>
              <div className="flex flex-wrap gap-4">
                {project.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    <LinkIcon type={link.type} className="w-4 h-4 mr-2" />
                    {getLinkText(link.type)}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        <ScrollToTop className="bottom-24 md:bottom-20" />
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}