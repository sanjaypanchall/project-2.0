import 'dotenv/config';

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const key of required) {
    if (!process.env[key]) {
        console.error(`Missing env variable: ${key} (.env file check karo)`);
        process.exit(1);
    }
}


export const env = {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI,
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessMinutes: Number(process.env.ACCESS_TOKEN_MINUTES) || 15,
    refreshDays: Number(process.env.REFRESH_TOKEN_DAYS) || 7,
    redisUrl: process.env.REDIS_URL || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
};
