'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Article, Project } from '@/types';
import { Search, FileText, FolderGit2, X, Loader2, AlertCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResults {
  articles: Article[];
  projects: Project[];
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'articles' | 'projects'>('articles');
  const [results, setResults] = useState<SearchResults>({
    articles: [],
    projects: [],
  });

  // Cache client pour éviter les requêtes répétées
  const cacheRef = useRef<Map<string, SearchResults>>(new Map());

  // Debounce augmenté à 400ms pour réduire les requêtes
  const debouncedQuery = useDebounce(query, 400);

  const handleSearch = useCallback(async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();

    // Minimum 2 caractères requis pour la recherche
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setResults({ articles: [], projects: [] });
      setError(null);
      return;
    }

    // Normaliser la query pour le cache
    const cacheKey = trimmedQuery.toLowerCase();

    // Vérifier le cache client d'abord
    const cachedResult = cacheRef.current.get(cacheKey);
    if (cachedResult) {
      setResults(cachedResult);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);

      if (!response.ok) {
        // Gestion des différents codes d'erreur
        if (response.status === 429) {
          const data = await response.json();
          setError(`Trop de requêtes. Réessayez dans ${data.retryAfter} secondes.`);
        } else if (response.status === 400) {
          setError('Recherche invalide. Veuillez vérifier votre saisie.');
        } else {
          setError('Une erreur est survenue. Veuillez réessayer.');
        }
        return;
      }

      const data = await response.json();

      // Mettre en cache le résultat
      cacheRef.current.set(cacheKey, data);

      // Limiter la taille du cache à 50 entrées (FIFO)
      if (cacheRef.current.size > 50) {
        const firstKey = cacheRef.current.keys().next().value;
        if (firstKey !== undefined) {
          cacheRef.current.delete(firstKey);
        }
      }

      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const handleResultClick = () => {
    onClose();
    setQuery('');
    setResults({ articles: [], projects: [] });
    setError(null);
    setActiveTab('articles');
  };

  const handleClose = () => {
    onClose();
    setQuery('');
    setResults({ articles: [], projects: [] });
    setError(null);
    setActiveTab('articles');
  };

  const totalResults = results.articles.length + results.projects.length;
  const hasResults = totalResults > 0;
  const trimmedQuery = debouncedQuery.trim();
  const showNoResults = trimmedQuery.length >= 2 && !isLoading && !hasResults;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="sr-only">Rechercher du contenu</DialogTitle>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher des articles ou des projets..."
              className="w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
              autoFocus
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </DialogHeader>

        {/* Résultats */}
        <div className="flex-1 overflow-y-auto px-6 pt-0 pb-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mb-3" />
              <p className="text-red-600 dark:text-red-400 text-center font-medium">
                {error}
              </p>
            </div>
          )}

          {showNoResults && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun résultat pour &quot;{trimmedQuery}&quot;
              </p>
            </div>
          )}

          {!isLoading && !error && hasResults && (
            <div className="space-y-4">
              {/* Onglets */}
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors relative ${activeTab === 'articles'
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <FileText className="h-4 w-4" />
                  Articles ({results.articles.length})
                  {activeTab === 'articles' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-gray-100" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors relative ${activeTab === 'projects'
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <FolderGit2 className="h-4 w-4" />
                  Projets ({results.projects.length})
                  {activeTab === 'projects' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-gray-100" />
                  )}
                </button>
              </div>

              {/* Contenu de l'onglet actif */}
              <div className="space-y-2">
                {activeTab === 'articles' && results.articles.length > 0 && (
                  <>
                    {results.articles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        onClick={handleResultClick}
                        className="block w-full text-left p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                          {article.title}
                        </h4>
                        {article.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {article.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </>
                )}

                {activeTab === 'projects' && results.projects.length > 0 && (
                  <>
                    {results.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        onClick={handleResultClick}
                        className="block w-full text-left p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                          {project.title}
                        </h4>
                        {project.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {project.summary}
                          </p>
                        )}
                      </Link>
                    ))}
                  </>
                )}

                {/* Message si l'onglet actif n'a pas de résultats */}
                {activeTab === 'articles' && results.articles.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucun article trouvé pour &quot;{trimmedQuery}&quot;
                    </p>
                  </div>
                )}

                {activeTab === 'projects' && results.projects.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucun projet trouvé pour &quot;{trimmedQuery}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer avec raccourci clavier */}
        <div className="hidden md:block px-6 py-3 border-t bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400">
          <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">ESC</kbd> pour fermer
        </div>
      </DialogContent>
    </Dialog>
  );
}
