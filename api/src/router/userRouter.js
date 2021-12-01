import express from 'express';
import passport from 'passport';
import User from '../model/User';
import Group from '../model/Group';

const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
  try {
    const saved = await (new User(req.body)).save();
    res.status(200)
      .json(saved);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400)
      .json({ message: e.message });
  }
});

userRouter.post(
  '/login',
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        next(err);
        return;
      }
      if (!user) {
        res.status(401)
          .json(info);
        return;
      }
      req.login(user, (error) => {
        if (error) {
          next(error);
          return;
        }
        res.json({
          code: 0,
          id: user.id,
        });
      });
    })(req, res, next);
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

userRouter.post('/filter/paginate', async (req, res) => {
  try {
    res.json(await User.find(req.body.filter)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

userRouter.post('/filter/count', async (req, res) => {
  try {
    res.json({
      ...req.body,
      count: await User.countDocuments(req.body.filter)
        .exec(),
    });
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

userRouter.get('/:userId', async (req, res) => {
  try {
    const result = res.json(await User.findById(req.params.userId)
      .exec());
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

userRouter.get('/:userId/joinedGroup', async (req, res) => {
  try {
    res.json(await Group.find({
      $or: [
        { creatorId: req.params.userId },
        { adminIds: { $all: [req.params.userId] } },
        { memberIds: { $all: [req.params.userId] } },
      ],
    })
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

userRouter.get('/:userId/pendingGroup', async (req, res) => {
  try {
    res.json(await Group.find(
      { pendingMemberIds: { $all: [req.params.userId] } },
    )
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

export default userRouter;
