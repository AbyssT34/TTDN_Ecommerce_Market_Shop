import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddressDoc {
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export interface IUserDoc extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'superadmin';
  addresses: IAddressDoc[];
  wishlist: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddressDoc>({
  label: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  street: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUserDoc>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'superadmin'],
      default: 'customer',
    },
    addresses: [AddressSchema],
    wishlist: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUserDoc>('User', UserSchema);
