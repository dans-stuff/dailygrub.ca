# Daily Grub — for AI sessions

Static Next.js site deployed to Cloudflare Workers. No backend, no DB. Open source; contributions arrive as GitHub PRs.

## Layout

- `cities/<slug>/_city.json` — `{name, province, website?}`
- `cities/<slug>/<restaurant-id>.json` — restaurant + deals (see `types/deals.ts`)
- `site.config.json` — global site config
- `data/deals.json` — **generated** at build time from `cities/**`; gitignored. Do not edit.
- `research/<slug>.md` — per-city research compendium (institutional memory; see Research below)

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Validate + assemble data, run Next dev server |
| `npm run build` | Production build (prebuild validates + assembles) |
| `npm run data:validate` | Schema check on `cities/**` |
| `npm run data:build` | Regenerate `data/deals.json` |
| `npm run deploy` | Build + `wrangler deploy` |

CI runs `data:validate` + `data:build` on every PR.

## Editing deal data

1. Update the per-city research doc in `research/` first with evidence/source.
2. Edit `cities/<slug>/<restaurant>.json`. Set `lastVerified` to today.
3. PR. CI validates. Maintainer merges. Cloudflare auto-deploys.

Never write directly to `data/deals.json`.

## Research compendium rules

`research/<slug>.md` is permanent institutional memory. It only grows.

1. **Research doc first, deal data second.** No deals.json change without an entry in the research doc with a source.
2. **Never delete from research docs.** Mark `removed`/`closed`/`debunked`, keep the history.
3. **No circular work.** Check the research doc before investigating any restaurant — past dead ends are recorded so we never repeat them.
4. **Record everything.** Search snippets, rumors, dead ends, source URLs, dates. High information density.

### Verification standards

- Every deal in `data` needs `lastVerified` (`YYYY-MM-DD`) and a source in the research doc.
- Source = restaurant website, official social post, recent in-person photo, or `human (in-person)` / `human (verified from website)` with date.
- Deals older than 90 days → flag for re-verification in the research doc backlog.
- When uncertain, flag for human verification instead of guessing.

### Research doc format

```markdown
# {City} Research

## Backlog
- [ ] ...

## Leads & Rumors
| Lead | What we heard | Source | Date | Status |

## Restaurants

### {Name}
- **Status:** in-production | researched | removed | closed | no-deals-found
- **Production ID:** {id}
- **Address / Website / Phone**

| Deal | Days | Time | Source | Verified |

## Research Log
| Date | Action | Result |
```

### Removing a restaurant

Don't delete the section. Set status to `removed`, add a removal note with date and reason, relabel the deal table as "Previously known deals," then remove from `cities/**`.
