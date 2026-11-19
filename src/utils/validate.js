import { ApiError } from './ApiError.js';
export function need(body, fields) {
    const missing = fields.filter(
        (f) => body[f] === undefined || body[f] === null || body[f] === ''
    );
    if (missing.length) {
        throw new ApiError(400, `Required fields missing: ${missing.join(', ')}`);
    }
}

export function pick(obj, fields) {
    const out = {};
    for (const f of fields) {
        if (obj[f] !== undefined) out[f] = obj[f];
    }
    return out;
}
