// Segment Router — deterministic precedence-based segment assignment
// Precedence: answer_match > category_threshold > total_score
// Tie-breaker: segment.priority (lower = higher priority)

import type { ScoringResult } from './scoring-engine';

export interface SegmentRuleData {
  id: string;
  type: 'total_score' | 'category_threshold' | 'answer_match';
  category: string | null;
  operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  value: number;
  questionId: string | null;
  optionId: string | null;
}

export interface SegmentData {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  reasonTemplate: string | null;
  rules: SegmentRuleData[];
}

export interface AnswerValue {
  questionId: string;
  value: string | string[] | number;
}

export interface SegmentAssignment {
  segment: SegmentData;
  matchedRules: string[];
  reason: string;
}

function compare(actual: number, operator: string, threshold: number): boolean {
  switch (operator) {
    case 'gte': return actual >= threshold;
    case 'lte': return actual <= threshold;
    case 'eq':  return actual === threshold;
    case 'gt':  return actual > threshold;
    case 'lt':  return actual < threshold;
    default:    return false;
  }
}

function rulesMatch(
  rules: SegmentRuleData[],
  scores: ScoringResult,
  answers: AnswerValue[]
): { matched: boolean; matchedRules: string[] } {
  const matchedRules: string[] = [];

  for (const rule of rules) {
    let ruleMatched = false;

    if (rule.type === 'total_score') {
      ruleMatched = compare(scores.totalScore, rule.operator, rule.value);
      if (ruleMatched) {
        matchedRules.push(`Total score ${rule.operator} ${rule.value} (actual: ${scores.totalScore})`);
      }
    } else if (rule.type === 'category_threshold' && rule.category) {
      const catScore = scores.categoryScores[rule.category] ?? 0;
      ruleMatched = compare(catScore, rule.operator, rule.value);
      if (ruleMatched) {
        matchedRules.push(`${rule.category} score ${rule.operator} ${rule.value} (actual: ${catScore})`);
      }
    } else if (rule.type === 'answer_match' && rule.questionId && rule.optionId) {
      const answer = answers.find((a) => a.questionId === rule.questionId);
      if (answer) {
        const val = answer.value;
        if (typeof val === 'string') {
          ruleMatched = val === rule.optionId;
        } else if (Array.isArray(val)) {
          ruleMatched = (val as string[]).includes(rule.optionId);
        }
        if (ruleMatched) {
          matchedRules.push(`Answer match on question ${rule.questionId}`);
        }
      }
    }

    // AND logic — all rules must match
    if (!ruleMatched) {
      return { matched: false, matchedRules: [] };
    }
  }

  return { matched: rules.length > 0, matchedRules };
}

const PRECEDENCE: Record<string, number> = {
  answer_match: 1,
  category_threshold: 2,
  total_score: 3,
};

function getSegmentPrecedence(segment: SegmentData): number {
  if (segment.rules.length === 0) return 99;
  const types = segment.rules.map((r) => PRECEDENCE[r.type] ?? 99);
  return Math.min(...types);
}

export function assignSegment(
  scores: ScoringResult,
  answers: AnswerValue[],
  segments: SegmentData[]
): SegmentAssignment | null {
  const candidates: Array<{
    segment: SegmentData;
    matchedRules: string[];
    precedence: number;
  }> = [];

  for (const segment of segments) {
    const { matched, matchedRules } = rulesMatch(segment.rules, scores, answers);
    if (matched) {
      candidates.push({
        segment,
        matchedRules,
        precedence: getSegmentPrecedence(segment),
      });
    }
  }

  if (candidates.length === 0) return null;

  // Sort: lower precedence number first, then lower priority number
  candidates.sort((a, b) => {
    if (a.precedence !== b.precedence) return a.precedence - b.precedence;
    return a.segment.priority - b.segment.priority;
  });

  const winner = candidates[0];
  const reason =
    winner.segment.reasonTemplate ??
    `Matched segment "${winner.segment.name}" based on: ${winner.matchedRules.join('; ')}`;

  return {
    segment: winner.segment,
    matchedRules: winner.matchedRules,
    reason,
  };
}
