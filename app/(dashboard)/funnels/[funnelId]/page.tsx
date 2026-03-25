import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft, Edit, Globe, Users, BarChart3, ExternalLink,
    Calendar, TrendingUp, Eye, Copy, Funnel
} from 'lucide-react';

export default async function FunnelDetailPage({ params }: { params: Promise<{ funnelId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');
    const { funnelId } = await params;

    const canEdit = session.role !== 'viewer';

    const mockFunnel = {
        id: funnelId,
        name: 'Startup Feasibility',
        slug: 'startup-feasibility',
        status: 'Live',
        project: 'Main Platform',
        version: 1,
        createdAt: 'Jan 15, 2025',
        updatedAt: 'Feb 1, 2025',
        publicUrl: `https://renen.app/f/startup-feasibility`,
    };

    const stats = [
        { label: 'Total Leads', value: '94', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Page Views', value: '1,240', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Completion Rate', value: '73%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Avg Score', value: '58 / 100', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const segments = [
        { name: 'High Potential', count: 24, color: 'bg-green-100 text-green-800 border-green-200', pct: '26%' },
        { name: 'Medium Growth', count: 41, color: 'bg-blue-100 text-blue-800 border-blue-200', pct: '44%' },
        { name: 'Not Ready Yet', count: 29, color: 'bg-gray-100 text-gray-700 border-gray-200', pct: '30%' },
    ];

    const recentLeads = [
        { id: 'lead-1', name: 'Jane Smith', email: 'jane@example.com', segment: 'High Potential', score: 88, date: '2 hours ago' },
        { id: 'lead-2', name: 'Bob Jones', email: 'bob@example.com', segment: 'Medium Growth', score: 65, date: '5 hours ago' },
        { id: 'lead-3', name: 'Maria Garcia', email: 'maria@example.com', segment: 'High Potential', score: 91, date: '1 day ago' },
        { id: 'lead-4', name: 'Alex Chen', email: 'alex@example.com', segment: 'Not Ready Yet', score: 32, date: '2 days ago' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/funnels">
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Funnels</Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{mockFunnel.name}</h1>
                        <Badge className="bg-green-100 text-green-800 border-green-200">{mockFunnel.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{mockFunnel.project} · v{mockFunnel.version} · Updated {mockFunnel.updatedAt}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" />Preview
                    </Button>
                    {canEdit && (
                        <Link href={`/builder/${funnelId}`}>
                            <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] gap-1.5">
                                <Edit className="w-3.5 h-3.5" />Edit Funnel
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Public URL */}
            <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4 flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm font-mono text-gray-600 flex-1 truncate">{mockFunnel.publicUrl}</span>
                    <Button variant="outline" size="sm" className="shrink-0"><Copy className="w-3.5 h-3.5 mr-1" />Copy Link</Button>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <Card key={s.label}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                                    <s.icon className={`w-4 h-4 ${s.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Segment Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Segment Distribution</CardTitle>
                        <CardDescription>How leads are classified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {segments.map(seg => (
                            <div key={seg.name} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <Badge className={`text-xs ${seg.color}`}>{seg.name}</Badge>
                                    <span className="text-gray-500">{seg.count} · {seg.pct}</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]" style={{ width: seg.pct }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base">Recent Leads</CardTitle>
                            <CardDescription>Latest submissions</CardDescription>
                        </div>
                        <Link href="/leads">
                            <Button variant="ghost" size="sm" className="text-[#ff36a2] hover:text-[#ff36a2] hover:bg-pink-50">View all</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {recentLeads.map(lead => (
                                <Link key={lead.id} href={`/leads/${lead.id}`}>
                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff36a2] to-[#ff6b9d] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <Badge className="text-xs bg-green-100 text-green-800 border-green-200 mb-1">{lead.segment}</Badge>
                                            <p className="text-xs text-gray-400">{lead.date}</p>
                                        </div>
                                        <span className="text-lg font-bold text-gray-700 w-12 text-right shrink-0">{lead.score}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Builder shortcuts */}
            {canEdit && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Builder Sections</CardTitle>
                        <CardDescription>Edit individual parts of this funnel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: 'Landing Page', href: `/builder/${funnelId}/landing`, emoji: '🌐' },
                                { label: 'Assessment', href: `/builder/${funnelId}/assessment`, emoji: '📝' },
                                { label: 'Segments', href: `/builder/${funnelId}/segments`, emoji: '🎯' },
                                { label: 'Results', href: `/builder/${funnelId}/results`, emoji: '✅' },
                            ].map(s => (
                                <Link key={s.href} href={s.href}>
                                    <div className="p-4 rounded-xl border border-gray-200 hover:border-pink-200 hover:bg-pink-50/30 transition-all text-center group">
                                        <span className="text-2xl mb-2 block">{s.emoji}</span>
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-[#ff36a2]">{s.label}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
