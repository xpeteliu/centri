import express from 'express';
import mongoose from 'mongoose';
import Group from '../model/Group';
import User from '../model/User';

const postingRouter = express.Router();

postingRouter.post('/', async (req, res) => {
  try {
    if (!['admin', 'member', 'pending'].includes(req.body.role)) {
      res.status(400)
        .json({ message: `Invalid role parameter: ${req.body.role}` });
    }

    const update = {};
    update[`${req.body.role}Ids`] = req.body.userId;

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const groupWriteResult = await Group.updateOne(
        { _id: req.params.groupId },
        { $addToSet: update },
        { session },
      )
        .exec();
      if (groupWriteResult.matchedCount === 0) {
        throw new RangeError('Group not found');
      }
      const userWriteResult = await User.updateOne(
        { _id: req.body.userId },
        { $addToSet: { groupIds: req.params.groupId } },
        { session },
      )
        .exec();
      if (userWriteResult.matchedCount === 0) {
        throw new RangeError('User not found');
      }
    });
    await session.endSession();
    res.status(204)
      .end();
  } catch (e) {
    res.status(e instanceof RangeError ? 404 : 400)
      .json({ message: e.message });
  }
});

export default postingRouter;
