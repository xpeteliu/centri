const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';

export default function SortCommentsByHashTag(hashTag) {
  const url = baseUrl.concat('/comment/filter/paginate');
  const data = {
      filter: {
        "$or": [
            {
              "content": {
                "$regex": hashTag
              }
            },
        ]
       
      }
  }
  return response.json();
}