import { Markdown } from '@/components/markdown/markdown';
import { ErrorDisplay } from '@/components/ui/error-display';
import { SocialLinksComponent } from '@/components/ui/social-links';
import { MePageSidebar } from '@/components/layout/me-page-sidebar';
import { ExperienceSection } from '@/components/cv/experience-section';
import { EducationSection } from '@/components/cv/education-section';
import { SkillsSection } from '@/components/cv/skills-section';
import Image from 'next/image';
import dataService from '@/lib/data';

const AboutPage = async () => {
  // Vérifier la santé de Strapi avant de charger
  const isStrapiHealthy = await dataService.isHealthy();

  if (!isStrapiHealthy) {
    return (
      <div className="w-full mx-auto px-8 max-w-7xl py-8 lg:py-12">
        <ErrorDisplay
          title="Serveur indisponible"
          message="Le serveur est actuellement injoignable. Les informations seront à nouveau disponibles dès que la connexion sera rétablie."
        />
      </div>
    );
  }

  try {
    const aboutInfo = await dataService.static.getAboutInfo();

    if (!aboutInfo) {
      return (
        <div className="w-full mx-auto px-8 max-w-7xl py-8 lg:py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Informations non disponibles</h1>
            <p className="text-muted-foreground">
              Les informations de profil ne sont pas disponibles actuellement.
            </p>
          </div>
        </div>
      );
    }

    // Textes alternatifs pour les champs obligatoires manquants
    const displayFullName = aboutInfo.fullName;
    const displayBiography = aboutInfo.biography;

    // Gestion des champs optionnels avec textes par défaut
    const displayLocation = aboutInfo.currentLocation;

    return (
      <div className="h-full grid 
                      grid-cols-[1fr_64px] 
                      md:grid-cols-[1fr_80px] 
                      lg:grid-cols-[280px_1fr_80px] 
                      xl:grid-cols-[320px_1fr_256px]">

        {/* Profile - Hidden on mobile/tablet, visible on lg+ as sidebar */}
        <aside className="hidden lg:block h-full border-r  border-gray-100 dark:border-gray-900 overflow-y-auto no-scrollbar">
          <div className="p-6 lg:p-8 space-y-6">
            {/* Photo de profil */}
            {aboutInfo.profileImage && (
              <div className="flex justify-center">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-32 w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40">
                  <Image
                    className="aspect-square h-full w-full object-cover"
                    alt={aboutInfo.profileImage?.alternativeText || `Photo de ${displayFullName}`}
                    width={160}
                    height={160}
                    src={aboutInfo.profileImage.url}
                    priority
                  />
                </span>
              </div>
            )}

            {/* Informations */}
            <div className="text-center space-y-2 lg:space-y-3">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {displayFullName}
              </h1>

              {aboutInfo.jobTitle && (
                <p className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">
                  {aboutInfo.jobTitle}
                </p>
              )}

              {aboutInfo.currentCompany && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {aboutInfo.currentCompany}
                </p>
              )}

              {aboutInfo.currentLocation && (
                <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
                  {displayLocation}
                </p>
              )}
            </div>

            {/* Réseaux sociaux */}
            <div className="pt-6 flex flex-row justify-center">
              <SocialLinksComponent size="sm" />
            </div>

            {/* Footer info */}
            <div className="pt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </aside>

        {/* Contenu principal */}
        <div className="h-full overflow-y-auto scrollable-content">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16 px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">

            {/* Profile section - Only visible on mobile/tablet */}
            <section className="lg:hidden space-y-6">
              {/* Photo de profil */}
              {aboutInfo.profileImage && (
                <div className="flex justify-center">
                  <span className="relative flex shrink-0 overflow-hidden rounded-full h-32 w-32 md:h-36 md:w-36">
                    <Image
                      className="aspect-square h-full w-full object-cover"
                      alt={aboutInfo.profileImage?.alternativeText || `Photo de ${displayFullName}`}
                      width={160}
                      height={160}
                      src={aboutInfo.profileImage.url}
                      priority
                    />
                  </span>
                </div>
              )}

              {/* Informations */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {displayFullName}
                </h1>

                {aboutInfo.jobTitle && (
                  <p className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
                    {aboutInfo.jobTitle}
                  </p>
                )}

                {aboutInfo.currentCompany && (
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {aboutInfo.currentCompany}
                  </p>
                )}

                {aboutInfo.currentLocation && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
                    {displayLocation}
                  </p>
                )}
              </div>

              {/* Réseaux sociaux */}
              <div className="flex justify-center">
                <SocialLinksComponent variant="horizontal" size="sm" />
              </div>
            </section>

            {/* Biography */}
            <section id="about">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
                À propos
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <Markdown content={displayBiography} />
              </div>
              {aboutInfo.resume && aboutInfo.resume.file && (
                <div className="pt-4 w-full max-w-fit">
                  <a
                    href={aboutInfo.resume.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Télécharger CV
                  </a>
                </div>
              )}
            </section>

            {/* Expériences */}
            {aboutInfo.experiences && aboutInfo.experiences.experiences.length > 0 && (
              <section id="experiences">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
                  Expériences
                </h2>
                <ExperienceSection experiences={aboutInfo.experiences} />
              </section>
            )}

            {/* Formations */}
            {aboutInfo.educations && aboutInfo.educations.educations.length > 0 && (
              <section id="educations">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
                  Formations
                </h2>
                <EducationSection educations={aboutInfo.educations} />
              </section>
            )}

            {/* Compétences */}
            {aboutInfo.skills && (
              <section id="skills">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
                  Compétences
                </h2>
                <SkillsSection skills={aboutInfo.skills} />
              </section>
            )}
          </div>
        </div>

        {/* Sidebar de navigation */}
        <MePageSidebar
          hasExperiences={!!(aboutInfo.experiences && aboutInfo.experiences.experiences.length > 0)}
          hasEducations={!!(aboutInfo.educations && aboutInfo.educations.educations.length > 0)}
          hasSkills={!!aboutInfo.skills}
        />
      </div>
    );
  } catch (error) {
    console.error('Error in AboutPage:', error);

    return (
      <div className="w-full mx-auto px-8 max-w-7xl py-8 lg:py-12">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.732 15.5c-.77.833-.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Informations indisponibles
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Les informations de profil ne peuvent pas être chargées actuellement.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default AboutPage;
