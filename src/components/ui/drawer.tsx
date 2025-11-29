'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

export function Drawer({ isOpen, onClose, children, side = 'left' }: CustomDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // This component uses a portal, so it should only run on the client
  const [isMounted, setIsMounted] = React.useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300 ease-in-out',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the drawer
        className={cn(
          'absolute top-0 h-full w-72 max-w-[80vw] bg-background p-6 shadow-xl transition-transform duration-300 ease-in-out',
          side === 'left' ? 'left-0' : 'right-0',
          {
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen && side === 'left',
            'translate-x-full': !isOpen && side === 'right',
          }
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
