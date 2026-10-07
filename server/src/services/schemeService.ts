import { dbSchemes } from '../db';
import { GovernmentScheme, Language } from '../types';

export interface SchemeFilter {
  category?: 'all' | 'central' | 'state';
  state?: string;
  search?: string;
  farmerCrops?: string[];
  lang?: Language;
}

export async function getSchemes(filter: SchemeFilter = {}) {
  const allSchemes = await dbSchemes.getAll();

  let filtered = allSchemes;

  if (filter.category && filter.category !== 'all') {
    filtered = filtered.filter(s => s.category === filter.category);
  }

  if (filter.state && filter.state !== 'all') {
    filtered = filtered.filter(s =>
      s.category === 'central' || (s.state && s.state.toLowerCase().includes(filter.state!.toLowerCase()))
    );
  }

  if (filter.search && filter.search.trim().length > 0) {
    const q = filter.search.toLowerCase().trim();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.nameHi && s.nameHi.includes(q)) ||
      (s.nameTe && s.nameTe.includes(q)) ||
      s.summary.toLowerCase().includes(q) ||
      s.benefits.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.eligibility.some(e => e.toLowerCase().includes(q))
    );
  }

  return {
    schemes: filtered,
    totalCount: filtered.length,
    source: 'National Portal of India / Department of Agriculture & Farmers Welfare (myScheme.gov.in)',
    lastUpdated: '2026-03-20',
  };
}

export async function getSchemeById(id: string): Promise<GovernmentScheme | null> {
  return await dbSchemes.getById(id);
}
