-- RENEN Database Schema
-- Investment Evaluation Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace members table (RBAC)
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'reviewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Funnel (evaluation template)
CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment (questionnaire definition)
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  questions JSONB NOT NULL, -- Array of question objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scoring model
CREATE TABLE scoring_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  categories JSONB NOT NULL, -- {name, max_score, weight}
  tiers JSONB NOT NULL, -- {name, min_score, max_score, label}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Segments (pass/revise/reject rules)
CREATE TABLE segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL, -- 'pass', 'revise', 'reject'
  outcome VARCHAR(50) NOT NULL,
  rules JSONB NOT NULL, -- AND conditions, category minimums
  precedence INT NOT NULL,
  reason_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funnel_id UUID NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  submitter_email VARCHAR(255),
  submitter_name VARCHAR(255),
  idea_text TEXT NOT NULL,
  file_urls JSONB, -- Array of uploaded file URLs
  status VARCHAR(50) DEFAULT 'submitted', -- submitted, evaluated, reviewed, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submission answers
CREATE TABLE submission_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id),
  answers JSONB NOT NULL, -- {question_id: answer}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluation snapshot (immutable)
CREATE TABLE evaluation_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  scoring_model_id UUID NOT NULL REFERENCES scoring_models(id),
  
  -- Extracted fields from LLM
  extracted_fields JSONB NOT NULL,
  
  -- Score breakdown
  category_scores JSONB NOT NULL, -- {category_name: score}
  total_score INT NOT NULL,
  tier VARCHAR(50) NOT NULL,
  
  -- Segment decision
  segment_id UUID REFERENCES segments(id),
  segment_name VARCHAR(50) NOT NULL,
  segment_outcome VARCHAR(50) NOT NULL,
  decision_reason TEXT NOT NULL,
  
  -- LLM metadata
  llm_confidence DECIMAL(3,2),
  risk_flags JSONB,
  missing_info_questions JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  evaluation_snapshot_id UUID NOT NULL REFERENCES evaluation_snapshots(id),
  pdf_url TEXT,
  version INT DEFAULT 1,
  generated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events (analytics)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(100) NOT NULL, -- page.viewed, assessment.completed, pdf.generated, etc.
  event_data JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_funnels_workspace ON funnels(workspace_id);
CREATE INDEX idx_submissions_funnel ON submissions(funnel_id);
CREATE INDEX idx_submissions_workspace ON submissions(workspace_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_evaluation_snapshots_submission ON evaluation_snapshots(submission_id);
CREATE INDEX idx_events_workspace ON events(workspace_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);
