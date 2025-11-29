'use client';

import Link from 'next/link';
import { SocialLinksComponent } from '@/components/ui/social-links';
import { useFooterSocialLinks } from '@/contexts/global-data-context';
import { DynamicSiteName } from '@/components/ui/site/dynamic-site-name';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const { hasActiveSocialLinks } = useFooterSocialLinks();

  return (
    <footer
      className={`container flex flex-col-reverse items-center gap-4 ${hasActiveSocialLinks ? 'md:flex-row justify-between' : 'justify-center'} max-w-screen-xl py-4 mt-28 w-full font-medium text-muted-foreground tracking-wider uppercase`}
    >
      <div className="flex gap-4 text-xs md:text-base">
        <div className="flex flex-col md:flex-row gap-1 items-center text-center">
          <Link href="/" className="hover:text-primary">
            <p className="text-sm text-muted-foreground">
              <DynamicSiteName fallbackText="My Portfolio" /> <span>© {currentYear}</span>
            </p>
          </Link>
          <div className="flex flex-row gap-4"><Link href="/legal" className="hover:text-primary">
            Mentions légales
          </Link>
            <Link href="/rss" className="hover:text-primary">
              Flux rss
            </Link>
          </div>
        </div>
      </div>

      {hasActiveSocialLinks && (
        <div className="mb-3">
          <SocialLinksComponent variant="horizontal" size="md" />
        </div>
      )}
    </footer>
  );
}
