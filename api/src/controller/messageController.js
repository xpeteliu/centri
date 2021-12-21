import Message from '../model/Message';
import Group from '../model/Group';

export const addMessage = async (req, res) => {
  try {
    if (req.body.content == null && req.body.attachmentId == null) {
      res.status(400)
        .json({ message: 'Unable to save an empty message' });
      return;
    }
    const saved = await (new Message(req.body)).save();
    res.status(200)
      .json(saved);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400)
      .json({ message: e.message });
  }
};

export const queryMessages = async (req, res) => {
  try {
    res.json(await Message.find(req.body.filter)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const countMessages = async (req, res) => {
  try {
    res.json({
      count: await Message.countDocuments(req.body.filter)
        .exec(),
    });
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    res.json(await Message.findByIdAndUpdate(req.params.messageId, req.body)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const acceptInvitationMessage = async (req, res) => {
  try {
    const messageDoc = await Message.findById(req.params.messageId);
    if (messageDoc == null || messageDoc.invitingGroupId == null) {
      res.status(404)
        .json({ message: 'Invitation not found' });
      return;
    }
    const groupId = messageDoc.invitingGroupId;
    const inviteeId = messageDoc.recipientId;
    messageDoc.invitingGroupId = null;
    messageDoc.content += ' (Invitation accepted)';
    messageDoc.save();
    const groupDoc = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { pendingMemberIds: inviteeId } },
    )
      .exec();
    await Message.bulkSave(groupDoc.adminIds.map((id) => (new Message({
      senderId: inviteeId,
      recipientId: id,
      content: `There is a new request for joining Group '${groupDoc.title}'!`,
    }))));
    res.status(204)
      .end();
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const declineInvitationMessage = async (req, res) => {
  try {
    const messageDoc = await Message.findById(req.params.messageId);
    if (messageDoc == null || messageDoc.invitingGroupId == null) {
      res.status(404)
        .json({ message: 'Invitation not found' });
      return;
    }

    messageDoc.invitingGroupId = null;
    messageDoc.content += ' (Invitation declined)';
    messageDoc.save();
    await (new Message({
      senderId: messageDoc.recipientId,
      recipientId: messageDoc.senderId,
      content: 'A previous invitation was declined.',
    })).save();
    res.status(204)
      .end();
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};
