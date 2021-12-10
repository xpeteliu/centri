
export default function AddComment() {
    const baseUrl = 'https://cis557-group20-project.herokuapp.com/api';
    const url = baseUrl.concat('/comment')
    const handleSubmit = (event) => {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            creatorId,
            postingId,
          }),
        }).then((resp) => {
          switch (resp.status) {
            case 200:
              dispatch(showModal({ headerText: 'Post', bodyText: 'Successfully created a new comment' }));
              history.push('/comment');
              break;
            case 400:
              dispatch(showModal({ headerText: 'Unable to add comment', bodyText: 'Invalid ID supplied' }));
              history.push('/comment');
              break;
            case 404:
              dispatch(showModal({ headerText: 'Unable to add comment', bodyText: 'Posting not found' }));
              history.push('/comment');
              break;
            default:
              throw new Error('Invalid response');
          }
        }).catch(() => {
          dispatch(showModal({ headerText: 'Network Error', bodyText: 'Unable to connect to the server. Please try again later.' }));
        });
        event.preventDefault();
      };
}