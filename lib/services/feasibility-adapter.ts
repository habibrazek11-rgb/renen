import type { EvaluationSnapshot, FeasibilityResponse } from "@/lib/types";

/**
 * Convert detailed EvaluationSnapshot to simplified FeasibilityResponse
 */
export function convertToFeasibilityResponse(
  snapshot: EvaluationSnapshot
): FeasibilityResponse {
  // Determine status from segment outcome
  const status =
    snapshot.segment_outcome === "pass" ? "feasible" : "not_feasible";

  // Derive risk level from risk flags and problem severity
  const risk_level = deriveRiskLevel(snapshot);

  // Calculate market potential from market category score
  const market_potential = deriveMarketPotential(snapshot);

  // Extract strengths from high-scoring categories
  const strengths = extractStrengths(snapshot);

  // Extract weaknesses from low-scoring categories and risk flags
  const weaknesses = extractWeaknesses(snapshot);

  // Generate recommendations
  const recommendations = generateRecommendations(snapshot);

  return {
    status,
    risk_level,
    market_potential,
    strengths,
    weaknesses,
    recommendations,
  };
}

/**
 * Derive risk level from risk flags and problem severity
 */
function deriveRiskLevel(
  snapshot: EvaluationSnapshot
): "low" | "medium" | "high" {
  const riskCount = snapshot.risk_flags?.length || 0;
  const problemSeverity = snapshot.extracted_fields.problem.severity;

  // High risk if multiple risk flags or high severity problem
  if (riskCount >= 3 || problemSeverity === "high") {
    return "high";
  }

  // Medium risk if some risk flags or medium severity
  if (riskCount >= 1 || problemSeverity === "medium") {
    return "medium";
  }

  return "low";
}

/**
 * Derive market potential from market category score
 */
function deriveMarketPotential(
  snapshot: EvaluationSnapshot
): "low" | "medium" | "high" {
  const marketScore = snapshot.category_scores.market || 0;
  const maxMarketScore = 25; // From DEFAULT_SCORING_MODEL

  const percentage = (marketScore / maxMarketScore) * 100;

  if (percentage >= 70) return "high";
  if (percentage >= 40) return "medium";
  return "low";
}

/**
 * Extract strengths from high-scoring categories
 */
function extractStrengths(snapshot: EvaluationSnapshot): string[] {
  const strengths: string[] = [];
  const scores = snapshot.category_scores;

  // Market strength
  if (scores.market >= 18) {
    strengths.push(
      `Strong market opportunity: ${snapshot.extracted_fields.market.customer}`
    );
  }

  // Product strength
  if (scores.product >= 18) {
    strengths.push(
      `Compelling product differentiation: ${snapshot.extracted_fields.solution.differentiation}`
    );
  }

  // Traction strength
  if (scores.traction >= 14) {
    const signals = snapshot.extracted_fields.traction.signals;
    if (signals.length > 0) {
      strengths.push(`Proven traction: ${signals.join(", ")}`);
    }
  }

  // Team strength
  if (scores.team >= 11) {
    strengths.push(
      `Experienced team: ${snapshot.extracted_fields.team.background}`
    );
  }

  // Financials strength
  if (scores.financials >= 11) {
    strengths.push(
      `Viable business model: ${snapshot.extracted_fields.financials.model}`
    );
  }

  // If no specific strengths, add general positive
  if (strengths.length === 0 && snapshot.total_score >= 50) {
    strengths.push("Meets minimum viability criteria");
  }

  return strengths;
}

/**
 * Extract weaknesses from low-scoring categories and risk flags
 */
function extractWeaknesses(snapshot: EvaluationSnapshot): string[] {
  const weaknesses: string[] = [];
  const scores = snapshot.category_scores;

  // Market weakness
  if (scores.market < 15) {
    weaknesses.push("Limited market validation or unclear target customer");
  }

  // Product weakness
  if (scores.product < 15) {
    weaknesses.push("Weak product differentiation or unclear value proposition");
  }

  // Traction weakness
  if (scores.traction < 10) {
    weaknesses.push("Insufficient traction or early-stage metrics");
  }

  // Team weakness
  if (scores.team < 8) {
    const gaps = snapshot.extracted_fields.team.gaps;
    if (gaps.length > 0) {
      weaknesses.push(`Team gaps: ${gaps.join(", ")}`);
    } else {
      weaknesses.push("Team experience concerns");
    }
  }

  // Financials weakness
  if (scores.financials < 8) {
    weaknesses.push("Unclear business model or unit economics");
  }

  // Add risk flags as weaknesses
  if (snapshot.risk_flags && snapshot.risk_flags.length > 0) {
    snapshot.risk_flags.forEach((risk) => {
      weaknesses.push(`${risk.type} risk: ${risk.detail}`);
    });
  }

  return weaknesses;
}

/**
 * Generate recommendations from missing info and decision reason
 */
function generateRecommendations(snapshot: EvaluationSnapshot): string[] {
  const recommendations: string[] = [];

  // Add missing info questions as recommendations
  if (
    snapshot.missing_info_questions &&
    snapshot.missing_info_questions.length > 0
  ) {
    snapshot.missing_info_questions.forEach((question) => {
      recommendations.push(`Address: ${question}`);
    });
  }

  // Add segment-specific recommendations
  if (snapshot.segment_outcome === "revise") {
    recommendations.push(
      "Strengthen key areas identified in weaknesses before resubmission"
    );
    recommendations.push(
      "Provide additional market validation and traction metrics"
    );
  }

  if (snapshot.segment_outcome === "reject") {
    recommendations.push(
      "Fundamental improvements needed in core business model"
    );
    recommendations.push("Consider pivoting or refining the core value proposition");
  }

  if (snapshot.segment_outcome === "pass") {
    recommendations.push("Proceed with due diligence and detailed evaluation");
    recommendations.push("Prepare comprehensive business plan and financial projections");
  }

  // Add confidence-based recommendation
  if (snapshot.llm_confidence && snapshot.llm_confidence < 0.7) {
    recommendations.push(
      "Provide more detailed information to improve evaluation accuracy"
    );
  }

  return recommendations;
}
