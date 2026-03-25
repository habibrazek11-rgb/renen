import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, FileQuestion, Plus, GripVertical, Trash2, ChevronDown } from 'lucide-react';

const QUESTION_TYPES = ['multiple_choice', 'scale', 'yes_no', 'text', 'number'];

const MOCK_QUESTIONS = [
    { id: 'q1', type: 'multiple_choice', text: 'What stage is your startup currently at?', options: ['Idea', 'MVP', 'Pre-revenue', 'Revenue-generating'], score: 25 },
    { id: 'q2', type: 'multiple_choice', text: 'How large is your target market?', options: ['Local (<$1M)', 'Regional ($1M-$10M)', 'National ($10M-$100M)', 'Global (>$100M)'], score: 20 },
    { id: 'q3', type: 'scale', text: 'How differentiated is your product from existing solutions? (1–10)', options: [], score: 20 },
    { id: 'q4', type: 'yes_no', text: 'Do you have a working prototype or MVP?', options: [], score: 15 },
    { id: 'q5', type: 'multiple_choice', text: 'What is your team\'s relevant experience?', options: ['First-time founders', '1 prior startup', 'Domain experts (10+ years)', 'Serial entrepreneurs'], score: 20 },
];

export default async function BuilderAssessmentPage({ params }: { params: Promise<{ funnelId: string }> }) {
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
                        <FileQuestion className="w-6 h-6 text-[#ff36a2]" /> Assessment Questions
                    </h1>
                    <p className="text-sm text-gray-500">Define questions, answer options, and scoring weights</p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]"><Save className="w-4 h-4 mr-1" />Save</Button>
            </div>

            {/* Scoring summary */}
            <div className="grid grid-cols-4 gap-3">
                {[{ label: 'Total Questions', val: MOCK_QUESTIONS.length }, { label: 'Max Score', val: '100' }, { label: 'Avg Score/Question', val: '20' }, { label: 'Question Types', val: '4' }].map(s => (
                    <Card key={s.label}>
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900">{s.val}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Questions */}
            <div className="space-y-3">
                {MOCK_QUESTIONS.map((q, i) => (
                    <Card key={q.id} className="border-gray-200 hover:border-pink-200 transition-colors">
                        <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="flex items-center gap-2 shrink-0 mt-1">
                                    <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                                    <span className="w-7 h-7 rounded-full bg-pink-50 border border-pink-200 text-[#ff36a2] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <input type="text" defaultValue={q.text} className="flex-1 font-medium px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                                        <select defaultValue={q.type} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff36a2] bg-white">
                                            {QUESTION_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                                        </select>
                                        <div className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-xs">
                                            <span className="text-gray-500">Score:</span>
                                            <input type="number" defaultValue={q.score} className="w-12 text-center font-bold focus:outline-none" />
                                            <span className="text-gray-400">pts</span>
                                        </div>
                                    </div>
                                    {q.options.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 pl-4 border-l-2 border-pink-100">
                                            {q.options.map((opt, j) => (
                                                <div key={j} className="flex items-center gap-2">
                                                    <input type="text" defaultValue={opt} className="flex-1 text-xs px-2 py-1.5 rounded border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#ff36a2]" />
                                                    <input type="number" defaultValue={Math.round(q.score / q.options.length)} className="w-12 text-xs text-center px-2 py-1.5 rounded border border-gray-100 focus:outline-none" placeholder="pts" />
                                                </div>
                                            ))}
                                            <Button variant="ghost" size="sm" className="text-xs text-gray-400 col-span-2 justify-start">+ Add option</Button>
                                        </div>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-red-400 shrink-0"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button variant="outline" className="w-full border-dashed border-[#ff36a2] text-[#ff36a2] hover:bg-pink-50">
                <Plus className="w-4 h-4 mr-2" /> Add New Question
            </Button>
        </div>
    );
}
