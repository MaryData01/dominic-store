import express from 'express';
import { chatWithAssistant } from '../controllers/assistantController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Stricter rate limit for AI Assistant: 20 requests per hour per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: 'AI rate limit exceeded, please try again later.' }
});

router.post('/chat', aiLimiter, chatWithAssistant);

export default router;
