const fs = require('fs');
const path = require('path');

// Read the JSON file
const dealsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/deals.json'), 'utf8')
);

// CSV header
const header = [
  'city_slug',
  'city_name',
  'city_province',
  'restaurant_id',
  'restaurant_name',
  'deal_id',
  'deal_title',
  'deal_summary',
  'deal_description',
  'deal_type',
  'deal_price',
  'day_of_week',
  'days_of_week',
  'start_hour',
  'end_hour',
  'last_verified',
  'is_active'
];

// Function to escape CSV fields
function escapeCsv(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Convert to CSV rows
const rows = [header.join(',')];

Object.entries(dealsData.cities).forEach(([citySlug, city]) => {
  city.restaurants.forEach((restaurant) => {
    restaurant.deals.forEach((deal) => {
      const row = [
        escapeCsv(citySlug),
        escapeCsv(city.name),
        escapeCsv(city.province),
        escapeCsv(restaurant.id),
        escapeCsv(restaurant.name),
        escapeCsv(deal.id),
        escapeCsv(deal.title),
        escapeCsv(deal.summary),
        escapeCsv(deal.description),
        escapeCsv(deal.type),
        escapeCsv(deal.price || ''),
        escapeCsv(deal.dayOfWeek !== undefined ? deal.dayOfWeek : ''),
        escapeCsv(deal.daysOfWeek ? deal.daysOfWeek.join(';') : ''),
        escapeCsv(deal.startHour !== undefined ? deal.startHour : ''),
        escapeCsv(deal.endHour !== undefined ? deal.endHour : ''),
        escapeCsv(deal.lastVerified || ''),
        escapeCsv(deal.isActive ? 'true' : 'false')
      ];
      rows.push(row.join(','));
    });
  });
});

// Write CSV file
const csvContent = rows.join('\n');
fs.writeFileSync(path.join(__dirname, '../data/deals.csv'), csvContent, 'utf8');

console.log('✓ Successfully converted deals.json to deals.csv');
console.log(`✓ Generated ${rows.length - 1} deal rows`);
