import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CloudSun,
  TrendingUp,
  FileText,
  Info,
  CheckCheck,
  Check,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

export const Notifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = filterType === 'all'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <CloudSun className="w-5 h-5 text-sky-600" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-amber-600" />;
      case 'scheme':
        return <FileText className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-purple-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>{t('notifTitle')}</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full">
                  {unreadCount} {t('notifUnread')}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {t('notifSubtitle')}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-kisan-700 hover:text-kisan-900 bg-kisan-50 hover:bg-kisan-100 px-4 py-2.5 rounded-xl border border-kisan-200 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t('notifMarkAllRead')}</span>
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'weather', 'market', 'scheme', 'system'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              filterType === type
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {type === 'all' ? 'All Alerts' : type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500">
          <Bell className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800 mb-1">{t('notifEmpty')}</h3>
          <p className="text-sm">You are completely up to date with farm alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl p-5 border transition-all shadow-sm ${
                item.isRead
                  ? 'bg-white border-stone-200 opacity-80'
                  : 'bg-amber-50/40 border-amber-200 ring-1 ring-amber-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-white border border-stone-200 shadow-sm shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSeverityBadge(item.severity)}`}>
                        {item.severity}
                      </span>
                      <h3 className="font-bold text-stone-900 text-base leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-stone-400 block pt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.actionUrl && (
                    <Link
                      to={item.actionUrl}
                      className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      title="View details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-kisan-700 hover:bg-stone-100 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
