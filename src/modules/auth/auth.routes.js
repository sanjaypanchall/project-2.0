import { Router } from 'express';
import { setup, login, me } from './auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.post('/setup', setup);
router.post('/login', login);
router.get('/me', authenticate, me);
export const path = '/auth';

export default router;
