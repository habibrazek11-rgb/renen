"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { getMockSubmissionById } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/mock-auth";
import { convertToFeasibilityResponse } from "@/lib/services/feasibility-adapter";
import { FeasibilityCard } from "@/components/feasibility-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Download,
    Share2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    BarChart3,
    Users,
    ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SubmissionWithDetails } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResultDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState<SubmissionWithDetails | null>(null);
    const [mounted, setMounted] = useState(false);
    const user = getCurrentUser();

    useEffect(() => {
        setMounted(true);
        if (id) {
            const sub = getMockSubmissionById(id as string);
            if (sub) {
                setSubmission(sub);
            }
        }
    }, [id]);

    if (!mounted) return null;
    if (!submission) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold">Submission Not Found</h2>
                    <p className="text-muted-foreground">The request you are looking for does not exist or has been removed.</p>
                    <Button variant="outline" className="mt-8" onClick={() => router.back()}>
                        Go Back
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const feasibility = submission.evaluation
        ? convertToFeasibilityResponse(submission.evaluation as any)
        : null;

    const isAdmin = user?.role === "admin";

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Navigation & Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-[#ff36a2]">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </Button>
                    </div>
                </div>

                {/* Page Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Feasibility Card & Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {feasibility && (
                            <FeasibilityCard feasibility={feasibility} />
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Submitter Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Company</span>
                                    <span className="font-medium text-right">{submission.submitter_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium text-right">{submission.submitter_email}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-medium">{new Date(submission.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="pt-4 border-t flex flex-col gap-2">
                                    <div className="text-xs font-semibold text-muted-foreground uppercase">Status</div>
                                    <Badge variant="outline" className="w-fit">{submission.status.toUpperCase()}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {isAdmin && (
                            <Card className="border-orange-200 bg-orange-50/30">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ShieldAlert className="w-5 h-5 text-orange-600" />
                                        Admin Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full bg-green-600 hover:bg-green-700">Approve Request</Button>
                                    <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50">Request Clarification</Button>
                                    <Button variant="destructive" className="w-full">Reject Submission</Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Detailed Consultation */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold italic">Consultation Detail</CardTitle>
                                        <CardDescription>Comprehensive AI-driven evaluation of the business idea.</CardDescription>
                                    </div>
                                    {submission.evaluation?.total_score && (
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-muted-foreground">Overall Score</div>
                                            <div className="text-3xl font-bold text-[#ff36a2]">{submission.evaluation.total_score}/100</div>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                        <TabsTrigger value="market">Market</TabsTrigger>
                                        <TabsTrigger value="team">Team & Risk</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="pt-6 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-[#ff36a2]" />
                                                Idea Summary
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg italic">
                                                "{submission.idea_text}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-sm text-muted-foreground uppercase">Problem Statement</h4>
                                                <p className="text-sm font-medium">{submission.evaluation?.extracted_fields?.problem?.statement || "N/A"}</p>
                                                <Badge variant="secondary">Severity: {submission.evaluation?.extracted_fields?.problem?.severity}</Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-sm text-muted-foreground uppercase">Proposed Solution</h4>
                                                <p className="text-sm font-medium">{submission.evaluation?.extracted_fields?.solution?.what || "N/A"}</p>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Diff: {submission.evaluation?.extracted_fields?.solution?.differentiation}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="analysis" className="pt-6 space-y-6">
                                        <div className="grid grid-cols-1 gap-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-blue-500" />
                                                Scoring Breakdown
                                            </h3>
                                            {submission.evaluation?.category_scores && Object.entries(submission.evaluation.category_scores).map(([category, score]) => (
                                                <div key={category} className="space-y-1">
                                                    <div className="flex justify-between text-sm capitalize">
                                                        <span>{category}</span>
                                                        <span className="font-bold">{score}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-blue-500 h-full rounded-full transition-all"
                                                            style={{ width: `${(score / 25) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="market" className="pt-6 space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-[#ff36a2]">Target Customer</h4>
                                                <p className="text-sm text-gray-700">{submission.evaluation?.extracted_fields?.market?.customer}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">TAM Note</h4>
                                                    <p className="font-medium">{submission.evaluation?.extracted_fields?.market?.tam_note}</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Competition</h4>
                                                    <p className="font-medium">{submission.evaluation?.extracted_fields?.market?.competition}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="team" className="pt-6 space-y-6">
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <h3 className="text-sm font-bold uppercase text-blue-700 mb-2 flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    Team Background
                                                </h3>
                                                <p className="text-sm text-blue-900 font-medium">{submission.evaluation?.extracted_fields?.team?.background}</p>
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="text-sm font-bold uppercase text-red-700 flex items-center gap-2">
                                                    <ShieldAlert className="w-4 h-4" />
                                                    Risk Factors
                                                </h3>
                                                {submission.evaluation?.extracted_fields?.risks?.map((risk, i) => (
                                                    <div key={i} className="flex gap-3 text-sm p-3 bg-red-50 border border-red-100 rounded-lg text-red-900">
                                                        <div className="font-bold uppercase shrink-0">{risk.type}</div>
                                                        <div className="italic">"{risk.detail}"</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card className="border-dashed border-2">
                            <CardHeader>
                                <CardTitle className="text-lg">Consultant Reasoning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 p-4 rounded-xl border italic text-gray-600 leading-relaxed font-serif">
                                    "{submission.evaluation?.decision_reason}"
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
