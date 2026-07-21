const MAX_QUOTED_CHARS = 2000;

// Prepares untrusted email text for inclusion in a public PR body: no code-fence
// escapes, no GitHub @-mentions, bounded length.
export function sanitizeForPrBody(text: string): string {
  let out = text.replace(/`/g, "'").replace(/@/g, '@​');
  if (out.length > MAX_QUOTED_CHARS) out = out.slice(0, MAX_QUOTED_CHARS) + '\n[truncated]';
  return out;
}

// tips@example.com -> ti***@example.com (repo is public; full sender stays in Worker logs)
export function maskEmail(address: string): string {
  const [local, domain] = address.split('@');
  if (!domain) return '***';
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}
