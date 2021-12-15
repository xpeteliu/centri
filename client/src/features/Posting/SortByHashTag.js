const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';

export default function SortCommentsByHashTag(hashTag) {
  const url = baseUrl.concat('/comment/filter/paginate');
  const data = {
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
  return response.json();
}