'use client';

import Link from 'next/link';

interface MePageSidebarProps {
  hasExperiences: boolean;
  hasEducations: boolean;
  hasSkills: boolean;
}

export function MePageSidebar({ hasExperiences, hasEducations, hasSkills }: MePageSidebarProps) {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);

    const scrollableContent = document.querySelector('div.scrollable-content');

    if (section && scrollableContent) {
      // Calculer la position de la section relative au conteneur scrollable
      const containerRect = scrollableContent.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const scrollOffset = sectionRect.top - containerRect.top + scrollableContent.scrollTop;

      scrollableContent.scrollTo({
        top: scrollOffset - 20, // 20px offset pour l'espacement
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside className="h-full border-l overflow-y-auto  border-gray-100 dark:border-gray-900">
      <nav className="p-2 md:p-4 xl:p-6 space-y-1 md:space-y-2">
        {/* À propos */}
        <a
          href="#about"
          onClick={(e) => scrollToSection(e, 'about')}
          className="flex items-center justify-center xl:justify-start gap-3 px-2 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group cursor-pointer"
          title="À propos"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 xl:w-5 xl:h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden xl:block text-sm font-medium text-gray-700 dark:text-gray-300">À propos</span>
        </a>

        {/* Expériences */}
        <a
          href="#experiences"
          onClick={(e) => hasExperiences ? scrollToSection(e, 'experiences') : e.preventDefault()}
          className={`flex items-center justify-center xl:justify-start gap-3 px-2 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-2 rounded-lg transition-colors group ${hasExperiences
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
            : 'cursor-not-allowed opacity-50'
            }`}
          title="Expériences"
        >
          <svg className={`w-5 h-5 md:w-6 md:h-6 xl:w-5 xl:h-5 ${hasExperiences ? 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className={`hidden xl:block text-sm font-medium ${hasExperiences ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>Expériences</span>
        </a>

        {/* Formations */}
        <a
          href="#educations"
          onClick={(e) => hasEducations ? scrollToSection(e, 'educations') : e.preventDefault()}
          className={`flex items-center justify-center xl:justify-start gap-3 px-2 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-2 rounded-lg transition-colors group ${hasEducations
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
            : 'cursor-not-allowed opacity-50'
            }`}
          title="Formations"
        >
          <svg className={`w-5 h-5 md:w-6 md:h-6 xl:w-5 xl:h-5 ${hasEducations ? 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className={`hidden xl:block text-sm font-medium ${hasEducations ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>Formations</span>
        </a>

        {/* Compétences */}
        <a
          href="#skills"
          onClick={(e) => hasSkills ? scrollToSection(e, 'skills') : e.preventDefault()}
          className={`flex items-center justify-center xl:justify-start gap-3 px-2 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-2 rounded-lg transition-colors group ${hasSkills
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
            : 'cursor-not-allowed opacity-50'
            }`}
          title="Compétences"
        >
          <svg className={`w-5 h-5 md:w-6 md:h-6 xl:w-5 xl:h-5 ${hasSkills ? 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span className={`hidden xl:block text-sm font-medium ${hasSkills ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>Compétences</span>
        </a>

        {/* Separator */}
        <div className="my-3 md:my-4 border-t  border-gray-100 dark:border-gray-900"></div>

        {/* Liens footer */}
        <Link
          href="/legal"
          className="flex items-center justify-center xl:justify-start gap-3 px-2 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          title="Mentions légales"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 xl:w-5 xl:h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden xl:block text-sm font-medium text-gray-700 dark:text-gray-300">Mentions légales</span>
        </Link>

        <Link
          href="/rss"
          className="flex items-center justify-center xl:justify-start gap-3 px-2 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          title="Flux RSS"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 xl:w-5 xl:h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span className="hidden xl:block text-sm font-medium text-gray-700 dark:text-gray-300">Flux RSS</span>
        </Link>
      </nav>
    </aside>
  );
}
