import express from 'express';
import { handleChat } from '../controllers/ai.controller.js';
import { checkJwt, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(checkJwt);

router.post('/chat', checkRole('user', 'admin'), handleChat);

export default router;