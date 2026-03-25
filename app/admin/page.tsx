"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { getMockSubmissions } from "@/lib/mock-data";
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
import { Eye, Clock, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SubmissionWithDetails } from "@/lib/types";

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setSubmissions(getMockSubmissions());
    }, []);

    if (!mounted) return null;

    const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === "submitted").length,
        evaluated: submissions.filter(s => s.status === "evaluated").length,
        passed: submissions.filter(s => s.evaluation?.segment_outcome === "pass").length
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
                    <p className="text-muted-foreground">Consult every request submitted across all companies.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">Across all organizations</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">Require immediate attention</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">AI Evaluated</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.evaluated}</div>
                            <p className="text-xs text-muted-foreground">Structured analysis complete</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Feasibility Rate</CardTitle>
                            <BarChart3 className="h-4 w-4 text-[#ff36a2]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">Submissions with 'Pass' outcome</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Submissions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Global Submission Queue</CardTitle>
                        <CardDescription>
                            Comprehensive list of all business ideas submitted for evaluation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company / User</TableHead>
                                    <TableHead>Proposed Idea</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Outcome</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((sub) => (
                                    <TableRow key={sub.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell>
                                            <div className="font-medium text-sm">{sub.submitter_name}</div>
                                            <div className="text-xs text-muted-foreground">{sub.submitter_email}</div>
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <div className="truncate text-sm font-medium">{sub.idea_text}</div>
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
                                                <span className="text-xs text-muted-foreground italic">Awaiting AI</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/results/${sub.id}`}>
                                                <Button variant="outline" size="sm" className="hover:bg-pink-50 hover:text-[#ff36a2] hover:border-pink-200">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Consult
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

// Sub-components as needed
function FileText(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    )
}
