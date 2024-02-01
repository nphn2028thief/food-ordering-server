import { Schema, model } from 'mongoose';
import { IUser } from '../types/auth';
import { ERole } from '../constants/role';

const UserSchema = new Schema<IUser>(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: ERole.USER },
    refreshToken: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export default model<IUser>('User', UserSchema);
