import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../modules/users/user.model.js';
// Har protected route se pehle chalega: token check -> req.user set
export const authenticate = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) throw new ApiError(401, 'Login Please Token Needed');
    let payload;
    try {
        payload = jwt.verify(token, env.accessSecret);
    } catch (err) {
        throw new ApiError(401, err.name === 'TokenExpiredError' ? 'Expired Token' : 'Invalid Token');
    }
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) throw new ApiError(401, 'User not found or Inactive User');
    req.user = user;
    next();
});
