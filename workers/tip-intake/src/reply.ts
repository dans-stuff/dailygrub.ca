import { createMimeMessage } from 'mimetext';
import { EmailMessage } from 'cloudflare:email';

export type ReplyKind = 'success' | 'merged' | 'needs-info' | 'already-listed';

function replyBody(kind: ReplyKind, detail: { prUrl?: string }): string {
  switch (kind) {
    case 'success':
      return [
        'Thanks for the tip!',
        '',
        `Your tip is being tracked here: ${detail.prUrl}`,
        '',
        'A human reviews every submission before it goes live on dailygrub.ca.',
      ].join('\n');
    case 'merged':
      return [
        'Thanks for the tip!',
        '',
        `Merged straight in (trusted sender): ${detail.prUrl}`,
        '',
        'It will appear on dailygrub.ca with the next site deploy.',
      ].join('\n');
    case 'already-listed':
      return [
        'Thanks for the tip!',
        '',
        'Good news: everything you sent is already listed on dailygrub.ca.',
        'If something there looks out of date, reply with the correction and we will take a look.',
      ].join('\n');
    case 'needs-info':
      return [
        'Thanks for the tip! We could not quite work out the details automatically.',
        '',
        'Could you reply with:',
        '- The restaurant name',
        '- The city (see dailygrub.ca for the cities we cover)',
        '- The deal itself — what it is, and which days/hours it runs',
        '',
        'Photos of menus or signs help too.',
      ].join('\n');
  }
}

// One reply per incoming message (platform limit). Throws if the sender fails
// DMARC — callers catch and log, since a failed reply must not fail the tip.
export async function replyToTipster(
  message: ForwardableEmailMessage,
  incoming: { subject: string; messageId: string; references: string },
  kind: ReplyKind,
  detail: { prUrl?: string } = {},
): Promise<void> {
  const msg = createMimeMessage();
  msg.setSender({ name: 'Daily Grub', addr: message.to });
  msg.setRecipient(message.from);
  msg.setSubject(incoming.subject ? `Re: ${incoming.subject}` : 'Re: your Daily Grub tip');
  if (incoming.messageId) {
    msg.setHeader('In-Reply-To', incoming.messageId);
    // The platform requires the full chain: incoming References + newest Message-ID.
    msg.setHeader('References', [incoming.references, incoming.messageId].filter(Boolean).join(' '));
  }
  msg.addMessage({ contentType: 'text/plain', data: replyBody(kind, detail) });
  await message.reply(new EmailMessage(message.to, message.from, msg.asRaw()));
}
