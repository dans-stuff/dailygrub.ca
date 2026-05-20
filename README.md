# Daily Grub

[**dailygrub.ca**](https://dailygrub.ca) — Canada's open directory of restaurant deals, happy hours, and daily specials. Community-maintained. No accounts. No ads. No tracking.

## 👉 Help out (no coding needed)

Everything you see on the site comes from one file per restaurant in [`restaurants/`](restaurants).

### To **fix or add a deal** at an existing restaurant

1. Browse [`restaurants/`](restaurants) and open the file for that restaurant (e.g. `subway.yaml`).
2. Click the **pencil ✏️ icon** in the top right to edit it in your browser.
3. Change the deal or add a new one in the `deals:` list. Set `lastVerified:` to today's date.
4. Scroll down, write a one-line note ("update Subway Monday deal — saw it in store yesterday"), click **Propose changes**. That's a PR.
5. CI checks it. A maintainer merges. The site auto-deploys within a minute.

### To **add a new restaurant**

1. Open [`restaurants/_TEMPLATE.yaml`](restaurants/_TEMPLATE.yaml) — every field is documented inline.
2. Click **Copy raw file** (or the **Add file → Create new file** button in [`restaurants/`](restaurants)).
3. Name your file after the restaurant, like `the-slice.yaml`. Paste, then fill in the blanks.
4. Propose changes. CI checks it. A maintainer merges.

### To **add a new city**

Edit [`cities.yaml`](cities.yaml). Add an entry like:

```yaml
saskatoon:
  name: Saskatoon
  province: SK
```

That's it. Once a city exists, restaurants can reference it.

---

## How it works

- All data is YAML at the repo root: [`restaurants/*.yaml`](restaurants) and [`cities.yaml`](cities.yaml).
- The website code lives under [`site/`](site).
- On every push, a build step assembles the YAML into a single `deals.json`, embeds it in the static site, and deploys to Cloudflare. The same file is published at [`https://dailygrub.ca/deals.json`](https://dailygrub.ca/deals.json) for anyone to reuse.
- Every PR runs schema validation, smoke tests, TypeScript, ESLint, and a full Next.js build. Broken submissions cannot be merged.

## License

This project is **strong copyleft**. If you publish a modified version — even as a network service — you must publish your changes under the same license.

- **Code** ([`site/`](site)): GNU **AGPL-3.0** — see [`LICENSE`](LICENSE).
- **Deal data** ([`restaurants/`](restaurants), [`cities.yaml`](cities.yaml), the published `deals.json`): **Open Database License (ODbL) 1.0** — see [`LICENSE-DATA`](LICENSE-DATA).

You are free to use both commercially. You must credit Daily Grub and license derivatives under the same terms.

## Local development

```bash
cd site
npm install
npm run dev    # local dev server at http://localhost:3000
npm test       # full CI gate (validate → build → smoke → typecheck)
```
