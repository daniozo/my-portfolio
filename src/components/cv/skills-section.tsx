import type { SkillsSection as SkillsSectionType } from '@/types';

interface SkillsSectionProps {
  skills: SkillsSectionType;
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  // Filtrer les catégories vides et valides
  const validCategories = skills.categories.filter((cat) => {
    if (!cat.category || cat.category.trim() === '') {
      return false;
    }

    // Vérifier qu'il y a au moins une compétence valide
    const validSkills = cat.skills.filter(
      (skill) => skill.name && skill.name.trim() !== ''
    );

    return validSkills.length > 0;
  });

  if (validCategories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {validCategories.map((category, catIndex) => {
        const validSkills = category.skills.filter(
          (skill) => skill.name && skill.name.trim() !== ''
        );

        return (
          <div key={catIndex} className="space-y-4">
            {/* Category Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {category.category}
            </h3>

            {/* Skills List */}
            <div className="flex flex-wrap gap-2 pl-1">
              {validSkills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
