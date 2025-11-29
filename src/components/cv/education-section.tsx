import type { EducationSection as EducationSectionType } from '@/types';

interface EducationSectionProps {
  educations: EducationSectionType;
}

export function EducationSection({ educations }: EducationSectionProps) {
  // Filtrer les formations vides et valides
  const validEducations = educations.educations.filter(
    (edu) => edu.degree && edu.degree.trim() !== '' && edu.school && edu.school.trim() !== '' && edu.startDate
  );

  if (validEducations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {validEducations.map((education, index) => {
        // Formatter les dates
        const startDate = new Date(education.startDate);
        const endDate = education.endDate ? new Date(education.endDate) : null;

        const startYear = startDate.getFullYear();
        const endYear = endDate ? endDate.getFullYear() : 'En cours';

        return (
          <div key={index} className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700 last:pb-0">
            {/* Bullet point */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>

            <div className="space-y-2">
              {/* Degree */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {education.degree}
              </h3>

              {/* School */}
              <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                {education.school}
              </p>

              {/* Location */}
              {education.location && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {education.location}
                </p>
              )}

              {/* Dates */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {startYear} - {endYear}
                </span>
              </div>

              {/* Description */}
              {education.description && (
                <div className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-6">
                  {education.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
