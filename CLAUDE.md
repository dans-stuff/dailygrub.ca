# Daily Grub - Architecture

## Two Deployments, One Codebase

1. **Static Viewer** (dailygrub.ca) - Cloudflare Workers
   - Fully pre-compiled, no server
   - All deals baked into JS bundle at build time

2. **Management App** (internal, no public domain) - Netlify
   - Dynamic Next.js for deal CRUD
   - Not built yet

## Data Storage: Netlify Blobs

The **only database** is a Netlify Blob containing all deals (JSON).

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Management App │ ───> │  Netlify Blob   │ <─── │  Static Build   │
│    (Netlify)    │write │   (deals.json)  │ read │   (npm build)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                                          │
                                                          v
                                                   ┌─────────────────┐
                                                   │   Cloudflare    │
                                                   │  (static site)  │
                                                   └─────────────────┘
```

**Workflow (two separate steps):**
1. Sync: Download blob to local `data/deals.json`
2. Deploy: Build static site from local JSON, deploy to Cloudflare

**Current state:** Using `data/deals.csv` as temporary source.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Static export to `./out/` |
| `npm run preview` | Build + wrangler dev (port 8787) - test static site |
| `npm run deploy` | Build + deploy to Cloudflare |
| `npm run dev` | Next.js dev server (port 3000) - for management app dev |

## Key Files

- `data/deals.csv` - Temporary deal source (will be blob)
- `lib/deals.ts` - Parses deals, runs at build time only
- `next.config.ts` - `output: 'export'` for static generation
- `wrangler.toml` - Cloudflare config
