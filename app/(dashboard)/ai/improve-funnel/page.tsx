"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Loader2, CheckCircle, TrendingUp, Target, Lightbulb } from "lucide-react";

const MOCK_FUNNEL = {
    id: 'fun-1',
    name: 'Startup Feasibility',
    questions: 10,
    avgScore: 58,
    leads: 94,
    completionRate: '73%',
};

const MOCK_SUGGESTIONS = [
    { type: 'question', icon: '❓', title: 'Add a team composition question', reason: 'Leads with team-related questions score 23% higher alignment. Your funnel is missing this signal.', impact: 'High' },
    { type: 'scoring', icon: '⚖️', title: 'Reweight market size scoring', reason: 'Currently worth 20pts but investors prioritize it more. Suggest increasing to 30pts.', impact: 'Medium' },
    { type: 'segment', icon: '🎯', title: 'Add a "Watch List" segment (50–69 pts)', reason: '31% of your leads fall between Medium and High — they\'re not getting a tailored message.', impact: 'High' },
    { type: 'copy', icon: '✍️', title: 'Improve landing page headline clarity', reason: 'A/B test data suggests action-oriented headlines increase start rate by 18%.', impact: 'Low' },
];

export default function ImproveFunnelAIPage() {
    const [loading, setLoading] = useState(false);
    const [analysed, setAnalysed] = useState(false);

    async function handleAnalyse() {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1800));
        setLoading(false);
        setAnalysed(true);
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    AI Funnel Optimizer
                </h1>
                <p className="text-gray-500 mt-1">AI analyses your existing funnel data and suggests improvements to increase quality leads</p>
            </div>

            {/* Select funnel */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Funnel to Analyse</label>
                        <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff36a2]">
                            <option>Startup Feasibility (94 leads, 73% completion)</option>
                            <option>Founder Fit Assessment (51 leads, 68% completion)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[{ label: 'Total Leads', val: MOCK_FUNNEL.leads }, { label: 'Avg Score', val: MOCK_FUNNEL.avgScore }, { label: 'Completion Rate', val: MOCK_FUNNEL.completionRate }].map(s => (
                            <div key={s.label} className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <p className="text-xl font-bold text-gray-900">{s.val}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <Button onClick={handleAnalyse} disabled={loading} className="bg-gradient-to-r from-purple-500 to-[#ff36a2] hover:shadow-lg transition-all">
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analysing funnel...</> : <><Sparkles className="w-4 h-4 mr-2" />Analyse &amp; Get Suggestions</>}
                    </Button>
                </CardContent>
            </Card>

            {analysed && (
                <div className="space-y-4 animate-[fadeInUp_0.4s_ease-out]">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Analysis complete — {MOCK_SUGGESTIONS.length} improvements found
                    </div>
                    {MOCK_SUGGESTIONS.map((s, i) => (
                        <Card key={i} className="hover:border-purple-200 transition-colors">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">{s.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-gray-900">{s.title}</p>
                                            <Badge className={`text-xs ${s.impact === 'High' ? 'bg-red-100 text-red-700 border-red-200' : s.impact === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-600'}`}>{s.impact} Impact</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">{s.reason}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="shrink-0 border-purple-200 text-purple-700 hover:bg-purple-50">Apply</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
