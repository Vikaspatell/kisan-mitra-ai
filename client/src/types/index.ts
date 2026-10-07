export type Language = 'en' | 'hi' | 'te';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  state: string;
  district: string;
  village?: string;
  landSize: number;
  crops: string[];
  preferredLanguage: Language;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  language: Language;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'weather' | 'market' | 'scheme' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent' | 'success';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface MandiPrice {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalDate: string;
  source: string;
  updatedAt: string;
}

export interface MarketPriceStats {
  commodity: string;
  avgModalPrice: number;
  highestPrice: number;
  highestMarket: string;
  lowestPrice: number;
  lowestMarket: string;
  mandisReporting: number;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  nameHi?: string;
  nameTe?: string;
  category: 'central' | 'state';
  state?: string;
  department: string;
  summary: string;
  summaryHi?: string;
  summaryTe?: string;
  benefits: string;
  benefitsHi?: string;
  benefitsTe?: string;
  eligibility: string[];
  eligibilityHi?: string[];
  eligibilityTe?: string[];
  requiredDocuments: string[];
  requiredDocumentsHi?: string[];
  requiredDocumentsTe?: string[];
  applicationSteps: string[];
  applicationStepsHi?: string[];
  applicationStepsTe?: string[];
  officialPortalUrl: string;
  source: string;
  lastUpdated: string;
}

export interface WeatherCurrent {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  isDay: boolean;
  timestamp: string;
}

export interface WeatherDailyForecast {
  date: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface WeatherData {
  location: {
    name: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: WeatherCurrent;
  forecast: WeatherDailyForecast[];
  alerts: Array<{
    id: string;
    title: string;
    severity: 'info' | 'warning' | 'urgent';
    description: string;
    advisory: string;
  }>;
  source: string;
  retrievedAt: string;
}
