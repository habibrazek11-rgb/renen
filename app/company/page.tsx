"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { getMockSubmissions } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/mock-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Target, Rocket, History, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SubmissionWithDetails } from "@/lib/types";

export default function CompanyDashboard() {
    const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
    const [mounted, setMounted] = useState(false);
    const user = getCurrentUser();

    useEffect(() => {
        setMounted(true);
        if (user) {
            const all = getMockSubmissions();
            setSubmissions(all.filter(s => s.submitter_email === user.email));
        }
    }, []);

    if (!mounted) return null;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h2>
                        <p className="text-muted-foreground">Track your business idea submissions and AI feasibility reports.</p>
                    </div>
                    <Link href="/submit">
                        <Button size="lg" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] shadow-lg shadow-pink-500/20">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            New Submission
                        </Button>
                    </Link>
                </div>

                {/* Quick Action Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-100 hover:shadow-lg transition-all cursor-pointer group">
                        <CardHeader className="pb-3">
                            <div className="w-10 h-10 rounded-full bg-pink-100 text-[#ff36a2] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6" />
                            </div>
                            <CardTitle className="pt-4">Analyze New Idea</CardTitle>
                            <CardDescription>Get feasibility insights in seconds using our AI engine.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/submit" className="text-[#ff36a2] font-medium flex items-center gap-1 hover:underline">
                                Get started <ChevronRight className="w-4 h-4" />
                            </Link>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-all cursor-pointer group">
                        <CardHeader className="pb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <CardTitle className="pt-4">View All Reports</CardTitle>
                            <CardDescription>Access documented analysis for all your previous submissions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/company/history" className="text-blue-600 font-medium flex items-center gap-1 hover:underline">
                                Explore history <ChevronRight className="w-4 h-4" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Submissions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Submissions</CardTitle>
                            <CardDescription>Manage your latest idea evaluations.</CardDescription>
                        </div>
                        <Link href="/company/history">
                            <Button variant="ghost" className="text-muted-foreground hover:text-[#ff36a2]">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {submissions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Submission</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>AI Outcome</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Result</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.slice(0, 5).map((sub) => (
                                        <TableRow key={sub.id} className="hover:bg-gray-50 transition-colors">
                                            <TableCell className="max-w-md">
                                                <div className="truncate font-medium text-sm">{sub.idea_text}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={sub.status === "evaluated" ? "default" : "secondary"}>
                                                    {sub.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {sub.evaluation ? (
                                                    <Badge
                                                        className={
                                                            sub.evaluation.segment_outcome === "pass"
                                                                ? "bg-green-100 text-green-800 border-green-200"
                                                                : sub.evaluation.segment_outcome === "revise"
                                                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                                    : "bg-red-100 text-red-800 border-red-200"
                                                        }
                                                        variant="outline"
                                                    >
                                                        {(sub.evaluation.segment_name ?? 'unknown').toUpperCase()}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Processing...</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {new Date(sub.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/results/${sub.id}`}>
                                                    <Button variant="outline" size="sm" className="hover:border-[#ff36a2] hover:text-[#ff36a2]">
                                                        Report
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <History className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">No submissions yet</h3>
                                    <p className="text-muted-foreground">Start by submitting your first business idea for AI analysis.</p>
                                </div>
                                <Link href="/submit">
                                    <Button variant="outline">Create Submission</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
