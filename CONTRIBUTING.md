# Contributing to dailygrub.ca

Welcome! This site lives or dies on locals knowing their local deals. **You don't need to know how to code to contribute.** If you can fill out a form, you can help.

## The easy way (no GitHub knowledge needed)

Open an [issue](../../issues/new/choose) — pick **"Submit a deal"** or **"Report a stale or wrong deal"**. A maintainer will turn it into a PR. That's it.

## The slightly faster way (edit one YAML file)

Every restaurant is **one file**. Adding a deal = editing one file. Adding a new restaurant = creating one file. No code involved.

### Layout

```
restaurants/
  subway.yaml          ← one file per restaurant; chains and locals alike
  boston-pizza.yaml
  duke-pub.yaml
  ...
cities.yaml            ← every city we cover, in one file
site.config.json       ← global site settings
LICENSE                ← MIT (code)
LICENSE-DATA           ← CC BY-SA 4.0 (deal data)
```

### Adding a deal to an existing restaurant

1. Open the restaurant file, e.g. `restaurants/subway.yaml`.
2. Add an entry to the `deals:` list. Set `lastVerified:` to today.
3. Open a PR. CI runs the full test gate. A maintainer merges. Cloudflare auto-deploys.

### Adding a brand new restaurant

Create `restaurants/<restaurant-slug>.yaml`:

```yaml
id: the-slice
name: The Slice
type: local            # local | chain | sponsored | exclusive
website: https://theslice.ca

cities:
  lethbridge:
    address: 517 4 Ave S

deals:
  - id: slice-wing-wed
    title: Wing Wednesday
    description: Half-price wings all day. Dine-in only.
    type: food         # food | drink | both
    dayOfWeek: 3       # 0 = Sun, 6 = Sat
    lastVerified: 2026-05-19
```

For a chain that operates in many cities, add each one under `cities:`:

```yaml
cities:
  lethbridge:
    address: Multiple locations
  red-deer:
    address: 2839 Gaetz Ave
  kelowna: {}          # no per-city address override
```

Rules:
- `id` must equal the filename (without `.yaml`) and be `kebab-case`.
- `type` is one of `local`, `chain`, `sponsored`, or `exclusive`. Use `local` or `chain` for ordinary deals. `sponsored` and `exclusive` are reserved for restaurants that have arranged a partnership with the project — a maintainer sets these.
- Every deal needs `id`, `title`, `description`, `type` (`food`/`drink`/`both`), and `lastVerified` (`YYYY-MM-DD`).
- Days are 0 (Sun) – 6 (Sat). Use `dayOfWeek:` for one day, `daysOfWeek: [1, 2, 3]` for several. Omit for all-week.
- Hours are 0–23. `startHour:` / `endHour:` are optional.
- Every `cities:` key must already exist in `cities.yaml`.

### Adding a new city

Add an entry to `cities.yaml`:

```yaml
red-deer:
  name: Red Deer
  province: AB
  website: https://example-local-site.ca   # optional, drives a per-city link
```

Then reference the city from at least one restaurant under `cities:`.

### Site-wide config

Global settings (site name, domain, default city, etc.) live in [`site.config.json`](site.config.json) at the repo root.

## Sources matter

We don't merge deal changes without a source — a restaurant website, an official social post, a recent in-person photo, or "called them on YYYY-MM-DD." This is the one rule we're strict about. It's what keeps the site trustworthy.

For deeper context per city (rumors, dead ends, removed places), see [`research/`](research/).

## Local development

```bash
npm install
npm run dev               # validates + assembles deals, then runs Next.js
npm run data:validate     # schema + invariant checks on YAML
npm run data:build        # regenerate public/deals.json
npm test                  # the full test gate CI runs
```

`public/deals.json` is a **generated** file — don't edit it directly. It is not committed; it's reassembled from `restaurants/*.yaml` + `cities.yaml` on every build.

## How a contribution becomes a live site

1. You open a PR.
2. CI runs the full gate: schema validation → assembly → invariant smoke tests → TypeScript typecheck → ESLint → Next build.
3. A maintainer reviews and merges.
4. Cloudflare rebuilds and deploys `dailygrub.ca` automatically.

No server, no database, no accounts. The site is a few hundred KB of static files. Free, fast, always up.

## Reusing the data

The full dataset is published at **https://dailygrub.ca/deals.json** under [CC BY-SA 4.0](LICENSE-DATA). Anyone may use it (including commercially) provided they attribute Daily Grub and license their derivatives under the same terms. The code itself is MIT — see [LICENSE](LICENSE).

## Maintainers

We use `CODEOWNERS` for review routing. Open an issue if you'd like to maintain a city.

Thanks for helping. 🍔
