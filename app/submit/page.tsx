"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Upload, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/mock-auth";
import { saveMockSubmission } from "@/lib/mock-data";
import { evaluateSubmission } from "@/lib/services/evaluation-orchestrator";
import type { SubmissionWithDetails, Submission } from "@/lib/types";

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newSubId, setNewSubId] = useState<string | null>(null);
  const user = getCurrentUser();

  const [formData, setFormData] = useState({
    companyName: user?.company_name || "",
    idea: "",
    website: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    // Create a new submission object
    const submissionId = `sub-${Math.random().toString(36).substr(2, 9)}`;

    const submission: Submission = {
      id: submissionId,
      funnel_id: "default-funnel",
      workspace_id: "default-workspace",
      submitter_email: user.email,
      submitter_name: user.name,
      idea_text: formData.idea,
      file_urls: null,
      status: "submitted",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use the orchestrator with mock mode
    // Note: evaluateWithLLM in the orchestrator can be swapped with mockEvaluateWithLLM
    const result = await evaluateSubmission({
      submission,
      use_mock: true
    });

    if (result.success) {
      const fullSubmission: SubmissionWithDetails = {
        ...submission,
        status: "evaluated",
        evaluation: {
          ...result.snapshot,
          id: `eval-${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
        } as any,
      };

      saveMockSubmission(fullSubmission);
      setNewSubId(submissionId);
      setSubmitted(true);
    } else {
      console.error("Evaluation failed:", result.error);
    }

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-bg">
      <header className="sticky top-0 z-50 glass border-b border-white/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff36a2] to-[#ff6b9d] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] bg-clip-text text-transparent">
              RENEN
            </h1>
          </Link>
          <div className="text-sm font-medium text-muted-foreground italic">
            Submission for {user.name}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {!submitted ? (
            <Card className="border-2 border-pink-100 shadow-xl shadow-pink-500/5">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Submit Your Business Idea</CardTitle>
                <CardDescription className="text-base">
                  Describe your concept in detail. Our AI will analyze feasibility, risks, and market potential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Company Name / Project Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder="e.g. Acme AI Solutions"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="bg-gray-50/50 border-gray-200 h-12 text-lg"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idea" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Describe the Business Concept</Label>
                      <Textarea
                        id="idea"
                        name="idea"
                        placeholder="What problem are you solving? Who is the customer? How do you make money? What is your secret sauce?"
                        value={formData.idea}
                        onChange={handleChange}
                        required
                        rows={12}
                        className="bg-gray-50/50 border-gray-200 text-lg resize-none p-4"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto px-8 h-14 text-lg bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] shadow-lg shadow-pink-500/20"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Running AI Analysis...
                        </>
                      ) : (
                        <>
                          Analyze Feasibility
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-green-100 shadow-xl shadow-green-500/5 text-center">
              <CardContent className="pt-16 pb-16">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold">Analysis Complete!</CardTitle>
                    <CardDescription className="text-lg max-w-md mx-auto">
                      Your business feasibility report has been generated and is ready for consultation.
                    </CardDescription>
                  </div>
                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-[#ff36a2]">
                      <Link href={`/results/${newSubId}`}>View Feasibility Report</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href={user.role === 'admin' ? '/admin' : '/company'}>Go to Dashboard</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="border-t mt-12 py-8 bg-gray-50/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground italic">
          <p>© 2026 RENEN. Automated Investment Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
