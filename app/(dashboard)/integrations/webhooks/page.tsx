import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Webhook, CheckCircle, XCircle } from 'lucide-react';

export default async function WebhooksPage() {
    const session = await getSession();
    if (!session) redirect('/login');

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Webhook className="w-8 h-8 text-[#ff36a2]" />
                    Webhooks
                </h1>
                <p className="text-gray-500 mt-1">Receive real-time events when leads submit assessments</p>
            </div>

            {webhooks.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Webhook className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No webhooks configured yet</p>
                        <p className="text-sm text-gray-400">Use the API to create webhook endpoints: POST /api/webhooks</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {webhooks.map((webhook) => (
                        <Card key={webhook.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-mono">{webhook.url}</CardTitle>
                                    <Badge variant={webhook.isActive ? 'default' : 'secondary'} className={webhook.isActive ? 'bg-green-100 text-green-800' : ''}>
                                        {webhook.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500">Events: {webhook.events.join(', ')}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm font-medium text-gray-700 mb-2">Recent Deliveries</p>
                                {webhook.deliveries.length === 0 ? (
                                    <p className="text-sm text-gray-400">No deliveries yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {webhook.deliveries.map((d: any) => (
                                            <div key={d.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 text-sm">
                                                {d.success ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                                )}
                                                <span className="font-mono text-gray-600">{d.eventType}</span>
                                                <span className="text-gray-400">HTTP {d.statusCode ?? '—'}</span>
                                                <span className="text-gray-400 ml-auto">{d.createdAt.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
