import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  ListOrdered,
  Building2,
  Calendar,
  X,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { schemesApi } from '../services/api';
import { GovernmentScheme } from '../types';

export const Schemes: React.FC = () => {
  const { language, t } = useLanguage();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'central' | 'state'>('all');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  useEffect(() => {
    async function fetchSchemesData() {
      try {
        setLoading(true);
        const data = await schemesApi.getSchemes({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery.trim() || undefined,
        });
        setSchemes(data.schemes);
      } catch (err) {
        console.error('Failed to fetch schemes:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchSchemesData();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-kisan-700 to-kisan-500 text-white flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t('schemesTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {t('schemesSubtitle')}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('schemesSearchPlaceholder')}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('schemesFilterAll')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('central')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'central'
                  ? 'bg-white text-kisan-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('schemesFilterCentral')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('state')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'state'
                  ? 'bg-white text-kisan-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('schemesFilterState')}
            </button>
          </div>
        </div>
      </div>

      {/* Schemes List Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
          <div className="w-8 h-8 border-3 border-kisan-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading verified government schemes...</span>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800 mb-1">{t('schemesNoResults')}</h3>
          <p className="text-sm">Try broadening your search keywords or resetting filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => {
            const displayName =
              language === 'hi' && scheme.nameHi
                ? scheme.nameHi
                : language === 'te' && scheme.nameTe
                ? scheme.nameTe
                : scheme.name;

            const displaySummary =
              language === 'hi' && scheme.summaryHi
                ? scheme.summaryHi
                : language === 'te' && scheme.summaryTe
                ? scheme.summaryTe
                : scheme.summary;

            const displayBenefits =
              language === 'hi' && scheme.benefitsHi
                ? scheme.benefitsHi
                : language === 'te' && scheme.benefitsTe
                ? scheme.benefitsTe
                : scheme.benefits;

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-kisan-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        scheme.category === 'central'
                          ? 'bg-kisan-100 text-kisan-800 border border-kisan-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {scheme.category === 'central' ? 'Central / केंद्र' : `State: ${scheme.state || 'State'}`}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      Updated: {scheme.lastUpdated}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {displayName}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {displaySummary}
                  </p>

                  <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 space-y-1">
                    <span className="text-[11px] font-bold text-kisan-800 block">
                      💰 {t('schemesBenefits')}:
                    </span>
                    <p className="text-xs text-stone-700 font-medium line-clamp-2">
                      {displayBenefits}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedScheme(scheme)}
                    className="text-xs font-bold text-kisan-700 hover:text-kisan-900 bg-kisan-50 hover:bg-kisan-100 px-3.5 py-2 rounded-xl transition-colors"
                  >
                    View Eligibility & Steps
                  </button>

                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 border border-stone-200 px-3 py-2 rounded-xl transition-colors"
                    title="Official Government Portal"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-kisan-800 bg-kisan-100 px-2.5 py-0.5 rounded-full">
                  {selectedScheme.category === 'central' ? 'Central Scheme' : 'State Scheme'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                  {language === 'hi' && selectedScheme.nameHi
                    ? selectedScheme.nameHi
                    : language === 'te' && selectedScheme.nameTe
                    ? selectedScheme.nameTe
                    : selectedScheme.name}
                </h2>
                <span className="text-xs text-stone-500 block">
                  {selectedScheme.department}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scheme Details Sections */}
            <div className="space-y-5 text-sm">
              {/* Benefits */}
              <div className="bg-kisan-50/80 rounded-2xl p-4 border border-kisan-200 space-y-1">
                <h4 className="font-bold text-kisan-900 text-sm flex items-center gap-1.5">
                  <span>💰 {t('schemesBenefits')}</span>
                </h4>
                <p className="text-stone-800 leading-relaxed text-xs sm:text-sm">
                  {language === 'hi' && selectedScheme.benefitsHi
                    ? selectedScheme.benefitsHi
                    : language === 'te' && selectedScheme.benefitsTe
                    ? selectedScheme.benefitsTe
                    : selectedScheme.benefits}
                </p>
              </div>

              {/* Eligibility Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('schemesEligibility')}</span>
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700">
                  {((language === 'hi' && selectedScheme.eligibilityHi) ||
                    (language === 'te' && selectedScheme.eligibilityTe) ||
                    selectedScheme.eligibility
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-sky-600" />
                  <span>{t('schemesDocuments')}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-stone-700">
                  {((language === 'hi' && selectedScheme.requiredDocumentsHi) ||
                    (language === 'te' && selectedScheme.requiredDocumentsTe) ||
                    selectedScheme.requiredDocuments
                  ).map((doc, idx) => (
                    <div key={idx} className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center gap-2">
                      <span className="text-sky-600 font-bold">•</span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Steps */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-amber-600" />
                  <span>{t('schemesSteps')}</span>
                </h4>
                <ol className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {((language === 'hi' && selectedScheme.applicationStepsHi) ||
                    (language === 'te' && selectedScheme.applicationStepsTe) ||
                    selectedScheme.applicationSteps
                  ).map((step, idx) => (
                    <li key={idx} className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Modal Footer / Official Link Button */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
              <div>
                <span className="block font-medium">Source: {selectedScheme.source}</span>
                <span className="text-[10px]">Verified official portal link</span>
              </div>
              <a
                href={selectedScheme.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-kisan-700 hover:bg-kisan-800 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md text-sm"
              >
                <span>{t('schemesVisitPortal')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
