'use client';

import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ImageWithCaption } from './image-with-caption';
import { cn, createUniqueSlugGenerator } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { MathJax } from 'better-react-mathjax';
import { CodeBlock } from './code-block';
import { VIDEO_CONFIG, YOUTUBE_CONFIG } from './markdown-config';
import {
  extractYouTubeId,
  extractTextContent,
  shouldEmbed,
  getEmbedType,
} from './markdown-utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown = React.memo(function Markdown({ content, className }: MarkdownProps) {
  // Utiliser useRef pour créer un générateur qui persiste entre les rendus
  // mais se réinitialise quand le content change
  const slugGeneratorRef = useRef<ReturnType<typeof createUniqueSlugGenerator> | null>(null);
  const previousContentRef = useRef<string>('');

  // Réinitialiser le générateur si le content a changé
  if (previousContentRef.current !== content) {
    slugGeneratorRef.current = createUniqueSlugGenerator();
    previousContentRef.current = content;
  }

  const generateUniqueSlug = slugGeneratorRef.current!;

  return (
    <div
      className={cn(
        'max-w-2xl prose prose-slate dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-primary prose-img:rounded-lg',
        'prose-blockquote:border-l-primary prose-blockquote:not-italic prose-blockquote:pl-6 prose-blockquote:text-gray-800 dark:prose-blockquote:text-gray-200',
        className
      )}
    >
      <MathJax dynamic hideUntilTypeset="every">
        <ReactMarkdown
          components={{
            pre({ node: _node, children, ..._props }) {
              return <>{children}</>;
            },
            code({ node: _node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const content = extractTextContent(children);

              if (!match) {
                return (
                  <code className={cn('font-mono text-sm font-bold', className)} {...props}>
                    {content}
                  </code>
                );
              }

              return <CodeBlock language={language}>{content}</CodeBlock>;
            },
            img({ node: _node, ...props }) {
              const src = typeof props.src === 'string' ? props.src : '';
              const alt = props.alt || '';

              // If user explicitly requests embed, keep current embed/video logic
              const embedType = shouldEmbed(alt) ? getEmbedType(alt) : null;

              if (embedType === 'youtube' && src) {
                const youtubeId = extractYouTubeId(src);
                if (youtubeId) {
                  return (
                    <span className="block w-full my-6 overflow-hidden rounded-lg aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={alt || 'YouTube video'}
                        allow={YOUTUBE_CONFIG.allow}
                        allowFullScreen={YOUTUBE_CONFIG.allowFullScreen}
                        className="w-full h-full m-0"
                      />
                    </span>
                  );
                }
                console.warn('Invalid YouTube URL for embed:', src);
              }

              if (embedType === 'video' && src) {
                return (
                  <span className="block w-full my-6 overflow-hidden rounded-lg">
                    <video
                      src={src}
                      controls={VIDEO_CONFIG.controls}
                      className="w-full m-0"
                      preload={VIDEO_CONFIG.preload}
                      aria-label={alt || 'Video content'}
                    >
                      <track kind="captions" />
                      Your browser does not support the video tag.
                    </video>
                  </span>
                );
              }

              // Default: render image using ImageWithCaption which handles 404/fallback and caption
              return <ImageWithCaption src={src} alt={alt} className="rounded-lg" />;
            },
            a({ node: _node, ...props }) {
              const isExternal = props.href?.startsWith('http');
              return (
                <a
                  className="inline-flex items-center gap-1 font-medium underline underline-offset-4 transition-colors hover:text-primary/80"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {props.children}
                  {isExternal && <ExternalLink size={14} className="inline" />}
                </a>
              );
            },
            h1({ node: _node, ...props }) {
              const title = extractTextContent(props.children);
              const id = generateUniqueSlug(title);
              return (
                <h1
                  id={id}
                  className="scroll-mt-20 text-3xl font-bold tracking-tight mt-12 mb-6"
                  {...props}
                />
              );
            },
            h2({ node: _node, ...props }) {
              const title = extractTextContent(props.children);
              const id = generateUniqueSlug(title);
              return (
                <h2
                  id={id}
                  className="scroll-mt-20 text-2xl font-semibold tracking-tight mt-10 mb-5 group flex items-center"
                  {...props}
                >
                  {props.children}
                  <a
                    href={`#${id}`}
                    className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-opacity"
                    aria-label="Link to this section"
                  >
                    #
                  </a>
                </h2>
              );
            },
            h3({ node: _node, ...props }) {
              const title = extractTextContent(props.children);
              const id = generateUniqueSlug(title);
              return (
                <h3
                  id={id}
                  className="scroll-mt-20 text-xl font-semibold tracking-tight mt-8 mb-4 group flex items-center"
                  {...props}
                >
                  {props.children}
                  <a
                    href={`#${id}`}
                    className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-opacity"
                    aria-label="Link to this section"
                  >
                    #
                  </a>
                </h3>
              );
            },
            p({ node: _node, ...props }) {
              return <p className="leading-7 my-5" {...props} />;
            },
            ul({ node: _node, ...props }) {
              return <ul className="list-disc pl-6 my-5 space-y-2" {...props} />;
            },
            ol({ node: _node, ...props }) {
              return <ol className="list-decimal pl-6 my-5 space-y-2" {...props} />;
            },
            li({ node: _node, ...props }) {
              return <li className="my-1 leading-7" {...props} />;
            },
            blockquote({ node: _node, ...props }) {
              return (
                <blockquote
                  className="my-8 border-l-4 pl-6 italic text-gray-600 dark:text-gray-300"
                  {...props}
                />
              );
            },
            table({ node: _node, ...props }) {
              return (
                <div className="my-8 w-full overflow-x-auto">
                  <table
                    className="m-0 min-w-full"
                    style={{ borderSpacing: 0 }}
                    {...props}
                  />
                </div>
              );
            },
            th({ node: _node, ...props }) {
              return (
                <th
                  className="p-4 align-middle text-left [&:has([role=checkbox])]:pr-0"
                  {...props}
                />
              );
            },
            td({ node: _node, ...props }) {
              return (
                <td
                  className="px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  {...props}
                />
              );
            },
          }}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          remarkRehypeOptions={{ passThrough: ['link'] }}
        >
          {content}
        </ReactMarkdown>
      </MathJax>
    </div>
  );
});