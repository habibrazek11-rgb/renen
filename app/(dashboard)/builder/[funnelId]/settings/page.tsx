import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Settings, Palette, Globe, Webhook, Shield, Trash2, Copy } from 'lucide-react';

export default async function BuilderSettingsPage({ params }: { params: Promise<{ funnelId: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');
    const { funnelId } = await params;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href={`/builder/${funnelId}`}>
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back to Builder</Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-6 h-6 text-[#ff36a2]" /> Funnel Settings
                    </h1>
                    <p className="text-sm text-gray-500">Brand, domain, webhooks, and security</p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]"><Save className="w-4 h-4 mr-1" />Save</Button>
            </div>

            {/* General */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe className="w-4 h-4" />General</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funnel Name</label>
                        <input type="text" defaultValue="Startup Feasibility" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Public URL Slug</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50">renen.app/f/</span>
                            <input type="text" defaultValue="startup-feasibility" className="flex-1 px-4 py-2.5 rounded-r-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-gray-800">Published</p>
                            <p className="text-xs text-gray-500">Funnel is live and accepting submissions</p>
                        </div>
                        <div className="w-11 h-6 rounded-full bg-green-400 relative cursor-pointer">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Branding */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Palette className="w-4 h-4" />Branding &amp; Theme</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" defaultValue="#ff36a2" className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                                <input type="text" defaultValue="#ff36a2" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" defaultValue="#ffffff" className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                                <input type="text" defaultValue="#ffffff" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                        <input type="url" placeholder="https://yourdomain.com/logo.png" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
                        <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff36a2]">
                            <option>Inter (Default)</option>
                            <option>Outfit</option>
                            <option>Roboto</option>
                            <option>Poppins</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Webhook */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Webhook className="w-4 h-4" />Webhook</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification URL</label>
                        <input type="url" defaultValue="https://api.example.com/webhooks/renen" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 p-2.5 rounded-lg border border-gray-100 bg-gray-50 font-mono text-xs text-gray-600 truncate">
                            whsec_renen_8f2k3j9...
                        </div>
                        <Button variant="outline" size="sm"><Copy className="w-3.5 h-3.5 mr-1" />Copy Secret</Button>
                    </div>
                    <p className="text-xs text-gray-400">Events triggered: <code className="bg-gray-100 px-1 rounded">lead.created</code> <code className="bg-gray-100 px-1 rounded">assessment.completed</code></p>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base text-red-700"><Shield className="w-4 h-4" />Danger Zone</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/50">
                        <div>
                            <p className="text-sm font-medium text-red-800">Archive Funnel</p>
                            <p className="text-xs text-red-600">Hides the funnel from public access but keeps all data</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">Archive</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                        <div>
                            <p className="text-sm font-medium text-red-900">Delete Funnel</p>
                            <p className="text-xs text-red-700">Permanently deletes this funnel and all associated leads</p>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white"><Trash2 className="w-3.5 h-3.5 mr-1" />Delete</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
