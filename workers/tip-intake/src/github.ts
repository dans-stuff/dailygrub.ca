import type { Env } from './types';

const API = 'https://api.github.com';

// Token is optional in local dev (public-repo reads work unauthenticated and
// writes are DRY_RUN); production needs the GITHUB_TOKEN secret.
function headers(env: Env): Record<string, string> {
  return {
    ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // GitHub rejects requests without a User-Agent.
    'User-Agent': 'dailygrub-tip-intake',
    'Content-Type': 'application/json',
  };
}

async function gh<T>(env: Env, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}/repos/${env.GITHUB_REPO}${path}`, {
    method,
    headers: headers(env),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`GitHub ${method} ${path} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

function isDryRun(env: Env): boolean {
  return env.DRY_RUN === 'true';
}

export async function listRestaurantSlugs(env: Env): Promise<string[]> {
  const files = await gh<Array<{ name: string; type: string }>>(
    env,
    'GET',
    `/contents/restaurants?ref=${env.GITHUB_BASE_BRANCH}`,
  );
  return files
    .filter((f) => f.type === 'file' && f.name.endsWith('.yaml') && !f.name.startsWith('_'))
    .map((f) => f.name.replace(/\.yaml$/, ''));
}

export async function getRestaurantFile(
  env: Env,
  slug: string,
): Promise<{ sha: string; content: string } | null> {
  const res = await fetch(
    `${API}/repos/${env.GITHUB_REPO}/contents/restaurants/${slug}.yaml?ref=${env.GITHUB_BASE_BRANCH}`,
    { headers: headers(env) },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET contents → ${res.status}`);
  const file = (await res.json()) as { sha: string; content: string };
  const bytes = Uint8Array.from(atob(file.content.replace(/\n/g, '')), (c) => c.charCodeAt(0));
  return { sha: file.sha, content: new TextDecoder().decode(bytes) };
}

function toBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export interface TipPr {
  url: string;
  number: number;
}

export async function openTipPr(
  env: Env,
  opts: {
    slug: string;
    yaml: string;
    existingFileSha: string | null;
    title: string;
    body: string;
    commitMessage: string;
  },
): Promise<TipPr> {
  const branch = `tip/${opts.slug}-${Math.floor(Date.now() / 1000)}`;

  if (isDryRun(env)) {
    console.log(`[DRY_RUN] would open PR "${opts.title}" on branch ${branch}`);
    console.log(`[DRY_RUN] restaurants/${opts.slug}.yaml:\n${opts.yaml}`);
    console.log(`[DRY_RUN] PR body:\n${opts.body}`);
    return { url: `https://github.com/${env.GITHUB_REPO}/pull/DRY_RUN`, number: 0 };
  }

  const ref = await gh<{ object: { sha: string } }>(
    env,
    'GET',
    `/git/ref/heads/${env.GITHUB_BASE_BRANCH}`,
  );
  await gh(env, 'POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: ref.object.sha });
  await gh(env, 'PUT', `/contents/restaurants/${opts.slug}.yaml`, {
    message: opts.commitMessage,
    content: toBase64Utf8(opts.yaml),
    branch,
    ...(opts.existingFileSha ? { sha: opts.existingFileSha } : {}),
  });
  const pr = await gh<{ html_url: string; number: number }>(env, 'POST', '/pulls', {
    title: opts.title,
    head: branch,
    base: env.GITHUB_BASE_BRANCH,
    body: opts.body,
    draft: false,
  });
  return { url: pr.html_url, number: pr.number };
}

export async function mergePr(env: Env, prNumber: number): Promise<void> {
  if (isDryRun(env)) {
    console.log(`[DRY_RUN] would merge PR #${prNumber}`);
    return;
  }
  await gh(env, 'PUT', `/pulls/${prNumber}/merge`, { merge_method: 'squash' });
}
