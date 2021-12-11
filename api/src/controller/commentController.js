import Comment from '../model/Comment';

export const addComment = async (req, res) => {
  try {
    const saved = await (new Comment(req.body)).save();
    res.status(200)
      .json(saved);
  } catch (e) {
    res.status(e.code === 11000 ? 409 : 400)
      .json({ message: e.message });
  }
};

export const queryComments = async (req, res) => {
  try {
    res.json(await Comment.find(req.body.filter)
      .sort(req.body.sort)
      .skip(req.body.skip)
      .limit(req.body.limit)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const countComments = async (req, res) => {
  try {
    res.json({
      count: await Comment.countDocuments(req.body.filter)
        .exec(),
    });
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const findComment = async (req, res) => {
  try {
    const result = await Comment.findById(req.params.commentId)
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

export const updateComment = async (req, res) => {
  try {
    res.json(await Comment.findByIdAndUpdate(req.params.commentId, req.body)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};

export const removeComment = async (req, res) => {
  try {
    res.json(await Comment.findByIdAndDelete(req.params.commentId)
      .exec());
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
};
