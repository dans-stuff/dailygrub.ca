import YAML from 'yaml';
import type { ExtractedDeal, ExtractedTip } from './types';
import { normalizeName } from './match';

function dealNode(deal: ExtractedDeal): Record<string, unknown> {
  const node: Record<string, unknown> = {
    title: deal.title,
    description: deal.description,
    type: deal.type,
  };
  if (deal.days?.length) node.days = deal.days;
  if (deal.startHour !== undefined) node.startHour = deal.startHour;
  if (deal.endHour !== undefined) node.endHour = deal.endHour;
  return node;
}

export function createRestaurantYaml(tip: ExtractedTip): string {
  const doc: Record<string, unknown> = { name: tip.restaurant_name.trim(), type: 'local' };
  if (tip.website) doc.website = tip.website;
  doc.cities = { [tip.city_slug]: tip.address ? { address: tip.address } : {} };
  doc.deals = tip.deals.map(dealNode);
  return (
    '# Added from an email tip — see the PR for provenance.\n' +
    YAML.stringify(doc, { lineWidth: 0 })
  );
}

export interface MergeResult {
  yaml: string;
  addedDeals: ExtractedDeal[];
  addedCity: boolean;
}

// Merges new deals/city into an existing restaurant file. Uses parseDocument so
// hand-written comments and formatting survive. Never overwrites an existing
// address. Returns null when there is nothing new to add.
export function mergeRestaurantYaml(existingYaml: string, tip: ExtractedTip): MergeResult | null {
  const doc = YAML.parseDocument(existingYaml);
  const current = doc.toJS() as {
    cities?: Record<string, { address?: string } | null>;
    deals?: ExtractedDeal[];
  };

  const addedCity = !(tip.city_slug in (current.cities ?? {}));
  if (addedCity) {
    doc.setIn(['cities', tip.city_slug], tip.address ? { address: tip.address } : {});
  }

  const existingTitles = new Set((current.deals ?? []).map((d) => normalizeName(d.title ?? '')));
  const addedDeals = tip.deals.filter((d) => !existingTitles.has(normalizeName(d.title)));
  for (const deal of addedDeals) doc.addIn(['deals'], dealNode(deal));

  if (!addedCity && addedDeals.length === 0) return null;
  // lineWidth 0 disables re-wrapping so untouched lines stay byte-identical in diffs.
  return { yaml: doc.toString({ lineWidth: 0 }), addedDeals, addedCity };
}
