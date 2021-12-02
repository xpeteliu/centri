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
  flaggerId: {
    type: mongoose.ObjectId,
    required: false,
  },
  status: {
    type: String,
    default: 'open',
  },
}, { timestamps: true });

const Posting = mongoose.model('Posting', postingSchema);

export default Posting;
