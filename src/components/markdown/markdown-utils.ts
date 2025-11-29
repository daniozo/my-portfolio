/**
 * Utilities for validating and extracting media URLs
 */

/**
 * Checks if the alt text explicitly requests embedding
 * @param alt - The alt text to check
 * @returns True if the alt text starts with 'embed:'
 */
export function shouldEmbed(alt: string): boolean {
  return alt.toLowerCase().startsWith('embed:');
}

/**
 * Extracts the embed type from alt text
 * @param alt - The alt text (e.g., "embed:youtube", "embed:video")
 * @returns The embed type or null
 */
export function getEmbedType(alt: string): 'youtube' | 'video' | null {
  if (!shouldEmbed(alt)) {
    return null;
  }

  const type = alt.toLowerCase().replace('embed:', '').trim();

  if (type === 'youtube' || type === 'yt') {
    return 'youtube';
  }

  if (type === 'video') {
    return 'video';
  }

  return null;
}

/**
 * Validates and extracts YouTube video ID from a URL
 * @param url - The URL to extract the YouTube ID from
 * @returns The YouTube video ID or null if invalid
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    // YouTube video ID is always 11 characters: A-Z, a-z, 0-9, _, -
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/, // youtube.com/watch?v=
      /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/, // youtu.be/
      /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/, // youtube.com/embed/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is a YouTube video
 * @param url - The URL to check
 * @returns True if the URL is a YouTube video
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Checks if a URL points to a video file
 * @param url - The URL to check
 * @returns True if the URL is a video file
 */
export function isVideoUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  return /\.(mp4|webm|ogg)$/i.test(url);
}

/**
 * Validates if a string could be valid children content
 * @param children - The children to validate
 * @returns The string content or empty string
 */
export function extractTextContent(children: unknown): string {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(extractTextContent).join('');
  }

  if (children && typeof children === 'object' && 'props' in children) {
    const props = children.props as { children?: unknown };
    return extractTextContent(props.children);
  }

  return String(children || '');
}

/**
 * Checks if a URL is valid for Next.js Image component
 * Next.js Image requires either absolute paths (/) or full URLs (http(s)://)
 * Also excludes video URLs that shouldn't be used as images
 * @param src - The image source URL
 * @returns True if the URL is valid for Next.js Image
 */
export function isValidImageUrl(src: string): boolean {
  if (!src || typeof src !== 'string') {
    return false;
  }

  // Check if it's a YouTube URL (should not be used as image)
  if (isYouTubeUrl(src)) {
    return false;
  }

  // Check if it's a video file (should not be used as image)
  if (isVideoUrl(src)) {
    return false;
  }

  // Check if it's an absolute path starting with /
  if (src.startsWith('/')) {
    return true;
  }

  // Check if it's a full URL (http:// or https://)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return true;
  }

  // Relative paths like ./image.jpg or ../image.jpg are NOT valid for Next.js Image
  return false;
}
