import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ok, created } from '../../utils/respond.js';
import { need } from '../../utils/validate.js';
import { User, hashPassword } from '../users/user.model.js';
import { signAccessToken } from './token.service.js';
// POST /api/auth/setup -> sirf PEHLA user (super admin). Baad me 403.

export const setup = asyncHandler(async (req, res) => {
    need(req.body, ['name', 'email', 'password']);
    const { name, email, password } = req.body;
    if (password.length < 8) throw new ApiError(400, 'Password Should Have 8 Characters Atleast');
    if ((await User.countDocuments()) > 0) throw new ApiError(403, 'Already Setup');
    const user = await User.create({
        name,
        email,
        passwordHash: await hashPassword(password),
        role: 'super_admin',
    });
    created(res, { user }, 'Super admin ban gaya');
});
// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
    need(req.body, ['email', 'password']);
    const { email, password } = req.body;
    // passwordHash select:false hai, isliye +passwordHash se maangna padega
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    const valid = user && user.isActive && (await user.checkPassword(password));
    // Dono case ka same message: attacker ko pata na chale email sahi hai ya nahi
    if (!valid) throw new ApiError(401, 'Invlaid Credentials');
    user.lastLoginAt = new Date();
    await user.save();
    ok(res, { accessToken: signAccessToken(user), user }, 'Login successful');
});
// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
    ok(res, { user: req.user });
});