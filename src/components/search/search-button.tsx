'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SearchModal } from '@/components/search/search-modal';

export function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Raccourci clavier Ctrl+K ou Cmd+K ou /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ne pas capturer si on est déjà dans un input/textarea
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Raccourci Ctrl+K ou Cmd+K (fonctionne partout)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      // Raccourci "/" (seulement si on n'est pas dans un champ de saisie)
      if (e.key === '/' && !isInputField) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
        aria-label="Rechercher"
      >
        <Search className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
          Rechercher
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
          /
        </kbd>
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
