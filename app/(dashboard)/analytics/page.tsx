import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, MousePointerClick } from 'lucide-react';

export default async function AnalyticsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    // Static Data Bypass: Mock all database results
    const views = 1540;
    const starts = 800;
    const completes = 420;
    const leads = 120;
    const ctaClicks = 95;
    const events = { length: views + starts + completes + leads + ctaClicks };

    const funnelStats = [
        { id: 'fun-1', name: 'Startup Feasibility', _count: { leads: 12 } },
        { id: 'fun-2', name: 'Founder Fit Assessment', _count: { leads: 8 } },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 mt-1">Last 7 days</p>
            </div>

            {/* Conversion Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#ff36a2]" />
                        Conversion Funnel
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { label: 'Page Views', value: views, color: 'bg-blue-500', pct: 100 },
                            { label: 'Started Assessment', value: starts, color: 'bg-purple-500', pct: views > 0 ? Math.round((starts / views) * 100) : 0 },
                            { label: 'Completed Assessment', value: completes, color: 'bg-pink-500', pct: views > 0 ? Math.round((completes / views) * 100) : 0 },
                            { label: 'Leads Captured', value: leads, color: 'bg-green-500', pct: views > 0 ? Math.round((leads / views) * 100) : 0 },
                            { label: 'CTA Clicks', value: ctaClicks, color: 'bg-orange-500', pct: views > 0 ? Math.round((ctaClicks / views) * 100) : 0 },
                        ].map((step) => (
                            <div key={step.label}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">{step.label}</span>
                                    <span className="text-sm text-gray-500">{step.value} ({step.pct}%)</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${step.color} rounded-full transition-all`}
                                        style={{ width: `${step.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Events', value: events.length, icon: BarChart3, color: 'text-[#ff36a2]', bg: 'bg-pink-50' },
                    { label: 'Leads Created', value: leads, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'CTA Clicks', value: ctaClicks, icon: MousePointerClick, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Completion Rate', value: `${starts > 0 ? Math.round((completes / starts) * 100) : 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Per-Funnel Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Leads by Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {funnelStats.map((funnel: { id: string; name: string; _count: { leads: number } }) => (
                            <div key={funnel.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <span className="font-medium text-gray-900">{funnel.name}</span>
                                <span className="text-sm text-gray-500">{funnel._count.leads} leads</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
