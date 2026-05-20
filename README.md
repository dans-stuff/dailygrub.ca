# Daily Grub

[**dailygrub.ca**](https://dailygrub.ca) — Canada's open, community-maintained directory of restaurant deals, happy hours, and daily specials.

No accounts. No ads. No tracking. A few hundred KB of static HTML served from the edge.

## 👉 Contribute (no coding needed)

| | |
| --- | --- |
| 🍔 [**Submit a deal**](../../issues/new?template=new-deal.yml) | An existing restaurant has a new happy hour or daily special you know about |
| 🏪 [**Submit a new restaurant**](../../issues/new?template=new-restaurant.yml) | A restaurant that isn't on the site yet |
| 🏙️ [**Add a new city**](../../issues/new?template=new-city.yml) | We don't cover your city yet — let's fix that |
| 🛠️ [**Report a wrong or stale deal**](../../issues/new?template=correction.yml) | Something on the site is outdated or wrong |

Just answer the questions in plain English — a maintainer will turn your submission into a properly formatted entry. **You don't need to know Git, JSON, or YAML to help.**

Comfortable editing files? See [**CONTRIBUTING.md**](CONTRIBUTING.md) — every restaurant is a single YAML file under [`restaurants/`](restaurants), and there's a fully commented [`_TEMPLATE.yaml`](restaurants/_TEMPLATE.yaml) you can copy.

## How it works

- **Data lives in this repo as YAML.** One file per restaurant under [`restaurants/`](restaurants), plus [`cities.yaml`](cities.yaml).
- **The site is static.** A build step assembles, validates, and ships everything to Cloudflare. The assembled dataset is also published at [`/deals.json`](https://dailygrub.ca/deals.json) for anyone to reuse.
- **Every PR runs a full test gate**: schema validation → assembly → invariant smoke tests → TypeScript typecheck → ESLint → Next build. Broken submissions cannot be merged.
- A maintainer reviews and merges. Cloudflare auto-deploys. There is no other infrastructure.

City-by-city research and verification notes live in [`research/`](research/).

## License

- **Code** — MIT. See [LICENSE](LICENSE).
- **Deal data** (`restaurants/`, `cities.yaml`, the published `deals.json`) — Creative Commons Attribution-ShareAlike 4.0. See [LICENSE-DATA](LICENSE-DATA).

Anyone is free to reuse the dataset, including commercially, as long as they credit Daily Grub and share derivative datasets back under the same license.

## Local development

```bash
npm install
npm run dev               # validates + assembles, then runs Next.js
npm test                  # full test gate CI runs (validate + build + smoke + typecheck)
npm run build             # production build
```

`public/deals.json` is generated from `restaurants/*.yaml` + `cities.yaml` and is not committed.

## Stack

Next.js (static export) · TypeScript · Tailwind · Cloudflare Workers.
