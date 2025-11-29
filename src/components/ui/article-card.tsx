import Link from 'next/link';
import { formatDateFr } from '@/lib/utils';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article: article }: ArticleCardProps) {
  const date = article.publishedAt ? new Date(article.publishedAt) : new Date();
  const formatedDate = formatDateFr(date, 'd MMMM yyyy');

  // Formater les tags
  const tagsText = article.tags && article.tags.length > 0
    ? article.tags.join(', ')
    : '';

  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="space-y-1">
        <h3 className="font-normal hover:underline">{article.title}</h3>
        <p className="text-sm text-muted-foreground">
          {formatedDate}
          {tagsText && <> — {tagsText}</>}
        </p>
      </article>
    </Link>
  );
}
