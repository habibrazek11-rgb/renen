import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileText, Plus } from "lucide-react";
import type { SubmissionWithDetails, SubmissionStatus } from "@/lib/types";

// Mock data for demonstration
const mockSubmissions: SubmissionWithDetails[] = [
  {
    id: "1",
    funnel_id: "f1",
    workspace_id: "w1",
    submitter_email: "john@startup.com",
    submitter_name: "John Doe",
    idea_text: "AI-powered customer support platform for SMBs",
    file_urls: null,
    status: "evaluated",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    evaluation: {
      id: "e1",
      submission_id: "1",
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
      decision_reason: "Strong product but needs more traction",
      llm_confidence: 0.75,
      risk_flags: [{ type: "market", detail: "Competitive market" }],
      missing_info_questions: ["What is your customer acquisition strategy?"],
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "2",
    funnel_id: "f1",
    workspace_id: "w1",
    submitter_email: "jane@tech.co",
    submitter_name: "Jane Smith",
    idea_text: "Blockchain-based supply chain tracking",
    file_urls: null,
    status: "submitted",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    funnel_id: "f1",
    workspace_id: "w1",
    submitter_email: "mike@innovation.io",
    submitter_name: "Mike Johnson",
    idea_text: "Sustainable packaging solutions for e-commerce",
    file_urls: null,
    status: "approved",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    evaluation: {
      id: "e3",
      submission_id: "3",
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
      decision_reason: "Strong team, proven traction, large market",
      llm_confidence: 0.85,
      risk_flags: [{ type: "execution", detail: "Manufacturing scale-up" }],
      missing_info_questions: [],
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  },
];

function getStatusBadge(status: SubmissionStatus) {
  const variants = {
    submitted: { variant: "secondary" as const, label: "Submitted" },
    evaluated: { variant: "default" as const, label: "Evaluated" },
    reviewed: { variant: "outline" as const, label: "Reviewed" },
    approved: { variant: "success" as const, label: "Approved" },
    rejected: { variant: "destructive" as const, label: "Rejected" },
  };

  const config = variants[status] || variants.submitted;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getSegmentBadge(segmentName: string, score: number) {
  const variants = {
    pass: { variant: "success" as const, label: `Pass (${score})` },
    revise: { variant: "warning" as const, label: `Revise (${score})` },
    reject: { variant: "destructive" as const, label: `Reject (${score})` },
  };

  const config = variants[segmentName as keyof typeof variants] || variants.reject;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">RENEN</h1>
            <p className="text-sm text-muted-foreground">Investment Evaluation Platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Funnels
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Submission
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Submissions</CardDescription>
                <CardTitle className="text-3xl">24</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">+3 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Approved</CardDescription>
                <CardTitle className="text-3xl text-green-600">8</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">33% conversion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Needs Review</CardDescription>
                <CardTitle className="text-3xl text-[#ff36a2]">7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Awaiting decision</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Rejected</CardDescription>
                <CardTitle className="text-3xl text-red-600">9</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Clear feedback sent</p>
              </CardContent>
            </Card>
          </div>

          {/* Submissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Submission Pipeline</CardTitle>
              <CardDescription>
                Review and manage startup idea submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="submitted">Submitted</TabsTrigger>
                  <TabsTrigger value="evaluated">Evaluated</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Submitter</TableHead>
                        <TableHead>Idea</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Evaluation</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{submission.submitter_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {submission.submitter_email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate">{submission.idea_text}</div>
                          </TableCell>
                          <TableCell>{getStatusBadge(submission.status)}</TableCell>
                          <TableCell>
                            {submission.evaluation
                              ? getSegmentBadge(
                                  submission.evaluation.segment_name,
                                  submission.evaluation.total_score
                                )
                              : <span className="text-xs text-muted-foreground">Not evaluated</span>}
                          </TableCell>
                          <TableCell>
                            {new Date(submission.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Other tab contents would filter the submissions */}
                <TabsContent value="submitted">
                  <div className="text-center py-8 text-muted-foreground">
                    Filter: Submitted submissions only
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
