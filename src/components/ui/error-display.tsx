'use client';

import { Button } from '@/components/ui/button';

/**
 * Composant pour afficher une erreur avec bouton de rechargement
 * Centré verticalement et horizontalement
 */
export function ErrorDisplay({
  title = 'Service temporairement indisponible',
  message = 'Nous rencontrons actuellement des difficultés techniques. Veuillez réessayer dans quelques instants.',
}: {
  title?: string;
  message?: string;
}) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md space-y-4">
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground">{message}</p>
        <Button onClick={handleReload} variant="outline" className="mt-6">
          Réessayer
        </Button>
      </div>
    </div>
  );
}
