import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { aiCopilot } from '@/lib/services/ai-copilot';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { prompt } = await request.json();
  if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

  const blueprint = await aiCopilot.createFunnel(prompt);
  return NextResponse.json({ blueprint });
}
