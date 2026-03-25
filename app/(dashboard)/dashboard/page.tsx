import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Funnel, Users, BarChart3, Plus, ArrowRight, Globe, Lock } from 'lucide-react';
import { getEventCounts } from '@/lib/services/event-logger';

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const canEdit = session.role === 'owner' || session.role === 'admin' || session.role === 'editor';
    const canManage = session.role === 'owner' || session.role === 'admin';
    const isViewer = session.role === 'viewer';

    // Static Data Bypass: Mock all database results
    const projects = [
        { id: 'proj-1', name: 'Main Platform', _count: { funnels: 2 } },
        { id: 'proj-2', name: 'Mobile App', _count: { funnels: 1 } },
    ];

    const funnels = [
        {
            id: 'fun-1',
            name: 'Startup Feasibility',
            workspaceId: session.workspaceId,
            project: { name: 'Main Platform' },
            versions: [{ version: 1, isPublished: true, isDraft: false }],
            _count: { leads: 12 },
            updatedAt: new Date(),
        },
        {
            id: 'fun-2',
            name: 'Founder Fit Assessment',
            workspaceId: session.workspaceId,
            project: { name: 'Main Platform' },
            versions: [{ version: 1, isPublished: true, isDraft: false }],
            _count: { leads: 8 },
            updatedAt: new Date(),
        }
    ] as any[];

    const stats = { views: 1540, completes: 420, starts: 800, leads: 120 };
    const totalFunnels = 3;
    const totalLeads = 120;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {session.name}</p>
                </div>
                {canEdit ? (
                    <Link href="/funnels">
                        <Button className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 transition-all">
                            <Plus className="w-4 h-4 mr-2" />
                            New Funnel
                        </Button>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <Lock className="w-4 h-4" />
                        Read-only — editors and above can create funnels
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Funnels', value: totalFunnels, icon: Funnel, color: 'text-[#ff36a2]', bg: 'bg-pink-50' },
                    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Page Views', value: stats.views, icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Completions', value: stats.completes, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat) => (
                    <Card key={stat.label} className="hover:shadow-md transition-shadow">
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

            {/* Workspace Management — Owner/Admin only */}
            {canManage && (
                <Card className="border-purple-100 bg-purple-50/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base text-purple-800">Workspace Management</CardTitle>
                        <CardDescription className="text-purple-600">Only visible to Owner and Admin roles</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                        <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-100">
                            Manage Team
                        </Button>
                        {session.role === 'owner' && (
                            <Button variant="outline" size="sm" className="border-pink-200 text-pink-700 hover:bg-pink-100">
                                Billing &amp; Plans
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                        <CardDescription>Your funnel projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {projects.map((project) => (
                                <div key={project.id} className="p-4 rounded-lg border border-gray-200 hover:border-pink-200 hover:bg-pink-50/30 transition-all">
                                    <p className="font-medium text-gray-900">{project.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">{project._count.funnels} funnels</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Funnels */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Funnels</CardTitle>
                        <CardDescription>Your latest assessment funnels</CardDescription>
                    </div>
                    <Link href="/funnels">
                        <Button variant="ghost" size="sm" className="text-[#ff36a2] hover:text-[#ff36a2] hover:bg-pink-50">
                            View all <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {funnels.map((funnel) => {
                            const latestVersion = funnel.versions[0];
                            const isPublished = latestVersion?.isPublished && !latestVersion?.isDraft;
                            return (
                                <div key={funnel.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-pink-100 hover:bg-pink-50/20 transition-all group">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900 truncate">{funnel.name}</p>
                                            <Badge variant={isPublished ? 'default' : 'secondary'} className={isPublished ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                                                {isPublished ? 'Live' : 'Draft'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {funnel._count.leads} leads · {funnel.project?.name ?? 'No project'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {canEdit ? (
                                            <Link href={`/builder/${funnel.id}`}>
                                                <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Edit
                                                </Button>
                                            </Link>
                                        ) : (
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-gray-400 border border-gray-200 rounded px-2 py-1">
                                                <Lock className="w-3 h-3" /> View only
                                            </span>
                                        )}
                                        <Link href={`/funnels/${funnel.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
