import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showModal } from '../common/MessageModal/modalSlice';

export default function DeleteComment(commentId) {
  const dispatch = useDispatch();
  const history = useHistory();
  const url = `https://cis557-group20-project.herokuapp.com/api/${commentId}`;
  fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commentId,
    }),
  }).then((resp) => {
    switch (resp.status) {
      case 200:
        dispatch(showModal({ headerText: 'Delete', bodyText: 'Successfully deleted a posting' }));
        history.push(url);
        break;
      case 400:
        dispatch(showModal({ headerText: 'Unable to delete', bodyText: 'Invalid ID supplied' }));
        history.push(url);
        break;
      case 404:
        dispatch(showModal({ headerText: 'Unable to delete', bodyText: 'Posting or comment not found' }));
        history.push(url);
        break;
      default:
        throw new Error('Invalid response');
    }
  }).catch(() => {
    dispatch(showModal({ headerText: 'Network Error', bodyText: 'Unable to connect to the server. Please try again later.' }));
  });
}
