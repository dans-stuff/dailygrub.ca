# Daily Grub

[**dailygrub.ca**](https://dailygrub.ca) — Canada's open directory of restaurant deals, happy hours, and daily specials. Community-maintained, open source, free to use.

## Help out

Every restaurant is a single YAML file you can edit directly in your browser. See [**CONTRIBUTING**](CONTRIBUTING.md) — the whole thing fits on a screen.

No GitHub? Email your tip — text or photos of menus and deal boards — to **tips@dailygrub.ca** and it becomes a pull request automatically (a human reviews before anything goes live).

## Reuse the data

The full dataset is published at [`https://dailygrub.ca/deals.json`](https://dailygrub.ca/deals.json) under [ODbL 1.0](LICENSE-DATA). Free to use, including commercially — credit Daily Grub and share derivatives under the same license.

The site code is [AGPL-3.0](LICENSE).

## Stack

Next.js static export → Cloudflare Workers. Code lives in [`site/`](site); data lives at the repo root. Email tips are handled by a separate Worker in [`workers/tip-intake/`](workers/tip-intake).
