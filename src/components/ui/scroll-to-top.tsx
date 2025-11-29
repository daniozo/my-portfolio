'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
  position?: 'default' | 'between-content-toc';
}

export function ScrollToTop({ threshold = 300, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trouver l'élément main qui contient le scroll
    const mainElement = document.querySelector('main');

    if (!mainElement) {
      return;
    }

    const toggleVisibility = () => {
      if (mainElement.scrollTop > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    mainElement.addEventListener('scroll', toggleVisibility);
    return () => mainElement.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'rounded-full shadow-lg transition-all duration-300 flex items-center justify-center fixed xl:right-6 right-[1.125rem] z-50',
        'bg-white/90 hover:bg-white border-gray-200 hover:border-gray-300',
        'dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600',
        'backdrop-blur-sm',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none',
        className
      )}
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
    >
      <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    </Button>
  );
}
