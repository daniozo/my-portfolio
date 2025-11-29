'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { DynamicSiteName } from '@/components/ui/site/dynamic-site-name';
import { SearchButton } from '@/components/search/search-button';
import { useGlobalData } from '@/contexts/global-data-context';

const NavigationLinks = React.memo(({ pathname }: { pathname: string }) => {
  const isBlogActive =
    pathname === '/' || (!pathname.startsWith('/projects') && !pathname.startsWith('/me'));
  return (
    <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        prefetch={true}
        className={`text-sm font-medium tracking-wider uppercase transition-colors hover:text-primary ${isBlogActive ? 'text-primary' : 'text-muted-foreground'
          }`}
      >
        Blog
      </Link>
      <Link
        href="/projects"
        prefetch={true}
        className={`text-sm font-medium tracking-wider uppercase transition-colors hover:text-primary ${pathname.startsWith('/projects') ? 'text-primary' : 'text-muted-foreground'
          }`}
      >
        Projets
      </Link>
      <Link
        href="/me"
        prefetch={true}
        className={`text-sm font-medium tracking-wider uppercase transition-colors hover:text-primary ${pathname === '/me' ? 'text-primary' : 'text-muted-foreground'
          }`}
      >
        À propos
      </Link>
    </div>
  );
});

NavigationLinks.displayName = 'NavigationLinks';

function SiteHeaderComponent() {

  const pathname = usePathname();
  const { globalData } = useGlobalData();
  const logo = globalData?.globalSettings?.logo;
  const siteName = globalData?.globalSettings?.siteName || process.env.NEXT_PUBLIC_SITE_NAME || 'Mon Portfolio';

  return (
    <header className="z-10 sticky top-0 md:w-full border-b  border-gray-100 dark:border-gray-900 px-4">
      <div className="md:mx-auto max-w-screen-xl w-full flex items-center justify-between px-2 md:px-0 py-2">
        <Link href="/" prefetch={true} className="flex gap-4 items-center hover:opacity-80 transition-opacity">
          {logo && (
            <Image
              src={logo.url}
              alt={logo.alternativeText || siteName}
              width={logo.width || 120}
              height={logo.height || 40}
              className="h-8 w-auto"
              priority
            />
          )}
          <DynamicSiteName
            className="font-medium tracking-wider uppercase"
            fallbackText="Mon Portfolio"
          />
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavigationLinks pathname={pathname} />
          <SearchButton />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export const SiteHeader = React.memo(SiteHeaderComponent);
