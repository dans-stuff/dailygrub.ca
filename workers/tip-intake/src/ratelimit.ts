import type { Env } from './types';

// Native Rate Limiting bindings: per-sender and global burst caps (limits and
// 60s windows are configured on the bindings in wrangler.toml). Over-limit
// callers are dropped silently upstream.
export async function checkRateLimit(env: Env, sender: string): Promise<boolean> {
  const [perSender, global] = await Promise.all([
    env.SENDER_LIMIT.limit({ key: sender }),
    env.GLOBAL_LIMIT.limit({ key: 'global' }),
  ]);
  return perSender.success && global.success;
}
