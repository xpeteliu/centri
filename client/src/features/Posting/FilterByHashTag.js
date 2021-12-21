import axios from 'axios';

const baseUrl = '/api';

export const FilterCommentsByHashTag = async (hashTag, postId) => {
  const url = baseUrl.concat('/comment/filter/paginate');
  try {
    const commentFilter = {
      filter: {
        postingId: postId,
        content: {
          $regex: `\\B#${hashTag}\\b`,
        },
      },
    };
    const comments = await axios.post(url, commentFilter);
    return comments.data;
  } catch (error) {
    return [];
  }
};

export const FilterPostsByHashTag = async (hashTag) => {
  const url = baseUrl.concat('/posting/filter/paginate');
  try {
    const postFilter = {
      filter: {
        content: {
          $regex: `\\B#${hashTag}\\b`,
        },
      },
    };
    const posts = await axios.post(url, postFilter);
    return posts.data;
  } catch (error) {
    return [];
  }
};
