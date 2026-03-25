// A/B Testing Service — cookie-based, deterministic variant assignment
// Uses anonymous_id (UUID) for consistent assignment per visitor

import { createHash } from 'crypto';

export type ABVariant = 'A' | 'B';

/**
 * Deterministically assigns a variant based on testId + anonymousId
 * Same inputs always produce the same output (no randomness after first assignment)
 */
export function getVariant(testId: string, anonymousId: string): ABVariant {
  const hash = createHash('sha256')
    .update(`${testId}:${anonymousId}`)
    .digest('hex');
  // Use first byte of hash to determine variant (0-127 = A, 128-255 = B)
  const byte = parseInt(hash.slice(0, 2), 16);
  return byte < 128 ? 'A' : 'B';
}

/**
 * Generate a new anonymous ID (call once per new visitor, store in cookie)
 */
export function generateAnonymousId(): string {
  // Use crypto.randomUUID if available (Node 19+), otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const AB_TESTS = {
  LANDING_PAGE: 'landing_page_v1',
  CTA_COPY: 'cta_copy_v1',
} as const;
