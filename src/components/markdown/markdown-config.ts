/**
 * Configuration constants for the Markdown component
 */

export const IMAGE_CONFIG = {
  defaultWidth: 768,
  defaultHeight: 432,
  maxHeight: 384, // Corresponds to 'max-h-96' (96 * 4px = 384px)
  sizes: '(max-width: 768px) 100vw, 768px',
} as const;

export const VIDEO_CONFIG = {
  preload: 'metadata' as const,
  controls: true,
} as const;

export const YOUTUBE_CONFIG = {
  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  allowFullScreen: true,
} as const;

export const CODE_CONFIG = {
  copyTimeout: 2000,
} as const;
