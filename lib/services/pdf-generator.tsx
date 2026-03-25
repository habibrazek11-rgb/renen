// PDF Report Generator — JSX component for @react-pdf/renderer
// Active implementation: see pdf-generator-doc.tsx
// This file provides a standalone PDF renderer using the legacy EvaluationSnapshot shape

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

// Inline types (no external dependency)
interface RiskFlag {
  type: string;
  detail: string;
}

interface ExtractedFields {
  idea_summary: string;
  problem: { statement: string; severity: string };
  solution: { what: string; differentiation: string };
  market: { customer: string; tam_note: string; competition: string };
  traction: { signals: string[]; metrics: string[] };
  team: { background: string; gaps: string[] };
  financials: { model: string; unit_economics_note: string };
  risks?: RiskFlag[];
  confidence: number;
  missing_info_questions?: string[];
  score_suggestions?: Record<string, number>;
}

interface EvaluationSnapshot {
  id: string;
  submission_id: string;
  scoring_model_id: string;
  extracted_fields: ExtractedFields;
  category_scores: Record<string, number>;
  total_score: number;
  tier: string;
  segment_id: string | null;
  segment_name: string | null;
  segment_outcome: string | null;
  decision_reason: string | null;
  llm_confidence: number | null;
  risk_flags: RiskFlag[] | null;
  missing_info_questions: string[] | null;
  created_at: string;
}

interface Submission {
  id: string;
  submitter_name: string;
  submitter_email: string;
  idea_text: string;
  created_at: string;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2 solid #ff36a2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 3,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff36a2",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1 solid #e5e5e5",
  },
  text: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },
  scoreSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },
  scoreValue: {
    fontSize: 11,
    color: "#ff36a2",
  },
  totalScore: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff36a2",
    textAlign: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "2 solid #ff36a2",
  },
  riskBox: {
    backgroundColor: "#fee",
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
    border: "1 solid #fcc",
  },
  riskLabel: {
    fontSize: 9,
    color: "#c00",
    fontWeight: "bold",
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#999999",
    borderTop: "1 solid #e5e5e5",
    paddingTop: 10,
  },
});

interface ReportData {
  submission: Submission;
  evaluation: EvaluationSnapshot;
}

/**
 * Generate PDF Report Document
 */
export function generateReportPDF(data: ReportData) {
  const { submission, evaluation } = data;
  const { extracted_fields } = evaluation;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RENEN Feasibility Report</Text>
          <Text style={styles.subtitle}>
            {submission.submitter_name} • {submission.submitter_email}
          </Text>
          <Text style={styles.subtitle}>
            Submitted: {format(new Date(submission.created_at), "MMMM d, yyyy")}
          </Text>
          <Text style={styles.subtitle}>Report ID: {evaluation.id}</Text>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.text}>{extracted_fields.idea_summary}</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Outcome: </Text>
            {(evaluation.segment_outcome ?? "N/A").toUpperCase()} (Score:{" "}
            {evaluation.total_score}/100)
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Decision: </Text>
            {evaluation.decision_reason ?? "N/A"}
          </Text>
        </View>

        {/* Overall Score */}
        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>Evaluation Score</Text>
          {Object.entries(evaluation.category_scores).map(([category, score]) => (
            <View key={category} style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <Text style={styles.scoreValue}>{score as number}</Text>
            </View>
          ))}
          <Text style={styles.totalScore}>
            Total: {evaluation.total_score}/100 • {evaluation.tier}
          </Text>
        </View>

        {/* Problem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Problem Statement</Text>
          <Text style={styles.text}>{extracted_fields.problem.statement}</Text>
          <Text style={styles.label}>
            Severity: {extracted_fields.problem.severity.toUpperCase()}
          </Text>
        </View>

        {/* Solution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proposed Solution</Text>
          <Text style={styles.text}>{extracted_fields.solution.what}</Text>
          <Text style={styles.label}>Differentiation:</Text>
          <Text style={styles.text}>{extracted_fields.solution.differentiation}</Text>
        </View>

        {/* Market Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Analysis</Text>
          <Text style={styles.label}>Target Customer:</Text>
          <Text style={styles.text}>{extracted_fields.market.customer}</Text>
          <Text style={styles.label}>Market Size:</Text>
          <Text style={styles.text}>{extracted_fields.market.tam_note}</Text>
          <Text style={styles.label}>Competition:</Text>
          <Text style={styles.text}>{extracted_fields.market.competition}</Text>
        </View>

        {/* Traction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traction &amp; Metrics</Text>
          <Text style={styles.label}>Signals:</Text>
          {extracted_fields.traction.signals.map((signal: string, i: number) => (
            <Text key={i} style={styles.text}>
              • {signal}
            </Text>
          ))}
          <Text style={styles.label}>Key Metrics:</Text>
          {extracted_fields.traction.metrics.map((metric: string, i: number) => (
            <Text key={i} style={styles.text}>
              • {metric}
            </Text>
          ))}
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Assessment</Text>
          <Text style={styles.text}>{extracted_fields.team.background}</Text>
          {extracted_fields.team.gaps.length > 0 && (
            <>
              <Text style={styles.label}>Team Gaps:</Text>
              {extracted_fields.team.gaps.map((gap: string, i: number) => (
                <Text key={i} style={styles.text}>
                  • {gap}
                </Text>
              ))}
            </>
          )}
        </View>

        {/* Financials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Model</Text>
          <Text style={styles.text}>{extracted_fields.financials.model}</Text>
          <Text style={styles.text}>
            {extracted_fields.financials.unit_economics_note}
          </Text>
        </View>

        {/* Risk Flags */}
        {evaluation.risk_flags && evaluation.risk_flags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Assessment</Text>
            {evaluation.risk_flags.map((risk: RiskFlag, i: number) => (
              <View key={i} style={styles.riskBox}>
                <Text style={styles.riskLabel}>{risk.type.toUpperCase()}</Text>
                <Text style={styles.text}>{risk.detail}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Missing Information */}
        {evaluation.missing_info_questions &&
          evaluation.missing_info_questions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information Needed</Text>
              {evaluation.missing_info_questions.map((question: string, i: number) => (
                <Text key={i} style={styles.text}>
                  {i + 1}. {question}
                </Text>
              ))}
            </View>
          )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            RENEN Investment Evaluation Platform • Generated on{" "}
            {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
          </Text>
          <Text>
            This report is confidential and for evaluation purposes only. LLM
            Confidence: {Math.round((evaluation.llm_confidence || 0) * 100)}%
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Type for server-side PDF generation
 * Returns: Buffer that can be saved or streamed
 */
export async function generateReportPDFBuffer(): Promise<Buffer> {
  // This would be implemented server-side with renderToBuffer
  // For now, this is a placeholder
  throw new Error("Server-side PDF generation not implemented yet");
}
