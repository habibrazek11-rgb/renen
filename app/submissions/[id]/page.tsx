"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  XCircle,
} from "lucide-react";

// Mock data - in real app, this would come from useParams() and API
const mockSubmission = {
  id: "1",
  submitter_name: "John Doe",
  submitter_email: "john@startup.com",
  idea_text:
    "An AI-powered customer support platform specifically designed for small and medium-sized businesses (SMBs). The platform uses natural language processing to automatically categorize and respond to common customer inquiries, reducing response times and allowing human agents to focus on complex issues. It integrates seamlessly with existing CRM systems and provides detailed analytics on customer satisfaction trends.",
  file_urls: ["pitch_deck.pdf", "financial_projections.xlsx"],
  status: "evaluated",
  created_at: "2026-02-07T10:30:00Z",
  evaluation: {
    extracted_fields: {
      idea_summary: "AI-powered customer support platform for SMBs",
      problem: {
        statement:
          "SMBs struggle to provide 24/7 customer support due to limited resources and high costs",
        severity: "high",
      },
      solution: {
        what: "AI chatbot with NLP capabilities integrated with existing CRM systems",
        differentiation:
          "SMB-focused pricing, simple setup, and pre-trained industry-specific models",
      },
      market: {
        customer: "SMBs with 10-200 employees across retail, services, and e-commerce",
        tam_note: "Estimated $2B TAM in North America alone",
        competition:
          "Zendesk, Intercom, Freshdesk - but they're enterprise-focused and expensive",
      },
      traction: {
        signals: ["10 pilot customers", "2 LOIs from mid-market companies"],
        metrics: ["$5K MRR", "85% customer satisfaction", "40% reduction in response time"],
      },
      team: {
        background: "Ex-Salesforce engineers with 15+ years combined experience",
        gaps: ["Sales leader", "Marketing expertise"],
      },
      financials: {
        model: "SaaS subscription with tiered pricing ($99-$499/month)",
        unit_economics_note: "60% gross margin, $120 CAC, $1,800 LTV",
      },
      risks: [
        {
          type: "market",
          detail: "Highly competitive market with established players",
        },
        {
          type: "execution",
          detail: "Need to prove product-market fit beyond pilots",
        },
      ],
      score_suggestions: {
        market: 18,
        product: 20,
        traction: 10,
        team: 12,
        financials: 9,
      },
      confidence: 0.75,
      missing_info_questions: [
        "What is your customer acquisition strategy?",
        "What are your plans for scaling the engineering team?",
        "Have you validated pricing with customers?",
      ],
    },
    category_scores: {
      market: 18,
      product: 20,
      traction: 10,
      team: 12,
      financials: 9,
    },
    total_score: 69,
    tier: "Revise",
    segment_name: "revise",
    segment_outcome: "revise",
    decision_reason:
      "Strong product-market fit and technical capabilities, but needs more traction and team development before investment. Recommend revision with focus on customer acquisition and key hires.",
    llm_confidence: 0.75,
    risk_flags: [
      {
        type: "market",
        detail: "Highly competitive market with established players",
      },
      {
        type: "execution",
        detail: "Need to prove product-market fit beyond pilots",
      },
    ],
    missing_info_questions: [
      "What is your customer acquisition strategy?",
      "What are your plans for scaling the engineering team?",
      "Have you validated pricing with customers?",
    ],
  },
};

export default function SubmissionDetailPage() {
  const submission = mockSubmission;
  const evaluation = submission.evaluation;

  const categoryScores = Object.entries(evaluation.category_scores);
  const maxScores = {
    market: 25,
    product: 25,
    traction: 20,
    team: 15,
    financials: 15,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{submission.submitter_name}</h1>
                <p className="text-sm text-muted-foreground">
                  {submission.submitter_email} •{" "}
                  {new Date(submission.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Badge
                variant={
                  evaluation.segment_name === "pass"
                    ? "success"
                    : evaluation.segment_name === "revise"
                    ? "default"
                    : "destructive"
                }
                className="text-base px-4 py-2"
              >
                {evaluation.tier} ({evaluation.total_score}/100)
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Submission */}
            <Card>
              <CardHeader>
                <CardTitle>Original Idea Submission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{submission.idea_text}</p>

                {submission.file_urls && submission.file_urls.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Uploaded Files</p>
                    <div className="flex flex-wrap gap-2">
                      {submission.file_urls.map((file, i) => (
                        <Badge key={i} variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs for Extracted Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Analysis</CardTitle>
                <CardDescription>
                  AI-extracted insights and structured evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="product">Product</TabsTrigger>
                    <TabsTrigger value="traction">Traction</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-sm">{evaluation.extracted_fields.idea_summary}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Problem Statement</h4>
                      <p className="text-sm">
                        {evaluation.extracted_fields.problem.statement}
                      </p>
                      <Badge
                        variant={
                          evaluation.extracted_fields.problem.severity === "high"
                            ? "destructive"
                            : "secondary"
                        }
                        className="mt-2"
                      >
                        Severity: {evaluation.extracted_fields.problem.severity}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Solution</h4>
                      <p className="text-sm mb-2">
                        {evaluation.extracted_fields.solution.what}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Differentiation:</strong>{" "}
                        {evaluation.extracted_fields.solution.differentiation}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="market" className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Target Customer</h4>
                      <p className="text-sm">
                        {evaluation.extracted_fields.market.customer}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Market Size</h4>
                      <p className="text-sm">{evaluation.extracted_fields.market.tam_note}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Competition</h4>
                      <p className="text-sm">
                        {evaluation.extracted_fields.market.competition}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="product" className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Product Description</h4>
                      <p className="text-sm">{evaluation.extracted_fields.solution.what}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Differentiators</h4>
                      <p className="text-sm">
                        {evaluation.extracted_fields.solution.differentiation}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="traction" className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Traction Signals</h4>
                      <ul className="space-y-1">
                        {evaluation.extracted_fields.traction.signals.map((signal, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {signal}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {evaluation.extracted_fields.traction.metrics.map((metric, i) => (
                          <Badge key={i} variant="secondary">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="team" className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Background</h4>
                      <p className="text-sm">{evaluation.extracted_fields.team.background}</p>
                    </div>

                    {evaluation.extracted_fields.team.gaps.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Team Gaps</h4>
                        <ul className="space-y-1">
                          {evaluation.extracted_fields.team.gaps.map((gap, i) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Risk Flags */}
            {evaluation.risk_flags && evaluation.risk_flags.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    Risk Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {evaluation.risk_flags.map((risk, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-red-50 rounded-lg">
                        <Badge variant="destructive" className="shrink-0">
                          {risk.type}
                        </Badge>
                        <p className="text-sm">{risk.detail}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Missing Information */}
            {evaluation.missing_info_questions &&
              evaluation.missing_info_questions.length > 0 && (
                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="w-5 h-5" />
                      Missing Information
                    </CardTitle>
                    <CardDescription>
                      Questions to ask the submitter for a more complete evaluation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {evaluation.missing_info_questions.map((question, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-[#ff36a2] font-bold">{i + 1}.</span>
                          {question}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Right Column - Scoring & Actions */}
          <div className="space-y-6">
            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>Category scores and total evaluation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryScores.map(([category, score]) => {
                  const maxScore = maxScores[category as keyof typeof maxScores] || 100;
                  const percentage = (score / maxScore) * 100;

                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {score}/{maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-[#ff36a2] h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Score</span>
                    <span className="text-2xl font-bold text-[#ff36a2]">
                      {evaluation.total_score}/100
                    </span>
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant={
                        evaluation.segment_name === "pass"
                          ? "success"
                          : evaluation.segment_name === "revise"
                          ? "default"
                          : "destructive"
                      }
                      className="w-full justify-center py-2"
                    >
                      Tier: {evaluation.tier}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1">LLM Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(evaluation.llm_confidence || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((evaluation.llm_confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Segment Decision */}
            <Card>
              <CardHeader>
                <CardTitle>Segment Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{evaluation.decision_reason}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Recommended Outcome</p>
                  <Badge
                    variant={
                      evaluation.segment_outcome === "pass"
                        ? "success"
                        : evaluation.segment_outcome === "revise"
                        ? "default"
                        : "destructive"
                    }
                    className="text-base px-4 py-2"
                  >
                    {evaluation.segment_outcome.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Review Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Review Actions</CardTitle>
                <CardDescription>Final decision requires human review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Add your review notes..."
                  rows={4}
                  className="resize-none"
                />

                <div className="space-y-2">
                  <Button className="w-full" variant="default">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button className="w-full" variant="outline">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
