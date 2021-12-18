import axios from 'axios';

const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';

export const FilterCommentsByHashTag = async (hashTag) => {
  const url = baseUrl.concat('/comment/filter/paginate');
  try {
    const commentFilter = {
      filter: {
        content: {
          $regex: `\\B#${hashTag}\\b`,
        },
      },
      sort: {
        updatedAt: -1,
      },
    };
    const comments = await axios.post(`${url}`, commentFilter);
    return comments.data();
  } catch (error) {
    return [];
  }
};

// export async function FilterPostsByHashTag(hashTag) {
//     const url = baseUrl.concat('/posting/filter/paginate');
//     const postFilter = {
//       filter: {
//         "content": {
//           "$regex": '\\B#' + hashTag +'\\b'
//         }
//       },
//       "sort": {
//         "updatedAt": -1
//       }
//     }
//     const posts = await axios.post(`${url}`, postFilter);
//     return posts.json();
//   }
