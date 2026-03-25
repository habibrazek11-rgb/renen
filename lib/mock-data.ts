"use client";

import { EvaluationSnapshot, SubmissionWithDetails } from "@/lib/types";

const SUBMISSIONS_KEY = "renen_mock_submissions";

// Initial seed data
const SEED_SUBMISSIONS: SubmissionWithDetails[] = [
  {
    id: "sub-1",
    funnel_id: "f1",
    workspace_id: "w1",
    submitter_email: "company-a@test.com",
    submitter_name: "John Smith",
    idea_text: "AI-powered customer support platform for SMBs",
    file_urls: null,
    status: "evaluated",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    evaluation: {
      id: "eval-1",
      submission_id: "sub-1",
      scoring_model_id: "sm1",
      extracted_fields: {
        idea_summary: "AI customer support for SMBs",
        problem: { statement: "SMBs struggle with 24/7 support", severity: "high" },
        solution: { what: "AI chatbot", differentiation: "SMB-focused UI" },
        market: { customer: "SMBs 10-200 employees", tam_note: "$2B", competition: "Zendesk" },
        traction: { signals: ["10 pilots"], metrics: ["$5K MRR"] },
        team: { background: "Ex-Salesforce engineers", gaps: ["Sales leader"] },
        financials: { model: "SaaS", unit_economics_note: "60% GM" },
        risks: [{ type: "market", detail: "Competitive market" }],
        score_suggestions: { market: 18, product: 20, traction: 10, team: 12, financials: 9 },
        confidence: 0.75,
        missing_info_questions: ["What is your customer acquisition strategy?"],
      },
      category_scores: { market: 18, product: 20, traction: 10, team: 12, financials: 9 },
      total_score: 69,
      tier: "Revise",
      segment_id: "s2",
      segment_name: "revise",
      segment_outcome: "revise",
      decision_reason: "Strong product but needs more traction before investment.",
      llm_confidence: 0.75,
      risk_flags: [{ type: "market", detail: "Competitive market" }],
      missing_info_questions: ["What is your customer acquisition strategy?"],
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  },
  {
    id: "sub-2",
    funnel_id: "f1",
    workspace_id: "w1",
    submitter_email: "company-b@test.com",
    submitter_name: "Jane Doe",
    idea_text: "Sustainable packaging for e-commerce using mycelium based materials.",
    file_urls: null,
    status: "approved",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    evaluation: {
      id: "eval-2",
      submission_id: "sub-2",
      scoring_model_id: "sm1",
      extracted_fields: {
        idea_summary: "Sustainable packaging for e-commerce",
        problem: { statement: "E-commerce waste problem", severity: "high" },
        solution: { what: "Biodegradable packaging", differentiation: "Custom sizing" },
        market: { customer: "E-commerce companies", tam_note: "$10B", competition: "EcoEnclose" },
        traction: { signals: ["3 enterprise pilots"], metrics: ["$50K MRR"] },
        team: { background: "Materials science PhDs", gaps: [] },
        financials: { model: "B2B SaaS + Usage", unit_economics_note: "70% GM" },
        risks: [{ type: "execution", detail: "Manufacturing scale-up" }],
        score_suggestions: { market: 22, product: 22, traction: 15, team: 14, financials: 12 },
        confidence: 0.85,
        missing_info_questions: [],
      },
      category_scores: { market: 22, product: 22, traction: 15, team: 14, financials: 12 },
      total_score: 85,
      tier: "Pass",
      segment_id: "s1",
      segment_name: "pass",
      segment_outcome: "pass",
      decision_reason: "Exceptional team and clear market need with early traction.",
      llm_confidence: 0.85,
      risk_flags: [{ type: "execution", detail: "Manufacturing scale-up" }],
      missing_info_questions: [],
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  }
];

export function getMockSubmissions(): SubmissionWithDetails[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(SUBMISSIONS_KEY);
  if (!stored) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(SEED_SUBMISSIONS));
    return SEED_SUBMISSIONS;
  }
  return JSON.parse(stored);
}

export function saveMockSubmission(submission: SubmissionWithDetails) {
  const submissions = getMockSubmissions();
  const updated = [submission, ...submissions];
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
}

export function updateMockSubmission(id: string, updates: Partial<SubmissionWithDetails>) {
  const submissions = getMockSubmissions();
  const updated = submissions.map(sub => sub.id === id ? { ...sub, ...updates } : sub);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
}

export function getMockSubmissionById(id: string): SubmissionWithDetails | undefined {
  const submissions = getMockSubmissions();
  return submissions.find(sub => sub.id === id);
}
