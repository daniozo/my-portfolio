'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  url: string;
  alt: string;
  caption: string;
  type: 'image' | 'video';
}

interface MediaGalleryProps {
  items: GalleryItem[];
}

export function MediaGallery({ items }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  // Gestion du clavier pour une meilleure réactivité
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'Escape':
          event.preventDefault();
          setOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handlePrevious, handleNext]);

  if (!items || items.length === 0) {
    return null;
  }

  // Limite d'affichage de la grille
  const maxGrid = 4;
  const showOverlay = items.length > maxGrid;
  const gridItems = showOverlay ? items.slice(0, maxGrid) : items;

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6">Galerie</h2>

      {/* Grille de vignettes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gridItems.map((item, index) => {
          // Si c'est la 4e vignette et qu'il y a plus d'images, overlay +N
          const isLast = index === maxGrid - 1 && showOverlay;
          const remaining = items.length - maxGrid;
          return (
            <div
              key={index}
              className="aspect-square relative cursor-pointer group overflow-hidden rounded-lg border hover:shadow-lg transition-all duration-200"
              onClick={() => {
                setSelectedIndex(index);
                setOpen(true);
              }}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index < 2}
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  muted
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              {isLast && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">+{remaining}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialog unique pour toute la galerie */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full p-0 border-0 bg-background">
          <DialogTitle className="sr-only">
            Galerie d&apos;images - {items[selectedIndex]?.alt || 'Image'} ({selectedIndex + 1} sur{' '}
            {items.length})
          </DialogTitle>
          <div className="relative w-full h-[80vh] flex flex-col bg-background">
            {/* Boutons navigation */}
            {items.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 dark:bg-background/80 hover:bg-background/90 dark:hover:bg-background/90 border border-border transition-colors duration-200 text-foreground shadow-lg"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 dark:bg-background/80 hover:bg-background/90 dark:hover:bg-background/90 border border-border transition-colors duration-200 text-foreground shadow-lg"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image principale */}
            <div className="flex-1 relative flex items-center justify-center p-8 bg-background">
              {items[selectedIndex]?.type === 'image' ? (
                <Image
                  src={items[selectedIndex].url}
                  alt={items[selectedIndex].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  className="object-contain"
                />
              ) : (
                <video src={items[selectedIndex]?.url} controls className="max-w-full max-h-full" />
              )}
            </div>

            {/* Caption et vignettes en bas */}
            <div className="bg-muted/100 backdrop-blur-sm p-4 space-y-4 border-t border-border">
              {/* Caption */}
              {items[selectedIndex]?.caption && (
                <p className="text-foreground text-center text-sm">
                  {items[selectedIndex].caption}
                </p>
              )}

              {/* Vignettes navigation */}
              {items.length > 1 && (
                <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                  {items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 w-16 h-16 relative rounded overflow-hidden border-2 transition-all duration-200 ${index === selectedIndex
                        ? 'border-foreground'
                        : 'border-border hover:border-muted-foreground'
                        }`}
                    >
                      {item.type === 'image' ? (
                        <Image
                          src={item.url}
                          alt={item.alt}
                          fill
                          sizes="64px"
                          className={`object-cover ${index === selectedIndex && 'scale-110'}`}
                        />
                      ) : (
                        <video src={item.url} className="w-full h-full object-cover" muted />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
