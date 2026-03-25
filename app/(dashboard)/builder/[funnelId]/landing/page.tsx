import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Globe, Eye, Pencil, Image, AlignLeft, HelpCircle, Star } from 'lucide-react';

export default async function BuilderLandingPage({ params }: { params: Promise<{ funnelId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { funnelId } = await params;

    const mockFunnel = { id: funnelId, name: 'Startup Feasibility', slug: 'startup-feasibility' };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href={`/builder/${funnelId}`}>
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back to Builder</Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="w-6 h-6 text-[#ff36a2]" /> Landing Page Editor
                    </h1>
                    <p className="text-sm text-gray-500">{mockFunnel.name} · /f/{mockFunnel.slug}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1" />Preview</Button>
                    <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]"><Save className="w-4 h-4 mr-1" />Save</Button>
                </div>
            </div>

            {/* Hero Section */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><AlignLeft className="w-4 h-4" />Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                        <input type="text" defaultValue="Is Your Startup Idea Ready for Investment?" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
                        <textarea rows={2} defaultValue="Answer 10 questions and get a structured, AI-powered assessment of your startup's investment readiness in under 5 minutes." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2] resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                        <input type="text" defaultValue="Start Free Assessment →" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                    </div>
                </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-4 h-4" />Benefits / Value Props</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {['Instant AI-powered feasibility score', 'Personalized recommendations for your stage', 'Expert-designed criteria used by investors'].map((b, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-pink-50 border border-pink-200 text-[#ff36a2] flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                            <input type="text" defaultValue={b} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600">✕</Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" className="mt-2">+ Add Benefit</Button>
                </CardContent>
            </Card>

            {/* Social Proof */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-4 h-4" />Social Proof</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        {[{ label: 'Stat 1', val: '500+', desc: 'Startups Evaluated' }, { label: 'Stat 2', val: '94%', desc: 'Accuracy Rate' }, { label: 'Stat 3', val: '48h', desc: 'Avg. Decision Time' }].map((s) => (
                            <div key={s.label} className="p-3 rounded-lg border border-gray-200 space-y-2">
                                <input type="text" defaultValue={s.val} className="w-full text-center font-bold text-xl px-2 py-1 rounded border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#ff36a2]" />
                                <input type="text" defaultValue={s.desc} className="w-full text-center text-xs px-2 py-1 rounded border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#ff36a2] text-gray-500" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><HelpCircle className="w-4 h-4" />FAQ</CardTitle>
                    <Button variant="outline" size="sm">+ Add Question</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[
                        { q: 'How long does the assessment take?', a: 'About 5 minutes. There are 10 short questions about your startup.' },
                        { q: 'Is my idea kept confidential?', a: 'Yes, all submissions are encrypted and only shared with the RENEN evaluation team.' },
                        { q: 'What happens after I submit?', a: 'You\'ll receive your result instantly, and our team will follow up within 48 hours for high-potential applicants.' },
                    ].map((faq, i) => (
                        <div key={i} className="p-4 rounded-lg border border-gray-100 space-y-2">
                            <input type="text" defaultValue={faq.q} className="w-full font-medium px-3 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff36a2]" />
                            <textarea rows={2} defaultValue={faq.a} className="w-full text-sm text-gray-600 px-3 py-1.5 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff36a2] resize-none" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
