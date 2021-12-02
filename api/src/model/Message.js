import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    default: 'text',
  },
  senderId: {
    type: mongoose.ObjectId,
    required: true,
  },
  recipientId: {
    type: mongoose.ObjectId,
    required: true,
  },
  invitingGroupId: {
    type: mongoose.ObjectId,
    required: false,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
