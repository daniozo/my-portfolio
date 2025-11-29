'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  // Blog est actif sur la home page ("/") et sur toutes les pages d'articles (tout chemin qui n'est pas /projects ou /me)
  const isBlogActive =
    pathname === '/' || (!pathname.startsWith('/projects') && !pathname.startsWith('/me') && !pathname.startsWith('/legal'));
  const isProjectsActive = pathname.startsWith('/projects');
  const isMeActive = pathname.startsWith('/me');

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_10px_rgba(255,255,255,0.05)] md:hidden">
      <div className="flex justify-around py-3">
        <Link
          href="/"
          prefetch={true}
          className={`flex flex-col gap-1 items-center text-xs tracking-wider uppercase ${isBlogActive ? 'text-primary' : 'text-muted-foreground'
            }`}
        >
          <Home className="w-5 h-5" />
          Blog
        </Link>
        <Link
          href="/projects"
          prefetch={true}
          className={`flex flex-col gap-1 items-center text-xs tracking-wider uppercase ${isProjectsActive ? 'text-primary' : 'text-muted-foreground'
            }`}
        >
          <Briefcase className="w-5 h-5" />
          Projets
        </Link>
        <Link
          href="/me"
          prefetch={true}
          className={`flex flex-col gap-1 items-center text-xs tracking-wider uppercase ${isMeActive ? 'text-primary' : 'text-muted-foreground'
            }`}
        >
          <User className="w-5 h-5" />À propos
        </Link>
      </div>
    </nav>
  );
}
