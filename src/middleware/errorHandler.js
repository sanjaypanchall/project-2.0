import { env } from '../config/env.js';
// Poore app ka ek hi error handler (4 parameters = Express ke liye error middleware)
export function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message || 'Server error';
    // Mongoose validation error (required, min, enum...)
    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    }
    // Wrong ObjectId, e.g. /customers/abc
    if (err.name === 'CastError') {
        status = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // Unique field duplicate (email, sku...)
    if (err.code === 11000) {
        status = 409;
        message = `Duplicate value for: ${Object.keys(err.keyValue).join(', ')}`;
    }
    if (status === 500) console.error(err);
    res.status(status).json({
        success: false,
        message,
        details: err.details || undefined,
        stack: env.nodeEnv === 'development' && status === 500 ? err.stack : undefined,
    });
}
