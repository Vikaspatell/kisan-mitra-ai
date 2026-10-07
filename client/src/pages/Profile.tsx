import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  MapPin,
  Wheat,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

const POPULAR_CROPS = [
  'Wheat (गेहूं / గోధుమ)',
  'Rice / Paddy (धान / వరి)',
  'Cotton (कपास / పత్తి)',
  'Onion (प्याज / ఉల్లిపాయ)',
  'Soybean (सोयाबीन / సోయాబీన్)',
  'Mustard (सरसों / ఆవాలు)',
  'Maize (मक्का / మొక్కజొన్న)',
  'Sugarcane (गन्ना / చెరకు)',
  'Tomato (टमाटर / టమోటా)',
  'Chilli (मिर्च / మిర్చి)',
  'Turmeric (हल्दी / పసుపు)',
  'Gram / Chana (चना / శనగలు)',
  'Groundnut (मूंगफली / వేరుశెనగ)',
  'Pulses (दालें / పప్పుధాన్యాలు)',
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [state, setState] = useState(user?.state || 'Madhya Pradesh');
  const [district, setDistrict] = useState(user?.district || '');
  const [village, setVillage] = useState(user?.village || '');
  const [landSize, setLandSize] = useState<number>(user?.landSize || 1.0);
  const [crops, setCrops] = useState<string[]>(user?.crops || []);
  const [prefLang, setPrefLang] = useState<Language>(user?.preferredLanguage || 'en');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setState(user.state);
      setDistrict(user.district);
      setVillage(user.village || '');
      setLandSize(user.landSize);
      setCrops(user.crops || []);
      setPrefLang(user.preferredLanguage || 'en');
    }
  }, [user]);

  const toggleCrop = (cropName: string) => {
    const baseName = cropName.split('(')[0].trim();
    if (crops.includes(baseName)) {
      setCrops(crops.filter(c => c !== baseName));
    } else {
      setCrops([...crops, baseName]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(false);

      await updateProfile({
        name,
        state,
        district,
        village,
        landSize: Number(landSize),
        crops,
        preferredLanguage: prefLang,
      });

      setLanguage(prefLang);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-kisan-700 to-kisan-500 text-white flex items-center justify-center shadow-md">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t('profileTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {t('profileSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{t('profileSavedSuccess')}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profileName')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
            />
          </div>

          {/* Mobile Phone (Read-Only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profilePhone')}
            </label>
            <input
              type="text"
              value={user?.phone || ''}
              disabled
              className="w-full bg-stone-100 border border-stone-200 rounded-2xl px-4 py-2.5 text-sm text-stone-500 cursor-not-allowed"
            />
            <span className="text-[10px] text-stone-400">Registered identifier</span>
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
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white text-stone-800"
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
              required
              placeholder="e.g. Aligarh, Guntur, Ludhiana"
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
              placeholder="Village or Tehsil name"
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
            />
          </div>

          {/* Land Size */}
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

          {/* Preferred Language */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profileLang')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'te', label: 'తెలుగు (Telugu)' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setPrefLang(item.code as Language)}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold text-center transition-all ${
                    prefLang === item.code
                      ? 'border-kisan-600 bg-kisan-50 text-kisan-900 shadow-sm ring-1 ring-kisan-600'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Crops Selection */}
        <div className="space-y-3 pt-3 border-t border-stone-100">
          <div>
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('profileCrops')} (Select all crops cultivated)
            </label>
            <span className="text-xs text-stone-500">
              Personalizes your Mandi price watch, scheme suggestions, and AI agronomy advice.
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_CROPS.map((crop) => {
              const base = crop.split('(')[0].trim();
              const isSelected = crops.includes(base);
              return (
                <button
                  key={crop}
                  type="button"
                  onClick={() => toggleCrop(crop)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
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

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-kisan-700 hover:bg-kisan-800 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : t('profileSaveBtn')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
