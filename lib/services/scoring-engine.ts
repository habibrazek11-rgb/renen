import type {
  ExtractedFields,
  ScoringModel,
  Segment,
  SegmentRule,
} from "@/lib/types";

export interface ScoreResult {
  category_scores: Record<string, number>;
  total_score: number;
  tier: string;
}

export interface SegmentResult {
  segment_id: string | null;
  segment_name: string;
  segment_outcome: string;
  decision_reason: string;
}

/**
 * Calculate deterministic scores based on LLM suggestions
 * Uses the scoring model's categories and max scores
 */
export function calculateScores(
  extracted: ExtractedFields,
  scoringModel: ScoringModel
): ScoreResult {
  const categoryScores: Record<string, number> = {};
  let totalScore = 0;

  // Use LLM suggestions but cap at category max scores
  for (const category of scoringModel.categories) {
    const suggestedScore = extracted.score_suggestions[category.name] || 0;
    const finalScore = Math.min(Math.max(suggestedScore, 0), category.max_score);

    categoryScores[category.name] = finalScore;
    totalScore += finalScore;
  }

  // Determine tier
  const tier = determineTier(totalScore, scoringModel.tiers);

  return {
    category_scores: categoryScores,
    total_score: totalScore,
    tier,
  };
}

/**
 * Determine the tier based on total score and tier definitions
 */
function determineTier(
  totalScore: number,
  tiers: Array<{ name: string; min_score: number; max_score: number; label: string }>
): string {
  for (const tier of tiers) {
    if (totalScore >= tier.min_score && totalScore <= tier.max_score) {
      return tier.label;
    }
  }
  return "Unknown";
}

/**
 * Apply segment routing rules to determine outcome
 * Rules are evaluated in precedence order (lower number = higher priority)
 */
export function applySegmentRouting(
  scoreResult: ScoreResult,
  segments: Segment[]
): SegmentResult {
  // Sort segments by precedence
  const sortedSegments = [...segments].sort((a, b) => a.precedence - b.precedence);

  // Evaluate each segment's rules
  for (const segment of sortedSegments) {
    if (evaluateSegmentRules(scoreResult, segment.rules)) {
      return {
        segment_id: segment.id,
        segment_name: segment.name,
        segment_outcome: segment.outcome,
        decision_reason:
          segment.reason_template ||
          `Matched ${segment.name} segment criteria (score: ${scoreResult.total_score})`,
      };
    }
  }

  // Default fallback
  return {
    segment_id: null,
    segment_name: "reject",
    segment_outcome: "reject",
    decision_reason: "Did not meet any segment criteria",
  };
}

/**
 * Evaluate if all rules in a segment are satisfied (AND logic)
 */
function evaluateSegmentRules(
  scoreResult: ScoreResult,
  rules: SegmentRule[]
): boolean {
  for (const rule of rules) {
    if (!evaluateSingleRule(scoreResult, rule)) {
      return false; // All rules must pass (AND logic)
    }
  }
  return true;
}

/**
 * Evaluate a single rule
 */
function evaluateSingleRule(
  scoreResult: ScoreResult,
  rule: SegmentRule
): boolean {
  let value: number;

  if (rule.type === "total_score") {
    value = scoreResult.total_score;
  } else if (rule.type === "category_score" && rule.category) {
    value = scoreResult.category_scores[rule.category] || 0;
  } else {
    return false;
  }

  switch (rule.operator) {
    case "gte":
      return value >= rule.value;
    case "lte":
      return value <= rule.value;
    case "eq":
      return value === rule.value;
    case "gt":
      return value > rule.value;
    case "lt":
      return value < rule.value;
    default:
      return false;
  }
}

/**
 * Default scoring model matching the spec
 */
export const DEFAULT_SCORING_MODEL: ScoringModel = {
  id: "default",
  funnel_id: "default",
  name: "Standard Investment Evaluation",
  categories: [
    { name: "market", max_score: 25, weight: 1.0 },
    { name: "product", max_score: 25, weight: 1.0 },
    { name: "traction", max_score: 20, weight: 1.0 },
    { name: "team", max_score: 15, weight: 1.0 },
    { name: "financials", max_score: 15, weight: 1.0 },
  ],
  tiers: [
    { name: "reject", min_score: 0, max_score: 49, label: "Reject" },
    { name: "revise", min_score: 50, max_score: 69, label: "Revise" },
    { name: "pass", min_score: 70, max_score: 100, label: "Pass" },
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Default segments matching the spec
 */
export const DEFAULT_SEGMENTS: Segment[] = [
  {
    id: "seg-pass",
    funnel_id: "default",
    name: "pass",
    outcome: "pass",
    precedence: 1,
    rules: [
      { type: "total_score", operator: "gte", value: 70 },
      { type: "category_score", category: "team", operator: "gte", value: 10 },
      { type: "category_score", category: "market", operator: "gte", value: 15 },
    ],
    reason_template:
      "Strong overall score with solid team and market potential. Recommended for investment.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seg-revise",
    funnel_id: "default",
    name: "revise",
    outcome: "revise",
    precedence: 2,
    rules: [
      { type: "total_score", operator: "gte", value: 50 },
      { type: "total_score", operator: "lte", value: 69 },
    ],
    reason_template:
      "Shows promise but needs improvement in key areas before investment consideration.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seg-reject",
    funnel_id: "default",
    name: "reject",
    outcome: "reject",
    precedence: 3,
    rules: [{ type: "total_score", operator: "lt", value: 50 }],
    reason_template:
      "Does not meet minimum criteria for investment at this time.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
