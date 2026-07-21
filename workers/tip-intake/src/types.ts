export interface Env {
  AI: Ai;
  SENDER_LIMIT: RateLimit;
  GLOBAL_LIMIT: RateLimit;
  GITHUB_TOKEN: string;
  TEST_KEY?: string;
  GITHUB_REPO: string;
  GITHUB_BASE_BRANCH: string;
  CITIES_URL: string;
  AI_MODEL: string;
  DRY_RUN: string;
  MAX_ATTACHMENTS: string;
  MAX_ATTACHMENT_BYTES: string;
  ALLOWED_SENDERS: string;
}

// Mirrors the rules in site/scripts/validate-deals.mjs. Duplicated on purpose:
// this worker must not import from site/, and CI re-validates every PR anyway.
export const DEAL_TYPES = new Set(['food', 'drink', 'both']);
export const DAY_NAMES = new Set([
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]);
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export interface ExtractedDeal {
  title: string;
  description: string;
  type: 'food' | 'drink' | 'both';
  days?: string[];
  startHour?: number;
  endHour?: number;
}

export interface ExtractedTip {
  confident: boolean;
  restaurant_name: string;
  website?: string;
  city_slug: string;
  address?: string;
  deals: ExtractedDeal[];
  notes?: string;
}

export interface TipImage {
  mimeType: string;
  filename: string;
  base64: string;
  bytes: number;
}

export interface ParsedTip {
  from: string;
  subject: string;
  messageId: string;
  text: string;
  images: TipImage[];
  skippedAttachments: string[];
}
