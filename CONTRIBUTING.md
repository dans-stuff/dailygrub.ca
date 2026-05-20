# Contributing to dailygrub.ca

Welcome! This site lives or dies on locals knowing their local deals. **You don't need to know how to code to contribute.** If you can fill out a form, you can help.

## The easy way (no GitHub knowledge needed)

Open an [issue](../../issues/new/choose) — pick **"Submit a deal"** or **"Report a stale or wrong deal"**. A maintainer will turn it into a PR. That's it.

## The slightly faster way (edit one JSON file)

Every restaurant is a single file. Adding a deal = editing one file. Adding a new restaurant = creating one file.

### Layout

```
cities/
  lethbridge/
    _city.json              ← city name & province (you don't usually touch this)
    original-joes.json      ← one restaurant
    churchs-chicken.json
  calgary/
    _city.json
    ...
```

### Adding a deal to an existing restaurant

1. Open the restaurant file (e.g. `cities/lethbridge/original-joes.json`).
2. Add an entry to the `deals` array. Today's date in `lastVerified`.
3. Open a PR. CI will validate. A maintainer merges. Cloudflare auto-deploys.

### Adding a brand new restaurant

Create `cities/<city-slug>/<restaurant-slug>.json`:

```json
{
  "id": "the-slice",
  "name": "The Slice",
  "type": "local",
  "address": "517 4 Ave S, Lethbridge",
  "website": "https://theslice.ca",
  "deals": [
    {
      "id": "slice-wing-wed",
      "title": "Wing Wednesday",
      "description": "Half-price wings all day. Dine-in only.",
      "type": "food",
      "dayOfWeek": 3,
      "lastVerified": "2026-05-19"
    }
  ]
}
```

Rules:
- `id` must equal the filename (without `.json`) and be `kebab-case`.
- `type` is one of `local`, `chain`, `sponsored`, or `exclusive`. Use `local` or `chain` for ordinary deals. `sponsored` and `exclusive` are reserved for restaurants that have arranged a partnership with the project — they sort to the top of the city page. Don't set these in a PR; a maintainer will.
- Every deal needs `id`, `title`, `description`, `type` (`food`/`drink`/`both`), and `lastVerified` (`YYYY-MM-DD`).
- Days are 0 (Sun) – 6 (Sat). Use `dayOfWeek` for one day, `daysOfWeek` for several. Omit for all-week.
- Hours are 0–23. `startHour`/`endHour` are optional.

### Adding a new city

Create the folder and a `_city.json`:

```
cities/<city-slug>/_city.json
```
```json
{ "name": "Red Deer", "province": "AB" }
```

Optionally include a city-specific site, e.g.:

```json
{ "name": "Lethbridge", "province": "AB", "website": "https://myql.ca" }
```

Then add at least one restaurant file alongside it.

### Site-wide config

Global settings (site name, domain, default city, etc.) live in [`site.config.json`](site.config.json) at the repo root. Edit it the same way as any other file.

## Sources matter

We don't merge deal changes without a source — a restaurant website, an official social post, a recent in-person photo, or "called them on YYYY-MM-DD." This is the one rule we're strict about. It's what keeps the site trustworthy.

For deeper context per city (rumors, dead ends, removed places), see [`research/`](research/).

## Local development

```bash
npm install
npm run dev          # validates + assembles data/deals.json, then starts Next.js
npm run data:validate
npm run data:build   # regenerates data/deals.json from cities/**/*.json
```

`data/deals.json` is a **generated** file — don't edit it directly. It's not committed.

## How a contribution becomes a live site

1. You open a PR.
2. CI validates every JSON file (schema, required fields, unique IDs).
3. A maintainer reviews and merges.
4. Cloudflare rebuilds and deploys `dailygrub.ca` automatically.

No server, no database, no accounts. The site is a few hundred KB of static files. Free, fast, always up.

## Maintainers

We use `CODEOWNERS` to route city-level changes to people who know the area. If you'd like to maintain your city, open an issue.

Thanks for helping. 🍔
