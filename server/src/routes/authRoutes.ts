import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { dbUsers, dbNotifications } from '../db';
import { config } from '../config/env';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { SafeUser } from '../types';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be a valid 10-digit mobile number'),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().optional(),
  landSize: z.number().min(0).default(1.0),
  crops: z.array(z.string()).default([]),
  preferredLanguage: z.enum(['en', 'hi', 'te']).default('en'),
});

const loginSchema = z.object({
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(1, 'Password is required'),
});

function toSafeUser(user: any): SafeUser {
  const { passwordHash, ...safe } = user;
  return safe;
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors.map(e => e.message),
      });
      return;
    }

    const data = parseResult.data;
    const existing = await dbUsers.findByPhone(data.phone);
    if (existing) {
      res.status(409).json({ error: 'A farmer account with this mobile number already exists. Please log in.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const now = new Date().toISOString();
    const userId = `farmer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser = await dbUsers.create({
      id: userId,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      passwordHash,
      state: data.state,
      district: data.district,
      village: data.village || undefined,
      landSize: data.landSize,
      crops: data.crops,
      preferredLanguage: data.preferredLanguage,
      createdAt: now,
      updatedAt: now,
    });

    // Generate initial welcome notifications
    await dbNotifications.create({
      id: `notif_${Date.now()}_1`,
      userId: newUser.id,
      type: 'system',
      title: 'Welcome to Kisan Mitra AI! / किसान मित्र में आपका स्वागत है!',
      message: `Namaste ${newUser.name}, your agricultural copilot is ready. Check your dashboard for live weather, mandi rates, and schemes.`,
      severity: 'success',
      isRead: false,
      createdAt: now,
    });

    await dbNotifications.create({
      id: `notif_${Date.now()}_2`,
      userId: newUser.id,
      type: 'scheme',
      title: 'PM-KISAN Next Installment / पीएम-किसान अगली किस्त',
      message: 'Please ensure your Aadhaar e-KYC and bank account linking are completed to receive upcoming financial assistance.',
      severity: 'info',
      isRead: false,
      actionUrl: '/schemes',
      createdAt: now,
    });

    const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Farmer account registered successfully',
      token,
      user: toSafeUser(newUser),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Internal server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors.map(e => e.message),
      });
      return;
    }

    const { phone, password } = parseResult.data;
    const user = await dbUsers.findByPhone(phone);
    if (!user) {
      res.status(401).json({ error: 'No farmer account found with this mobile number. Please register first.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      user: toSafeUser(user),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Internal server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.json({ user: toSafeUser(req.user) });
});

export default router;
