import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CloudSun,
  TrendingUp,
  FileText,
  Bot,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Sparkles,
  Droplets,
  Wind,
  ShieldAlert,
  Wheat,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { weatherApi, marketApi, schemesApi } from '../services/api';
import { WeatherData, MandiPrice, GovernmentScheme } from '../types';
import { VoiceInputButton } from '../components/VoiceInputButton';

export const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [marketPrices, setMarketPrices] = useState<MandiPrice[]>([]);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [quickQuestion, setQuickQuestion] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Fetch Weather
      try {
        setWeatherLoading(true);
        const wData = await weatherApi.getLiveWeather({
          district: user?.district || 'Indore',
          state: user?.state || 'Madhya Pradesh',
          village: user?.village,
        });
        setWeather(wData);
      } catch (err) {
        console.warn('Weather fetch failed:', err);
      } finally {
        setWeatherLoading(false);
      }

      // 2. Fetch Mandi Prices
      try {
        const mData = await marketApi.getPrices({
          state: user?.state || undefined,
        });
        // Prioritize farmer's crops if available
        let filtered = mData.prices;
        if (user && user.crops && user.crops.length > 0) {
          const userCropPrices = mData.prices.filter(p =>
            user.crops.some(c => p.commodity.toLowerCase().includes(c.toLowerCase()))
          );
          if (userCropPrices.length > 0) {
            filtered = userCropPrices;
          }
        }
        setMarketPrices(filtered.slice(0, 4));
      } catch (err) {
        console.warn('Market fetch failed:', err);
      }

      // 3. Fetch Schemes
      try {
        const sData = await schemesApi.getSchemes();
        setSchemes(sData.schemes.slice(0, 3));
      } catch (err) {
        console.warn('Schemes fetch failed:', err);
      }
    }

    loadDashboardData();
  }, [user]);

  const handleQuickAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    navigate(`/ai-copilot?q=${encodeURIComponent(quickQuestion)}`);
  };

  const handleVoiceTranscript = (text: string) => {
    navigate(`/ai-copilot?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Farmer Profile Header */}
      <section className="bg-gradient-to-r from-kisan-900 via-kisan-800 to-kisan-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Wheat className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold text-kisan-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-wheat-300" />
            <span>Kisan Mitra AI • Indian Agriculture Platform</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {t('dashGreeting')}, {user ? user.name : 'Kisan Bandhu'}!
            </h1>
            <p className="text-kisan-100 text-sm sm:text-base mt-1">
              {t('dashSubheading')}
            </p>
          </div>

          {/* Farmer Farm Snippet */}
          {user ? (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/15">
                <MapPin className="w-4 h-4 text-wheat-300" />
                <span>
                  {user.village ? `${user.village}, ` : ''}
                  {user.district}, {user.state}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/15">
                <span>🌾 {user.landSize} {t('dashAcres')}</span>
              </div>
              {user.crops && user.crops.length > 0 && (
                <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/15">
                  <span className="text-wheat-200 font-medium">Crops:</span>
                  <span className="font-semibold">{user.crops.join(', ')}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-wheat-400 hover:bg-wheat-300 text-stone-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-md"
              >
                <span>Register to personalize your farm advisory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Severe Weather Alerts Banner (if present in weather data) */}
      {weather && weather.alerts && weather.alerts.length > 0 && (
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-md">
                  Active Alert
                </span>
                <h3 className="font-bold text-amber-950 text-base">
                  {weather.alerts[0].title}
                </h3>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                {weather.alerts[0].description}
              </p>
              <div className="bg-amber-100/80 rounded-xl p-3 border border-amber-200 text-xs sm:text-sm text-amber-950 font-medium">
                <strong>{t('weatherAdvisory')}:</strong> {weather.alerts[0].advisory}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick AI Copilot Ask Box */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2.5 text-kisan-700">
            <Bot className="w-6 h-6" />
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              {t('dashQuickAI')}
            </h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm">
            {t('dashQuickAIDesc')}
          </p>

          <form onSubmit={handleQuickAiSubmit} className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder={t('aiPlaceholder')}
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3.5 pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white transition-all shadow-inner"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputButton onTranscript={handleVoiceTranscript} />
              </div>
            </div>
            <button
              type="submit"
              className="bg-kisan-700 hover:bg-kisan-800 text-white font-bold px-5 py-3.5 rounded-2xl text-sm transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
            >
              <span>{t('aiSend')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <span>💡 {t('dashVoiceTip')}</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Weather Snapshot + Market Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Weather Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                    {t('dashWeatherSnapshot')}
                  </h3>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {weather ? `${weather.location.name}, ${weather.location.state}` : 'Locating...'}
                  </span>
                </div>
              </div>
              <Link
                to="/weather"
                className="text-xs font-bold text-kisan-700 hover:text-kisan-900 flex items-center gap-1 group"
              >
                <span>{t('dashWeatherViewDetails')}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {weatherLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-stone-400 gap-2">
                <div className="w-6 h-6 border-2 border-kisan-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Fetching live meteorological data...</span>
              </div>
            ) : weather ? (
              <div className="py-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl sm:text-5xl font-black text-stone-900">
                      {weather.current.temperature}°C
                    </div>
                    <div className="text-xs text-stone-500 font-medium mt-1">
                      {t('weatherFeelsLike')}: {weather.current.apparentTemperature}°C
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full border border-sky-200">
                      {weather.current.weatherDescription}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-center">
                    <Droplets className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                    <span className="text-[11px] text-stone-500 block">{t('weatherHumidity')}</span>
                    <strong className="text-sm text-stone-800 font-bold">{weather.current.humidity}%</strong>
                  </div>
                  <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-center">
                    <CloudSun className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <span className="text-[11px] text-stone-500 block">{t('weatherRainfall')}</span>
                    <strong className="text-sm text-stone-800 font-bold">{weather.current.precipitation} mm</strong>
                  </div>
                  <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-center">
                    <Wind className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                    <span className="text-[11px] text-stone-500 block">{t('weatherWind')}</span>
                    <strong className="text-sm text-stone-800 font-bold">{weather.current.windSpeed} km/h</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-stone-500">
                Live weather unavailable. Check network connection.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400">
            {weather?.source || 'Source: Open-Meteo Global Forecasting'}
          </div>
        </div>

        {/* Mandi Prices Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                    {t('dashMarketSnapshot')}
                  </h3>
                  <span className="text-xs text-stone-500">
                    Real Agmarknet APMC mandi prices
                  </span>
                </div>
              </div>
              <Link
                to="/market-prices"
                className="text-xs font-bold text-kisan-700 hover:text-kisan-900 flex items-center gap-1 group"
              >
                <span>{t('dashMarketViewDetails')}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="py-4 space-y-3">
              {marketPrices.length > 0 ? (
                marketPrices.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors border border-stone-100"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{item.commodity}</h4>
                      <span className="text-xs text-stone-500">
                        {item.market} • {item.district}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-kisan-800">
                        ₹{item.modalPrice}
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        per quintal
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-stone-500">
                  Loading authentic Agmarknet prices...
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400">
            Source: Agmarknet / Directorate of Marketing & Inspection, GoI
          </div>
        </div>
      </div>

      {/* Recommended Government Schemes Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-kisan-700" />
              <h2 className="text-xl font-bold text-stone-900">
                {t('dashSchemesSnapshot')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Verified financial subsidies, insurance, and institutional credit support.
            </p>
          </div>
          <Link
            to="/schemes"
            className="text-xs sm:text-sm font-bold text-kisan-700 hover:text-kisan-900 flex items-center gap-1 group w-fit"
          >
            <span>{t('dashSchemesViewDetails')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-stone-50 hover:bg-stone-100/80 transition-all rounded-2xl p-5 border border-stone-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-kisan-700 bg-kisan-100 px-2.5 py-0.5 rounded-full">
                  {scheme.category === 'central' ? 'Central Scheme' : 'State Scheme'}
                </span>
                <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-kisan-800 transition-colors">
                  {language === 'hi' && scheme.nameHi ? scheme.nameHi : language === 'te' && scheme.nameTe ? scheme.nameTe : scheme.name}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {language === 'hi' && scheme.summaryHi ? scheme.summaryHi : language === 'te' && scheme.summaryTe ? scheme.summaryTe : scheme.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-kisan-800">
                  {scheme.benefits.substring(0, 32)}...
                </span>
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg"
                  title="Official Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
