import type { EvaluationSnapshot, Submission, ExtractedFields } from "@/lib/types";
import {
  evaluateWithLLM,
  mockEvaluateWithLLM,
  type LLMEvaluationRequest,
} from "./llm-evaluation";
import {
  calculateScores,
  applySegmentRouting,
  DEFAULT_SCORING_MODEL,
  DEFAULT_SEGMENTS,
} from "./scoring-engine";

export interface EvaluationRequest {
  submission: Submission;
  assessment_answers?: Record<string, unknown>;
  uploaded_files_content?: string[];
  use_mock?: boolean; // For testing without API key
}

export interface EvaluationResult {
  snapshot: Omit<EvaluationSnapshot, "id" | "created_at">;
  success: boolean;
  error?: string;
}

/**
 * Main evaluation orchestrator
 * Coordinates LLM analysis, scoring, and segment routing
 */
export async function evaluateSubmission(
  request: EvaluationRequest
): Promise<EvaluationResult> {
  try {
    // Step 1: LLM Evaluation - Extract structured fields
    console.log("Step 1: Extracting structured fields with LLM...");

    const llmRequest: LLMEvaluationRequest = {
      idea_text: request.submission.idea_text,
      assessment_answers: request.assessment_answers,
      uploaded_files_content: request.uploaded_files_content,
    };

    const extractedFields = request.use_mock
      ? mockEvaluateWithLLM()
      : await evaluateWithLLM(llmRequest);

    console.log("✓ LLM extraction complete");

    // Step 2: Deterministic Scoring
    console.log("Step 2: Calculating deterministic scores...");

    const scoreResult = calculateScores(extractedFields, DEFAULT_SCORING_MODEL);

    console.log("✓ Scoring complete:", scoreResult);

    // Step 3: Segment Routing
    console.log("Step 3: Applying segment routing rules...");

    const segmentResult = applySegmentRouting(scoreResult, DEFAULT_SEGMENTS);

    console.log("✓ Segment routing complete:", segmentResult);

    // Step 4: Create Evaluation Snapshot
    const snapshot: Omit<EvaluationSnapshot, "id" | "created_at"> = {
      submission_id: request.submission.id,
      scoring_model_id: DEFAULT_SCORING_MODEL.id,
      extracted_fields: extractedFields,
      category_scores: scoreResult.category_scores,
      total_score: scoreResult.total_score,
      tier: scoreResult.tier,
      segment_id: segmentResult.segment_id,
      segment_name: segmentResult.segment_name,
      segment_outcome: segmentResult.segment_outcome,
      decision_reason: segmentResult.decision_reason,
      llm_confidence: extractedFields.confidence,
      risk_flags: extractedFields.risks || null,
      missing_info_questions: extractedFields.missing_info_questions || null,
    };

    return {
      snapshot,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred during evaluation";
    console.error("Evaluation Error:", error);
    return {
      snapshot: {} as Omit<EvaluationSnapshot, "id" | "created_at">,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Batch evaluation for multiple submissions
 */
export async function evaluateSubmissionBatch(
  requests: EvaluationRequest[]
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];

  for (const request of requests) {
    const result = await evaluateSubmission(request);
    results.push(result);

    // Add delay to avoid rate limiting
    if (!request.use_mock) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Re-evaluate an existing submission with updated rules
 */
export async function reevaluateSubmission(
  submission: Submission,
  existingExtractedFields: ExtractedFields
): Promise<EvaluationResult> {
  try {
    // Skip LLM, just re-run scoring and routing
    const scoreResult = calculateScores(
      existingExtractedFields,
      DEFAULT_SCORING_MODEL
    );

    const segmentResult = applySegmentRouting(scoreResult, DEFAULT_SEGMENTS);

    const snapshot: Omit<EvaluationSnapshot, "id" | "created_at"> = {
      submission_id: submission.id,
      scoring_model_id: DEFAULT_SCORING_MODEL.id,
      extracted_fields: existingExtractedFields,
      category_scores: scoreResult.category_scores,
      total_score: scoreResult.total_score,
      tier: scoreResult.tier,
      segment_id: segmentResult.segment_id,
      segment_name: segmentResult.segment_name,
      segment_outcome: segmentResult.segment_outcome,
      decision_reason: segmentResult.decision_reason,
      llm_confidence: existingExtractedFields.confidence,
      risk_flags: existingExtractedFields.risks || null,
      missing_info_questions: existingExtractedFields.missing_info_questions || null,
    };

    return {
      snapshot,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      snapshot: {} as Omit<EvaluationSnapshot, "id" | "created_at">,
      success: false,
      error: errorMessage,
    };
  }
}
