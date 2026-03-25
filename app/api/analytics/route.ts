import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const funnelId = searchParams.get('funnelId');
  const days = parseInt(searchParams.get('days') ?? '7');

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const where = {
    workspaceId: session.workspaceId,
    ...(funnelId ? { funnelId } : {}),
    createdAt: { gte: since },
  };

  const events = await db.eventLog.findMany({
    where,
    select: { eventType: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  // Aggregate by event type
  const counts: Record<string, number> = {};
  const byDay: Record<string, Record<string, number>> = {};

  for (const event of events) {
    counts[event.eventType] = (counts[event.eventType] ?? 0) + 1;
    const day = event.createdAt.toISOString().slice(0, 10);
    if (!byDay[day]) byDay[day] = {};
    byDay[day][event.eventType] = (byDay[day][event.eventType] ?? 0) + 1;
  }

  // Conversion funnel
  const views = counts['page.viewed'] ?? 0;
  const starts = counts['assessment.started'] ?? 0;
  const completes = counts['assessment.completed'] ?? 0;
  const leads = counts['lead.created'] ?? 0;
  const ctaClicks = counts['cta.clicked'] ?? 0;

  return NextResponse.json({
    counts,
    byDay,
    funnel: { views, starts, completes, leads, ctaClicks },
    conversionRates: {
      startRate: views > 0 ? Math.round((starts / views) * 100) : 0,
      completionRate: starts > 0 ? Math.round((completes / starts) * 100) : 0,
      leadRate: completes > 0 ? Math.round((leads / completes) * 100) : 0,
      ctaRate: leads > 0 ? Math.round((ctaClicks / leads) * 100) : 0,
    },
  });
}
