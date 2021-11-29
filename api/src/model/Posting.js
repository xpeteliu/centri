import mongoose from 'mongoose';

const postingSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.ObjectId,
    required: true,
  },
  groupId: {
    type: mongoose.ObjectId,
    required: true,
  },
  commentIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  numOfLikes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'open',
  },
}, { timestamps: true });

const Posting = mongoose.model('Posting', postingSchema);

export default Posting;
