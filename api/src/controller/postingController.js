import mongoose from 'mongoose';
import Posting from '../model/Posting';
import Comment from '../model/Comment';
import Group from '../model/Group';
import User from '../model/User';
import Message from '../model/Message';

export const addPosting = async (req, res) => {
  try {
    const saved = await (new Posting(req.body)).save();
    res.status(200)
      .json(saved);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400)
      .json({ message: e.message });
  }
};

export const queryPostings = async (req, res) => {
  try {
    res.json(await Posting.find(req.body.filter)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const countPostings = async (req, res) => {
  try {
    res.json({
      count: await Posting.countDocuments(req.body.filter)
        .exec(),
    });
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const findPosting = async (req, res) => {
  try {
    const posting = await Posting.findById(req.params.postingId)
      .lean();
    if (posting == null) {
      res.status(404)
        .json({ message: 'No record found' });
      return;
    }
    posting.comments = await Comment.find({ postingId: posting._id })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(posting);
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const updatePosting = async (req, res) => {
  try {
    let posting = await Posting.findById(req.params.postingId)
      .lean();

    if (posting == null) {
      res.status(404)
        .json('Post does not exist');
      return;
    }

    const group = await Group.findById(posting.groupId)
      .lean();

    if (group == null) {
      res.status(404)
        .json('Group does not exist');
      return;
    }

    const affectedFields = Object.keys(req.body);
    if (req.user == null
      || (
        (((affectedFields.length > 1 || (affectedFields.length === 1 && affectedFields[0] !== 'flaggerId')) && req.user.id !== String(posting.creatorId))
          || (affectedFields.includes('flaggerId') && posting.flaggerId && req.user.id !== String(posting.flaggerId)))
        && (group.adminIds.find((id) => id.toString() === req.user.id)) == null
      )) {
      res.status(401)
        .json({ message: 'Operation requires logging-in as the author / flagger or an admin user' });
      return;
    }

    if (req.body.flaggerId && req.user.id !== String(req.body.flaggerId)) {
      res.status(400)
        .json({ message: 'Flagger ID must match the logged-in user ID' });
      return;
    }

    let flagger;
    if (req.body.flaggerId != null) {
      if (posting.flaggerId != null) {
        res.status(400)
          .json({ message: 'Post already flagged' });
        return;
      }

      flagger = await User.findById(req.body.flaggerId)
        .lean();

      if (flagger == null) {
        res.status(404)
          .json('User does not exist');
        return;
      }
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      posting = await Posting.findByIdAndUpdate(
        req.params.postingId,
        req.body,
        { session },
      )
        .lean();

      if (req.body.flaggerId != null) {
        if (posting.flaggerId != null) {
          throw new Error('Post already flagged');
        }
        await Message.bulkWrite(group.adminIds.map((id) => ({
          insertOne: {
            document: new Message({
              senderId: req.body.flaggerId,
              recipientId: id,
              content: `Post '${req.body.heading || posting.heading}' in Group '${group.title}' is flagged for deletion by User '${flagger.username}'!`,
            }),
          },
        })), { session });
      }

      if (req.body.flaggerId === null && posting.flaggerId != null) {
        await (new Message({
          senderId: group.creatorId,
          recipientId: posting.flaggerId,
          content: `Your deletion flagger on Post '${req.body.heading || posting.heading}' in Group '${group.title}' was revoked`,
        })).save({ session });
      }
    });
    await session.endSession();
    res.json(posting);
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const removePosting = async (req, res) => {
  try {
    let posting = await Posting.findById(req.params.postingId)
      .lean();

    if (posting == null) {
      res.status(404)
        .json('Post does not exist');
      return;
    }

    const group = await Group.findById(posting.groupId)
      .lean();

    if (req.user == null || (
      req.user.id !== String(posting.creatorId)
      && group != null
      && (group.adminIds.find((id) => id.toString() === req.user.id)) == null
    )) {
      res.status(401)
        .json({ message: 'Operation requires logging-in as the author or an admin user' });
      return;
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      posting = await Posting.findByIdAndDelete(
        req.params.postingId,
        { session },
      )
        .lean();

      if (String(posting.creatorId) !== req.user.id) {
        await (new Message({
          senderId: group.creatorId,
          recipientId: posting.creatorId,
          content: `Your Post '${req.body.heading || posting.heading}' in Group '${group.title}' has been deleted`,
        })).save({ session });
      }

      if (posting.flaggerId != null && String(posting.flaggerId) !== req.user.id) {
        await (new Message({
          senderId: group.creatorId,
          recipientId: posting.flaggerId,
          content: `Post '${req.body.heading || posting.heading}' in Group '${group.title}' has been deleted as a result of your deletion flag`,
        })).save({ session });
      }
    });
    await session.endSession();
    res.json(posting);
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const hidePosting = async (req, res) => {
  try {
    if (req.user == null || req.user.id == null) {
      res.status(401)
        .json({ message: 'Unable to hide a post without logging-in as an authorized user' });
    }

    const postingWriteResult = await Posting.updateOne(
      { _id: req.params.postingId },
      { $addToSet: { hiderIds: req.user.id } },
    )
      .exec();

    if (postingWriteResult.matchedCount === 0) {
      res.status(404)
        .json({ message: 'Posting not found' });
      return;
    }

    res.status(204)
      .end();
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};
