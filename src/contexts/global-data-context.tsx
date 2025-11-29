'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { GlobalData } from '@/types';

interface GlobalDataContextType {
  globalData: GlobalData | null;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

interface GlobalDataProviderProps {
  children: ReactNode;
  initialData: GlobalData | null;
}

export function GlobalDataProvider({ children, initialData }: GlobalDataProviderProps) {
  const [globalData] = useState<GlobalData | null>(initialData);

  return (
    <GlobalDataContext.Provider value={{ globalData }}>
      {children}
    </GlobalDataContext.Provider>
  );
}

export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
}

// Hooks de compatibilité pour les composants existants
export function useGlobalSettings() {
  const { globalData } = useGlobalData();
  return { globalSettings: globalData?.globalSettings };
}

export function useSocialLinks() {
  const { globalData } = useGlobalData();
  return { socialLinks: globalData?.socialLinks };
}

export function useFooterSocialLinks() {
  const { globalData } = useGlobalData();
  const socialLinks = globalData?.socialLinks;

  // Calcul de hasActiveSocialLinks basé sur footerConfiguration
  const hasActiveSocialLinks =
    socialLinks &&
    ((socialLinks.footerConfiguration?.showEmail && socialLinks.email) ||
      (socialLinks.footerConfiguration?.showPhone && socialLinks.phone) ||
      (socialLinks.footerConfiguration?.showLinkedin && socialLinks.linkedin) ||
      (socialLinks.footerConfiguration?.showTwitter && socialLinks.twitter) ||
      (socialLinks.footerConfiguration?.showGithub && socialLinks.github) ||
      (socialLinks.footerConfiguration?.showInstagram && socialLinks.instagram) ||
      (socialLinks.footerConfiguration?.showFacebook && socialLinks.facebook) ||
      (socialLinks.footerConfiguration?.showYoutube && socialLinks.youtube));

  return { socialLinks, hasActiveSocialLinks };
}
