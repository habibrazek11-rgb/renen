/**
 * Static in-memory database for demo mode.
 * All data lives in module-level arrays — no PostgreSQL required.
 * Data persists for the lifetime of the server process.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StaticFunnel {
  id: string; workspaceId: string; projectId: string | null;
  name: string; slug: string; description: string | null;
  isActive: boolean; createdBy: string | null;
  createdAt: string; updatedAt: string;
}

export interface StaticFunnelVersion {
  id: string; funnelId: string; version: number;
  isDraft: boolean; isPublished: boolean; publishedAt: string | null;
  landingPage: Record<string, unknown> | null;
  brandTheme: Record<string, unknown> | null;
  createdAt: string; updatedAt: string;
}

export interface StaticAssessment {
  id: string; funnelVersionId: string; name: string;
  createdAt: string; updatedAt: string;
}

export interface StaticQuestion {
  id: string; assessmentId: string; order: number;
  type: 'single_choice' | 'multi_choice' | 'scale' | 'short_text' | 'email';
  text: string; required: boolean;
  scaleMin?: number | null; scaleMax?: number | null;
  scaleMinLabel?: string | null; scaleMaxLabel?: string | null;
  createdAt: string;
}

export interface StaticAnswerOption {
  id: string; questionId: string; text: string;
  order: number; points: number; categoryId: string | null;
}

export interface StaticScoreCategory {
  id: string; assessmentId: string; name: string; maxScore: number; weight: number;
}

export interface StaticScoreTier {
  id: string; assessmentId: string; name: string; label: string; minScore: number; maxScore: number;
}

export interface StaticSegment {
  id: string; funnelId: string; name: string;
  description: string | null; priority: number; reasonTemplate: string | null;
  createdAt: string; updatedAt: string;
}

export interface StaticSegmentRule {
  id: string; segmentId: string;
  type: 'total_score' | 'category_threshold' | 'answer_match';
  category: string | null; operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  value: number; questionId: string | null; optionId: string | null;
}

export interface StaticResultPage {
  id: string; segmentId: string; headline: string; body: string;
  showScore: boolean; showCategories: boolean;
  createdAt: string; updatedAt: string;
}

export interface StaticCTAConfig {
  id: string; resultPageId: string;
  type: 'book' | 'buy' | 'whatsapp' | 'nurture' | 'link';
  label: string; url: string | null; abVariantLabel: string | null;
}

export interface StaticLead {
  id: string; workspaceId: string; funnelId: string;
  segmentId: string | null; email: string | null; name: string | null;
  anonymousId: string | null; abVariant: string | null;
  createdAt: string; updatedAt: string;
}

export interface StaticSubmission {
  id: string; leadId: string; funnelVersionId: string;
  completedAt: string | null; createdAt: string;
}

export interface StaticSubmissionAnswer {
  id: string; submissionId: string; questionId: string;
  value: string | string[] | number; createdAt: string;
}

export interface StaticScoringSnapshot {
  id: string; submissionId: string; totalScore: number;
  categoryScores: Record<string, number>; tier: string;
  segmentId: string | null; segmentName: string | null;
  matchedRules: unknown[]; decisionReason: string | null; createdAt: string;
}

export interface StaticEventLog {
  id: string; workspaceId: string | null; funnelId: string | null;
  leadId: string | null; submissionId: string | null;
  anonymousId: string | null; eventType: string;
  eventData: Record<string, unknown> | null; createdAt: string;
}

export interface StaticWebhookConfig {
  id: string; workspaceId: string; name: string; url: string;
  events: string[]; secret: string; maxAttempts: number; isActive: boolean;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const now = new Date().toISOString();
const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const funnels: StaticFunnel[] = [
  {
    id: 'funnel-demo-1', workspaceId: 'ws-renen-demo', projectId: 'proj-demo-1',
    name: 'Business Growth Assessment', slug: 'business-growth-assessment',
    description: 'Assess your business growth readiness and get a personalized action plan',
    isActive: true, createdBy: 'user-owner-1', createdAt: d(30), updatedAt: d(2),
  },
  {
    id: 'funnel-demo-2', workspaceId: 'ws-renen-demo', projectId: 'proj-demo-1',
    name: 'Marketing Maturity Audit', slug: 'marketing-maturity-audit',
    description: 'Discover your marketing maturity level and unlock the next stage',
    isActive: true, createdBy: 'user-owner-1', createdAt: d(15), updatedAt: d(1),
  },
];

export const funnelVersions: StaticFunnelVersion[] = [
  {
    id: 'fv-demo-1', funnelId: 'funnel-demo-1', version: 1,
    isDraft: false, isPublished: true, publishedAt: d(25),
    landingPage: {
      blocks: [
        { type: 'hero', headline: 'Discover Your Business Growth Potential', subheadline: 'Take our 5-minute assessment and get a personalized roadmap', ctaText: 'Start Free Assessment →' },
        { type: 'benefits', items: ['Identify your biggest growth opportunities', 'Get a personalized action plan', 'Benchmark against industry standards'] },
        { type: 'proof', stats: [{ value: '2,400+', label: 'Assessments completed' }, { value: '94%', label: 'Found it valuable' }, { value: '5 min', label: 'Average completion time' }] },
      ],
    },
    brandTheme: { primaryColor: '#ff36a2', secondaryColor: '#ff6b9d', fontFamily: 'system-ui', logoUrl: null },
    createdAt: d(30), updatedAt: d(25),
  },
  {
    id: 'fv-demo-2', funnelId: 'funnel-demo-2', version: 1,
    isDraft: false, isPublished: true, publishedAt: d(10),
    landingPage: { blocks: [{ type: 'hero', headline: 'How Mature Is Your Marketing?', subheadline: 'Benchmark yourself and get actionable next steps', ctaText: 'Take the Audit →' }] },
    brandTheme: { primaryColor: '#7c3aed', secondaryColor: '#a78bfa', fontFamily: 'system-ui', logoUrl: null },
    createdAt: d(15), updatedAt: d(10),
  },
];

export const assessments: StaticAssessment[] = [
  { id: 'assess-demo-1', funnelVersionId: 'fv-demo-1', name: 'Business Growth Readiness Assessment', createdAt: d(30), updatedAt: d(30) },
];

export const questions: StaticQuestion[] = [
  { id: 'q-1', assessmentId: 'assess-demo-1', order: 1, type: 'single_choice', text: 'How clearly defined is your business strategy?', required: true, createdAt: d(30) },
  { id: 'q-2', assessmentId: 'assess-demo-1', order: 2, type: 'single_choice', text: 'How would you rate your operational efficiency?', required: true, createdAt: d(30) },
  { id: 'q-3', assessmentId: 'assess-demo-1', order: 3, type: 'multi_choice', text: 'Which marketing channels are you actively using?', required: true, createdAt: d(30) },
  { id: 'q-4', assessmentId: 'assess-demo-1', order: 4, type: 'scale', text: 'How confident are you in your financial runway? (1 = very worried, 10 = very secure)', required: true, scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Very worried', scaleMaxLabel: 'Very secure', createdAt: d(30) },
  { id: 'q-5', assessmentId: 'assess-demo-1', order: 5, type: 'email', text: 'Where should we send your personalized growth report?', required: true, createdAt: d(30) },
];

export const answerOptions: StaticAnswerOption[] = [
  { id: 'q1-a', questionId: 'q-1', text: 'No clear strategy yet', order: 1, points: 0, categoryId: 'cat-strategy' },
  { id: 'q1-b', questionId: 'q-1', text: 'Basic direction but not documented', order: 2, points: 10, categoryId: 'cat-strategy' },
  { id: 'q1-c', questionId: 'q-1', text: 'Documented strategy with goals', order: 3, points: 20, categoryId: 'cat-strategy' },
  { id: 'q1-d', questionId: 'q-1', text: 'Clear strategy with KPIs and reviews', order: 4, points: 30, categoryId: 'cat-strategy' },
  { id: 'q2-a', questionId: 'q-2', text: 'Very inefficient, lots of manual work', order: 1, points: 0, categoryId: 'cat-operations' },
  { id: 'q2-b', questionId: 'q-2', text: 'Some processes documented', order: 2, points: 8, categoryId: 'cat-operations' },
  { id: 'q2-c', questionId: 'q-2', text: 'Most processes automated', order: 3, points: 17, categoryId: 'cat-operations' },
  { id: 'q2-d', questionId: 'q-2', text: 'Highly optimized with continuous improvement', order: 4, points: 25, categoryId: 'cat-operations' },
  { id: 'q3-a', questionId: 'q-3', text: 'Social media', order: 1, points: 5, categoryId: 'cat-marketing' },
  { id: 'q3-b', questionId: 'q-3', text: 'Email marketing', order: 2, points: 7, categoryId: 'cat-marketing' },
  { id: 'q3-c', questionId: 'q-3', text: 'SEO / Content', order: 3, points: 8, categoryId: 'cat-marketing' },
  { id: 'q3-d', questionId: 'q-3', text: 'Paid advertising', order: 4, points: 5, categoryId: 'cat-marketing' },
];

export const scoreCategories: StaticScoreCategory[] = [
  { id: 'cat-strategy', assessmentId: 'assess-demo-1', name: 'Strategy', maxScore: 30, weight: 1.0 },
  { id: 'cat-operations', assessmentId: 'assess-demo-1', name: 'Operations', maxScore: 25, weight: 1.0 },
  { id: 'cat-marketing', assessmentId: 'assess-demo-1', name: 'Marketing', maxScore: 25, weight: 1.0 },
  { id: 'cat-finance', assessmentId: 'assess-demo-1', name: 'Finance', maxScore: 20, weight: 1.0 },
];

export const scoreTiers: StaticScoreTier[] = [
  { id: 'tier-champion', assessmentId: 'assess-demo-1', name: 'Champion', label: '🏆 Champion', minScore: 80, maxScore: 100 },
  { id: 'tier-contender', assessmentId: 'assess-demo-1', name: 'Contender', label: '🚀 Contender', minScore: 50, maxScore: 79 },
  { id: 'tier-explorer', assessmentId: 'assess-demo-1', name: 'Explorer', label: '🌱 Explorer', minScore: 0, maxScore: 49 },
];

export const segments: StaticSegment[] = [
  { id: 'seg-champion', funnelId: 'funnel-demo-1', name: 'Champion', priority: 1, description: 'High-performing businesses ready to scale', reasonTemplate: "Your strong scores across strategy, operations, and marketing show you're ready to scale. Let's accelerate your growth.", createdAt: d(30), updatedAt: d(30) },
  { id: 'seg-contender', funnelId: 'funnel-demo-1', name: 'Contender', priority: 2, description: 'Strong potential with clear areas to improve', reasonTemplate: 'You have a solid foundation. With targeted improvements in a few key areas, you can reach the next level.', createdAt: d(30), updatedAt: d(30) },
  { id: 'seg-explorer', funnelId: 'funnel-demo-1', name: 'Explorer', priority: 3, description: 'Early stage businesses building their foundation', reasonTemplate: "You're in the early stages of your growth journey. Focus on building strong foundations first.", createdAt: d(30), updatedAt: d(30) },
];

export const segmentRules: StaticSegmentRule[] = [
  { id: 'rule-champ-1', segmentId: 'seg-champion', type: 'total_score', category: null, operator: 'gte', value: 70, questionId: null, optionId: null },
  { id: 'rule-cont-1', segmentId: 'seg-contender', type: 'total_score', category: null, operator: 'gte', value: 40, questionId: null, optionId: null },
  { id: 'rule-cont-2', segmentId: 'seg-contender', type: 'total_score', category: null, operator: 'lt', value: 70, questionId: null, optionId: null },
  { id: 'rule-expl-1', segmentId: 'seg-explorer', type: 'total_score', category: null, operator: 'lt', value: 40, questionId: null, optionId: null },
];

export const resultPages: StaticResultPage[] = [
  { id: 'rp-champion', segmentId: 'seg-champion', headline: "🏆 You're a Champion — Ready to Scale!", body: "Congratulations! Your assessment results show you have a well-defined strategy, efficient operations, and strong marketing. You're in the top tier of business readiness.\n\nYou're ready to accelerate growth with the right strategic partner. Let's build your scaling roadmap together.", showScore: true, showCategories: true, createdAt: d(30), updatedAt: d(30) },
  { id: 'rp-contender', segmentId: 'seg-contender', headline: "🚀 You're a Contender — Almost There!", body: "Great work! You have a solid business foundation with clear strengths. Your assessment shows specific areas where focused improvement will unlock significant growth.\n\nA strategic review session will help you identify the highest-leverage actions to take next.", showScore: true, showCategories: true, createdAt: d(30), updatedAt: d(30) },
  { id: 'rp-explorer', segmentId: 'seg-explorer', headline: "🌱 You're an Explorer — Let's Build Your Foundation!", body: "Every great business starts somewhere! Your assessment shows you're in the early stages of your growth journey. The good news: you've identified exactly where to focus first.\n\nStart with our free Business Foundation Guide to build the systems you need.", showScore: true, showCategories: true, createdAt: d(30), updatedAt: d(30) },
];

export const ctaConfigs: StaticCTAConfig[] = [
  { id: 'cta-champion', resultPageId: 'rp-champion', type: 'book', label: 'Book Your Growth Strategy Session →', url: 'https://calendly.com/renen-demo', abVariantLabel: 'Schedule Your Free Consultation →' },
  { id: 'cta-contender', resultPageId: 'rp-contender', type: 'book', label: 'Book a Free Strategy Review →', url: 'https://calendly.com/renen-demo', abVariantLabel: 'Get Your Personalized Growth Plan →' },
  { id: 'cta-explorer', resultPageId: 'rp-explorer', type: 'nurture', label: 'Get Your Free Foundation Guide →', url: 'https://renen.app/guide', abVariantLabel: 'Download the Starter Toolkit →' },
];

// ─── Mutable runtime collections (populated with demo leads/events) ───────────

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const DEMO_LEADS: StaticLead[] = [
  { id: 'lead-1', workspaceId: 'ws-renen-demo', funnelId: 'funnel-demo-1', segmentId: 'seg-champion', email: 'alice@acmecorp.com', name: 'Alice Martin', anonymousId: 'anon-1', abVariant: 'A', createdAt: d(6), updatedAt: d(6) },
  { id: 'lead-2', workspaceId: 'ws-renen-demo', funnelId: 'funnel-demo-1', segmentId: 'seg-contender', email: 'bob@startup.io', name: 'Bob Chen', anonymousId: 'anon-2', abVariant: 'B', createdAt: d(5), updatedAt: d(5) },
  { id: 'lead-3', workspaceId: 'ws-renen-demo', funnelId: 'funnel-demo-1', segmentId: 'seg-explorer', email: 'carol@newbiz.co', name: 'Carol White', anonymousId: 'anon-3', abVariant: 'A', createdAt: d(4), updatedAt: d(4) },
  { id: 'lead-4', workspaceId: 'ws-renen-demo', funnelId: 'funnel-demo-1', segmentId: 'seg-champion', email: 'david@scale.com', name: 'David Kim', anonymousId: 'anon-4', abVariant: 'A', createdAt: d(3), updatedAt: d(3) },
  { id: 'lead-5', workspaceId: 'ws-renen-demo', funnelId: 'funnel-demo-1', segmentId: 'seg-contender', email: 'emma@growth.co', name: 'Emma Patel', anonymousId: 'anon-5', abVariant: 'B', createdAt: d(2), updatedAt: d(2) },
  { id: 'lead-6', workspaceId: 'ws-renen-demo', funnelId: 'funnel-demo-2', segmentId: null, email: 'frank@market.co', name: 'Frank Lopez', anonymousId: 'anon-6', abVariant: null, createdAt: d(1), updatedAt: d(1) },
];

const DEMO_SUBMISSIONS: StaticSubmission[] = [
  { id: 'sub-1', leadId: 'lead-1', funnelVersionId: 'fv-demo-1', completedAt: d(6), createdAt: d(6) },
  { id: 'sub-2', leadId: 'lead-2', funnelVersionId: 'fv-demo-1', completedAt: d(5), createdAt: d(5) },
  { id: 'sub-3', leadId: 'lead-3', funnelVersionId: 'fv-demo-1', completedAt: d(4), createdAt: d(4) },
  { id: 'sub-4', leadId: 'lead-4', funnelVersionId: 'fv-demo-1', completedAt: d(3), createdAt: d(3) },
  { id: 'sub-5', leadId: 'lead-5', funnelVersionId: 'fv-demo-1', completedAt: d(2), createdAt: d(2) },
];

const DEMO_SNAPSHOTS: StaticScoringSnapshot[] = [
  { id: 'snap-1', submissionId: 'sub-1', totalScore: 82, categoryScores: { Strategy: 28, Operations: 22, Marketing: 20, Finance: 12 }, tier: 'Champion', segmentId: 'seg-champion', segmentName: 'Champion', matchedRules: [], decisionReason: "Your strong scores across strategy, operations, and marketing show you're ready to scale.", createdAt: d(6) },
  { id: 'snap-2', submissionId: 'sub-2', totalScore: 55, categoryScores: { Strategy: 20, Operations: 17, Marketing: 13, Finance: 5 }, tier: 'Contender', segmentId: 'seg-contender', segmentName: 'Contender', matchedRules: [], decisionReason: 'You have a solid foundation. With targeted improvements in a few key areas, you can reach the next level.', createdAt: d(5) },
  { id: 'snap-3', submissionId: 'sub-3', totalScore: 28, categoryScores: { Strategy: 10, Operations: 8, Marketing: 5, Finance: 5 }, tier: 'Explorer', segmentId: 'seg-explorer', segmentName: 'Explorer', matchedRules: [], decisionReason: "You're in the early stages of your growth journey. Focus on building strong foundations first.", createdAt: d(4) },
  { id: 'snap-4', submissionId: 'sub-4', totalScore: 90, categoryScores: { Strategy: 30, Operations: 25, Marketing: 25, Finance: 10 }, tier: 'Champion', segmentId: 'seg-champion', segmentName: 'Champion', matchedRules: [], decisionReason: "Your strong scores across strategy, operations, and marketing show you're ready to scale.", createdAt: d(3) },
  { id: 'snap-5', submissionId: 'sub-5', totalScore: 62, categoryScores: { Strategy: 20, Operations: 17, Marketing: 18, Finance: 7 }, tier: 'Contender', segmentId: 'seg-contender', segmentName: 'Contender', matchedRules: [], decisionReason: 'You have a solid foundation. With targeted improvements in a few key areas, you can reach the next level.', createdAt: d(2) },
];

// Generate realistic event log entries for the last 7 days
function genEvents(): StaticEventLog[] {
  const evts: StaticEventLog[] = [];
  const types = ['page.viewed', 'assessment.started', 'assessment.completed', 'lead.created', 'cta.clicked'];
  const weights = [10, 7, 5, 4, 3];
  for (let day = 6; day >= 0; day--) {
    const base = new Date(Date.now() - day * 86400000);
    const count = 8 + Math.floor(Math.random() * 12);
    for (let i = 0; i < count; i++) {
      const roll = Math.random() * weights.reduce((a, b) => a + b, 0);
      let cumul = 0; let typeIdx = 0;
      for (let j = 0; j < weights.length; j++) { cumul += weights[j]; if (roll < cumul) { typeIdx = j; break; } }
      evts.push({
        id: makeId(),
        workspaceId: 'ws-renen-demo', funnelId: 'funnel-demo-1',
        leadId: null, submissionId: null, anonymousId: `anon-seed-${day}-${i}`,
        eventType: types[typeIdx],
        eventData: { source: 'demo' },
        createdAt: new Date(base.getTime() + Math.random() * 86400000).toISOString(),
      });
    }
  }
  return evts;
}

export const webhookConfigs: StaticWebhookConfig[] = [];

// ─── Runtime mutable state (module-singleton) ─────────────────────────────────

let _leads: StaticLead[] = [...DEMO_LEADS];
let _submissions: StaticSubmission[] = [...DEMO_SUBMISSIONS];
let _submissionAnswers: StaticSubmissionAnswer[] = [];
let _snapshots: StaticScoringSnapshot[] = [...DEMO_SNAPSHOTS];
let _events: StaticEventLog[] = genEvents();
let _funnels: StaticFunnel[] = [...funnels];
let _funnelVersions: StaticFunnelVersion[] = [...funnelVersions];

// ─── Accessor API (mimics Prisma patterns) ────────────────────────────────────

export const staticDb = {
  // Funnels
  getFunnels: (workspaceId: string) => _funnels.filter(f => f.workspaceId === workspaceId),
  getFunnelById: (id: string) => _funnels.find(f => f.id === id) ?? null,
  getFunnelBySlug: (slug: string) => _funnels.find(f => f.slug === slug) ?? null,
  createFunnel: (data: Omit<StaticFunnel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const f: StaticFunnel = { ...data, id: 'funnel-' + makeId(), createdAt: now, updatedAt: now };
    _funnels.push(f); return f;
  },
  updateFunnel: (id: string, data: Partial<StaticFunnel>) => {
    _funnels = _funnels.map(f => f.id === id ? { ...f, ...data, updatedAt: now } : f);
  },
  deleteFunnel: (id: string) => { _funnels = _funnels.filter(f => f.id !== id); },

  // Funnel Versions
  getFunnelVersions: (funnelId: string) => _funnelVersions.filter(v => v.funnelId === funnelId).sort((a, b) => b.version - a.version),
  getFunnelVersionById: (id: string) => _funnelVersions.find(v => v.id === id) ?? null,
  getLatestPublishedVersion: (funnelId: string) => _funnelVersions.filter(v => v.funnelId === funnelId && v.isPublished).sort((a, b) => b.version - a.version)[0] ?? null,
  createFunnelVersion: (data: Omit<StaticFunnelVersion, 'id' | 'createdAt' | 'updatedAt'>) => {
    const v: StaticFunnelVersion = { ...data, id: 'fv-' + makeId(), createdAt: now, updatedAt: now };
    _funnelVersions.push(v); return v;
  },
  updateFunnelVersion: (id: string, data: Partial<StaticFunnelVersion>) => {
    _funnelVersions = _funnelVersions.map(v => v.id === id ? { ...v, ...data, updatedAt: now } : v);
  },

  // Assessments
  getAssessmentByVersionId: (funnelVersionId: string) => assessments.find(a => a.funnelVersionId === funnelVersionId) ?? null,
  getFullAssessment: (funnelVersionId: string) => {
    const a = assessments.find(x => x.funnelVersionId === funnelVersionId);
    if (!a) return null;
    return {
      ...a,
      questions: questions
        .filter(q => q.assessmentId === a.id)
        .sort((a, b) => a.order - b.order)
        .map(q => ({ ...q, answerOptions: answerOptions.filter(o => o.questionId === q.id).sort((a, b) => a.order - b.order), logicRules: [] })),
      scoreCategories: scoreCategories.filter(c => c.assessmentId === a.id),
      scoreTiers: scoreTiers.filter(t => t.assessmentId === a.id),
    };
  },

  // Segments
  getSegments: (funnelId: string) => {
    return segments
      .filter(s => s.funnelId === funnelId)
      .map(s => ({
        ...s,
        rules: segmentRules.filter(r => r.segmentId === s.id),
        resultPage: (() => {
          const rp = resultPages.find(p => p.segmentId === s.id) ?? null;
          if (!rp) return null;
          return { ...rp, ctaConfig: ctaConfigs.find(c => c.resultPageId === rp.id) ?? null };
        })(),
      }));
  },

  // Leads
  getLeads: (workspaceId: string, funnelId?: string | null) =>
    _leads
      .filter(l => l.workspaceId === workspaceId && (!funnelId || l.funnelId === funnelId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(l => {
        const funnel = _funnels.find(f => f.id === l.funnelId);
        const segment = segments.find(s => s.id === l.segmentId) ?? null;
        const subs = _submissions
          .filter(s => s.leadId === l.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 1)
          .map(s => ({ ...s, snapshot: _snapshots.find(sn => sn.submissionId === s.id) ?? null }));
        return { ...l, funnel: funnel ? { name: funnel.name, slug: funnel.slug } : { name: 'Unknown', slug: '' }, segment: segment ? { name: segment.name } : null, submissions: subs };
      }),

  getLeadById: (id: string, workspaceId: string) => {
    const l = _leads.find(x => x.id === id && x.workspaceId === workspaceId) ?? null;
    if (!l) return null;
    const funnel = _funnels.find(f => f.id === l.funnelId);
    const segment = segments.find(s => s.id === l.segmentId) ?? null;
    const subs = _submissions
      .filter(s => s.leadId === l.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(s => ({
        ...s,
        snapshot: _snapshots.find(sn => sn.submissionId === s.id) ?? null,
        answers: _submissionAnswers.filter(a => a.submissionId === s.id),
        funnelVersion: _funnelVersions.find(v => v.id === s.funnelVersionId) ?? null,
      }));
    return { ...l, funnel: funnel ? { name: funnel.name, slug: funnel.slug } : { name: 'Unknown', slug: '' }, segment: segment ? { name: segment.name, description: segment.description } : null, submissions: subs };
  },

  createLead: (data: Omit<StaticLead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const l: StaticLead = { ...data, id: 'lead-' + makeId(), createdAt: now, updatedAt: now };
    _leads.push(l); return l;
  },
  updateLead: (id: string, data: Partial<StaticLead>) => {
    _leads = _leads.map(l => l.id === id ? { ...l, ...data, updatedAt: now } : l);
  },
  getLeadCount: (funnelId: string) => _leads.filter(l => l.funnelId === funnelId).length,

  // Submissions
  getSubmissionById: (id: string) => {
    const s = _submissions.find(x => x.id === id) ?? null;
    if (!s) return null;
    const lead = _leads.find(l => l.id === s.leadId) ?? null;
    const snapshot = _snapshots.find(sn => sn.submissionId === s.id) ?? null;
    const fv = _funnelVersions.find(v => v.id === s.funnelVersionId) ?? null;
    const funnel = fv ? _funnels.find(f => f.id === fv.funnelId) ?? null : null;
    const assessment = fv ? staticDb.getFullAssessment(fv.id) : null;
    return { ...s, lead, snapshot, funnelVersion: fv ? { ...fv, funnel, assessment } : null };
  },
  createSubmission: (data: Omit<StaticSubmission, 'id' | 'createdAt'>) => {
    const s: StaticSubmission = { ...data, id: 'sub-' + makeId(), createdAt: now };
    _submissions.push(s); return s;
  },
  addSubmissionAnswers: (answers: Omit<StaticSubmissionAnswer, 'id' | 'createdAt'>[]) => {
    const created = answers.map(a => ({ ...a, id: 'ans-' + makeId(), createdAt: now }));
    _submissionAnswers.push(...created);
  },

  // Scoring Snapshots
  createSnapshot: (data: Omit<StaticScoringSnapshot, 'id' | 'createdAt'>) => {
    const sn: StaticScoringSnapshot = { ...data, id: 'snap-' + makeId(), createdAt: now };
    _snapshots.push(sn); return sn;
  },

  // Events
  getEvents: (workspaceId: string, funnelId?: string | null, since?: Date) =>
    _events.filter(e =>
      e.workspaceId === workspaceId &&
      (!funnelId || e.funnelId === funnelId) &&
      (!since || new Date(e.createdAt) >= since)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  logEvent: (data: Omit<StaticEventLog, 'id'>) => {
    _events.push({ ...data, id: makeId() });
  },
};

export default staticDb;
