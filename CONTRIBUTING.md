# Contributing

The short version is in the [README](README.md#-help-out-no-coding-needed). This file covers the details.

## Schema reference

Every restaurant is a single YAML file in [`restaurants/`](restaurants). The fully commented schema lives in [`restaurants/_TEMPLATE.yaml`](restaurants/_TEMPLATE.yaml).

Required fields:

- `id` — kebab-case, must match the filename (without `.yaml`)
- `name` — how the restaurant is publicly known
- `type` — `local` | `chain` (`sponsored` / `exclusive` are maintainer-only)
- `cities` — at least one entry; each key must exist in [`cities.yaml`](cities.yaml)
- `deals` — at least one deal

Each deal needs:

- `id` (unique within the file), `title`, `description`
- `type` — `food` | `drink` | `both`

Optional:

- `website` (restaurant level)
- `address` per city under `cities.<slug>.address`
- `dayOfWeek` (0=Sun, 6=Sat) **or** `daysOfWeek: [1, 2, 3]` — omit both for all-week
- `startHour` / `endHour` — 0-23

## Sources matter

We don't merge deal changes without a source — a restaurant website, an official social post, a recent in-person photo, or "called them on YYYY-MM-DD." That's the one strict rule.

## Local dev

```bash
cd site
npm install
npm run dev
npm test
```

`site/public/deals.json` is generated — never edit it by hand.

## License

By contributing you agree your contributions are released under the project's licenses: **AGPL-3.0** for code, **ODbL 1.0** for data.
