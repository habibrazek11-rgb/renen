import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft, Mail, Phone, Globe, Calendar,
    BarChart3, FileText, Download, Star, MessageSquare
} from 'lucide-react';

export default async function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');
    const { leadId } = await params;

    const canEdit = session.role !== 'viewer';

    const mockLead = {
        id: leadId,
        name: 'Jane Smith',
        email: 'jane@techstartup.io',
        phone: '+1 (415) 555-0123',
        company: 'TechStartup Inc.',
        website: 'https://techstartup.io',
        submittedAt: 'Feb 18, 2025 at 14:32',
        funnel: 'Startup Feasibility',
        segment: { name: 'High Potential', color: 'bg-green-100 text-green-800 border-green-200' },
        score: 88,
        maxScore: 100,
    };

    const answers = [
        { question: 'What stage is your startup currently at?', answer: 'MVP', score: 20, maxScore: 25 },
        { question: 'How large is your target market?', answer: 'Global (>$100M)', score: 20, maxScore: 20 },
        { question: 'How differentiated is your product from existing solutions? (1–10)', answer: '8', score: 16, maxScore: 20 },
        { question: 'Do you have a working prototype or MVP?', answer: 'Yes', score: 15, maxScore: 15 },
        { question: "What is your team's relevant experience?", answer: 'Domain experts (10+ years)', score: 17, maxScore: 20 },
    ];

    const timeline = [
        { event: 'Lead created', time: '2 hours ago', icon: '🟢' },
        { event: 'Assessment completed (Score: 88/100)', time: '2 hours ago', icon: '📊' },
        { event: 'Assigned to segment: High Potential', time: '2 hours ago', icon: '🎯' },
        { event: 'Notification email sent', time: '2 hours ago', icon: '📧' },
    ];

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/leads">
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Leads</Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{mockLead.name}</h1>
                        <Badge className={mockLead.segment.color}>{mockLead.segment.name}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{mockLead.company} · Submitted {mockLead.submittedAt}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />Export PDF</Button>
                    {canEdit && (
                        <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]">
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />Contact
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                    {/* Contact Info */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Contact Info</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { icon: Mail, label: mockLead.email, href: `mailto:${mockLead.email}` },
                                { icon: Phone, label: mockLead.phone, href: `tel:${mockLead.phone}` },
                                { icon: Globe, label: mockLead.website, href: mockLead.website },
                            ].map(({ icon: Icon, label, href }) => (
                                <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#ff36a2] transition-colors">
                                    <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="truncate">{label}</span>
                                </a>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Score Card */}
                    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-100">
                        <CardContent className="p-5 text-center">
                            <p className="text-sm font-medium text-gray-600 mb-2">Assessment Score</p>
                            <div className="text-5xl font-black text-gray-900 mb-1">{mockLead.score}</div>
                            <div className="text-sm text-gray-500">out of {mockLead.maxScore}</div>
                            <div className="mt-4 h-2.5 rounded-full bg-white/70 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]" style={{ width: `${mockLead.score}%` }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Top 15% of all applicants</p>
                        </CardContent>
                    </Card>

                    {/* Funnel Info */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Funnel</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-gray-800">{mockLead.funnel}</p>
                            <Link href="/funnels/fun-1" className="text-xs text-[#ff36a2] hover:underline">View funnel →</Link>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    {canEdit && (
                        <Card>
                            <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
                            <CardContent>
                                <textarea rows={4} placeholder="Add internal notes about this lead..." className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff36a2] resize-none" />
                                <Button size="sm" variant="outline" className="mt-2 w-full">Save Note</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Assessment Answers */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="w-4 h-4" />Assessment Answers
                                </CardTitle>
                                <Badge variant="outline" className="text-xs">Score: {mockLead.score}/{mockLead.maxScore}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {answers.map((a, i) => (
                                <div key={i} className="p-4 rounded-lg border border-gray-100 hover:border-pink-100 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Q{i + 1}</p>
                                            <p className="text-sm text-gray-700 font-medium mb-2">{a.question}</p>
                                            <p className="text-sm text-[#ff36a2] font-semibold">{a.answer}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-lg font-bold text-gray-900">{a.score}</span>
                                            <span className="text-sm text-gray-400">/{a.maxScore}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {timeline.map((t, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-lg">{t.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800">{t.event}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 shrink-0">{t.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
