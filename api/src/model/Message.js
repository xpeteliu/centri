import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.ObjectId,
    required: true,
  },
  recipientId: {
    type: mongoose.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  invitingGroupId: {
    type: mongoose.ObjectId,
    required: false,
  },
  attachmentId: {
    type: mongoose.ObjectId,
    required: false,
  },
  attachmentType: {
    type: String,
    default: 'other',
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
