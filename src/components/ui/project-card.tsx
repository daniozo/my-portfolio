import Link from 'next/link';
import { formatProjectDateRange } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  role?: string;
  summary: string;
  date: {
    start: string;
    end?: string | null;
  };
  tags?: string[];
  slug: string;
  isExternal?: boolean;
}

export function ProjectCard({ project }: { project: ProjectCardProps }) {
  const dateDisplay = formatProjectDateRange(project.date.start, project.date.end);
  const href = project.isExternal ? project.slug : `/projects/${project.slug}`;
  const linkProps = project.isExternal
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return (
    <Link href={href} {...linkProps}>
      <article className="text-card-foreground border-0 bg-transparent h-full group">
        <div className="flex flex-col space-y-3">
          <div className="space-y-1.5">
            <h3 className="text-2xl font-semibold leading-none tracking-tight group-hover:underline">
              {project.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <time>{dateDisplay}</time>
              {project.role && <span className="text-muted-foreground">{project.role}</span>}
            </div>
          </div>
          <p className="text-foreground leading-relaxed">{project.summary}</p>
        </div>
      </article>
    </Link>
  );
}
