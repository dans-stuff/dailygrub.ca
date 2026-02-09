# Daily Grub - Architecture

## Static Site (Cloudflare Workers)

- Pre-compiled Next.js static site
- Deals baked into JS bundle at build time
- Deployed to dailygrub.ca via Cloudflare Workers

## Data Storage

Single source of truth: **`data/deals.json`** (committed to repo)

```
┌─────────────────┐      ┌─────────────────┐
│ data/deals.json │ ───> │  npm run build  │
│  (edit directly)│      │  npm run deploy │
└─────────────────┘      └─────────────────┘
                                │
                                v
                         ┌─────────────────┐
                         │  dailygrub.ca   │
                         │  (Cloudflare)   │
                         └─────────────────┘
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Build static site to `./out/` |
| `npm run preview` | Build + wrangler dev (port 8787) |
| `npm run deploy` | Build + deploy to Cloudflare |

## Data Schema

```typescript
interface DealsData {
  cities: { [citySlug: string]: City };
}

interface City {
  name: string;           // "Lethbridge"
  province: string;       // "AB"
  restaurants: Restaurant[];
}

interface Restaurant {
  id: string;             // "original-joes"
  name: string;           // "Original Joe's"
  type: 'sponsored' | 'exclusive' | 'local' | 'chain';
  deals: Deal[];
}

interface Deal {
  id: string;             // "oj-taco-tuesday"
  title: string;          // "Taco Tuesday"
  description: string;    // Full details
  type: 'food' | 'drink' | 'both';
  dayOfWeek?: number;     // 0-6 (Sun-Sat) for single day
  daysOfWeek?: number[];  // [1,2,3] for multi-day
  startHour?: number;     // 0-23
  endHour?: number;       // 0-23
  lastVerified?: string;  // "2025-01-15"
}
```

## Key Files

- `data/deals.json` - Deal data (source of truth)
- `lib/deals.ts` - Loads deals for static build
- `types/deals.ts` - TypeScript interfaces
- `research/{city-slug}.md` - Research & verification evidence per city

---

## Research & Verification Pipeline

### Cardinal Rules

**The research compendium (`research/{city-slug}.md`) is the permanent institutional memory of this project.** Every rumor, every confirmed fact, every dead end, every human verification, every removal decision — all of it lives in the research docs forever. The compendium only grows. It never shrinks.

1. **Research doc FIRST, deals.json SECOND.** Never put information into `deals.json` without first recording evidence, source, and reasoning in the research doc. If it's not in the compendium, it doesn't exist.
2. **Never delete information from research docs.** Statuses change (`in-production` → `removed`), notes get appended, but content is never deleted. Old deal tables stay with a "previously known deals" label. Removal reasons are documented. Dead ends are recorded so they are never re-investigated.
3. **No circular work.** Every session must build on prior sessions. Before researching any restaurant, check if it already exists in the research doc. If we already debunked it, learned it's closed, or decided to remove it — that decision and its reasoning must be in the doc so we never repeat the work.
4. **Record everything.** Search snippets, social media mentions, word of mouth, in-person observations, phone calls, website checks, failed website fetches, price discrepancies, conflicting sources — all of it goes into the compendium with dates and sources. High information density.
5. **Incremental building.** The goal is a nationwide compendium of every restaurant deal in Canada, built 5 minutes at a time. Every session should leave the research docs richer than it found them, even if no deals.json changes are made.

### Overview

Every deal in production (`data/deals.json`) must trace back to a source in its city's research document (`research/{city-slug}.md`). The research pipeline is layered — cast a wide net, then refine:

```
Leads & Rumors          →   Restaurants (researched)   →   data/deals.json   →   site
(gossip, tips, snippets)    (verified with sources)        (production data)     (static)
```

**Layer 1 — Leads & Rumors:** Every restaurant gossip, hint, search snippet, social media mention, or secondhand tip gets captured here. Cast the widest possible net. Nothing is too speculative for this layer.

**Layer 2 — Restaurants (researched):** Leads that have been investigated with primary sources. Deals have source URLs but may need human verification before promotion.

**Layer 3 — Production (`deals.json`):** Fully verified deals with source URLs, `lastVerified` dates, and cross-referenced entries in the research doc.

### File Locations

| File | Purpose |
|------|---------|
| `research/{city-slug}.md` | Per-city research doc: backlog, restaurant evidence, source URLs, research log |
| `research/{city-slug}-raw-*.md` | Read-only historical research dumps (preserved for reference) |
| `data/deals.json` | Production deal data (single source of truth for the site) |

### Research Document Format

Each `research/{city-slug}.md` follows this structure:

```markdown
# {City Name} Research

## Backlog
<!-- Prioritized work items: fixes, new restaurants to add, re-verification needed -->
- [ ] Fix: {description}
- [ ] Add: {restaurant} — {reason}
- [ ] Re-verify: {restaurant} — last verified {date}

## Leads & Rumors
<!-- Unverified tips, search snippets, secondhand mentions, overheard gossip.
     NOT confirmed — exists to build a pool of possibilities for future research.
     Bubble up promising leads to Backlog → Restaurants → Production. -->

| Restaurant / Lead | What We Heard | Where We Heard It | Date Noted | Status |
|-------------------|---------------|-------------------|------------|--------|
| {name or tip} | {what was claimed} | {source: search snippet, social media, word of mouth, etc.} | {YYYY-MM-DD} | Unverified / Promising / Debunked / Promoted |

## Restaurants

### {Restaurant Name}
- **Status:** `in-production` | `researched` | `removed` | `not-in-city` | `closed` | `no-deals-found`
- **Production ID:** `{id}` (if in-production, matches deals.json)
- **Address:** {address}
- **Website:** {url}
- **Type:** `local` | `chain`
- **Phone:** {phone} (if known)

| Deal | Days | Time | Source URL | Verified |
|------|------|------|------------|----------|
| {title} | {days} | {hours or "All day"} | {url} | {YYYY-MM-DD} |

## Research Log
| Date | Action | Result |
|------|--------|--------|
```

### Verification Standards

- **Primary source required:** Every deal in production must have a source (restaurant website, official social media, reputable directory, or `human (in-person)` / `human (verified from website)` with date)
- **Staleness threshold:** Deals older than 90 days from `lastVerified` should be flagged for re-verification in the backlog
- **Every deal in `deals.json` must have:** `lastVerified` date and a corresponding entry with source in the research doc
- **Every restaurant in `deals.json` should have:** `website` field (flag missing ones in backlog)
- **Rumors and unverified leads** go in the Leads & Rumors table — capture EVERYTHING (search snippets, social media mentions, word of mouth, directory listings, tourism site mentions). The goal is a huge pool of possibilities per city.
- **Promoting leads:** When a lead is investigated and confirmed with a primary source, move it to a Restaurants section with status `researched`. Update the lead's status to `Promoted`.
- **When uncertain:** flag for human verification in the backlog rather than guessing. The user can check websites, Facebook, call restaurants, etc.
- **Verification means checking the primary source directly** — not relying on cached/secondary data. If a web fetch shows different info than what's in production, the production data needs correction
- **Source types:** `{website URL}` for web sources, `human (in-person)` for user's physical visit, `human (in-person photo)` for photographed evidence, `human (verified from website)` for user reading a JS-heavy site we can't fetch, `human` for general user confirmation. Always include the date.

### Session Workflow

1. **Read backlog** — open `research/{city-slug}.md`, check prioritized items
2. **Do work** — research, verify, or fix items from the backlog
3. **Update research doc FIRST** — add all evidence, sources, findings, decisions, and reasoning to the research doc. This is non-negotiable. The research doc is updated before or simultaneously with deals.json, never after.
4. **Update `deals.json` SECOND** — only after the research doc has the evidence
5. **Update backlog** — check off completed items, add any new items discovered during the session
6. **Update research log** — append dated entries for every action taken this session
7. **Commit** — changes to research doc and deals.json together

### Cross-Reference Rules

- Every restaurant in `deals.json` has a matching section in `research/{city-slug}.md` with status `in-production`
- Every deal in production has a source in the research doc (URL, `human (in-person)`, etc.)
- The research doc's production ID matches the restaurant's `id` in `deals.json`
- The research doc contains ALL restaurants ever investigated — including `removed`, `closed`, `debunked`, and `no-deals-found` — so no work is ever repeated
- `deals.json` is a strict subset of the research docs. The research docs are the superset of all knowledge.

### Common Workflows

**New city:**
1. Create `research/{city-slug}.md` with empty backlog and restaurant sections
2. Research restaurants, populate research doc with evidence
3. When ready, add city to `deals.json` and promote verified restaurants

**New restaurant (existing city):**
1. Add restaurant section to research doc with status `researched`
2. Populate deals table with source URLs
3. When verified, add to `deals.json`, update status to `in-production`, record production ID

**Re-verification:**
1. Check source URLs — are deals still listed?
2. Update `lastVerified` in both research doc and `deals.json`
3. If deals changed, update the research doc note with what changed and why, then update deals.json

**Removing a restaurant from production:**
1. **DO NOT delete the restaurant section from the research doc.** Change status to `removed`.
2. Add a bold removal notice with: date, who decided (user/system), the exact reason in their words, and the former production ID.
3. Relabel the deal table as "Previously known deals (no longer in production)."
4. Add a "History" note summarizing the full lifecycle: when added, what sources existed, why removed, and guidance for future investigators who might encounter this restaurant again.
5. Remove from `deals.json`.
6. Log the removal in the research log with reasoning.

**Stale sweep:**
1. Query deals where `lastVerified` is older than 90 days
2. Add re-verification items to backlog
3. Work through backlog in priority order
