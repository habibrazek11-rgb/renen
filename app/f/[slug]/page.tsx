import staticDb from '@/lib/static-db';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { generateAnonymousId, getVariant } from '@/lib/services/ab-testing';
import { logEvent } from '@/lib/services/event-logger';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default async function FunnelLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const funnel = staticDb.getFunnelBySlug(slug);
    if (!funnel) notFound();

    const version = staticDb.getLatestPublishedVersion(funnel.id);
    if (!version) notFound();

    // Get or create anonymous ID
    const cookieStore = await cookies();
    let anonymousId = cookieStore.get('renen_anon')?.value;
    if (!anonymousId) {
        anonymousId = generateAnonymousId();
    }

    const abVariant = getVariant('landing_page_v1', anonymousId);
    const landingPage = version.landingPage as {
        blocks: Array<{
            type: string;
            headline?: string;
            subheadline?: string;
            ctaText?: string;
            items?: string[];
            stats?: Array<{ value: string; label: string }>;
            faq?: Array<{ q: string; a: string }>;
        }>;
    } | null;

    const heroBlock = landingPage?.blocks?.find((b) => b.type === 'hero');
    const benefitsBlock = landingPage?.blocks?.find((b) => b.type === 'benefits');
    const proofBlock = landingPage?.blocks?.find((b) => b.type === 'proof');
    const faqBlock = landingPage?.blocks?.find((b) => b.type === 'faq');

    // Log page view (fire and forget)
    logEvent({
        eventType: 'page.viewed',
        workspaceId: funnel.workspaceId,
        funnelId: funnel.id,
        anonymousId,
        eventData: { abVariant, versionId: version.id },
    }).catch(() => { });

    const brandTheme = version.brandTheme as { primaryColor: string; secondaryColor: string };
    const primary = brandTheme?.primaryColor ?? '#ff36a2';

    return (
        <>
            {/* Set anon cookie via script */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `document.cookie = 'renen_anon=${anonymousId}; path=/; max-age=31536000; SameSite=Lax';`,
                }}
            />

            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-100 px-6 py-4">
                    <div className="max-w-5xl mx-auto flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primary}, ${brandTheme?.secondaryColor ?? '#ff6b9d'})` }}>
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">{funnel.name}</span>
                    </div>
                </header>

                {/* Hero */}
                <section className="py-20 px-6 text-center" style={{ background: `linear-gradient(135deg, ${primary}10, ${primary}05)` }}>
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {heroBlock?.headline ?? funnel.name}
                        </h1>
                        {heroBlock?.subheadline && (
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed">{heroBlock.subheadline}</p>
                        )}
                        <Link href={`/f/${slug}/assessment?v=${version.id}&anon=${anonymousId}&ab=${abVariant}`}>
                            <Button
                                size="lg"
                                className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${primary}, ${brandTheme?.secondaryColor ?? '#ff6b9d'})` }}
                            >
                                {heroBlock?.ctaText ?? 'Start Free Assessment →'}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Benefits */}
                {benefitsBlock?.items && benefitsBlock.items.length > 0 && (
                    <section className="py-16 px-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {benefitsBlock.items.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                                        <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: primary }} />
                                        <p className="text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Proof */}
                {proofBlock?.stats && (
                    <section className="py-12 px-6 bg-gray-50">
                        <div className="max-w-3xl mx-auto">
                            <div className="grid grid-cols-3 gap-6 text-center">
                                {proofBlock.stats.map((stat, i) => (
                                    <div key={i}>
                                        <p className="text-3xl font-bold" style={{ color: primary }}>{stat.value}</p>
                                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ */}
                {faqBlock?.faq && faqBlock.faq.length > 0 && (
                    <section className="py-16 px-6">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqBlock.faq.map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">{item.q}</p>
                                        <p className="text-gray-600 text-sm">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Bottom CTA */}
                <section className="py-16 px-6 text-center" style={{ background: `linear-gradient(135deg, ${primary}15, ${primary}05)` }}>
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get your personalized results?</h2>
                        <Link href={`/f/${slug}/assessment?v=${version.id}&anon=${anonymousId}&ab=${abVariant}`}>
                            <Button
                                size="lg"
                                className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${primary}, ${brandTheme?.secondaryColor ?? '#ff6b9d'})` }}
                            >
                                Start Free Assessment →
                            </Button>
                        </Link>
                    </div>
                </section>

                <footer className="py-8 px-6 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-400">Powered by <span className="font-semibold" style={{ color: primary }}>RENEN</span></p>
                </footer>
            </div>
        </>
    );
}
