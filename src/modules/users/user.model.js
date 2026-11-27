import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        // select:false = query me by default nahi aayega (safety)
        passwordHash: { type: String, required: true, select: false },
        role: { type: String, default: 'employee' },
        isActive: { type: Boolean, default: true },
        lastLoginAt: Date,
    },
    { timestamps: true }
);
userSchema.methods.checkPassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};
userSchema.set('toJSON', {
    transform(doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
    },
});
export const User = mongoose.model('User', userSchema);
export const hashPassword = (plain) => bcrypt.hash(plain, 10);