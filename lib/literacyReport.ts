import { concepts, getConceptById } from '@/data/vocabulary';
import { getLiteracyLevel, StreakData } from '@/lib/streaks';
import { ConceptCategory } from '@/types';

const categoryPoetry: Record<ConceptCategory, string> = {
  technique: 'the geometry of touch — techniques that shape sensation with intention',
  sensation: 'the textures of feeling — how pleasure moves and spreads through the body',
  timing: 'the rhythm of desire — pacing, warm-up, and the art of building',
  psychological: 'the inner landscape — desire, shame, and the stories we tell ourselves',
  anatomy: 'the architecture of pleasure — understanding the body on its own terms',
};

const categoryLabels: Record<ConceptCategory, string> = {
  technique: 'Techniques',
  sensation: 'Sensations',
  timing: 'Timing & Pacing',
  psychological: 'Psychological',
  anatomy: 'Anatomy',
};

export interface LiteracyReportData {
  literacyLevel: ReturnType<typeof getLiteracyLevel>;
  exploredCount: number;
  resonatesCount: number;
  totalConcepts: number;
  progressPercent: number;
  topCategory: ConceptCategory | null;
  topCategoryLabel: string | null;
  patternPoetry: string | null;
  topConcepts: { id: string; name: string; category: ConceptCategory }[];
  streakDays: number;
  generatedAt: string;
}

export function buildLiteracyReport(
  userConcepts: { concept_id: string; status: string }[],
  exploredCount: number,
  resonatesCount: number,
  streak: StreakData | null
): LiteracyReportData {
  const totalConcepts = concepts.length;
  const literacyLevel = getLiteracyLevel(exploredCount, totalConcepts);
  const progressPercent = totalConcepts > 0 ? Math.round((exploredCount / totalConcepts) * 100) : 0;

  const categoryCounts: Partial<Record<ConceptCategory, number>> = {};
  userConcepts
    .filter((uc) => uc.status === 'resonates')
    .forEach((uc) => {
      const concept = getConceptById(uc.concept_id);
      if (concept) {
        categoryCounts[concept.category] = (categoryCounts[concept.category] ?? 0) + 1;
      }
    });

  const sortedCategories = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a);
  const topCategory = (sortedCategories[0]?.[0] as ConceptCategory) ?? null;
  const topCategoryLabel = topCategory ? categoryLabels[topCategory] : null;
  const patternPoetry = topCategory ? categoryPoetry[topCategory] : null;

  const topConcepts = userConcepts
    .filter((uc) => uc.status === 'resonates')
    .map((uc) => {
      const concept = getConceptById(uc.concept_id);
      return concept
        ? { id: concept.id, name: concept.name, category: concept.category }
        : null;
    })
    .filter(Boolean)
    .slice(0, 5) as { id: string; name: string; category: ConceptCategory }[];

  return {
    literacyLevel,
    exploredCount,
    resonatesCount,
    totalConcepts,
    progressPercent,
    topCategory,
    topCategoryLabel,
    patternPoetry,
    topConcepts,
    streakDays: streak?.currentStreak ?? 0,
    generatedAt: new Date().toISOString(),
  };
}

export function formatReportAsText(report: LiteracyReportData): string {
  let text = `My Pleasure Literacy Report\n`;
  text += `${report.literacyLevel.label}\n\n`;
  text += `${report.exploredCount} of ${report.totalConcepts} concepts explored (${report.progressPercent}%)\n`;
  text += `${report.resonatesCount} concepts resonate with me\n`;

  if (report.streakDays > 0) {
    text += `${report.streakDays}-day exploration streak\n`;
  }

  if (report.patternPoetry) {
    text += `\nYou're drawn to ${report.patternPoetry}.\n`;
  }

  if (report.topConcepts.length > 0) {
    text += `\nConcepts that resonate:\n`;
    report.topConcepts.forEach((c) => {
      text += `• ${c.name}\n`;
    });
  }

  text += `\n— Shared from Pleasure Vocabulary Builder`;
  return text;
}
