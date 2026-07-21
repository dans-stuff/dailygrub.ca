import PostalMime from 'postal-mime';
import type { ParsedTip, TipImage } from './types';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BODY_CHARS = 8000;

export function stripHtml(html: string): string {
  return html
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function parseEmail(
  raw: ReadableStream<Uint8Array>,
  limits: { maxAttachments: number; maxAttachmentBytes: number },
): Promise<ParsedTip> {
  const buffer = await new Response(raw).arrayBuffer();
  const email = await new PostalMime().parse(buffer);

  let text = email.text?.trim() || (email.html ? stripHtml(email.html) : '');
  if (text.length > MAX_BODY_CHARS) text = text.slice(0, MAX_BODY_CHARS);

  const images: TipImage[] = [];
  const skippedAttachments: string[] = [];
  for (const att of email.attachments ?? []) {
    const name = att.filename || 'unnamed';
    const mimeType = (att.mimeType || '').toLowerCase();
    const content =
      typeof att.content === 'string' ? new TextEncoder().encode(att.content) : new Uint8Array(att.content);
    if (!IMAGE_TYPES.has(mimeType)) {
      skippedAttachments.push(`${name} (${mimeType || 'unknown type'}, not an image)`);
      continue;
    }
    if (content.length > limits.maxAttachmentBytes) {
      skippedAttachments.push(`${name} (too large)`);
      continue;
    }
    if (images.length >= limits.maxAttachments) {
      skippedAttachments.push(`${name} (over attachment limit)`);
      continue;
    }
    images.push({ mimeType, filename: name, base64: toBase64(content), bytes: content.length });  }

  return {
    from: email.from?.address?.toLowerCase() ?? '',
    subject: email.subject ?? '',
    messageId: email.messageId ?? '',
    text,
    images,
    skippedAttachments,
  };
}
