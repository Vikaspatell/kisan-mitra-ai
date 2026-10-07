import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Building,
  Calendar,
  Layers,
  MapPin,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { marketApi } from '../services/api';
import { MandiPrice, MarketPriceStats } from '../types';

export const MarketPrices: React.FC = () => {
  const { language, t } = useLanguage();
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [comparisons, setComparisons] = useState<MarketPriceStats[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    states: string[];
    districts: string[];
    commodities: string[];
  }>({ states: [], districts: [], commodities: [] });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCommodity, setSelectedCommodity] = useState('all');
  const [sourceInfo, setSourceInfo] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    async function loadPrices() {
      try {
        setLoading(true);
        const data = await marketApi.getPrices({
          state: selectedState === 'all' ? undefined : selectedState,
          district: selectedDistrict === 'all' ? undefined : selectedDistrict,
          commodity: selectedCommodity === 'all' ? undefined : selectedCommodity,
          search: search.trim() || undefined,
        });

        setPrices(data.prices);
        setComparisons(data.comparisons);
        setFilterOptions(data.filters);
        setSourceInfo(data.source);
        setLastUpdated(data.lastUpdated);
      } catch (err) {
        console.error('Failed to load mandi prices:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadPrices();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedState, selectedDistrict, selectedCommodity]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedCommodity('all');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {t('mandiTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {t('mandiSubtitle')}
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-500 text-right bg-stone-50 p-2.5 rounded-xl border border-stone-200 w-fit sm:w-auto">
            <span className="block font-semibold text-stone-700">Source: Agmarknet (GoI)</span>
            <span className="text-[10px]">Arrival: 2026-10-07</span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('mandiSearchPlaceholder')}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          {/* Commodity Dropdown */}
          <div>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-800"
            >
              <option value="all">{t('mandiAllCommodities')}</option>
              {filterOptions.commodities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State Dropdown */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('all');
              }}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-800"
            >
              <option value="all">{t('mandiAllStates')}</option>
              {filterOptions.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-800"
            >
              <option value="all">{t('mandiAllDistricts')}</option>
              {filterOptions.districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {(search || selectedState !== 'all' || selectedDistrict !== 'all' || selectedCommodity !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-600"
                title="Reset Filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Commodity Market Price Comparison Highlights */}
      {comparisons.length > 0 && selectedCommodity === 'all' && !search && (
        <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {t('mandiCompareTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisons.slice(0, 6).map((c) => (
              <div
                key={c.commodity}
                className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">{c.commodity}</h3>
                  <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded-full font-semibold text-stone-700">
                    {c.mandisReporting} Mandis
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-stone-500">{t('mandiAvgPrice')}:</span>
                  <span className="text-base font-black text-stone-900">₹{c.avgModalPrice} / Qtl</span>
                </div>
                <div className="text-[11px] space-y-1 pt-1 border-t border-stone-200 text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700 font-semibold">Highest: ₹{c.highestPrice}</span>
                    <span className="text-stone-500 truncate max-w-[140px]">{c.highestMarket}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-800 font-semibold">Lowest: ₹{c.lowestPrice}</span>
                    <span className="text-stone-500 truncate max-w-[140px]">{c.lowestMarket}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mandi Rates Table / Cards */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Retrieving real-time APMC Mandi rates...</span>
        </div>
      ) : prices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500">
          <TrendingUp className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800 mb-1">{t('mandiNoResults')}</h3>
          <p className="text-sm">Try resetting filters to view all commodities across India.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">{t('mandiCommodity')}</th>
                  <th className="px-6 py-4">{t('mandiMarket')}</th>
                  <th className="px-6 py-4">{t('mandiState')} / {t('mandiDistrict')}</th>
                  <th className="px-6 py-4 text-right">{t('mandiMinPrice')}</th>
                  <th className="px-6 py-4 text-right">{t('mandiMaxPrice')}</th>
                  <th className="px-6 py-4 text-right font-black text-stone-900">{t('mandiModalPrice')}</th>
                  <th className="px-6 py-4">{t('mandiDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {prices.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-900">
                      <div>{item.commodity}</div>
                      <span className="text-[11px] text-stone-400 font-normal">{item.variety}</span>
                    </td>
                    <td className="px-6 py-4 text-stone-700 font-medium">
                      {item.market}
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-xs">
                      {item.district}, {item.state}
                    </td>
                    <td className="px-6 py-4 text-right text-stone-600">
                      ₹{item.minPrice}
                    </td>
                    <td className="px-6 py-4 text-right text-stone-600">
                      ₹{item.maxPrice}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-base font-black text-kisan-800 bg-kisan-50 px-2.5 py-1 rounded-lg border border-kisan-200">
                        ₹{item.modalPrice}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-400 text-xs whitespace-nowrap">
                      {item.arrivalDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-stone-100">
            {prices.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{item.commodity}</h3>
                    <span className="text-xs text-stone-500">{item.variety}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-kisan-800 bg-kisan-50 px-2.5 py-1 rounded-lg border border-kisan-200">
                      ₹{item.modalPrice}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">{item.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span>Mandi: <strong>{item.market}</strong></span>
                  <span>{item.district}, {item.state}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <span>Range: ₹{item.minPrice} - ₹{item.maxPrice}</span>
                  <span>Arrival: {item.arrivalDate}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>{sourceInfo}</span>
            <span>Total Records Displayed: {prices.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};
