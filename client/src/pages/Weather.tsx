import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Search,
  MapPin,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  ShieldAlert,
  Calendar,
  AlertCircle,
  RefreshCw,
  Sun,
  CloudRain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { weatherApi } from '../services/api';
import { WeatherData } from '../types';

export const Weather: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchDistrict, setSearchDistrict] = useState(user?.district || 'Indore');

  const fetchWeather = async (districtToQuery?: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const query = districtToQuery || searchDistrict;
      const data = await weatherApi.getLiveWeather({
        district: query,
        state: user?.state,
        village: user?.village,
      });
      setWeather(data);
    } catch (err: any) {
      console.error('Weather retrieval error:', err);
      setErrorMsg(
        err.response?.data?.error ||
        'Unable to retrieve live meteorological data. Please check connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(user?.district || 'Indore');
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDistrict.trim()) return;
    fetchWeather(searchDistrict.trim());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & District Search */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-md">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {t('weatherTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {t('weatherSubtitle')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                placeholder={t('weatherSearchPlaceholder')}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-2xl text-xs sm:text-sm transition-colors shadow-sm whitespace-nowrap"
            >
              {t('weatherSearchBtn')}
            </button>
          </form>
        </div>
      </div>

      {/* Error state if API call failed */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="text-sm">
            <strong>Weather Data Unavailable:</strong> {errorMsg}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
          <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Fetching live meteorological conditions...</span>
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Active Severe Weather Warnings Banner */}
          {weather.alerts.length > 0 && (
            <div className="space-y-3">
              {weather.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-amber-950 text-base">{alert.title}</h3>
                  </div>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {alert.description}
                  </p>
                  <div className="bg-amber-100/90 rounded-2xl p-3 border border-amber-200 text-xs sm:text-sm text-amber-950 font-semibold">
                    💡 <strong>{t('weatherAdvisory')}:</strong> {alert.advisory}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current Weather Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Location Verified
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-sky-600" />
                  <span>{weather.location.name}, {weather.location.state}</span>
                </h2>
                <span className="text-xs text-stone-400 block">
                  Coordinates: {weather.location.latitude.toFixed(2)}°N, {weather.location.longitude.toFixed(2)}°E
                </span>
              </div>

              <div className="flex items-center gap-4 bg-sky-50 px-5 py-3 rounded-2xl border border-sky-100 w-fit">
                <div className="text-3xl sm:text-4xl font-black text-sky-950">
                  {weather.current.temperature}°C
                </div>
                <div className="text-xs text-sky-800">
                  <div className="font-bold">{weather.current.weatherDescription}</div>
                  <div>Feels like {weather.current.apparentTemperature}°C</div>
                </div>
              </div>
            </div>

            {/* Current Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span>{t('weatherHumidity')}</span>
                </div>
                <div className="text-xl font-black text-stone-900">{weather.current.humidity}%</div>
                <span className="text-[11px] text-stone-400">Relative humidity</span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  <span>{t('weatherRainfall')}</span>
                </div>
                <div className="text-xl font-black text-stone-900">{weather.current.precipitation} mm</div>
                <span className="text-[11px] text-stone-400">Current precipitation</span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Wind className="w-4 h-4 text-emerald-500" />
                  <span>{t('weatherWind')}</span>
                </div>
                <div className="text-xl font-black text-stone-900">{weather.current.windSpeed} km/h</div>
                <span className="text-[11px] text-stone-400">Wind speed (10m)</span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Gauge className="w-4 h-4 text-purple-500" />
                  <span>{t('weatherPressure')}</span>
                </div>
                <div className="text-xl font-black text-stone-900">{weather.current.surfacePressure} hPa</div>
                <span className="text-[11px] text-stone-400">Surface pressure</span>
              </div>
            </div>
          </div>

          {/* 7-Day Agronomic Forecast Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                {t('weatherForecastTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day) => {
                const dateObj = new Date(day.date);
                const dayName = dateObj.toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US', { weekday: 'short' });
                const dateDisplay = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                return (
                  <div
                    key={day.date}
                    className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 flex flex-col justify-between space-y-3 hover:bg-sky-50/50 transition-colors"
                  >
                    <div className="text-center pb-2 border-b border-stone-200">
                      <span className="font-bold text-stone-900 text-sm block">{dayName}</span>
                      <span className="text-[10px] text-stone-400">{dateDisplay}</span>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-base font-black text-stone-900">
                        {day.tempMax}° / <span className="text-stone-400 text-xs font-normal">{day.tempMin}°</span>
                      </div>
                      <span className="text-[10px] text-stone-600 font-medium block leading-tight line-clamp-2">
                        {day.weatherDescription.split('(')[0]}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-stone-500 pt-2 border-t border-stone-200">
                      <div className="flex items-center justify-between">
                        <span>🌧️ {t('weatherRainProb')}:</span>
                        <strong className="text-sky-700">{day.precipitationProbability}%</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rain:</span>
                        <strong>{day.precipitationSum} mm</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Wind:</span>
                        <strong>{day.windSpeedMax} km/h</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
              <span>{t('weatherSource')}</span>
              <span>Retrieved: {new Date(weather.retrievedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
