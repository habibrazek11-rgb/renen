"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Loader2, CheckCircle, ArrowRight } from "lucide-react";

export default function CreateFunnelAIPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | {
        name: string;
        description: string;
        landingPage: { headline: string; subheadline: string; benefits: string[]; cta: string };
        questions: Array<{ type: string; text: string; options?: string[] }>;
        segments: Array<{ name: string; description: string; rules: string }>;
    }>(null);

    async function handleGenerate() {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/ai/create-funnel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setResult(data.blueprint);
        } catch {
            // handle error
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    AI Funnel Creator
                </h1>
                <p className="text-gray-500 mt-1">Describe your business and target audience — AI will generate a complete funnel blueprint</p>
            </div>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Describe your funnel
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. I run a B2B SaaS company helping marketing teams automate their reporting. I want to qualify leads and identify which ones are ready to buy vs. need nurturing."
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2] focus:border-transparent resize-none"
                        />
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="bg-gradient-to-r from-purple-500 to-[#ff36a2] hover:shadow-lg transition-all"
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                        ) : (
                            <><Sparkles className="w-4 h-4 mr-2" />Generate Funnel Blueprint</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-4 animate-[fadeInUp_0.4s_ease-out]">
                    <Card className="border-2 border-purple-100">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <CardTitle>{result.name}</CardTitle>
                            </div>
                            <p className="text-sm text-gray-500">{result.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Landing Page */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Landing Page</h3>
                                <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
                                    <p className="text-xl font-bold text-gray-900 mb-1">{result.landingPage.headline}</p>
                                    <p className="text-gray-600 mb-3">{result.landingPage.subheadline}</p>
                                    <ul className="space-y-1 mb-3">
                                        {result.landingPage.benefits.map((b, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                                                <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]">
                                        {result.landingPage.cta}
                                    </Button>
                                </div>
                            </div>

                            {/* Questions */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Assessment Questions ({result.questions.length})</h3>
                                <div className="space-y-2">
                                    {result.questions.map((q, i) => (
                                        <div key={i} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                                            <div className="flex items-start gap-2">
                                                <Badge variant="outline" className="text-xs shrink-0">{q.type.replace('_', ' ')}</Badge>
                                                <p className="text-sm text-gray-800">{q.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Segments */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Segments ({result.segments.length})</h3>
                                <div className="space-y-2">
                                    {result.segments.map((s, i) => (
                                        <div key={i} className="p-3 rounded-lg border border-pink-100 bg-pink-50/30">
                                            <p className="font-medium text-gray-900">{s.name}</p>
                                            <p className="text-sm text-gray-600">{s.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">Rule: {s.rules}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]">
                                Create This Funnel <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
