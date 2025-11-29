'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = React.memo(function TableOfContents({
  content,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; title: string }>>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const tocContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Petit délai pour s'assurer que le DOM est à jour après le rendu du markdown
    const timeoutId = setTimeout(() => {
      // Au lieu de générer les IDs, on les lit directement depuis le DOM
      // pour garantir la cohérence avec les IDs générés par le composant Markdown
      const headingElements = document.querySelectorAll('h2[id]');

      if (headingElements.length > 0) {
        const extractedHeadings = Array.from(headingElements).map((element) => ({
          id: element.id,
          title: element.textContent?.replace('#', '').trim() || '',
        }));
        setHeadings(extractedHeadings);
      }
    }, 100); // Délai de 100ms pour s'assurer que le DOM est à jour

    return () => clearTimeout(timeoutId);
  }, [content]);

  useEffect(() => {
    // Find the scrollable container
    const scrollable = document.querySelector('main');
    if (!scrollable) {
      return;
    }

    const updateActiveId = () => {
      const headingElements = Array.from(scrollable.querySelectorAll('h2'));
      const scrollPosition = scrollable.scrollTop + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        // Get position relative to scrollable container
        const elementTop = element.offsetTop;
        if (scrollPosition >= elementTop) {
          setActiveId(element.id);
          break;
        }
      }
    };

    scrollable.addEventListener('scroll', updateActiveId);
    updateActiveId();

    return () => {
      scrollable.removeEventListener('scroll', updateActiveId);
    };
  }, [headings]);

  // Auto-scroll vers l'élément actif dans la TOC
  useEffect(() => {
    if (!activeId || !tocContainerRef.current) {
      return;
    }

    const activeLink = tocContainerRef.current.querySelector(
      `a[data-id="${activeId}"]`
    ) as HTMLElement;

    if (activeLink) {
      // Calculer la position pour centrer l'élément actif dans la TOC
      const container = tocContainerRef.current;
      const linkTop = activeLink.offsetTop;
      const linkHeight = activeLink.offsetHeight;
      const containerHeight = container.clientHeight;

      // Scroll pour centrer l'élément actif (ou le garder visible)
      const scrollTo = linkTop - containerHeight / 2 + linkHeight / 2;

      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
    }
  }, [activeId]);

  const handleClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsDrawerOpen(false);
    }
  };

  const TOCList = ({ className = '' }: { className?: string }) => (
    <ul className={cn('space-y-3', className)}>
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            data-id={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleClick(heading.id);
            }}
            className={cn(
              'text-sm text-muted-foreground hover:text-foreground transition-colors block text-left w-full',
              activeId === heading.id && 'text-foreground font-medium'
            )}
          >
            {heading.title}
          </a>
        </li>
      ))}
    </ul>
  );

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* XL et au-dessus : Comportement actuel (TOC fixe à droite) */}
      <nav className="hidden xl:block not-prose w-64">
        <div className="sticky top-24 pt-10">
          <div
            ref={tocContainerRef}
            className="max-h-[calc(100vh-12rem)] overflow-y-auto pb-8 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            <TOCList />
          </div>
        </div>
      </nav>

      <nav className="block">
        {/* Bouton flottant pour ouvrir le drawer */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="xl:hidden fixed bottom-24 md:bottom-8 right-4 z-40 p-3 text-primary-foreground rounded-full shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700 bg-gray-900 hover:bg-gray-800 transition-colors"
          aria-label="Ouvrir la table des matières"
        >
          <Menu size={20} className="dark:text-gray-300 text-white" />
        </button>

        {/* Drawer */}
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} side="right">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Sur cette page</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Fermer la table des matières"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <TOCList />
            </div>
          </div>
        </Drawer>
      </nav>
    </>
  );
});
