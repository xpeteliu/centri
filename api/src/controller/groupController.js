import mongoose from 'mongoose';
import Group from '../model/Group';
import Message from '../model/Message';

export const addGroup = async (req, res) => {
  try {
    const group = req.body;
    if (!group.adminIds) {
      group.adminIds = [group.creatorId];
    }
    const saved = await (new Group(group)).save();
    res.status(200)
      .json(saved);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400)
      .json({ message: e.message });
  }
};

const convertObjectId = (obj) => {
  if (typeof obj === 'string' && /^[0-9a-f]{24}$/i.test(obj)) {
    return new mongoose.Types.ObjectId(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((elem) => convertObjectId(elem));
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    Object.keys(obj)
      .forEach((key) => {
        result[key] = convertObjectId(obj[key]);
      });
    return result;
  }
  return obj;
};

export const queryGroups = async (req, res) => {
  try {
    if (req.body.sortMethod && !['latestUpdates', 'numOfPosts', 'numOfMembers'].includes(req.body.sortMethod)) {
      res.status(400)
        .json({ message: `Unrecognized sortMethod parameter: ${req.body.sortMethod}` });
      return;
    }
    const agg = Group.aggregate([{ $match: convertObjectId(req.body.filter || {}) }]);
    switch (req.body.sortMethod) {
      case 'latestUpdates':
        res.json(await agg.lookup({
          from: 'postings',
          localField: '_id',
          foreignField: 'groupId',
          as: 'postings',
        })
          .addFields({
            touchedAt: { $max: '$postings.updatedAt' },
          })
          .sort({ touchedAt: -1 })
          .exec());
        return;
      case 'numOfPosts':
        res.json(await agg.lookup({
          from: 'postings',
          localField: '_id',
          foreignField: 'groupId',
          as: 'postings',
        })
          .addFields({
            numOfPosts: { $size: '$postings' },
          })
          .sort({ numOfPosts: -1 })
          .exec());
        return;
      case 'numOfMembers':
        res.json(await agg.addFields({
          numOfMembers: { $add: [{ $size: '$adminIds' }, { $size: '$memberIds' }, 1] },
        })
          .sort({ numOfMembers: -1 })
          .exec());
        return;
      default:
        res.json(await agg.exec());
    }
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};
export const findGroup = async (req, res) => {
  try {
    const result = await Group.findById(req.params.groupId)
      .exec();
    if (result == null) {
      res.status(404)
        .json({ message: 'No record found' });
      return;
    }
    res.json(result);
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const findGroupMember = async (req, res) => {
  try {
    const groupDoc = await Group.findById(req.params.groupId)
      .exec();
    if (groupDoc == null) {
      res.status(404)
        .json({ message: 'Group not found' });
      return;
    }
    const groupObj = JSON.parse(JSON.stringify(groupDoc));
    if (groupObj.creatorId === req.params.userId) {
      res.json({
        userId: req.params.userId,
        role: 'creator',
      });
      return;
    }
    if (groupObj.adminIds.includes(req.params.userId)) {
      res.json({
        userId: req.params.userId,
        role: 'admin',
      });
      return;
    }
    if (groupObj.memberIds.includes(req.params.userId)) {
      res.json({
        userId: req.params.userId,
        role: 'member',
      });
      return;
    }
    if (groupObj.pendingMemberIds.includes(req.params.userId)) {
      res.json({
        userId: req.params.userId,
        role: 'pendingMember',
      });
      return;
    }
    res.status(404)
      .json({ message: 'User not found in the group' });
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const updateGroupMember = async (req, res) => {
  try {
    if (!['admin', 'member', 'pendingMember'].includes(req.body.role)) {
      res.status(400)
        .json({ message: `Invalid role parameter: ${req.body.role}` });
      return;
    }

    const groupDoc = await Group.findById(req.params.groupId)
      .exec();
    if (groupDoc == null) {
      res.status(404)
        .json({ message: 'Group not found' });
      return;
    }

    if (String(groupDoc.creatorId) === req.params.userId) {
      res.status(400)
        .json({ message: 'Unable to modify the membership of a creator' });
      return;
    }

    if ((req.body.role === 'admin' || req.body.role === 'member') && (req.user == null
      || groupDoc.adminIds.find((id) => id.toString() === req.user.id) == null)) {
      res.status(401)
        .json({ message: 'Operation requires admin authority' });
      return;
    }

    const originalSize = groupDoc.adminIds.length
      + groupDoc.memberIds.length + groupDoc.pendingMemberIds.length;
    const removeMemberPredicate = (id) => id.toString() !== req.params.userId;
    const newAdminIds = groupDoc.adminIds.filter(removeMemberPredicate);
    const newMemberIds = groupDoc.memberIds.filter(removeMemberPredicate);
    const newPendingMemberIds = groupDoc.pendingMemberIds.filter(removeMemberPredicate);
    if (req.body.role === 'pendingMember' && newAdminIds.length + newMemberIds.length + newPendingMemberIds.length < originalSize) {
      res.status(400)
        .json({ message: 'Unable to change the role of an existing (pending) member to pendingMember' });
      return;
    }
    groupDoc.adminIds = newAdminIds;
    groupDoc.memberIds = newMemberIds;
    groupDoc.pendingMemberIds = newPendingMemberIds;
    groupDoc[`${req.body.role}Ids`].push(req.params.userId);
    await groupDoc.save();

    await (new Message({
      senderId: groupDoc.creatorId,
      recipientId: req.params.userId,
      content: `Your role in Group '${groupDoc.title}' has been changed to '${req.body.role}'`,
    })).save();

    res.status(204)
      .end();
  } catch (e) {
    res.status(e instanceof RangeError ? 404 : 400)
      .json({ message: e.message });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .lean();

    if (group == null) {
      res.status(404)
        .json({ message: 'Group not found' });
      return;
    }

    if (String(group.creatorId) === req.params.userId) {
      res.status(400)
        .json({ message: 'Unable to modify the membership of a creator' });
      return;
    }

    if (req.user == null || (req.user.id !== req.params.userId
      && (group.adminIds.find((id) => id.toString() === req.user.id)) == null)) {
      res.status(401)
        .json({ message: 'Operation requires logging-in as the leaving user or an admin user' });
      return;
    }

    await Group.findByIdAndUpdate(
      req.params.groupId,
      {
        $pull: {
          adminIds: req.params.userId,
          memberIds: req.params.userId,
          pendingMemberIds: req.params.userId,
        },
      },
    )
      .exec();

    if (req.user.id !== req.params.userId) {
      // operated by admin
      await (new Message({
        senderId: group.creatorId,
        recipientId: req.params.userId,
        content: `You are no long a pending / existing member of Group '${group.title}'`,
      })).save();
    } else {
      // operated by user themselves
      await Message.bulkSave(group.adminIds.map((id) => (new Message({
        senderId: req.params.userId,
        recipientId: id,
        content: `A user has left Group '${group.title}'!`,
      }))));
    }

    res.status(204)
      .end();
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const addGroupTag = async (req, res) => {
  try {
    const groupWriteResult = await Group.updateOne(
      { _id: req.params.groupId },
      { $addToSet: { tags: req.params.tagName } },
    )
      .exec();

    if (groupWriteResult.matchedCount === 0) {
      res.status(404)
        .json({ message: 'Group not found' });
      return;
    }

    res.status(204)
      .end();
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const removeGroupTag = async (req, res) => {
  try {
    const groupWriteResult = await Group.updateOne(
      { _id: req.params.groupId },
      { $pull: { tags: req.params.tagName } },
    )
      .exec();

    if (groupWriteResult.matchedCount === 0) {
      res.status(404)
        .json({ message: 'Group not found' });
      return;
    }

    res.status(204)
      .end();
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};
