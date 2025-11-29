import { Badge } from '@/components/ui/badge';

interface TagListProps {
  items: string[];
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

/**
 * Composant pour afficher une liste de tags
 */
export function TagList({
  items,
  variant = 'secondary',
  className = ''
}: TagListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Fonction pour capitaliser la première lettre
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((item, index) => (
        <Badge
          key={`${item}-${index}`}
          variant={variant}
          className="text-xs"
        >
          {capitalize(item)}
        </Badge>
      ))}
    </div>
  );
}
