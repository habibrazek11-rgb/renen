import { getSession } from '@/lib/auth/session';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Settings, FileQuestion, Users, Palette } from 'lucide-react';

export default async function BuilderPage({ params }: { params: Promise<{ funnelId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');
    if (session.role === 'viewer') redirect('/funnels');

    const { funnelId } = await params;

    // Static Data Bypass: Mock all database results
    const funnel = {
        id: funnelId,
        name: 'Startup Feasibility',
        slug: 'startup-feasibility',
        workspaceId: session.workspaceId,
        versions: [{ version: 1, isPublished: true, isDraft: false }],
        segments: [
            { id: 'seg-1', name: 'High Potential', priority: 1, rules: [{}, {}], resultPage: { ctaConfig: { type: 'link' } } },
            { id: 'seg-2', name: 'Medium Growth', priority: 2, rules: [{}], resultPage: { ctaConfig: { type: 'form' } } },
        ]
    } as any;

    // Static Data Bypass: Mock all database results
    const webhooks = [
        {
            id: 'wh-1',
            url: 'https://api.example.com/webhooks/renen',
            isActive: true,
            events: ['lead.created', 'assessment.completed'],
            deliveries: [
                { id: 'del-1', success: true, eventType: 'lead.created', statusCode: 200, createdAt: new Date() },
                { id: 'del-2', success: false, eventType: 'assessment.completed', statusCode: 500, createdAt: new Date() },
            ]
        }
    ] as any[];

    if (!funnel) notFound();

    const latestVersion = funnel.versions[0];
    const isPublished = latestVersion?.isPublished && !latestVersion?.isDraft;

    const sections = [
        { href: `/builder/${funnelId}/landing`, label: 'Landing Page', icon: Globe, description: 'Edit headline, benefits, proof, FAQ blocks' },
        { href: `/builder/${funnelId}/assessment`, label: 'Assessment', icon: FileQuestion, description: 'Add/edit questions, answer options, scoring' },
        { href: `/builder/${funnelId}/segments`, label: 'Segments & Rules', icon: Users, description: 'Define segments and routing rules' },
        { href: `/builder/${funnelId}/results`, label: 'Result Pages', icon: Palette, description: 'Customize result pages and CTAs per segment' },
        { href: `/builder/${funnelId}/settings`, label: 'Settings', icon: Settings, description: 'Brand theme, webhooks, integrations' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/funnels">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{funnel.name}</h1>
                        <Badge variant={isPublished ? 'default' : 'secondary'} className={isPublished ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                            {isPublished ? 'Live' : 'Draft'}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Version {latestVersion?.version ?? 1} · Slug: {funnel.slug}
                    </p>
                </div>
                <div className="flex gap-2">
                    {isPublished && (
                        <a href={`/f/${funnel.slug}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                                <Globe className="w-4 h-4 mr-1" />
                                Preview
                            </Button>
                        </a>
                    )}
                    <form action={`/api/funnels/${funnelId}/publish`} method="POST">
                        <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]">
                            {isPublished ? 'Republish' : 'Publish'}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Builder Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sections.map((section) => (
                    <Link key={section.href} href={section.href}>
                        <Card className="hover:shadow-lg hover:shadow-pink-500/10 hover:border-pink-100 border-2 transition-all cursor-pointer group">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                                        <section.icon className="w-5 h-5 text-[#ff36a2]" />
                                    </div>
                                    <CardTitle className="text-base">{section.label}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">{section.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Segments Overview */}
            {funnel.segments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Segments ({funnel.segments.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {funnel.segments.map((seg: any) => (
                                <div key={seg.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-900">{seg.name}</p>
                                        <p className="text-xs text-gray-500">{seg.rules.length} rules · Priority {seg.priority}</p>
                                    </div>
                                    {seg.resultPage?.ctaConfig && (
                                        <Badge variant="outline" className="text-xs border-pink-200 text-[#ff36a2]">
                                            {seg.resultPage.ctaConfig.type}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
