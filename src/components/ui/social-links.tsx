'use client';

import Link from 'next/link';
import { Mail, Github, Linkedin, Instagram, Facebook, Youtube, Phone } from 'lucide-react';
import { useSocialLinks } from '@/contexts/global-data-context';

interface SocialLinksProps {
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function SocialLinksComponent({
  variant = 'horizontal',
  size = 'md',
  showLabels = false,
  className = '',
}: SocialLinksProps) {
  const { socialLinks } = useSocialLinks();

  // Pas d'affichage si pas de socialLinks, même en cours de chargement
  if (!socialLinks) {
    return null;
  }

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }[size];

  const links = [
    {
      href: socialLinks.email ? `mailto:${socialLinks.email}` : '',
      icon: <Mail className={iconSize} />,
      label: 'Email',
      condition: socialLinks.email && socialLinks.footerConfiguration.showEmail,
    },
    {
      href: socialLinks.phone ? `tel:${socialLinks.phone}` : '',
      icon: <Phone className={iconSize} />,
      label: 'Téléphone',
      condition: socialLinks.phone && socialLinks.footerConfiguration.showPhone,
    },
    {
      href: socialLinks.linkedin || '',
      icon: <Linkedin className={iconSize} />,
      label: 'LinkedIn',
      condition: socialLinks.linkedin && socialLinks.footerConfiguration.showLinkedin,
    },
    {
      href: socialLinks.twitter || '',
      icon: (
        <svg className={iconSize} viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
          ></path>
        </svg>
      ),
      label: 'X (Twitter)',
      condition: socialLinks.twitter && socialLinks.footerConfiguration.showTwitter,
    },
    {
      href: socialLinks.github || '',
      icon: <Github className={iconSize} />,
      label: 'GitHub',
      condition: socialLinks.github && socialLinks.footerConfiguration.showGithub,
    },
    {
      href: socialLinks.instagram || '',
      icon: <Instagram className={iconSize} />,
      label: 'Instagram',
      condition: socialLinks.instagram && socialLinks.footerConfiguration.showInstagram,
    },
    {
      href: socialLinks.facebook || '',
      icon: <Facebook className={iconSize} />,
      label: 'Facebook',
      condition: socialLinks.facebook && socialLinks.footerConfiguration.showFacebook,
    },
    {
      href: socialLinks.youtube || '',
      icon: <Youtube className={iconSize} />,
      label: 'YouTube',
      condition: socialLinks.youtube && socialLinks.footerConfiguration.showYoutube,
    },
  ].filter((link) => link.condition && link.href);

  return (
    <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} gap-4 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
          className="hover:text-primary transition-colors"
        >
          <span className="sr-only">{link.label}</span>
          {showLabels ? (
            <div
              className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-row'} items-center gap-2`}
            >
              {link.icon}
              <span className="text-sm">{link.label}</span>
            </div>
          ) : (
            link.icon
          )}
        </Link>
      ))}
    </div>
  );
}
