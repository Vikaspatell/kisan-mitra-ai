import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { dbChat } from '../db';
import { generateCopilotResponse } from '../services/aiService';
import { Language } from '../types';

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  language: z.enum(['en', 'hi', 'te']).optional(),
});

// GET /api/ai/history - Fetch chat history for logged-in user
router.get('/history', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const messages = await dbChat.getMessagesByUserId(req.user!.id);
    res.json({ messages });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Failed to fetch chat history' });
  }
});

// POST /api/ai/chat - Send message to AI Copilot
router.post('/chat', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.errors.map(e => e.message),
      });
      return;
    }

    const { message, language } = parseResult.data;
    const user = req.user!;
    const lang: Language = (language || user.preferredLanguage || 'en') as Language;

    const history = await dbChat.getMessagesByUserId(user.id);

    // Save user message
    const userMsgId = `msg_${Date.now()}_u`;
    const userMsg = await dbChat.addMessage({
      id: userMsgId,
      userId: user.id,
      role: 'user',
      content: message,
      language: lang,
      createdAt: new Date().toISOString(),
    });

    // Generate personalized AI response
    const aiText = await generateCopilotResponse(message, user, history, lang);

    // Save assistant message
    const aiMsgId = `msg_${Date.now()}_a`;
    const aiMsg = await dbChat.addMessage({
      id: aiMsgId,
      userId: user.id,
      role: 'assistant',
      content: aiText,
      language: lang,
      createdAt: new Date().toISOString(),
    });

    res.json({
      reply: aiText,
      userMessage: userMsg,
      assistantMessage: aiMsg,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('AI chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI chat message' });
  }
});

// DELETE /api/ai/history - Clear chat history
router.delete('/history', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await dbChat.clearUserMessages(req.user!.id);
    res.json({ message: 'Chat history cleared successfully' });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Failed to clear chat history' });
  }
});

export default router;
