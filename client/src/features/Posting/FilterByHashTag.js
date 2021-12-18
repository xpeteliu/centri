const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';

export default function FilterCommentsByHashTag(hashTag) {
  const url = baseUrl.concat('/comment/filter/paginate');
  const commentFilter = {
      filter: {
        "$or": [
            {
              "content": {
                "$regex": '\\B#'+ hashTag +'\\b'
              }
            },
        ]
      },
      "sort": {
        "updatedAt": -1
      }
  };
  const comments = await axios.post(`${url}`, commentFilter);
  return comments.json();
}

export default function FilterPostsByHashTag(hashTag) {
    const url = baseUrl.concat('/posting/filter/paginate');
    const postFilter = {
        filter: {
          "$or": [
              {
                "content": {
                  "$regex": '\\B#'+ hashTag +'\\b'
                }
              },
          ]
        },
        "sort": {
          "updatedAt": -1
        }
    }
    const posts = await axios.post(`${url}`, postFilter);
    return posts.json();
  }
