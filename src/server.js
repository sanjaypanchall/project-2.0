import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

async function start() {
    await connectDB();
    const app = await createApp();
    app.listen(env.port, () => console.log(`ERP API running on port ${env.port}`));
}
start().catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
});