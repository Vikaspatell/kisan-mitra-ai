import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Phone, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;

    try {
      setLoading(true);
      setError(null);
      await login(phone.trim(), password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error ||
        'Login failed. Please check your mobile number and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick helper to fill demo account
  const handleDemoLogin = () => {
    setPhone('9876543210');
    setPassword('kisan123');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 space-y-6">
      {/* Brand card */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-kisan-700 to-kisan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-kisan-700/20">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {t('loginTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {t('loginSubtitle')}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('loginPhoneLabel')} *
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
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
              {t('loginPassLabel')} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-kisan-700 hover:bg-kisan-800 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Logging In...' : t('loginBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 space-y-4 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-3 rounded-2xl text-xs font-semibold text-kisan-800 bg-kisan-50 hover:bg-kisan-100 border border-kisan-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-wheat-500" />
            <span>Use Demo Farmer Credentials (9876543210 / kisan123)</span>
          </button>

          <p className="text-xs text-stone-500">
            {t('loginNoAccount')}{' '}
            <Link to="/register" className="font-bold text-kisan-700 hover:underline">
              {t('loginRegisterLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
