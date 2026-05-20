# Daily Grub

[**dailygrub.ca**](https://dailygrub.ca) — Canada's open, community-maintained directory of restaurant deals, happy hours, and daily specials.

Time-aware filtering. No accounts. No ads. No tracking pixels. A few hundred KB of static HTML served from the edge.

## How it works

- **Data lives in this repo.** One JSON file per restaurant under [`cities/`](data/cities).
- **The site is static.** A build step assembles the per-restaurant files, validates them, and ships HTML/JS to Cloudflare.
- **Anyone can contribute.** Open a PR or an issue. CI validates. A maintainer merges. Cloudflare auto-deploys. There is no other infrastructure.

## Contributing

See [**CONTRIBUTING.md**](CONTRIBUTING.md). The short version: add or edit one file under `cities/<your-city>/<restaurant>.json`, open a PR with a source link. Or open an issue and a maintainer will do it for you.

City-by-city research and verification notes live in [`research/`](research/).

## Local development

```bash
npm install
npm run dev          # validates + assembles data, then runs Next.js
npm run data:validate
npm run data:build   # regenerates data/deals.json from cities/**
npm run build        # full production build
```

`data/deals.json` is a generated artifact — don't edit it directly.

## Stack

Next.js (static export) · TypeScript · Tailwind · Cloudflare Workers.

## License

MIT.
