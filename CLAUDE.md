# Daily Grub — for AI sessions

Static Next.js site deployed to Cloudflare Workers. No backend, no DB. Open source; contributions arrive as GitHub PRs.

## Layout

- `restaurants/<id>.yaml` — one YAML per restaurant (chain or local). Contains `cities:` map of where it operates and a `deals:` list.
- `cities.yaml` — all cities (slug → `{name, province, website?}`)
- `site.config.json` — global site config
- `public/deals.json` — **generated** at build time from the above; gitignored. Served at `https://dailygrub.ca/deals.json` for third parties (CC BY-SA 4.0).
- `research/<slug>.md` — per-city research compendium (institutional memory; see Research below)

Code: MIT (`LICENSE`). Data: CC BY-SA 4.0 (`LICENSE-DATA`).

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Validate + assemble data, run Next dev |
| `npm run build` | Production build (prebuild validates + assembles) |
| `npm run data:validate` | Schema check on YAML |
| `npm run data:build` | Regenerate `public/deals.json` |
| `npm run data:smoke-test` | Invariants on assembled artifact |
| `npm test` | Full CI gate locally |

CI runs validate + build + smoke + typecheck + lint + Next build on every PR.

## Editing deal data

1. Update the per-city research doc in `research/` first with evidence/source.
2. Edit `restaurants/<id>.yaml`. Set `lastVerified` to today.
3. PR. CI runs the gate. Maintainer merges. Cloudflare auto-deploys.

Never write `public/deals.json` directly — it is regenerated.

## Research compendium rules

`research/<slug>.md` is permanent institutional memory. It only grows.

1. **Research doc first, deal data second.** No YAML change without an entry in the research doc with a source.
2. **Never delete from research docs.** Mark `removed`/`closed`/`debunked`, keep the history.
3. **No circular work.** Check the research doc before investigating any restaurant — past dead ends are recorded so we never repeat them.
4. **Record everything.** Search snippets, rumors, dead ends, source URLs, dates. High information density.

### Verification standards

- Every deal needs `lastVerified` (`YYYY-MM-DD`) and a source in the research doc.
- Source = restaurant website, official social post, recent in-person photo, or `human (in-person)` / `human (verified from website)` with date.
- Deals older than 90 days → flag for re-verification in the research doc backlog.
- When uncertain, flag for human verification instead of guessing.

### Removing a restaurant

Don't delete the section. Set status to `removed`, add a note with date and reason, relabel the deal table as "Previously known deals," then remove the entry (or the whole file) from `restaurants/`.
