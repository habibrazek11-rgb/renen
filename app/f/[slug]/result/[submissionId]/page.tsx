import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, ExternalLink, Sparkles } from 'lucide-react';
import { logEvent } from '@/lib/services/event-logger';

export default async function ResultPage({
    params,
}: {
    params: Promise<{ slug: string; submissionId: string }>;
}) {
    const { slug, submissionId } = await params;

    const submission = await db.submission.findUnique({
        where: { id: submissionId },
        include: {
            lead: true,
            snapshot: true,
            funnelVersion: {
                include: {
                    funnel: true,
                    assessment: { include: { scoreCategories: true } },
                },
            },
        },
    });

    if (!submission || !submission.snapshot) notFound();

    const snapshot = submission.snapshot;
    const funnel = submission.funnelVersion.funnel;
    const categories = submission.funnelVersion.assessment?.scoreCategories ?? [];

    // Get segment result page + CTA
    const resultPage = snapshot.segmentId
        ? await db.resultPage.findUnique({
            where: { segmentId: snapshot.segmentId },
            include: { ctaConfig: true },
        })
        : null;

    // Log result view
    logEvent({
        eventType: 'result.viewed',
        workspaceId: funnel.workspaceId,
        funnelId: funnel.id,
        leadId: submission.leadId,
        submissionId: submission.id,
    }).catch(() => { });

    const categoryScores = snapshot.categoryScores as Record<string, number>;
    const maxScoreTotal = categories.reduce((sum: number, c: { maxScore: number }) => sum + c.maxScore, 0);
    const percentage = maxScoreTotal > 0 ? Math.round((snapshot.totalScore / maxScoreTotal) * 100) : 0;

    const primary = '#ff36a2';

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-100 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff36a2] to-[#ff6b9d] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">{funnel.name}</span>
                </div>
            </header>

            <main className="py-12 px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Success */}
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {resultPage?.headline ?? 'Your Results Are Ready!'}
                        </h1>
                    </div>

                    {/* Score Card */}
                    <div className="p-8 rounded-2xl text-center" style={{ background: `linear-gradient(135deg, ${primary}15, ${primary}05)`, border: `2px solid ${primary}20` }}>
                        <p className="text-6xl font-bold mb-2" style={{ color: primary }}>{snapshot.totalScore}</p>
                        <p className="text-gray-500 mb-4">out of {maxScoreTotal} points ({percentage}%)</p>
                        <Badge className="text-base px-4 py-1" style={{ background: primary, color: 'white' }}>
                            {snapshot.tier}
                        </Badge>
                        {snapshot.segmentName && (
                            <p className="text-lg font-semibold text-gray-800 mt-4">{snapshot.segmentName}</p>
                        )}
                    </div>

                    {/* Category Breakdown */}
                    {categories.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="font-semibold text-gray-900">Category Breakdown</h2>
                            {categories.map((cat: { id: string; name: string; maxScore: number }) => {
                                const score = categoryScores[cat.name] ?? 0;
                                const pct = cat.maxScore > 0 ? (score / cat.maxScore) * 100 : 0;
                                return (
                                    <div key={cat.id}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{cat.name}</span>
                                            <span className="text-gray-500">{score}/{cat.maxScore}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: primary }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Decision Reason */}
                    {snapshot.decisionReason && (
                        <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                            <p className="text-gray-700 leading-relaxed">{snapshot.decisionReason}</p>
                        </div>
                    )}

                    {/* Result Page Body */}
                    {resultPage?.body && (
                        <div className="prose prose-gray max-w-none">
                            {resultPage.body.split('\n\n').map((para: string, i: number) => (
                                <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    {resultPage?.ctaConfig && resultPage.ctaConfig.url && (
                        <div className="p-6 rounded-2xl text-center" style={{ background: `linear-gradient(135deg, ${primary}, #ff6b9d)` }}>
                            <a href={resultPage.ctaConfig.url} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-white text-[#ff36a2] hover:bg-pink-50 font-bold px-8 py-4 text-lg shadow-lg">
                                    {resultPage.ctaConfig.label}
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            </a>
                        </div>
                    )}

                    {/* PDF Download */}
                    <div className="text-center">
                        <a href={`/api/submissions/${submissionId}/report`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="border-[#ff36a2] text-[#ff36a2] hover:bg-pink-50">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF Report
                            </Button>
                        </a>
                    </div>

                    {/* Share */}
                    <div className="text-center text-sm text-gray-400">
                        <p>Powered by <Link href="/" className="font-semibold" style={{ color: primary }}>RENEN</Link></p>
                    </div>
                </div>
            </main>
        </div>
    );
}
