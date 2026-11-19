import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { loadModules } from './modules/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import dns from "dns"

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


export async function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '1mb' }));
    app.use(morgan('dev'));
    app.use('/api', await loadModules());
    app.use(notFound);
    app.use(errorHandler);
    return app;
}