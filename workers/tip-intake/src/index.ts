import YAML from 'yaml';
import type { Env, ExtractedTip, ParsedTip } from './types';
import { parseEmail } from './parse';
import { extractTip } from './extract';
import { matchRestaurant } from './match';
import { createRestaurantYaml, mergeRestaurantYaml } from './yamlgen';
import { getRestaurantFile, listRestaurantSlugs, mergePr, openTipPr } from './github';
import { checkRateLimit } from './ratelimit';
import { replyToTipster, type ReplyKind } from './reply';
import { maskEmail, sanitizeForPrBody } from './sanitize';

interface Outcome {
  reply: ReplyKind | null;
  prUrl?: string;
}

// Reads cities.yaml from the repo (the source of truth) rather than the deployed
// deals.json — a Worker fetching its own zone routes to the (nonexistent) origin.
async function fetchCities(env: Env): Promise<Record<string, string>> {
  const res = await fetch(env.CITIES_URL, {
    headers: { 'User-Agent': 'dailygrub-tip-intake' },
  });
  if (!res.ok) throw new Error(`cities.yaml fetch → ${res.status}`);
  const cities = YAML.parse(await res.text()) as Record<string, { name: string }>;
  return Object.fromEntries(Object.entries(cities).map(([slug, c]) => [slug, c.name]));
}

function prBody(
  env: Env,
  parsed: ParsedTip,
  tip: ExtractedTip,
  rawModelOutput: string,
  receivedAt: string,
): string {
  const attachments = parsed.images.length
    ? parsed.images.map((i) => `${i.filename} (${i.mimeType}, ${Math.round(i.bytes / 1024)} KB)`).join(', ')
    : 'none';
  const skipped = parsed.skippedAttachments.length
    ? `\n- Skipped attachments: ${parsed.skippedAttachments.join(', ')}`
    : '';
  return [
    '## Source',
    'Emailed tip to tips@dailygrub.ca',
    `- From: ${maskEmail(parsed.from)} (full sender in Worker logs, keyed by Message-ID)`,
    `- Subject: ${sanitizeForPrBody(parsed.subject) || '(none)'}`,
    `- Received (UTC): ${receivedAt}`,
    `- Message-ID: \`${parsed.messageId.replace(/`/g, '')}\``,
    `- Image attachments: ${attachments}${skipped}`,
    '',
    '## Extraction',
    `- Model: ${env.AI_MODEL}`,
    `- Model confidence: ${tip.confident ? 'high' : 'LOW — double-check restaurant, city, and deal details'}`,
    ...(tip.notes ? [`- Model notes: ${sanitizeForPrBody(tip.notes)}`] : []),
    '',
    '<details><summary>Raw model JSON</summary>',
    '',
    '```json',
    sanitizeForPrBody(rawModelOutput),
    '```',
    '</details>',
    '',
    '<details><summary>Original email text (sanitized)</summary>',
    '',
    '```text',
    sanitizeForPrBody(parsed.text) || '(no text body)',
    '```',
    '</details>',
    '',
    '_Automated PR from the tip-intake Worker. A human must review before merge._',
  ].join('\n');
}

// Auto-merge is allowlist + DMARC-pass only: the From address is trivially
// spoofable, so we require Cloudflare's Authentication-Results header to show
// dmarc=pass before treating the sender as trusted.
function isTrustedSender(message: ForwardableEmailMessage, env: Env): boolean {
  const sender = message.from.toLowerCase();
  const trusted = env.AUTO_MERGE_SENDERS.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!trusted.includes(sender)) return false;
  const auth = message.headers.get('authentication-results') ?? '';
  return /\bdmarc=pass\b/i.test(auth);
}

async function handleTip(message: ForwardableEmailMessage, env: Env): Promise<Outcome> {
  const sender = message.from.toLowerCase();

  const allowlist = env.ALLOWED_SENDERS.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (allowlist.length && !allowlist.includes(sender)) {
    console.log(`dropped: sender not on allowlist (${sender})`);
    return { reply: null };
  }
  if (!(await checkRateLimit(env, sender))) {
    console.log(`dropped: rate limit (${sender})`);
    return { reply: null };
  }

  const parsed = await parseEmail(message.raw, {
    maxAttachments: Number(env.MAX_ATTACHMENTS),
    maxAttachmentBytes: Number(env.MAX_ATTACHMENT_BYTES),
  });
  console.log(
    `tip from ${sender} messageId=${parsed.messageId} images=${parsed.images.length} chars=${parsed.text.length}`,
  );

  const cities = await fetchCities(env);
  const { tip, abusive, rawModelOutput } = await extractTip(env, parsed, cities);
  if (abusive) {
    // Abusive content (profanity, slurs, spam, injection attempts): silent drop,
    // no reply — don't engage, don't confirm the address works.
    console.log(`rejected: model flagged abusive content (${sender})`);
    return { reply: null };
  }
  // `confident` is advisory only — the PR review is the accuracy gate. We only
  // bail when extraction produced nothing structurally valid.
  if (!tip) {
    console.log(`needs-info: no structurally valid extraction; raw output: ${rawModelOutput.slice(0, 1500)}`);
    return { reply: 'needs-info' };
  }

  const slugs = await listRestaurantSlugs(env);
  const match = matchRestaurant(tip.restaurant_name, slugs, tip.city_slug);
  if (!match) {
    console.log(`needs-info: could not derive a usable slug for "${tip.restaurant_name}"`);
    return { reply: 'needs-info' };
  }

  let yaml: string;
  let existingFileSha: string | null = null;
  let action: string;
  if (match.mode === 'update') {
    const file = await getRestaurantFile(env, match.slug);
    if (!file) throw new Error(`file for matched slug ${match.slug} missing on main`);
    const merged = mergeRestaurantYaml(file.content, tip);
    if (!merged) {
      console.log(`already-listed: ${match.slug} has all extracted deals + city`);
      return { reply: 'already-listed' };
    }
    yaml = merged.yaml;
    existingFileSha = file.sha;
    action = `update ${match.slug} (+${merged.addedDeals.length} deal(s)${merged.addedCity ? ', new city' : ''})`;
  } else {
    yaml = createRestaurantYaml(tip);
    action = `add ${match.slug}`;
  }

  const receivedAt = new Date().toISOString();
  const pr = await openTipPr(env, {
    slug: match.slug,
    yaml,
    existingFileSha,
    title: `Tip: ${tip.restaurant_name} — ${cities[tip.city_slug]}`,
    body: prBody(env, parsed, tip, rawModelOutput, receivedAt),
    commitMessage: `tip: ${action}`,
  });
  console.log(`opened PR: ${pr.url}`);

  if (isTrustedSender(message, env)) {
    try {
      await mergePr(env, pr.number);
      console.log(`auto-merged PR #${pr.number} (trusted sender ${sender}, dmarc=pass)`);
      return { reply: 'merged', prUrl: pr.url };
    } catch (err) {
      // Merge can fail (e.g. required checks still running); the PR stands for
      // normal review and the tipster still gets the tracking link.
      console.warn(`auto-merge failed for PR #${pr.number}: ${err instanceof Error ? err.message : err}`);
    }
  }
  return { reply: 'success', prUrl: pr.url };
}

// Builds a message shim from a raw RFC 822 string so the pipeline can run
// outside a real email event. reply() is suppressed (only real events can reply).
function testMessage(raw: string, from: string, to: string): ForwardableEmailMessage {
  const header = (name: string) =>
    raw.split(/\r?\n\r?\n/)[0].match(new RegExp(`^${name}:\\s*(.+)$`, 'im'))?.[1].trim() ?? '';
  const headers = new Headers();
  for (const name of ['subject', 'message-id', 'references', 'authentication-results']) {
    const v = header(name);
    if (v) headers.set(name, v);
  }
  return {
    from,
    to,
    raw: new Response(raw).body!,
    rawSize: raw.length,
    headers,
    setReject: () => {},
    forward: async () => {},
    reply: async () => {
      console.log('[test-email] reply suppressed');
    },
  } as unknown as ForwardableEmailMessage;
}

export default {
  // Test harness: inject an email without involving a mailbox. Requires the
  // TEST_KEY secret; disabled entirely when the secret is unset.
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (req.method !== 'POST' || url.pathname !== '/test-email') {
      return new Response('not found', { status: 404 });
    }
    if (!env.TEST_KEY || req.headers.get('x-test-key') !== env.TEST_KEY) {
      return new Response('forbidden', { status: 403 });
    }
    const raw = await req.text();
    const from = url.searchParams.get('from') ?? 'test@example.com';
    const message = testMessage(raw, from, 'tips@dailygrub.ca');
    try {
      const outcome = await handleTip(message, env);
      return Response.json(outcome);
    } catch (err) {
      return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
  },

  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    let outcome: Outcome;
    try {
      outcome = await handleTip(message, env);
    } catch (err) {
      // Swallow rather than rethrow: Email Routing retries on exceptions, which
      // could duplicate PRs. The tipster gets a needs-info nudge instead.
      console.error(`tip processing failed: ${err instanceof Error ? err.stack : err}`);
      outcome = { reply: 'needs-info' };
    }

    if (!outcome.reply) return;
    try {
      await replyToTipster(
        message,
        {
          subject: message.headers.get('subject') ?? '',
          messageId: message.headers.get('message-id') ?? '',
          references: message.headers.get('references') ?? '',
        },
        outcome.reply,
        { prUrl: outcome.prUrl },
      );
    } catch (err) {
      // Reply fails for DMARC-less senders — the PR (if any) still stands.
      console.warn(`reply failed: ${err instanceof Error ? err.message : err}`);
    }
  },
};
