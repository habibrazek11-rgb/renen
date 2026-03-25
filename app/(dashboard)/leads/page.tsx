import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink } from 'lucide-react';

export default async function LeadsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    // Static Data Bypass: Mock all database results
    const leads = [
        {
            id: 'lead-1',
            email: 'jane@example.com',
            name: 'Jane Smith',
            funnel: { name: 'Startup Feasibility' },
            segment: { name: 'High Potential' },
            submissions: [{ snapshot: { totalScore: 88 } }],
            createdAt: new Date(),
        },
        {
            id: 'lead-2',
            email: 'bob@example.com',
            name: 'Bob Jones',
            funnel: { name: 'Startup Feasibility' },
            segment: { name: 'Medium Growth' },
            submissions: [{ snapshot: { totalScore: 65 } }],
            createdAt: new Date(),
        }
    ] as any[];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                    <p className="text-gray-500 mt-1">{leads.length} total leads</p>
                </div>
                <a href="/api/leads?format=csv">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </a>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Leads</CardTitle>
                </CardHeader>
                <CardContent>
                    {leads.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No leads yet. Publish a funnel to start collecting leads.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Funnel</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Segment</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => {
                                        const snapshot = lead.submissions[0]?.snapshot;
                                        return (
                                            <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <span className="font-medium text-gray-900">{lead.email ?? 'Anonymous'}</span>
                                                    {lead.name && <span className="text-gray-500 ml-2">({lead.name})</span>}
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">{lead.funnel.name}</td>
                                                <td className="py-3 px-4">
                                                    {lead.segment ? (
                                                        <Badge variant="outline" className="border-pink-200 text-[#ff36a2]">
                                                            {lead.segment.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {snapshot ? (
                                                        <span className="font-medium text-gray-900">{snapshot.totalScore}</span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-gray-500">
                                                    {lead.createdAt.toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Link href={`/leads/${lead.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
