'use client';

import { useGlobalSettings } from '@/contexts/global-data-context';

interface DynamicSiteNameProps {
  className?: string;
  fallbackText?: string;
}

/**
 * Composant qui affiche le nom du site depuis les Global Settings
 */
export function DynamicSiteName({ className = '', fallbackText }: DynamicSiteNameProps) {
  const { globalSettings } = useGlobalSettings();

  // Utilise la valeur depuis globalSettings ou le fallback fourni en prop
  const siteName = globalSettings?.siteName || fallbackText || 'My Portfolio';

  return (
    <span className={className} title={siteName}>
      {siteName}
    </span>
  );
}

/**
 * Hook pour accéder facilement au nom du site
 */
export function useSiteName() {
  const { globalSettings } = useGlobalSettings();

  return {
    siteName: globalSettings?.siteName || 'Mon Portfolio',
    isFromEnv: true,
  };
}
