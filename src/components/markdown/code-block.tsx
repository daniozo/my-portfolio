'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { CODE_CONFIG } from './markdown-config';

interface CodeBlockProps {
  language: string;
  children: string;
}

export const CodeBlock = React.memo(function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const { theme, systemTheme } = useTheme();

  // Determine the effective theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const isDark = effectiveTheme === 'dark';

  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard
      .writeText(children)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), CODE_CONFIG.copyTimeout);
      })
      .catch((error) => {
        console.error('Failed to copy code:', error);
      });
  }, [children]);

  return (
    <div className="group relative mt-6 mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-inherit transition-none">
      <div className="flex items-center justify-between px-4 pt-2 text-sm">
        <span className="font-mono text-gray-500 dark:text-gray-400">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 rounded px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        >
          {copied ? (
            <>
              <Check size={14} className="text-gray-500 dark:text-gray-400" />
              <span className="text-xs">Copié</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="text-xs">Copier</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={isDark ? vscDarkPlus : prism}
        language={language}
        PreTag="pre"
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: 0,
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        codeTagProps={{
          style: {
            background: 'transparent',
            fontSize: 'inherit', // Hérite de la taille définie dans customStyle
          }
        }}
      >
        {children.replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
});
