# tip-intake

Cloudflare Email Worker behind **tips@dailygrub.ca**. Turns emailed deal tips (text and/or photos) into GitHub pull requests against this repo, then replies to the tipster with the PR link.

```
email → Email Routing → this Worker
  → rate limit (native Rate Limiting bindings, per-sender + global burst caps)
  → postal-mime parse (text + capped image attachments)
  → Workers AI extraction (Llama 4 Scout, JSON-schema output, abuse flagging)
  → strict re-validation (same rules as site/scripts/validate-deals.mjs)
  → match restaurant against restaurants/ on main
  → create restaurants/<slug>.yaml, or merge deals into the existing file
    (comment-preserving; never overwrites an address; dedupes by title)
  → branch tip/<slug>-<ts> → commit → PR (regular, CI validates it)
  → reply: "Your tip is being tracked here: <PR url>"
```

Outcomes:
- **Valid tip** → PR + success reply. Model confidence is advisory only and noted in the PR body; the human PR review is the accuracy gate.
- **Unextractable** (no restaurant/city/deal) → no PR; reply asks for specifics.
- **Everything already listed** → no PR; "already listed" reply.
- **Abusive content** (profanity, slurs, spam, prompt-injection attempts — flagged by the model) → silently dropped and logged.
- **Over rate limit / off allowlist** → silently dropped and logged.

The PR body carries provenance: masked sender (full sender in Worker logs, keyed by Message-ID), subject, timestamp, attachment list, model ID + confidence, raw model JSON, and the sanitized original email text.

## One-time setup

1. `npm install`
2. Create a fine-grained GitHub PAT: resource owner `dans-stuff`, access to only this repo, permissions **Contents: Read & write** + **Pull requests: Read & write**. Then `npx wrangler secret put GITHUB_TOKEN`.
3. `npx wrangler deploy`
4. Cloudflare dashboard → dailygrub.ca zone → Email Routing → enable, create custom address `tips@dailygrub.ca` → **Send to a Worker** → `dailygrub-tip-intake`. Set catch-all to drop.

Knobs in `wrangler.toml`: `DRY_RUN` (log instead of touching GitHub), `ALLOWED_SENDERS` (comma-separated allowlist; empty = open), `MAX_ATTACHMENTS` / `MAX_ATTACHMENT_BYTES`, `AI_MODEL` (all under `[vars]`); rate limits live on the `[[ratelimits]]` bindings (60s windows, per-sender and global).

## Local development

```sh
npm run dev                 # wrangler dev with DRY_RUN=true (AI binding hits real Workers AI)
npm run test:email          # POST all .eml fixtures to the local email endpoint
scripts/send-test-email.sh text-only   # or one fixture
npm test                    # vitest + tsc
```

Note: the AI binding is always remote, so local runs incur (small) Workers AI usage and need `wrangler login`. Without the `GITHUB_TOKEN` secret, repo reads run unauthenticated (fine for a public repo) and DRY_RUN skips all writes.

## Production test harness

`POST /test-email?from=<sender>` on the worker's workers.dev URL runs the full pipeline
(real Workers AI, real GitHub PRs) on a raw RFC 822 body — replies are suppressed, since
only genuine email events can reply. Guarded by the `TEST_KEY` secret (`x-test-key`
header); the endpoint is disabled if that secret is unset. Rotate with
`openssl rand -hex 24 | npx wrangler secret put TEST_KEY`. Returns the outcome as JSON,
e.g. `{"reply":"success","prUrl":"..."}`. Close test PRs and delete their branches after.

```sh
curl -X POST "https://dailygrub-tip-intake.<subdomain>.workers.dev/test-email?from=x@example.com" \
  -H "x-test-key: $TEST_KEY" --data-binary @test/fixtures/text-only.eml
```

## Rollout / smoke test

1. Deploy with `DRY_RUN = "true"`, email tips@ from a real account, watch `npm run tail`.
2. Flip `DRY_RUN = "false"`, redeploy, send one real tip: verify branch + PR, green CI, tipster reply. Close the test PR.
3. Also exercise: a no-city email (needs-info reply) and 3 quick emails from one sender inside a minute (silent drop).
