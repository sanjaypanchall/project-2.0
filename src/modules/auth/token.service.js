import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import { RefreshToken } from './refreshToken.model.js';
import { User } from '../users/user.model.js';

export const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');


export function signAccessToken(user) {
    return jwt.sign({ sub: String(user._id), role: user.role }, env.accessSecret, {
        expiresIn: `${env.accessMinutes}m`,
    });
}


export async function issueTokenPair(user, req) {
    const accessToken = signAccessToken(user);
    const refreshToken = jwt.sign(
        { sub: String(user._id), jti: crypto.randomUUID() }, // jti = har token unique
        env.refreshSecret,
        { expiresIn: `${env.refreshDays}d` }
    );
    await RefreshToken.create({
        user: user._id,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + env.refreshDays * 24 * 60 * 60 * 1000),
        userAgent: req.headers['user-agent'],
        ip: req.ip,
    });
    return { accessToken, refreshToken };
}



export async function rotateRefreshToken(oldToken, req) {
    try {
        jwt.verify(oldToken, env.refreshSecret);
    } catch {
        throw new ApiError(401, 'Refresh token galat ya expire hai');
    }
    const stored = await RefreshToken.findOne({ tokenHash: sha256(oldToken) });
    if (!stored) throw new ApiError(401, 'Refresh token pehchana nahi gaya');
    if (stored.revokedAt) {
        await RefreshToken.updateMany({ user: stored.user, revokedAt: null }, { revokedAt: new Date() });
        throw new ApiError(401, 'Token reuse detect hua - sab sessions logout kar diye gaye');
    }
    const user = await User.findById(stored.user);
    if (!user || !user.isActive) throw new ApiError(401, 'User inactive hai');
    stored.revokedAt = new Date();
    await stored.save();
    const pair = await issueTokenPair(user, req);
    return { ...pair, user };
}


export async function revokeAllSessions(userId) {
    await RefreshToken.updateMany({ user: userId, revokedAt: null }, { revokedAt: new Date() });
}
