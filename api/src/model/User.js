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
  relatedPostingIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  publishedCommentIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  likedCommentIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  groupIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  followerIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  followeeIds: {
    type: [mongoose.ObjectId],
    default: [],
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

async function encryptPassword4ModelOps(next) {
  try {
    if (!this.password.match(/^\$2[ayb]\$.{56}$/)) {
      this.password = await bcrypt.hash(this.password, 6);
    }
    next();
  } catch (e) {
    next(e);
  }
}

userSchema.pre('save', encryptPassword4ModelOps);
userSchema.pre('updateOne', encryptPassword4ModelOps);

async function encryptPassword4QueryUpdating(next) {
  try {
    /* eslint-disable no-underscore-dangle */
    if (!this._update.password.match(/^\$2[ayb]\$.{56}$/)) {
      this._update.password = await bcrypt.hash(this._update.password, 6);
    }
    next();
  } catch (e) {
    next(e);
  }
}

userSchema.pre('findOneAndUpdate', encryptPassword4QueryUpdating);

const User = mongoose.model('User', userSchema);

export default User;
