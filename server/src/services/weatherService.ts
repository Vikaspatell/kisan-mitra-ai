import axios from 'axios';
import { WeatherData, WeatherCurrent, WeatherDailyForecast } from '../types';

// WMO Weather interpretation codes
const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear sky (साफ आसमान / నిర్మలమైన ఆకాశం)',
  1: 'Mainly clear (मुख्य रूप से साफ / ఎక్కువగా నిర్మలం)',
  2: 'Partly cloudy (आंशिक रूप से बादल / పాక్షికంగా మేఘావృతం)',
  3: 'Overcast (बादल छाए हुए / దట్టమైన మేఘాలు)',
  45: 'Fog (कोहरा / పొగమంచు)',
  48: 'Depositing rime fog (घना कोहरा / దట్టమైన పొగమంచు)',
  51: 'Light drizzle (हल्की बूंदाबांदी / తేలికపాటి జల్లులు)',
  53: 'Moderate drizzle (मध्यम बूंदाबांदी / మోస్తరు జల్లులు)',
  55: 'Dense drizzle (घनी बूंदाबांदी / చిరుజల్లులు)',
  61: 'Slight rain (हल्की बारिश / తేలికపాటి వర్షం)',
  63: 'Moderate rain (मध्यम बारिश / మోస్తరు వర్షం)',
  65: 'Heavy rain (भारी बारिश / భారీ వర్షం)',
  71: 'Slight snow fall (हल्की बर्फबारी)',
  73: 'Moderate snow fall (मध्यम बर्फबारी)',
  75: 'Heavy snow fall (भारी बर्फबारी)',
  80: 'Slight rain showers (हल्की बौछारें / తేలికపాటి వర్షపు జల్లులు)',
  81: 'Moderate rain showers (मध्यम बौछारें / మోస్తరు వర్షపు జల్లులు)',
  82: 'Violent rain showers (तेज बौछारें / తీవ్రమైన వర్షపు జల్లులు)',
  95: 'Thunderstorm (आंधी-तूफान / ఉరుములతో కూడిన వర్షం)',
  96: 'Thunderstorm with slight hail (ओलावृष्टि के साथ आंधी / వడగండ్ల వాన)',
  99: 'Thunderstorm with heavy hail (भारी ओलावृष्टि / తీవ్రమైన వడగండ్ల వాన)',
};

// Known coordinates for Indian districts as instant fallback
const DISTRICT_COORDINATES: Record<string, { lat: number; lon: number; state: string }> = {
  'aligarh': { lat: 27.8974, lon: 78.0880, state: 'Uttar Pradesh' },
  'ludhiana': { lat: 30.9010, lon: 75.8573, state: 'Punjab' },
  'guntur': { lat: 16.3067, lon: 80.4365, state: 'Andhra Pradesh' },
  'warangal': { lat: 17.9689, lon: 79.5941, state: 'Telangana' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, state: 'Telangana' },
  'indore': { lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh' },
  'bhopal': { lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh' },
  'nashik': { lat: 19.9975, lon: 73.7898, state: 'Maharashtra' },
  'pune': { lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
  'rajkot': { lat: 22.3039, lon: 70.8022, state: 'Gujarat' },
  'bharatpur': { lat: 27.2152, lon: 77.5030, state: 'Rajasthan' },
  'jaipur': { lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  'kolar': { lat: 13.1367, lon: 78.1291, state: 'Karnataka' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
  'agra': { lat: 27.1767, lon: 78.0081, state: 'Uttar Pradesh' },
  'varanasi': { lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh' },
  'patna': { lat: 25.5941, lon: 85.1376, state: 'Bihar' },
  'new delhi': { lat: 28.6139, lon: 77.2090, state: 'Delhi' },
};

export async function fetchLiveWeather(locationQuery: {
  district?: string;
  state?: string;
  village?: string;
  lat?: number;
  lon?: number;
}): Promise<WeatherData> {
  let lat = locationQuery.lat;
  let lon = locationQuery.lon;
  let locName = locationQuery.village || locationQuery.district || 'India';
  let districtName = locationQuery.district || '';
  let stateName = locationQuery.state || 'India';

  // If coordinates not passed, geocode locationQuery
  if (lat === undefined || lon === undefined) {
    const searchStr = [locationQuery.village, locationQuery.district, locationQuery.state, 'India']
      .filter(Boolean)
      .join(', ');

    try {
      const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: locationQuery.district || locationQuery.state || 'Delhi',
          count: 5,
          language: 'en',
          format: 'json',
        },
        timeout: 5000,
      });

      if (geoRes.data && geoRes.data.results && geoRes.data.results.length > 0) {
        // Prioritize India matches
        const indianResult = geoRes.data.results.find((r: { country_code?: string }) => r.country_code === 'IN') || geoRes.data.results[0];
        lat = indianResult.latitude;
        lon = indianResult.longitude;
        locName = indianResult.name;
        if (indianResult.admin1) stateName = indianResult.admin1;
        if (indianResult.admin2) districtName = indianResult.admin2;
      }
    } catch {
      // Fallback to dictionary
      const lowerDistrict = (locationQuery.district || '').toLowerCase().trim();
      if (DISTRICT_COORDINATES[lowerDistrict]) {
        const found = DISTRICT_COORDINATES[lowerDistrict];
        lat = found.lat;
        lon = found.lon;
        stateName = found.state;
      } else {
        // Default to central India (Nagpur/Indore)
        lat = 22.7196;
        lon = 75.8577;
        stateName = locationQuery.state || 'Madhya Pradesh';
      }
    }
  }

  // Ensure lat and lon are defined
  if (lat === undefined) lat = 22.7196;
  if (lon === undefined) lon = 75.8577;

  // Query Open-Meteo real live forecast API
  const weatherRes = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,is_day',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
      timezone: 'Asia/Kolkata',
      forecast_days: 7,
    },
    timeout: 7000,
  });

  const cur = weatherRes.data.current;
  const daily = weatherRes.data.daily;

  const current: WeatherCurrent = {
    temperature: Math.round(cur.temperature_2m * 10) / 10,
    apparentTemperature: Math.round(cur.apparent_temperature * 10) / 10,
    humidity: Math.round(cur.relative_humidity_2m),
    precipitation: cur.precipitation || 0,
    weatherCode: cur.weather_code,
    weatherDescription: WMO_CODE_MAP[cur.weather_code] || 'Partly Cloudy',
    windSpeed: Math.round(cur.wind_speed_10m * 10) / 10,
    windDirection: cur.wind_direction_10m,
    surfacePressure: Math.round(cur.surface_pressure),
    isDay: cur.is_day === 1,
    timestamp: cur.time,
  };

  const forecast: WeatherDailyForecast[] = [];
  if (daily && daily.time) {
    for (let i = 0; i < daily.time.length; i++) {
      forecast.push({
        date: daily.time[i],
        weatherCode: daily.weather_code[i],
        weatherDescription: WMO_CODE_MAP[daily.weather_code[i]] || 'Clear',
        tempMax: Math.round(daily.temperature_2m_max[i] * 10) / 10,
        tempMin: Math.round(daily.temperature_2m_min[i] * 10) / 10,
        precipitationProbability: daily.precipitation_probability_max[i] || 0,
        precipitationSum: Math.round((daily.precipitation_sum[i] || 0) * 10) / 10,
        windSpeedMax: Math.round((daily.wind_speed_10m_max[i] || 0) * 10) / 10,
      });
    }
  }

  // Generate agricultural severe weather alerts based on real metrics
  const alerts: WeatherData['alerts'] = [];

  const maxPrecip = Math.max(...(daily?.precipitation_sum || [0]));
  const maxWind = Math.max(...(daily?.wind_speed_10m_max || [0]));
  const maxTemp = Math.max(...(daily?.temperature_2m_max || [30]));
  const minTemp = Math.min(...(daily?.temperature_2m_min || [15]));

  if (maxPrecip > 30) {
    alerts.push({
      id: 'alert-rain',
      title: 'Heavy Rainfall Warning / भारी बारिश चेतावनी / భారీ వర్ష సూచన',
      severity: 'urgent',
      description: `Significant rainfall expected (${maxPrecip}mm) in your area over the coming days.`,
      advisory: 'Ensure proper drainage in standing crops (paddy, cotton, pulses). Postpone pesticide/fertilizer spraying to avoid chemical runoff.',
    });
  } else if (maxPrecip > 15) {
    alerts.push({
      id: 'alert-mod-rain',
      title: 'Moderate Rainfall Advisory / मध्यम वर्षा परामर्श',
      severity: 'info',
      description: `Rainfall up to ${maxPrecip}mm forecast. Good for soil moisture.`,
      advisory: 'Halt scheduled irrigation cycles to conserve water and prevent waterlogging.',
    });
  }

  if (maxTemp >= 40) {
    alerts.push({
      id: 'alert-heatwave',
      title: 'Heatwave Advisory / तीव्र लू की चेतावनी / తీవ్రమైన వడగాల్పులు',
      severity: 'warning',
      description: `Daytime maximum temperatures will peak near ${maxTemp}°C.`,
      advisory: 'Provide light and frequent irrigation during evening/early morning hours to protect crops from moisture stress.',
    });
  }

  if (minTemp <= 6) {
    alerts.push({
      id: 'alert-frost',
      title: 'Cold Wave / Frost Alert / पाला व शीत लहर चेतावनी',
      severity: 'warning',
      description: `Night temperatures expected to fall to ${minTemp}°C.`,
      advisory: 'Risk of frost injury to sensitive vegetables and mustard. Irrigate fields lightly in the evening to maintain soil temperature.',
    });
  }

  if (maxWind >= 35) {
    alerts.push({
      id: 'alert-wind',
      title: 'High Wind Speed Alert / तेज हवा चेतावनी / బలమైన ఈదురుగాలులు',
      severity: 'warning',
      description: `Wind gusts up to ${maxWind} km/h predicted.`,
      advisory: 'Stake tall crops (sugarcane, banana, maize). Do not apply foliar sprays in windy conditions.',
    });
  }

  return {
    location: {
      name: locName,
      district: districtName || locationQuery.district || locName,
      state: stateName,
      country: 'India',
      latitude: lat,
      longitude: lon,
    },
    current,
    forecast,
    alerts,
    source: 'Open-Meteo Global Forecasting Service (WMO / IMD Data Models)',
    retrievedAt: new Date().toISOString(),
  };
}
