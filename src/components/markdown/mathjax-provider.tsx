'use client';

import { MathJaxContext } from 'better-react-mathjax';
import React, { useMemo } from 'react';

export function MathJaxProvider({ children }: { children: React.ReactNode }) {
  // Utilisation de useMemo pour éviter la re-création de la config à chaque render
  const config = useMemo(
    () => ({
      loader: {
        load: ['[tex]/html'],
        cacheBust: false,
      },
      tex: {
        packages: { '[+]': ['html'] },
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']],
        processEscapes: true,
        processEnvironments: true,
      },
      svg: {
        fontCache: 'global',
        scale: 1,
        minScale: 0.5,
      },
      chtml: {
        mtextFont: 'inherit',
        minScale: 0.5,
      },
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        ignoreHtmlClass: 'tex2jax_ignore',
      },
    }),
    []
  );

  return <MathJaxContext config={config}>{children}</MathJaxContext>;
}
