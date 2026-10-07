import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Phone, Lock, User as UserIcon, MapPin, Wheat, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

const POPULAR_CROPS = [
  'Wheat', 'Rice / Paddy', 'Cotton', 'Onion', 'Soybean',
  'Mustard', 'Maize', 'Sugarcane', 'Tomato', 'Chilli', 'Gram / Chana', 'Turmeric'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Delhi', 'Gujarat',
  'Haryana', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Odisha',
  'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Aligarh');
  const [village, setVillage] = useState('');
  const [landSize, setLandSize] = useState<number>(2.5);
  const [crops, setCrops] = useState<string[]>(['Wheat', 'Mustard']);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(language);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleCrop = (c: string) => {
    if (crops.includes(c)) {
      setCrops(crops.filter(item => item !== c));
    } else {
      setCrops([...crops, c]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !password || !state || !district) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await register({
        name: name.trim(),
        phone: phone.trim(),
        password,
        state,
        district: district.trim(),
        village: village.trim() || undefined,
        landSize: Number(landSize),
        crops,
        preferredLanguage,
      });
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.error ||
        'Registration failed. Please check details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-kisan-700 to-kisan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-kisan-700/20">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {t('registerTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {t('registerSubtitle')}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profileName')} *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar Patel"
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profilePhone')} (10-Digit) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={10}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('loginPassLabel')} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
              />
            </div>
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profileState')} *
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white text-stone-800"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profileDistrict')} *
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Aligarh, Ludhiana, Guntur"
              required
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
            />
          </div>

          {/* Village */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profileVillage')}
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="Village or Tehsil"
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
            />
          </div>

          {/* Landholding Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profileLandSize')}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={landSize}
              onChange={(e) => setLandSize(parseFloat(e.target.value) || 0)}
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Crops Selection */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
            {t('profileCrops')}
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CROPS.map((crop) => {
              const isSelected = crops.includes(crop);
              return (
                <button
                  key={crop}
                  type="button"
                  onClick={() => toggleCrop(crop)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-kisan-700 text-white border-kisan-800 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {crop}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
            {t('profileLang')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी (Hindi)' },
              { code: 'te', label: 'తెలుగు (Telugu)' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setPreferredLanguage(item.code as Language)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  preferredLanguage === item.code
                    ? 'border-kisan-600 bg-kisan-50 text-kisan-900 ring-1 ring-kisan-600'
                    : 'border-stone-200 bg-stone-50 text-stone-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-kisan-700 hover:bg-kisan-800 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Creating Account...' : t('registerBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          {t('registerHaveAccount')}{' '}
          <Link to="/login" className="font-bold text-kisan-700 hover:underline">
            {t('registerLoginLink')}
          </Link>
        </p>
      </form>
    </div>
  );
};
