import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Palette, ExternalLink, Phone, FileText, Calendar } from 'lucide-react';

const MOCK_SEGMENTS = [
    { id: 'seg-1', name: 'High Potential', color: 'green', cta: { type: 'link', label: 'Book a Call', url: 'https://calendly.com/renen/call' }, headline: '🎉 Congratulations! Your startup shows strong investment potential.', body: 'Our team has reviewed your profile and your idea scores in the top 30% of all applications. We\'d love to learn more.' },
    { id: 'seg-2', name: 'Medium Growth', color: 'blue', cta: { type: 'form', label: 'Get More Info', url: '' }, headline: '✨ Great foundation! Your startup has clear growth potential.', body: 'You\'re on the right track. With a few refinements, you could be investor-ready within 3-6 months. Let us show you how.' },
    { id: 'seg-3', name: 'Not Ready Yet', color: 'gray', cta: { type: 'link', label: 'View Resources', url: 'https://renen.app/resources' }, headline: '📚 Not quite there yet — but that\'s okay!', body: 'Most successful startups weren\'t investor-ready on day one. Here are some resources to help you strengthen your foundation.' },
];

const CTA_TYPES = [
    { id: 'link', icon: ExternalLink, label: 'External Link' },
    { id: 'phone', icon: Phone, label: 'Phone / WhatsApp' },
    { id: 'form', icon: FileText, label: 'Intake Form' },
    { id: 'calendar', icon: Calendar, label: 'Calendar Booking' },
];

export default async function BuilderResultsPage({ params }: { params: Promise<{ funnelId: string }> }) {
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
                        <Palette className="w-6 h-6 text-[#ff36a2]" /> Result Pages
                    </h1>
                    <p className="text-sm text-gray-500">Customize what each segment sees after completing the assessment</p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]"><Save className="w-4 h-4 mr-1" />Save</Button>
            </div>

            <div className="space-y-6">
                {MOCK_SEGMENTS.map((seg) => {
                    const colorMap: Record<string, string> = {
                        green: 'border-green-200',
                        blue: 'border-blue-200',
                        gray: 'border-gray-200',
                    };
                    const badgeMap: Record<string, string> = {
                        green: 'bg-green-100 text-green-700 border-green-200',
                        blue: 'bg-blue-100 text-blue-700 border-blue-200',
                        gray: 'bg-gray-100 text-gray-600 border-gray-200',
                    };
                    return (
                        <Card key={seg.id} className={`border-2 ${colorMap[seg.color]}`}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <CardTitle className="flex-1">{seg.name}</CardTitle>
                                    <Badge className={`${badgeMap[seg.color]}`}>Segment</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {/* Result Page Content */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Headline</label>
                                    <input type="text" defaultValue={seg.headline} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                                    <label className="text-sm font-medium text-gray-700">Body Message</label>
                                    <textarea rows={3} defaultValue={seg.body} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2] resize-none" />
                                </div>

                                {/* CTA Config */}
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                                    <p className="text-sm font-semibold text-gray-700">Call to Action</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {CTA_TYPES.map(({ id, icon: Icon, label }) => (
                                            <button key={id} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-xs font-medium ${seg.cta.type === id ? 'border-[#ff36a2] bg-pink-50 text-[#ff36a2]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                                <Icon className="w-4 h-4" />
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Button Label</label>
                                            <input type="text" defaultValue={seg.cta.label} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Destination URL</label>
                                            <input type="url" defaultValue={seg.cta.url} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center bg-white">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Preview</p>
                                    <p className="text-lg font-bold text-gray-900 mb-2">{seg.headline}</p>
                                    <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{seg.body}</p>
                                    <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]">{seg.cta.label}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
