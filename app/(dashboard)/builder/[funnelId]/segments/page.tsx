import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Users, Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react';

const MOCK_SEGMENTS = [
    {
        id: 'seg-1', name: 'High Potential', priority: 1, color: 'green',
        rules: [{ field: 'totalScore', operator: '>=', value: '70' }, { field: 'marketSize', operator: '==', value: 'Global' }],
        leads: 24,
    },
    {
        id: 'seg-2', name: 'Medium Growth', priority: 2, color: 'blue',
        rules: [{ field: 'totalScore', operator: '>=', value: '40' }, { field: 'totalScore', operator: '<', value: '70' }],
        leads: 51,
    },
    {
        id: 'seg-3', name: 'Not Ready Yet', priority: 3, color: 'gray',
        rules: [{ field: 'totalScore', operator: '<', value: '40' }],
        leads: 19,
    },
];

const OPERATORS = ['>=', '<=', '==', '!=', '>', '<'];
const FIELDS = ['totalScore', 'marketSize', 'stage', 'teamExperience', 'hasPrototype'];

export default async function BuilderSegmentsPage({ params }: { params: Promise<{ funnelId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');
    const { funnelId } = await params;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href={`/builder/${funnelId}`}>
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back to Builder</Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-[#ff36a2]" /> Segments &amp; Rules
                    </h1>
                    <p className="text-sm text-gray-500">Configure how leads are classified based on their assessment answers</p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]"><Save className="w-4 h-4 mr-1" />Save</Button>
            </div>

            {/* How it works */}
            <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4 text-sm text-blue-700">
                    <strong>How Segments Work:</strong> Rules are evaluated in priority order. A lead is placed in the first segment whose rules all match. Make sure your rules are mutually exclusive or ordered by priority.
                </CardContent>
            </Card>

            {/* Segments */}
            <div className="space-y-4">
                {MOCK_SEGMENTS.map((seg, i) => {
                    const colorMap: Record<string, string> = {
                        green: 'border-green-200 bg-green-50/50',
                        blue: 'border-blue-200 bg-blue-50/50',
                        gray: 'border-gray-200 bg-gray-50/50',
                    };
                    const badgeMap: Record<string, string> = {
                        green: 'bg-green-100 text-green-700 border-green-200',
                        blue: 'bg-blue-100 text-blue-700 border-blue-200',
                        gray: 'bg-gray-100 text-gray-600 border-gray-200',
                    };
                    return (
                        <Card key={seg.id} className={`border-2 ${colorMap[seg.color]}`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                                    <span className="text-xs font-semibold text-gray-400">PRIORITY {seg.priority}</span>
                                    <input type="text" defaultValue={seg.name} className="flex-1 font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-[#ff36a2] text-lg" />
                                    <Badge className={`text-xs ${badgeMap[seg.color]}`}>{seg.leads} leads</Badge>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rules (ALL must match)</p>
                                <div className="space-y-2">
                                    {seg.rules.map((rule, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <select defaultValue={rule.field} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff36a2]">
                                                {FIELDS.map(f => <option key={f}>{f}</option>)}
                                            </select>
                                            <select defaultValue={rule.operator} className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff36a2]">
                                                {OPERATORS.map(op => <option key={op}>{op}</option>)}
                                            </select>
                                            <input type="text" defaultValue={rule.value} className="w-28 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-[#ff36a2]">
                                    <Plus className="w-3 h-3 mr-1" />Add Rule
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Button variant="outline" className="w-full border-dashed border-[#ff36a2] text-[#ff36a2] hover:bg-pink-50">
                <Plus className="w-4 h-4 mr-2" />Add New Segment
            </Button>
        </div>
    );
}
