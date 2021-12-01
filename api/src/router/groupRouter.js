import express from 'express';
import Group from '../model/Group';
import Posting from '../model/Posting';

const groupRouter = express.Router();

groupRouter.post('/', async (req, res) => {
  try {
    const saved = await (new Group(req.body)).save();
    res.status(200)
      .json(saved);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400)
      .json({ message: e.message });
  }
});

groupRouter.post('/filter/paginate', async (req, res) => {
  try {
    res.json(await Group.find(req.body.filter)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

groupRouter.post('/filter/count', async (req, res) => {
  try {
    res.json({
      ...req.body,
      count: await Group.countDocuments(req.body.filter)
        .exec(),
    });
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

groupRouter.get('/:groupId', async (req, res) => {
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
});

groupRouter.post('/findByTag/paginate', async (req, res) => {
  try {
    res.json(await Group.where('tags')
      .all(req.body.tags)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

groupRouter.post('/:groupId/member', async (req, res) => {
  try {
    if (!['admin', 'member', 'pendingMember'].includes(req.body.role)) {
      res.status(400)
        .json({ message: `Invalid role parameter: ${req.body.role}` });
    }

    const update = {};
    update[`${req.body.role}Ids`] = req.body.userId;
    const groupWriteResult = await Group.updateOne(
      { _id: req.params.groupId },
      { $addToSet: update },
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
    res.status(e instanceof RangeError ? 404 : 400)
      .json({ message: e.message });
  }
});

groupRouter.get('/:groupId/member/:userId', async (req, res) => {
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
});

groupRouter.put('/:groupId/member/:userId', async (req, res) => {
  try {
    if (!['admin', 'member', 'pendingMember'].includes(req.body.role)) {
      res.status(400)
        .json({ message: `Invalid role parameter: ${req.body.role}` });
    }

    const groupDoc = await Group.findById(req.params.groupId)
      .exec();
    if (groupDoc == null) {
      res.status(404)
        .json({ message: 'Group not found' });
      return;
    }

    const removeMemberPredicate = (id) => id.toString() !== req.params.userId;
    groupDoc.adminIds = groupDoc.adminIds.filter(removeMemberPredicate);
    groupDoc.memberIds = groupDoc.memberIds.filter(removeMemberPredicate);
    groupDoc.pendingMemberIds = groupDoc.pendingMemberIds.filter(removeMemberPredicate);
    groupDoc[`${req.body.role}Ids`].push(req.params.userId);
    await groupDoc.save();

    res.status(204)
      .end();
  } catch (e) {
    res.status(e instanceof RangeError ? 404 : 400)
      .json({ message: e.message });
  }
});

groupRouter.delete('/:groupId/member/:userId', async (req, res) => {
  try {
    const groupUpdate = {};
    groupUpdate[`${req.body.role}Ids`] = req.params.userId;
    const groupWriteResult = await Group.updateOne(
      { _id: req.params.groupId },
      {
        $pull: {
          adminIds: req.params.userId,
          memberIds: req.params.userId,
          pendingMemberIds: req.params.userId,
        },
      },
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
});

groupRouter.put('/:groupId/tag/:tagName', async (req, res) => {
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
});

groupRouter.delete('/:groupId/tag/:tagName', async (req, res) => {
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
});

groupRouter.post('/:groupId/posting/paginate', async (req, res) => {
  try {
    res.json(await Posting.where({ groupId: req.params.groupId })
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

export default groupRouter;
