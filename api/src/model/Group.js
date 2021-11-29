import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.ObjectId,
    required: true,
  },
  adminIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  memberIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  postingIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  tagNames: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: 'open',
  },
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

export default Group;
