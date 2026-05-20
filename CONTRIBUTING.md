# Contributing

Every restaurant on [dailygrub.ca](https://dailygrub.ca) is a single YAML file in [`restaurants/`](restaurants). To help out:

## To **fix or add a deal**

1. Open the restaurant's file in [`restaurants/`](restaurants).
2. Click the ✏️ pencil to edit it on GitHub.
3. Add or change a deal in the `deals:` list.
4. Scroll down, click **Propose changes**. You've opened a PR.

## To **add a new restaurant**

Copy [`restaurants/_TEMPLATE.yaml`](restaurants/_TEMPLATE.yaml), save it with the restaurant's name (e.g. `the-slice.yaml`), fill in the blanks. The template explains every field inline.

## To **add a new city**

Add an entry to [`cities.yaml`](cities.yaml):

```yaml
saskatoon:
  name: Saskatoon
  province: SK
```

Then a restaurant can use it under `cities:`.

## A deal looks like

```yaml
- title: Wing Wednesday
  description: Half-price wings all day. Dine-in only.
  type: food                # food | drink | both
  days: [Wednesday]         # one day, several, or omit for all week
  startHour: 17             # optional 24-hour window
  endHour: 21
```

Required: `title`, `description`, `type`. Everything else is optional.

## Source required

We won't merge a deal change without a source — a link, a recent photo, or "saw it in-person on YYYY-MM-DD". The PR template asks for it.

## License

Contributions are released under the project's licenses: **AGPL-3.0** (code) and **ODbL 1.0** (data).
