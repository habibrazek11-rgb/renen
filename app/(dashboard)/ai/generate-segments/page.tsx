"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Loader2, CheckCircle, Target, Plus, Trash2 } from "lucide-react";

const MOCK_GENERATED = [
    { name: 'High Potential', score: '70–100', description: 'Strong market fit, experienced team, scalable model. Ready for investor conversation.', color: 'green', leads: 24 },
    { name: 'Medium Growth', score: '45–69', description: 'Good concept but needs validation. Recommend 90-day incubator program before funding.', color: 'blue', leads: 41 },
    { name: 'Early Stage', score: '25–44', description: 'Promising idea but missing key components. Needs MVP and market validation first.', color: 'amber', leads: 19 },
    { name: 'Not Ready', score: '0–24', description: 'Fundamental gaps in business model or market understanding. Recommend foundation resources.', color: 'gray', leads: 10 },
];

export default function GenerateSegmentsAIPage() {
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [context, setContext] = useState('');

    async function handleGenerate() {
        if (!context.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 2000));
        setLoading(false);
        setGenerated(true);
    }

    const colorMap: Record<string, string> = {
        green: 'border-green-200 bg-green-50/50',
        blue: 'border-blue-200 bg-blue-50/50',
        amber: 'border-amber-200 bg-amber-50/50',
        gray: 'border-gray-200 bg-gray-50/50',
    };
    const badgeMap: Record<string, string> = {
        green: 'bg-green-100 text-green-700 border-green-200',
        blue: 'bg-blue-100 text-blue-700 border-blue-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        gray: 'bg-gray-100 text-gray-600 border-gray-200',
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    AI Segment Generator
                </h1>
                <p className="text-gray-500 mt-1">Describe your evaluation criteria and AI will design smart scoring segments for your funnel</p>
            </div>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Funnel</label>
                        <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff36a2]">
                            <option>Startup Feasibility (10 questions, max 100 pts)</option>
                            <option>Founder Fit Assessment (8 questions, max 80 pts)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Context</label>
                        <textarea
                            value={context}
                            onChange={e => setContext(e.target.value)}
                            rows={4}
                            placeholder="e.g. We are a seed-stage fund investing in B2B SaaS startups. We prioritize teams with domain expertise, addressable markets above $50M, and products with at least 3 paying customers. We want to segment leads into investment-ready, follow-up, and educational tracks."
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2] resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Segments</label>
                        <div className="flex gap-2">
                            {[2, 3, 4, 5].map(n => (
                                <button key={n} className={`w-10 h-10 rounded-lg border-2 font-bold text-sm transition-all ${n === 4 ? 'border-[#ff36a2] bg-pink-50 text-[#ff36a2]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>{n}</button>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleGenerate} disabled={loading || !context.trim()} className="bg-gradient-to-r from-purple-500 to-[#ff36a2] hover:shadow-lg transition-all">
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating segments...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Segments</>}
                    </Button>
                </CardContent>
            </Card>

            {generated && (
                <div className="space-y-4 animate-[fadeInUp_0.4s_ease-out]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                            <CheckCircle className="w-5 h-5" />
                            {MOCK_GENERATED.length} segments generated
                        </div>
                        <Button className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]">
                            Apply to Funnel
                        </Button>
                    </div>

                    {MOCK_GENERATED.map((seg, i) => (
                        <Card key={i} className={`border-2 ${colorMap[seg.color]}`}>
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <input type="text" defaultValue={seg.name} className="flex-1 font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-[#ff36a2] text-base" />
                                            <Badge className={`shrink-0 ${badgeMap[seg.color]}`}>{seg.score} pts</Badge>
                                            <Badge variant="outline" className="shrink-0 text-xs text-gray-500">{seg.leads} est. leads</Badge>
                                        </div>
                                        <textarea rows={2} defaultValue={seg.description} className="w-full text-sm text-gray-600 bg-transparent border-b border-dashed border-gray-200 focus:outline-none focus:border-[#ff36a2] resize-none" />
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-red-400 shrink-0"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Button variant="outline" className="w-full border-dashed border-gray-300 text-gray-500 hover:border-[#ff36a2] hover:text-[#ff36a2]">
                        <Plus className="w-4 h-4 mr-2" /> Add Segment Manually
                    </Button>
                </div>
            )}
        </div>
    );
}
