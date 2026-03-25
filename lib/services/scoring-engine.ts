// Scoring Engine — deterministic, pure function
// Same answers always produce the same scores

export interface AnswerValue {
  questionId: string;
  value: string | string[] | number;
}

export interface AnswerOptionData {
  id: string;
  questionId: string;
  points: number;
  categoryId: string | null;
}

export interface ScoreCategoryData {
  id: string;
  name: string;
  maxScore: number;
  weight: number;
}

export interface ScoreTierData {
  id: string;
  name: string;
  label: string;
  minScore: number;
  maxScore: number;
}

export interface ScoringResult {
  categoryScores: Record<string, number>; // categoryName → score
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  tier: string;
  tierLabel: string;
}

export function calculateScores(
  answers: AnswerValue[],
  answerOptions: AnswerOptionData[],
  categories: ScoreCategoryData[],
  tiers: ScoreTierData[]
): ScoringResult {
  // Build a map of optionId → option data
  const optionMap = new Map<string, AnswerOptionData>();
  for (const opt of answerOptions) {
    optionMap.set(opt.id, opt);
  }

  // Build category name map
  const categoryMap = new Map<string, ScoreCategoryData>();
  for (const cat of categories) {
    categoryMap.set(cat.id, cat);
  }

  // Accumulate points per category
  const categoryPoints: Record<string, number> = {};
  for (const cat of categories) {
    categoryPoints[cat.name] = 0;
  }

  for (const answer of answers) {
    const val = answer.value;

    // Collect selected option IDs
    let selectedOptionIds: string[] = [];
    if (typeof val === 'string') {
      selectedOptionIds = [val];
    } else if (Array.isArray(val)) {
      selectedOptionIds = val as string[];
    }
    // Scale answers don't map to options — handled separately if needed

    for (const optId of selectedOptionIds) {
      const opt = optionMap.get(optId);
      if (!opt) continue;
      const cat = opt.categoryId ? categoryMap.get(opt.categoryId) : null;
      const catName = cat ? cat.name : 'General';
      if (!(catName in categoryPoints)) categoryPoints[catName] = 0;
      categoryPoints[catName] += opt.points;
    }
  }

  // Cap category scores at maxScore
  const categoryScores: Record<string, number> = {};
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const cat of categories) {
    const raw = categoryPoints[cat.name] ?? 0;
    const capped = Math.min(raw, cat.maxScore);
    categoryScores[cat.name] = capped;
    totalScore += capped * cat.weight;
    maxPossibleScore += cat.maxScore * cat.weight;
  }

  totalScore = Math.round(totalScore);
  maxPossibleScore = Math.round(maxPossibleScore);
  const percentageScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  // Find tier
  const sortedTiers = [...tiers].sort((a, b) => b.minScore - a.minScore);
  let tier = 'Unknown';
  let tierLabel = 'Unknown';
  for (const t of sortedTiers) {
    if (totalScore >= t.minScore && totalScore <= t.maxScore) {
      tier = t.name;
      tierLabel = t.label;
      break;
    }
  }

  return { categoryScores, totalScore, maxPossibleScore, percentageScore, tier, tierLabel };
}
