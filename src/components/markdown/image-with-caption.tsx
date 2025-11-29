'use client';

import React from 'react';
import Image from 'next/image';
import { IMAGE_CONFIG } from './markdown-config';
import { isValidImageUrl } from './markdown-utils';
import { ImageZoom } from './image-zoom';

interface ImageWithCaptionProps {
  src: string;
  alt?: string;
  className?: string;
}

export const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({ src, alt = '', className }) => {
  const [failed, setFailed] = React.useState(false);

  const handleError = React.useCallback(() => {
    setFailed(true);
  }, []);

  // Check if alt text is meaningful (not empty or just whitespace)
  const hasCaption = alt && alt.trim().length > 0;

  // If src is invalid (relative path) or Image failed, use native <img> or placeholder
  if (!src) {
    return (
      <span className={`block w-full my-6 ${className || ''}`}>
        <span className="flex w-full h-48 bg-gray-100 dark:bg-gray-800 items-center justify-center rounded-lg">
          <span className="text-sm text-gray-500">Image non disponible</span>
        </span>
        {hasCaption && <span className="block mt-2 text-sm text-center text-gray-600 dark:text-gray-400">{alt}</span>}
      </span>
    );
  }

  // If it's not valid for Next/Image, render a native img and handle error
  if (!isValidImageUrl(src) || failed) {
    return (
      <span className={`block w-full my-6 ${className || ''}`}>
        <ImageZoom src={src} alt={alt}>
          <img
            src={src}
            alt={alt}
            onError={handleError}
            className="w-full h-auto max-h-96 object-cover m-0 rounded-lg"
          />
        </ImageZoom>
        {hasCaption && <span className="block mt-2 text-sm text-center text-gray-600 dark:text-gray-400">{alt}</span>}
      </span>
    );
  }

  // Otherwise use Next/Image for optimized delivery
  return (
    <span className={`block w-full my-6 ${className || ''}`}>
      <ImageZoom src={src} alt={alt}>
        <Image
          src={src}
          alt={alt}
          width={IMAGE_CONFIG.defaultWidth}
          height={IMAGE_CONFIG.defaultHeight}
          sizes={IMAGE_CONFIG.sizes}
          onError={(e) => {
            console.error('Next/Image failed to load:', src, e);
            setFailed(true);
          }}
          className="w-full h-auto max-h-96 object-cover m-0 rounded-lg"
        />
      </ImageZoom>
      {hasCaption && <span className="block mt-2 text-sm text-center text-gray-600 dark:text-gray-400">{alt}</span>}
    </span>
  );
};
