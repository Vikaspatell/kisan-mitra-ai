import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { dbUsers } from '../db';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  state: z.string().min(2, 'State is required').optional(),
  district: z.string().min(2, 'District is required').optional(),
  village: z.string().optional(),
  landSize: z.number().min(0).optional(),
  crops: z.array(z.string()).optional(),
  preferredLanguage: z.enum(['en', 'hi', 'te']).optional(),
});

// GET /api/profile
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// PUT /api/profile
router.put('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors.map(e => e.message),
      });
      return;
    }

    const updated = await dbUsers.update(req.user!.id, parseResult.data);
    if (!updated) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { passwordHash, ...safeUser } = updated;
    res.json({
      message: 'Farmer profile updated successfully',
      user: safeUser,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

export default router;
