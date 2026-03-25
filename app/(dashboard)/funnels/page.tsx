import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowRight, Globe, Users, Edit } from 'lucide-react';

export default async function FunnelsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    // Static Data Bypass: Mock all database results
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Funnels</h1>
                    <p className="text-gray-500 mt-1">{funnels.length} assessment funnels</p>
                </div>
                {session.role !== 'viewer' && (
                    <Button className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] shadow-lg shadow-pink-500/20">
                        <Plus className="w-4 h-4 mr-2" />
                        New Funnel
                    </Button>
                )}
            </div>

            {funnels.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No funnels yet. Create your first assessment funnel.</p>
                        {session.role !== 'viewer' && (
                            <Button className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Funnel
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {funnels.map((funnel) => {
                        const latestVersion = funnel.versions[0];
                        const isPublished = latestVersion?.isPublished && !latestVersion?.isDraft;
                        return (
                            <Card key={funnel.id} className="hover:shadow-lg hover:shadow-pink-500/10 transition-all group border-2 hover:border-pink-100">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg leading-tight">{funnel.name}</CardTitle>
                                        <Badge variant={isPublished ? 'default' : 'secondary'} className={`shrink-0 ${isPublished ? 'bg-green-100 text-green-800 border-green-200' : ''}`}>
                                            {isPublished ? 'Live' : 'Draft'}
                                        </Badge>
                                    </div>
                                    {funnel.project && (
                                        <p className="text-xs text-gray-500">{funnel.project.name}</p>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {funnel._count.leads} leads
                                        </span>
                                        <span>v{latestVersion?.version ?? 1}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {session.role !== 'viewer' && (
                                            <Link href={`/builder/${funnel.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Edit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={`/funnels/${funnel.id}`} className="flex-1">
                                            <Button variant="ghost" size="sm" className="w-full text-[#ff36a2] hover:bg-pink-50">
                                                View <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
