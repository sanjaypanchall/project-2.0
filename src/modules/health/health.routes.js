import { Router } from 'express';
import mongoose from 'mongoose';
import { ok } from '../../utils/respond.js';

const router = Router();

router.get('/', (req, res) => {
    ok(res, {
        status: 'up',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
        time: new Date().toISOString(),
    });
});

export const path = '/health';
export default router;
