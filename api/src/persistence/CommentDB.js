import Comment from '../model/Comment';

const addComment = async (obj) => {
  const comment = new Comment(obj);
  await comment.save();
};

export default addComment;
