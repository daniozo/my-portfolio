import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { SiteHeader } from '@/components/layout/site-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { generateGlobalMetadata } from '@/lib/next-metadata';
import { getDefaultLang } from '@/lib/env-config';
import dataService from '@/lib/data';
import { GlobalDataProvider } from '@/contexts/global-data-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Ajouter 'swap' pour éviter le texte invisible pendant le chargement
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // Ajouter 'swap' pour éviter le texte invisible pendant le chargement
  preload: true,
});

// Génération dynamique des métadonnées basées sur les Global Settings
export async function generateMetadata(): Promise<Metadata> {
  return await generateGlobalMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Récupérer les données avec gestion d'erreur pour permettre le démarrage sans backend
  let globalSettings = null;
  let socialLinks = null;

  try {
    const isStrapiHealthy = await dataService.isHealthy();

    if (isStrapiHealthy) {
      [globalSettings, socialLinks] = await Promise.all([
        dataService.static.getGlobalSettings(),
        dataService.static.getSocialLinks(),
      ]);
    }
  } catch (_error) {
    console.warn('Layout: Backend not available, using fallback values');
  }

  const globalData = { globalSettings, socialLinks };

  return (
    <html lang={getDefaultLang()} suppressHydrationWarning className="h-full overflow-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background h-full overflow-hidden`}
      >
        <div className="h-full grid grid-rows-[auto_1fr_auto] md:grid-rows-[auto_1fr]">
          <GlobalDataProvider initialData={globalData}>
            <Providers>
              {/* Header */}
              <SiteHeader />

              {/* Main content */}
              <main className="overflow-y-auto overflow-x-hidden">{children}</main>

              {/* Bottom navigation - only visible on mobile */}
              <BottomNav />
            </Providers>
          </GlobalDataProvider>
        </div>
      </body>
    </html>
  );
}
