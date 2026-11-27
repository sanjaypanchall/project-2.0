import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        tokenHash: { type: String, required: true, unique: true }, // asli token kabhi store nahi karte
        expiresAt: { type: Date, required: true },
        revokedAt: { type: Date, default: null },
        userAgent: String,
        ip: String,
    },
    { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);