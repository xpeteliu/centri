import passport from 'passport';
import User from '../model/User';
import Group from '../model/Group';

export const addUser = async (req, res) => {
  try {
    const saved = await (new User(req.body)).save();
    res.status(200)
      .json(saved);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400)
      .json({ message: e.message });
  }
};

export const loginUser = (req, res, next) => {
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
};

export const logoutUser = (req, res) => {
  req.logout();
  res.status(204)
    .end();
};

export const queryUsers = async (req, res) => {
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
};

export const countUsers = async (req, res) => {
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
};

export const findUser = async (req, res) => {
  try {
    const result = await User.findById(req.params.userId)
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

export const updateUser = async (req, res) => {
  try {
    if ((req.user == null || req.params.userId !== req.user.id)
      && (!(Object.keys(req.body).length === 1 && req.body.password))) {
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
};

export const removeUser = async (req, res) => {
  try {
    if (req.user == null || req.params.userId !== req.user.id) {
      res.status(401)
        .json({ message: 'Not operating as an authorized user' });
      return;
    }
    req.logout();
    res.json(await User.findByIdAndDelete(req.params.userId)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const queryUserJoinedGroups = async (req, res) => {
  try {
    res.json(await Group.find({
      $or: [
        { creatorId: req.params.userId },
        { adminIds: req.params.userId },
        { memberIds: req.params.userId },
      ],
    })
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const queryUserPendingGroups = async (req, res) => {
  try {
    res.json(await Group.find(
      { pendingMemberIds: req.params.userId },
    )
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};
