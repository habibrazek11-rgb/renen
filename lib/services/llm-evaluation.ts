import type { ExtractedFields } from "@/lib/types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are an expert investment analyst evaluating startup ideas for feasibility and investment potential.

Your task is to analyze startup submissions and extract structured information. You must output ONLY valid JSON following the exact schema provided.

Extract the following information:
1. Problem statement and severity (low/medium/high)
2. Solution description and differentiation
3. Market analysis (customer, TAM, competition)
4. Traction signals and metrics
5. Team background and gaps
6. Financial model and unit economics
7. Risk flags (regulatory/execution/market/tech)
8. Score suggestions for each category
9. Confidence level (0-1)
10. Missing information questions

Be critical but fair. Look for:
- Clear problem-solution fit
- Viable business model
- Realistic market opportunity
- Capable team
- Evidence of traction
- Financial sustainability

Output only JSON. No markdown, no explanation.`;

export interface LLMEvaluationRequest {
  idea_text: string;
  assessment_answers?: Record<string, unknown>;
  uploaded_files_content?: string[];
}

export async function evaluateWithLLM(
  request: LLMEvaluationRequest
): Promise<ExtractedFields> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // Construct user message
  let userMessage = `Analyze this startup idea and extract structured information:\n\n${request.idea_text}`;

  if (request.assessment_answers) {
    userMessage += `\n\nAssessment Answers:\n${JSON.stringify(
      request.assessment_answers,
      null,
      2
    )}`;
  }

  if (request.uploaded_files_content && request.uploaded_files_content.length > 0) {
    userMessage += `\n\nAdditional Documents:\n${request.uploaded_files_content.join(
      "\n\n---\n\n"
    )}`;
  }

  // Define the expected JSON schema
  const schema = {
    idea_summary: "string",
    problem: {
      statement: "string",
      severity: "low | medium | high",
    },
    solution: {
      what: "string",
      differentiation: "string",
    },
    market: {
      customer: "string",
      tam_note: "string",
      competition: "string",
    },
    traction: {
      signals: ["string"],
      metrics: ["string"],
    },
    team: {
      background: "string",
      gaps: ["string"],
    },
    financials: {
      model: "string",
      unit_economics_note: "string",
    },
    risks: [
      {
        type: "regulatory | execution | market | tech",
        detail: "string",
      },
    ],
    score_suggestions: {
      market: "number (0-25)",
      product: "number (0-25)",
      traction: "number (0-20)",
      team: "number (0-15)",
      financials: "number (0-15)",
    },
    confidence: "number (0-1)",
    missing_info_questions: ["string"],
  };

  userMessage += `\n\nOutput JSON matching this schema:\n${JSON.stringify(
    schema,
    null,
    2
  )}`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from OpenAI API");
    }

    // Parse and validate the JSON response
    const extractedFields: ExtractedFields = JSON.parse(content);

    // Validate required fields
    if (
      !extractedFields.idea_summary ||
      !extractedFields.problem ||
      !extractedFields.solution ||
      !extractedFields.score_suggestions
    ) {
      throw new Error("Invalid response structure from LLM");
    }

    return extractedFields;
  } catch (error) {
    console.error("LLM Evaluation Error:", error);
    throw error;
  }
}

// Mock evaluation for testing without API key
export function mockEvaluateWithLLM(): ExtractedFields {
  return {
    idea_summary: "AI-powered solution for the described problem",
    problem: {
      statement: "Extracted problem from submission",
      severity: "medium",
    },
    solution: {
      what: "Proposed solution approach",
      differentiation: "Unique value proposition",
    },
    market: {
      customer: "Target customer segment",
      tam_note: "Market size estimate",
      competition: "Competitive landscape",
    },
    traction: {
      signals: ["Early indicator 1", "Early indicator 2"],
      metrics: ["Metric 1", "Metric 2"],
    },
    team: {
      background: "Team experience and skills",
      gaps: ["Gap 1", "Gap 2"],
    },
    financials: {
      model: "Business model",
      unit_economics_note: "Unit economics summary",
    },
    risks: [
      {
        type: "market",
        detail: "Market-related risk",
      },
    ],
    score_suggestions: {
      market: 15,
      product: 18,
      traction: 8,
      team: 10,
      financials: 8,
    },
    confidence: 0.7,
    missing_info_questions: ["Question 1?", "Question 2?"],
  };
}
