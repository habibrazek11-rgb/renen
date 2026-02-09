"use server";

import { evaluateSubmission } from "@/lib/services/evaluation-orchestrator";
import type { Submission } from "@/lib/types";

/**
 * Server action to evaluate a submission
 * Can be called from client components
 */
export async function evaluateSubmissionAction(submission: Submission) {
  try {
    const result = await evaluateSubmission({
      submission,
      use_mock: !process.env.OPENAI_API_KEY, // Use mock if no API key
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // In production, you would save to database here
    // await supabaseAdmin.from('evaluation_snapshots').insert(result.snapshot)

    return {
      success: true,
      data: result.snapshot,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Evaluation action error:", error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Server action to fetch submissions
 */
export async function getSubmissions() {
  try {
    // In production, fetch from database
    // const { data, error } = await supabase
    //   .from('submissions')
    //   .select('*, evaluation_snapshots(*)')

    // For now, return empty array
    return {
      success: true,
      data: [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
