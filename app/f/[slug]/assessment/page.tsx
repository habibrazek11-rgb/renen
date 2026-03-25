"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface Question {
    id: string;
    type: string;
    text: string;
    required: boolean;
    scaleMin?: number;
    scaleMax?: number;
    scaleMinLabel?: string;
    scaleMaxLabel?: string;
    answerOptions: Array<{ id: string; text: string; order: number }>;
}

interface AssessmentData {
    id: string;
    name: string;
    questions: Question[];
    funnelVersionId: string;
}

export default function AssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const versionId = searchParams.get("v") ?? "";
    const anonymousId = searchParams.get("anon") ?? "";
    const abVariant = searchParams.get("ab") ?? "A";

    const [slug, setSlug] = useState("");
    const [assessment, setAssessment] = useState<AssessmentData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then((p) => setSlug(p.slug));
    }, [params]);

    useEffect(() => {
        if (!versionId) return;
        fetch(`/api/assessments/${versionId}`)
            .then((r) => r.json())
            .then((d) => { setAssessment(d.assessment); setLoading(false); })
            .catch(() => setLoading(false));
    }, [versionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff36a2]" />
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Assessment not found</p>
            </div>
        );
    }

    const questions = assessment.questions;
    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const currentAnswer = answers[currentQuestion.id];

    function setAnswer(value: string | string[] | number) {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    }

    function handleMultiToggle(optionId: string) {
        const current = (currentAnswer as string[]) ?? [];
        if (current.includes(optionId)) {
            setAnswer(current.filter((id) => id !== optionId));
        } else {
            setAnswer([...current, optionId]);
        }
    }

    async function handleSubmit() {
        setSubmitting(true);
        try {
            const payload = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
            const res = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ funnelVersionId: versionId, answers: payload, anonymousId, abVariant }),
            });
            const data = await res.json();
            if (res.ok) {
                router.push(`/f/${slug}/result/${data.submissionId}`);
            }
        } catch {
            setSubmitting(false);
        }
    }

    function handleNext() {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((i) => i + 1);
        } else {
            handleSubmit();
        }
    }

    const isLast = currentIndex === questions.length - 1;
    const canProceed = !currentQuestion.required || currentAnswer !== undefined;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-100 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff36a2] to-[#ff6b9d] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">RENEN</span>
                </div>
            </header>

            {/* Progress */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>Question {currentIndex + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </div>

            {/* Question */}
            <main className="py-12 px-6">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion.text}</h2>

                    {/* Single choice */}
                    {currentQuestion.type === "single_choice" && (
                        <div className="space-y-3">
                            {currentQuestion.answerOptions.sort((a, b) => a.order - b.order).map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setAnswer(opt.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${currentAnswer === opt.id
                                            ? "border-[#ff36a2] bg-pink-50 text-[#ff36a2]"
                                            : "border-gray-200 hover:border-pink-200 hover:bg-pink-50/30"
                                        }`}
                                >
                                    <span className="font-medium">{opt.text}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Multi choice */}
                    {currentQuestion.type === "multi_choice" && (
                        <div className="space-y-3">
                            {currentQuestion.answerOptions.sort((a, b) => a.order - b.order).map((opt) => {
                                const selected = ((currentAnswer as string[]) ?? []).includes(opt.id);
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleMultiToggle(opt.id)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected
                                                ? "border-[#ff36a2] bg-pink-50 text-[#ff36a2]"
                                                : "border-gray-200 hover:border-pink-200 hover:bg-pink-50/30"
                                            }`}
                                    >
                                        <span className="font-medium">{opt.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Scale */}
                    {currentQuestion.type === "scale" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{currentQuestion.scaleMinLabel ?? currentQuestion.scaleMin ?? 1}</span>
                                <span>{currentQuestion.scaleMaxLabel ?? currentQuestion.scaleMax ?? 10}</span>
                            </div>
                            <div className="flex gap-2">
                                {Array.from({ length: (currentQuestion.scaleMax ?? 10) - (currentQuestion.scaleMin ?? 1) + 1 }, (_, i) => {
                                    const val = (currentQuestion.scaleMin ?? 1) + i;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => setAnswer(val)}
                                            className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${currentAnswer === val
                                                    ? "border-[#ff36a2] bg-[#ff36a2] text-white"
                                                    : "border-gray-200 hover:border-pink-300"
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    {currentQuestion.type === "email" && (
                        <input
                            type="email"
                            value={(currentAnswer as string) ?? ""}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:border-[#ff36a2] transition-colors"
                        />
                    )}

                    {/* Text */}
                    {currentQuestion.type === "text" && (
                        <textarea
                            value={(currentAnswer as string) ?? ""}
                            onChange={(e) => setAnswer(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#ff36a2] transition-colors resize-none"
                        />
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-10">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                            disabled={currentIndex === 0}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed || submitting}
                            className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] px-8"
                        >
                            {submitting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                            ) : isLast ? (
                                <>Get My Results <Sparkles className="w-4 h-4 ml-2" /></>
                            ) : (
                                <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
