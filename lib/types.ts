// RENEN TypeScript Types
// Matches database schema

export type UserRole = 'owner' | 'admin' | 'reviewer';

export type SubmissionStatus = 
  | 'submitted' 
  | 'evaluated' 
  | 'reviewed' 
  | 'approved' 
  | 'rejected';

export type SegmentName = 'pass' | 'revise' | 'reject';

export type QuestionType = 
  | 'single_choice' 
  | 'multi_choice' 
  | 'scale' 
  | 'short_text' 
  | 'long_text'
  | 'email';

// Database Tables

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Funnel {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[]; // For single/multi choice
  scale_min?: number; // For scale type
  scale_max?: number;
  scale_labels?: { min: string; max: string };
}

export interface Assessment {
  id: string;
  funnel_id: string;
  name: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface ScoringCategory {
  name: string;
  max_score: number;
  weight: number;
}

export interface ScoreTier {
  name: string;
  min_score: number;
  max_score: number;
  label: string;
}

export interface ScoringModel {
  id: string;
  funnel_id: string;
  name: string;
  categories: ScoringCategory[];
  tiers: ScoreTier[];
  created_at: string;
  updated_at: string;
}

export interface SegmentRule {
  type: 'total_score' | 'category_score';
  category?: string;
  operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  value: number;
}

export interface Segment {
  id: string;
  funnel_id: string;
  name: string;
  outcome: string;
  rules: SegmentRule[];
  precedence: number;
  reason_template: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  funnel_id: string;
  workspace_id: string;
  submitter_email: string | null;
  submitter_name: string | null;
  idea_text: string;
  file_urls: string[] | null;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
}

export interface SubmissionAnswers {
  id: string;
  submission_id: string;
  assessment_id: string;
  answers: Record<string, unknown>;
  created_at: string;
}

// LLM Extracted Fields

export interface ProblemField {
  statement: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SolutionField {
  what: string;
  differentiation: string;
}

export interface MarketField {
  customer: string;
  tam_note: string;
  competition: string;
}

export interface TractionField {
  signals: string[];
  metrics: string[];
}

export interface TeamField {
  background: string;
  gaps: string[];
}

export interface FinancialsField {
  model: string;
  unit_economics_note: string;
}

export interface RiskFlag {
  type: 'regulatory' | 'execution' | 'market' | 'tech';
  detail: string;
}

export interface ExtractedFields {
  idea_summary: string;
  problem: ProblemField;
  solution: SolutionField;
  market: MarketField;
  traction: TractionField;
  team: TeamField;
  financials: FinancialsField;
  risks: RiskFlag[];
  score_suggestions: Record<string, number>;
  confidence: number;
  missing_info_questions: string[];
}

export interface EvaluationSnapshot {
  id: string;
  submission_id: string;
  scoring_model_id: string;
  extracted_fields: ExtractedFields;
  category_scores: Record<string, number>;
  total_score: number;
  tier: string;
  segment_id: string | null;
  segment_name: string;
  segment_outcome: string;
  decision_reason: string;
  llm_confidence: number | null;
  risk_flags: RiskFlag[] | null;
  missing_info_questions: string[] | null;
  created_at: string;
}

export interface Report {
  id: string;
  submission_id: string;
  evaluation_snapshot_id: string;
  pdf_url: string | null;
  version: number;
  generated_by: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  workspace_id: string | null;
  user_id: string | null;
  event_type: string;
  event_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// Composite types for UI

export interface SubmissionWithDetails extends Submission {
  evaluation?: EvaluationSnapshot;
  answers?: SubmissionAnswers;
}
