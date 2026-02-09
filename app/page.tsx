"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  FileSearch,
  Layers,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff36a2] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">RENEN</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/funnels">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Investment Evaluation,
            <br />
            <span className="text-[#ff36a2]">Automated & Defensible</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured intake, LLM analysis, and deterministic scoring combine to
            create reliable feasibility assessments for startup ideas—with built-in
            human review guardrails.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/submit">
              <Button size="lg">
                <Target className="w-5 h-5 mr-2" />
                Submit Your Startup
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need for Feasibility Filtering
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built on the proven pattern: structured intake + LLM analysis +
            deterministic scoring + human review
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FileSearch className="w-10 h-10 text-[#ff36a2] mb-4" />
              <CardTitle>Smart Intake & Extraction</CardTitle>
              <CardDescription>
                Capture ideas via text, files, and custom questionnaires. LLM
                automatically extracts structured fields.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-[#ff36a2] mb-4" />
              <CardTitle>Deterministic Scoring</CardTitle>
              <CardDescription>
                Category-based evaluation with configurable weights and tier bands.
                Reliable, auditable, investor-defensible.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Layers className="w-10 h-10 text-[#ff36a2] mb-4" />
              <CardTitle>Segment Routing</CardTitle>
              <CardDescription>
                Automatic Pass/Revise/Reject decisions based on rules and score
                thresholds.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-[#ff36a2] mb-4" />
              <CardTitle>Human Review Workflow</CardTitle>
              <CardDescription>
                Nothing auto-publishes without review. Built-in guardrails ensure
                human oversight.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileSearch className="w-10 h-10 text-[#ff36a2] mb-4" />
              <CardTitle>PDF Reports</CardTitle>
              <CardDescription>
                Generate professional feasibility reports with scoring breakdowns and
                recommendations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="w-10 h-10 text-[#ff36a2] mb-4" />
              <CardTitle>Analytics & Events</CardTitle>
              <CardDescription>
                Track every action with analytics-ready event schema for business
                intelligence.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto border-[#ff36a2]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ready to Build?</CardTitle>
            <CardDescription className="text-lg">
              Explore the demo pages or read the technical documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">View Dashboard</Button>
            </Link>
            <Link href="/funnels">
              <Button size="lg" variant="outline">
                Create Assessment
              </Button>
            </Link>
            <Link href="/submissions/1">
              <Button size="lg" variant="outline">
                See Evaluation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            RENEN Investment Evaluation Platform • Built with Next.js, Tailwind CSS,
            and OpenAI
          </p>
          <p className="mt-2">
            Structured intake + LLM analysis + Deterministic scoring = Reliable
            decisions
          </p>
        </div>
      </footer>
    </div>
  );
}
