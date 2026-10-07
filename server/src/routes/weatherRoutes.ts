import { Router, Request, Response } from 'express';
import { fetchLiveWeather } from '../services/weatherService';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { dbUsers } from '../db';

const router = Router();

// GET /api/weather
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    let district = (req.query.district as string) || '';
    let state = (req.query.state as string) || '';
    let village = (req.query.village as string) || '';
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;

    // Check if token was supplied to infer farmer location if not explicitly queried
    if (!district && !state && !lat) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
          const user = await dbUsers.findById(decoded.userId);
          if (user) {
            district = user.district;
            state = user.state;
            village = user.village || '';
          }
        } catch {
          // Ignore token error for public weather query
        }
      }
    }

    // Default to central India location if completely empty
    if (!district && !state && lat === undefined) {
      district = 'Indore';
      state = 'Madhya Pradesh';
    }

    const weatherData = await fetchLiveWeather({
      district,
      state,
      village,
      lat,
      lon,
    });

    res.json(weatherData);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Weather API error:', error);
    res.status(503).json({
      error: 'Unable to retrieve live weather data from Open-Meteo meteorological service at this moment.',
      message: error.message,
      source: 'Open-Meteo Global Forecasting Service',
      status: 'unavailable',
    });
  }
});

export default router;
