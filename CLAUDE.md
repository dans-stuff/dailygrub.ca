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

### Overview

Every deal in production (`data/deals.json`) must trace back to a source URL in its city's research document (`research/{city-slug}.md`). The pipeline:

```
research/{city-slug}.md   →   data/deals.json   →   npm run build   →   site
(evidence & backlog)          (production data)      (static export)
```

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

## Restaurants

### {Restaurant Name}
- **Status:** `in-production` | `researched` | `not-in-city` | `closed` | `no-deals-found`
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

- **Primary source required:** Every deal in production must have a source URL (restaurant website, official social media, or reputable directory like eatreddeer.ca)
- **Staleness threshold:** Deals older than 90 days from `lastVerified` should be flagged for re-verification in the backlog
- **Every deal in `deals.json` must have:** `lastVerified` date and a corresponding entry with source URL in the research doc
- **Every restaurant in `deals.json` should have:** `website` field (flag missing ones in backlog)
- **Rumors and unverified leads** go in the research doc (with notes) but NOT in `deals.json` — track them for future verification
- **When uncertain:** flag for human verification in the backlog rather than guessing. The user can check websites, Facebook, call restaurants, etc.
- **Verification means checking the primary source directly** — not relying on cached/secondary data. If a web fetch shows different info than what's in production, the production data needs correction

### Session Workflow

1. **Read backlog** — open `research/{city-slug}.md`, check prioritized items
2. **Do work** — research, verify, or fix items from the backlog
3. **Update both files** — add evidence to research doc, update `deals.json` if promoting to production
4. **Update backlog** — check off completed items, add any new items discovered
5. **Commit** — changes to research doc and deals.json together

### Cross-Reference Rules

- Every restaurant in `deals.json` has a matching section in `research/{city-slug}.md` with status `in-production`
- Every deal in production has a source URL in the research doc
- The research doc's production ID matches the restaurant's `id` in `deals.json`

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
3. Remove or update deals that are no longer offered

**Stale sweep:**
1. Query deals where `lastVerified` is older than 90 days
2. Add re-verification items to backlog
3. Work through backlog in priority order
