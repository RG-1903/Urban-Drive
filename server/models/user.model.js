import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: 'https://img.rocket.new/generatedImages/rocket_gen_img_1317ce20a-1762248863496.png',
  },
  avatarAlt: {
    type: String,
    default: 'Default user avatar'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  dateOfBirth: {
    type: String,
  },
  address: {
    type: String,
    trim: true,
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  loyaltyTier: {
    type: String,
    enum: ['Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Silver',
  },
  favorites: {
    vehicles: [{ type: mongoose.Schema.ObjectId, ref: 'Vehicle' }],
    searches: [{
      name: String,
      location: String,
      dates: String,
      category: String,
      priceRange: String,
    }],
  },
  paymentMethods: [
    {
      type: String,
      last4: String,
      expiryDate: String,
      isDefault: { type: Boolean, default: false },
    },
  ],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  socialLinks: {
    instagram: {
      type: String,
      default: ''
    },
    facebook: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    marketing: { type: Boolean, default: true }
  },
  documents: [
    {
      type: { type: String, enum: ['License', 'Passport', 'Insurance'] },
      url: String,
      status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
      uploadedAt: { type: Date, default: Date.now }
    }
  ]
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;