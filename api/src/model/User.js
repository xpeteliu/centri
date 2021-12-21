import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  avatarId: {
    type: mongoose.ObjectId,
    required: false,
  },
  lockoutCounter: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'active',
  },
}, { timestamps: true });

async function validatePassword(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.methods.validatePassword = validatePassword;

async function encryptPassword4DocumentOps(next) {
  try {
    if (this.password && !this.password.match(/^\$2[ayb]\$.{56}$/)) {
      this.password = await bcrypt.hash(this.password, 6);
    }
    next();
  } catch (e) {
    next(e);
  }
}

userSchema.pre('save', encryptPassword4DocumentOps);
userSchema.pre('updateOne', {
  document: true,
  query: false,
}, encryptPassword4DocumentOps);

async function encryptPassword4QueryUpdating(next) {
  try {
    /* eslint-disable no-underscore-dangle */
    if (this._update && this._update.password && !this._update.password.match(/^\$2[ayb]\$.{56}$/)) {
      this._update.password = await bcrypt.hash(this._update.password, 6);
    }
    next();
  } catch (e) {
    next(e);
  }
}

userSchema.pre('findOneAndUpdate', encryptPassword4QueryUpdating);
userSchema.pre('updateOne', {
  document: false,
  query: true,
}, encryptPassword4QueryUpdating);

const User = mongoose.model('User', userSchema);

export default User;
