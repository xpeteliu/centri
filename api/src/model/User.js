import mongoose from 'mongoose';

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

const User = mongoose.model('User', userSchema);

export default User;
