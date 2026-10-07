import { dbMandi } from '../db';
import { MandiPrice } from '../types';

export interface MarketPriceFilter {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  search?: string;
}

export interface MarketPriceStats {
  commodity: string;
  avgModalPrice: number;
  highestPrice: number;
  highestMarket: string;
  lowestPrice: number;
  lowestMarket: string;
  mandisReporting: number;
}

export async function getMarketPrices(filter: MarketPriceFilter = {}) {
  const allPrices = await dbMandi.getAll();

  let filtered = allPrices;

  if (filter.state && filter.state !== 'all') {
    filtered = filtered.filter(p => p.state.toLowerCase() === filter.state!.toLowerCase());
  }

  if (filter.district && filter.district !== 'all') {
    filtered = filtered.filter(p => p.district.toLowerCase() === filter.district!.toLowerCase());
  }

  if (filter.market && filter.market !== 'all') {
    filtered = filtered.filter(p => p.market.toLowerCase().includes(filter.market!.toLowerCase()));
  }

  if (filter.commodity && filter.commodity !== 'all') {
    filtered = filtered.filter(p => p.commodity.toLowerCase().includes(filter.commodity!.toLowerCase()));
  }

  if (filter.search && filter.search.trim().length > 0) {
    const q = filter.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.commodity.toLowerCase().includes(q) ||
      p.market.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.variety.toLowerCase().includes(q)
    );
  }

  // Calculate commodity comparisons
  const statsMap: Record<string, MandiPrice[]> = {};
  for (const item of allPrices) {
    const baseComm = item.commodity.split('(')[0].trim();
    if (!statsMap[baseComm]) statsMap[baseComm] = [];
    statsMap[baseComm].push(item);
  }

  const comparisons: MarketPriceStats[] = Object.entries(statsMap).map(([comm, items]) => {
    let highest = items[0];
    let lowest = items[0];
    let total = 0;

    for (const item of items) {
      if (item.modalPrice > highest.modalPrice) highest = item;
      if (item.modalPrice < lowest.modalPrice) lowest = item;
      total += item.modalPrice;
    }

    return {
      commodity: comm,
      avgModalPrice: Math.round(total / items.length),
      highestPrice: highest.modalPrice,
      highestMarket: `${highest.market} (${highest.state})`,
      lowestPrice: lowest.modalPrice,
      lowestMarket: `${lowest.market} (${lowest.state})`,
      mandisReporting: items.length,
    };
  });

  // Extract distinct lists for filter dropdowns
  const states = Array.from(new Set(allPrices.map(p => p.state))).sort();
  const districts = Array.from(new Set(allPrices.map(p => p.district))).sort();
  const commodities = Array.from(new Set(allPrices.map(p => p.commodity))).sort();

  return {
    prices: filtered,
    totalRecords: filtered.length,
    comparisons,
    filters: {
      states,
      districts,
      commodities,
    },
    source: 'Agmarknet / Directorate of Marketing & Inspection, Ministry of Agriculture & Farmers Welfare, GoI',
    lastUpdated: filtered.length > 0 ? filtered[0].updatedAt : new Date().toISOString(),
  };
}
