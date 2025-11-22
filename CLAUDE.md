# Daily Grub - Architecture

## Two Deployments, One Codebase

1. **Static Viewer** (dailygrub.ca) - Cloudflare Workers
   - Fully pre-compiled, no server
   - All deals baked into JS bundle at build time

2. **Admin App** (dailygrub-admin-ui-8a4f28e5.netlify.app) - Netlify
   - Dynamic Next.js for deal CRUD
   - Reads/writes Netlify Blob

## Data Storage: Netlify Blobs

The **only database** is a Netlify Blob containing all deals (JSON).

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    Admin App    │ ───> │  Netlify Blob   │ <─── │   npm run sync  │
│    (Netlify)    │write │   (deals.json)  │ read │   (downloads)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                                          │
                                                          v
                                                   ┌─────────────────┐
                                                   │ data/deals.json │
                                                   └─────────────────┘
                                                          │
                                                          v
                                                   ┌─────────────────┐
                                                   │  npm run build  │
                                                   │  npm run deploy │
                                                   └─────────────────┘
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run sync` | Download blob from Netlify to `data/deals.json` |
| `npm run build` | Static export to `./out/` |
| `npm run preview` | Build + wrangler dev (port 8787) - test static site |
| `npm run deploy` | Build + deploy to Cloudflare |

## Key Files

- `data/deals.json` - Deal data (synced from Netlify Blob)
- `lib/deals.ts` - Loads deals JSON, runs at build time only
- `scripts/sync-deals.sh` - Downloads blob from admin API
- `admin/` - Admin app source (separate Next.js app)

## Admin App

**Current state:** Basic textarea editor with Load/Save/Upload/Download buttons.

**Planned UI:**

### Navigation Structure
```
/ (home)
├── Cities list
│   └── [city] - Restaurants list
│       └── [restaurant] - Deals list
│           └── [deal] - Deal editor
```

### City List (`/`)
- List of cities with deal counts
- "+ Add City" button
- Click city to view restaurants

### Restaurant List (`/[city]`)
- Breadcrumb: Cities > Lethbridge
- List of restaurants with deal counts
- "+ Add Restaurant" button
- Restaurant type indicator (local/chain/sponsored)
- Click restaurant to view deals

### Deals List (`/[city]/[restaurant]`)
- Breadcrumb: Cities > Lethbridge > Original Joe's
- List of deals with summary info
- "+ Add Deal" button
- Deal cards showing:
  - Title, summary
  - Day(s) active
  - Time range (if applicable)
  - Active/inactive toggle

### Deal Editor (`/[city]/[restaurant]/[deal]`)
- Form fields:
  - Title (text)
  - Summary (text)
  - Description (textarea)
  - Type (food/drink/both)
  - Price (optional text)
  - Day selection:
    - Single day picker (Sun-Sat)
    - OR multi-day checkboxes
    - OR "All days" toggle
  - Time range (optional):
    - Start hour (0-23 dropdown)
    - End hour (0-23 dropdown)
  - Last verified (date picker)
  - Active (toggle)
- Save / Delete buttons
- Changes save to blob immediately

### Data Types (from `types/deals.ts`)
```typescript
interface Deal {
  id: string;
  title: string;
  summary: string;
  description: string;
  type: 'food' | 'drink' | 'both';
  price?: string;
  dayOfWeek?: number;      // 0-6 for single-day
  daysOfWeek?: number[];   // for multi-day
  startHour?: number;      // 0-23
  endHour?: number;        // 0-23
  lastVerified?: string;   // YYYY-MM-DD
  isActive: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  type: 'local' | 'chain' | 'sponsored';
  deals: Deal[];
}

interface City {
  name: string;
  province: string;
  restaurants: Restaurant[];
}

interface DealsData {
  cities: { [citySlug: string]: City };
}
```
