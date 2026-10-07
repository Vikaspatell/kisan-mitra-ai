import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { dbNotifications } from '../db';

const router = Router();

// GET /api/notifications
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const notifications = await dbNotifications.getByUserId(req.user!.id);
    res.json({
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length,
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const success = await dbNotifications.markAsRead(req.params.id, req.user!.id);
    if (!success) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    res.json({ message: 'Notification marked as read' });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Failed to update notification' });
  }
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await dbNotifications.markAllAsRead(req.user!.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Failed to update notifications' });
  }
});

export default router;
