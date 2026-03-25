import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { aiCopilot } from '@/lib/services/ai-copilot';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { funnelId, analytics } = await request.json();
  const improvements = await aiCopilot.improveFunnel(funnelId, analytics ?? {});
  return NextResponse.json({ improvements });
}
