'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';

const DynamicMathJaxProvider = dynamic(
  () => import('./markdown/mathjax-provider').then((mod) => mod.MathJaxProvider),
  {
    ssr: false,
    loading: () => <>{/* Placeholder pendant le chargement */}</>,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DynamicMathJaxProvider>{children}</DynamicMathJaxProvider>
    </ThemeProvider>
  );
}
