import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
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
  pendingMemberIds: {
    type: [mongoose.ObjectId],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: 'public',
  },
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

export default Group;
