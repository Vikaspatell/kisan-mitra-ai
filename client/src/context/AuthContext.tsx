import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi, profileApi } from '../services/api';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kisan_mitra_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setLanguage } = useLanguage();

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        setUser(res.user);
        if (res.user.preferredLanguage) {
          setLanguage(res.user.preferredLanguage);
        }
      } catch (err) {
        console.warn('Failed to verify token, clearing session.');
        localStorage.removeItem('kisan_mitra_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (phone: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(phone, pass);
      localStorage.setItem('kisan_mitra_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.preferredLanguage) {
        setLanguage(res.user.preferredLanguage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      localStorage.setItem('kisan_mitra_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.preferredLanguage) {
        setLanguage(res.user.preferredLanguage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('kisan_mitra_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const res = await profileApi.update(updates);
    setUser(res.user);
    if (res.user.preferredLanguage) {
      setLanguage(res.user.preferredLanguage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
