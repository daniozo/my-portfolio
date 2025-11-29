'use client';

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ImageZoomProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, children }) => {
  const [open, setOpen] = React.useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <>
      {/* Clickable image */}
      <span
        onClick={() => setOpen(true)}
        className="cursor-zoom-in block"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-label={`Agrandir l'image: ${alt}`}
      >
        {children}
      </span>

      {/* Zoom modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[98vw] max-h-[98vh] p-4 border-none bg-transparent shadow-none [&>button]:hidden"
          onClick={() => setOpen(false)}
        >
          <DialogTitle className="sr-only">{alt || 'Image agrandie'}</DialogTitle>

          {/* Image container - takes full available space */}
          <div className="relative w-full h-[90vh] flex items-center justify-center cursor-zoom-out">
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain rounded-lg"
                quality={100}
                priority
                sizes="98vw"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
