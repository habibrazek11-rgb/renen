// Webhook Sender — HMAC-SHA256 signed, in-memory queue with retry
// Logs deliveries to WebhookDelivery table

import { createHmac } from 'crypto';
import { db } from '@/lib/db';

export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
}

function signPayload(secret: string, body: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

async function deliverWebhook(
  webhookId: string,
  url: string,
  secret: string,
  payload: WebhookPayload,
  attempt: number
): Promise<{ success: boolean; statusCode?: number; responseBody?: string }> {
  const body = JSON.stringify(payload);
  const signature = signPayload(secret, body);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RENEN-Signature': `sha256=${signature}`,
        'X-RENEN-Event': payload.event,
        'X-RENEN-Timestamp': payload.timestamp,
      },
      body,
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    const responseBody = await res.text().catch(() => '');
    return { success: res.ok, statusCode: res.status, responseBody };
  } catch (err) {
    return { success: false, responseBody: String(err) };
  }
}

// In-memory retry queue (dev-safe)
const retryQueue: Array<{
  webhookId: string;
  url: string;
  secret: string;
  payload: WebhookPayload;
  attempt: number;
  maxAttempts: number;
  nextRetryAt: number;
}> = [];

async function processQueue() {
  const now = Date.now();
  const ready = retryQueue.filter((item) => item.nextRetryAt <= now);

  for (const item of ready) {
    const idx = retryQueue.indexOf(item);
    retryQueue.splice(idx, 1);

    const result = await deliverWebhook(
      item.webhookId,
      item.url,
      item.secret,
      item.payload,
      item.attempt
    );

    await db.webhookDelivery.create({
      data: {
        webhookId: item.webhookId,
        eventType: item.payload.event,
        payload: JSON.parse(JSON.stringify(item.payload)),
        statusCode: result.statusCode,
        responseBody: result.responseBody,
        attempt: item.attempt,
        success: result.success,
      },
    });

    if (!result.success && item.attempt < item.maxAttempts) {
      const backoff = Math.pow(2, item.attempt) * 1000; // exponential backoff
      retryQueue.push({
        ...item,
        attempt: item.attempt + 1,
        nextRetryAt: Date.now() + backoff,
      });
    }
  }
}

// Process queue every 5 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(processQueue, 5000);
}

export async function sendWebhook(
  workspaceId: string,
  eventType: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const webhooks = await db.webhookConfig.findMany({
      where: { workspaceId, isActive: true, events: { has: eventType } },
    });

    const payload: WebhookPayload = {
      event: eventType,
      data,
      timestamp: new Date().toISOString(),
    };

    for (const webhook of webhooks) {
      retryQueue.push({
        webhookId: webhook.id,
        url: webhook.url,
        secret: webhook.secret,
        payload,
        attempt: 1,
        maxAttempts: webhook.maxAttempts,
        nextRetryAt: Date.now(),
      });
    }

    // Process immediately
    await processQueue();
  } catch (err) {
    console.error('[WebhookSender] Error:', err);
  }
}
