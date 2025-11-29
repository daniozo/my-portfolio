'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 10;

    if (totalPages <= maxVisible) {
      // Afficher toutes les pages si <= 10
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher avec ellipses
      if (currentPage <= 5) {
        // Au début : 1 2 3 4 5 6 7 ... 12
        for (let i = 1; i <= 7; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 4) {
        // À la fin : 1 ... 6 7 8 9 10 11 12
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 6; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Au milieu : 1 ... 5 6 7 8 9 ... 12
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className="mx-auto flex w-full justify-center mt-8"
    >
      <ul className="flex flex-row items-center gap-1">
        {/* Bouton Précédent */}
        {currentPage > 1 && (
          <li>
            <Link
              href={getPageUrl(currentPage - 1)}
              aria-label="Aller à la page précédente"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </Link>
          </li>
        )}

        {/* Numéros de page */}
        {getPageNumbers().map((page, index) => (
          <li key={index} className="hidden sm:inline-block">
            {page === '...' ? (
              <span className="inline-flex items-center justify-center h-10 w-10">...</span>
            ) : (
              <Link
                href={getPageUrl(page as number)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-10 ${page === currentPage
                  ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground pointer-events-none'
                  : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Version mobile : affichage simple */}
        <li className="sm:hidden">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} / {totalPages}
          </span>
        </li>

        {/* Bouton Suivant */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={getPageUrl(currentPage + 1)}
              aria-label="Aller à la page suivante"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5"
            >
              <span>Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
