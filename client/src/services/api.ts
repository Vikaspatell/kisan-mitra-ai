import axios from 'axios';
import { User, MandiPrice, GovernmentScheme, WeatherData, Notification, ChatMessage, MarketPriceStats } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kisan_mitra_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  async register(data: any): Promise<{ token: string; user: User }> {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(phone: string, password: string): Promise<{ token: string; user: User }> {
    const res = await api.post('/auth/login', { phone, password });
    return res.data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const profileApi = {
  async get(): Promise<{ user: User }> {
    const res = await api.get('/profile');
    return res.data;
  },

  async update(updates: Partial<User>): Promise<{ user: User }> {
    const res = await api.put('/profile', updates);
    return res.data;
  },
};

export const weatherApi = {
  async getLiveWeather(params?: { district?: string; state?: string; village?: string; lat?: number; lon?: number }): Promise<WeatherData> {
    const res = await api.get('/weather', { params });
    return res.data;
  },
};

export const marketApi = {
  async getPrices(params?: { state?: string; district?: string; market?: string; commodity?: string; search?: string }): Promise<{
    prices: MandiPrice[];
    totalRecords: number;
    comparisons: MarketPriceStats[];
    filters: {
      states: string[];
      districts: string[];
      commodities: string[];
    };
    source: string;
    lastUpdated: string;
  }> {
    const res = await api.get('/market', { params });
    return res.data;
  },
};

export const schemesApi = {
  async getSchemes(params?: { category?: string; state?: string; search?: string }): Promise<{
    schemes: GovernmentScheme[];
    totalCount: number;
    source: string;
    lastUpdated: string;
  }> {
    const res = await api.get('/schemes', { params });
    return res.data;
  },

  async getScheme(id: string): Promise<{ scheme: GovernmentScheme }> {
    const res = await api.get(`/schemes/${id}`);
    return res.data;
  },
};

export const aiApi = {
  async getHistory(): Promise<{ messages: ChatMessage[] }> {
    const res = await api.get('/ai/history');
    return res.data;
  },

  async sendMessage(message: string, language?: string): Promise<{
    reply: string;
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
  }> {
    const res = await api.post('/ai/chat', { message, language });
    return res.data;
  },

  async clearHistory(): Promise<{ message: string }> {
    const res = await api.delete('/ai/history');
    return res.data;
  },
};

export const notificationApi = {
  async getAll(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const res = await api.get('/notifications');
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/mark-all-read');
  },
};

export default api;
