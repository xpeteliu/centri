import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.ObjectId,
    required: true,
  },
  postingId: {
    type: mongoose.ObjectId,
    required: true,
  },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
