# Daily Grub

Lethbridge's best food & drink deals in one place.

## Features

- Daily specials and happy hours for Lethbridge restaurants
- Time-aware deal filtering (shows deals based on current day/time in Lethbridge timezone)
- Clean, modern, responsive UI
- PostHog analytics integration for tracking deal interactions
- SEO-optimized with Next.js server-side rendering

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- PostHog Analytics
- Deployed on Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Add your PostHog credentials to .env.local
# NEXT_PUBLIC_POSTHOG_KEY=your_key_here
# NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Data Structure

Deals are stored in `/data/deals.json` with the following structure:

```json
{
  "id": "unique-deal-id",
  "title": "Deal Title",
  "summary": "Short description",
  "description": "Full description with details",
  "type": "food" | "drink" | "both",
  "price": "$10" (optional),
  "dayOfWeek": 0-6 (optional, for single-day deals),
  "daysOfWeek": [0,1,2] (optional, for multi-day deals),
  "startHour": 14 (optional, for hourly deals),
  "endHour": 18 (optional, for hourly deals),
  "isActive": true
}
```

## Deployment

### Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Set environment variables:
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`
4. Deploy

Build settings are configured in `netlify.toml`.

## Analytics

Deal clicks are tracked in PostHog with the following event:

```javascript
posthog.capture('deal_opened', {
  deal_id: string,
  deal_title: string,
  restaurant_id: string,
  restaurant_name: string,
  deal_type: 'food' | 'drink' | 'both'
})
```

## License

MIT
