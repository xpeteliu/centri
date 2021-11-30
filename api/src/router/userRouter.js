import express from 'express';
import passport from 'passport';
import User from '../model/User';
import Posting from '../model/Posting';
import Comment from '../model/Comment';

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  try {
    const saved = await (new User(req.body)).save();
    res.status(204)
      .json(saved);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400)
      .json({ message: e.message });
  }
});

userRouter.post(
  '/login',
  passport.authenticate('local'),
  (_, res) => {
    res.status(204)
      .end();
  },
);

userRouter.post(
  '/logout',
  (req, res) => {
    req.logout();
    res.status(204)
      .end();
  },
);

userRouter.get('/:userId', async (req, res) => {
  try {
    res.json(await User.findById(req.params.userId)
      .exec());
  } catch (e) {
    res.status(404)
      .json({ message: e.message });
  }
});

userRouter.put('/:userId', async (req, res) => {
  try {
    if (req.user == null || req.params.userId !== req.user.id) {
      res.status(401)
        .json({ message: 'Not operating as an authorized user' });
      return;
    }
    res.json(await User.findByIdAndUpdate(req.params.userId, req.body)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

userRouter.delete('/:userId', async (req, res) => {
  try {
    if (req.user == null || req.params.userId !== req.user.id) {
      res.status(401)
        .json({ message: 'Not operating as an authorized user' });
      return;
    }
    res.json(await User.findByIdAndDelete(req.params.userId)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

userRouter.post('/:userId/relatedPosting/pagination', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .exec();
    res.json(await Posting.where('_id')
      .in(user.toObject().relatedPostingIds)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(404)
      .json({ message: e.message });
  }
});

userRouter.post('/:userId/publishedComment/pagination', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .exec();
    res.json(await Comment.where('id')
      .in(user.toObject().publishedCommentIds)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(404)
      .json({ message: e.message });
  }
});

userRouter.post('/:userId/likedComment/pagination', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .exec();
    res.json(await Comment.where('_id')
      .in(user.toObject().likedCommentIds)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(404)
      .json({ message: e.message });
  }
});

userRouter.post('/:userId/group/pagination', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .exec();
    res.json(await Comment.where('_id')
      .in(user.toObject().groupIds)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(404)
      .json({ message: e.message });
  }
});

export default userRouter;
