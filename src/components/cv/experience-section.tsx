import type { ExperienceSection as ExperienceSectionType } from '@/types';

interface ExperienceSectionProps {
  experiences: ExperienceSectionType;
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  // Filtrer les expériences vides et valides
  const validExperiences = experiences.experiences.filter(
    (exp) => exp.position && exp.position.trim() !== '' && exp.startDate
  );

  if (validExperiences.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {validExperiences.map((experience, index) => {
        // Formatter les dates
        const startDate = new Date(experience.startDate);
        const endDate = experience.endDate ? new Date(experience.endDate) : null;

        const startMonth = startDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        const endMonth = endDate
          ? endDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
          : 'Présent';

        // Calculer la durée
        const calculateDuration = () => {
          const end = endDate || new Date();
          const months = (end.getFullYear() - startDate.getFullYear()) * 12 +
            (end.getMonth() - startDate.getMonth());

          if (months < 12) {
            return `${months} mois`;
          } else {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            if (remainingMonths === 0) {
              return `${years} an${years > 1 ? 's' : ''}`;
            }
            return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
          }
        };

        return (
          <div key={index} className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700 last:pb-0">
            {/* Bullet point */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>

            <div className="space-y-2">
              {/* Position */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {experience.position}
              </h3>

              {/* Company & Type */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {experience.company && (
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {experience.company}
                  </span>
                )}
                {experience.type && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {experience.type}
                  </span>
                )}
              </div>

              {/* Location */}
              {experience.location && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {experience.location}
                </p>
              )}

              {/* Dates & Duration */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {startMonth} - {endMonth}
                </span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-500 dark:text-gray-500">
                  {calculateDuration()}
                </span>
              </div>

              {/* Description */}
              {experience.description && (
                <div className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-6">
                  {experience.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
