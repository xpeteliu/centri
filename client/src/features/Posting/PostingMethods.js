import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showModal } from '../common/MessageModal/modalSlice';

const baseUrl = 'https://cis557-group20-project.herokuapp.com/api';

export async function UploadAttachment(file) {
  const url = baseUrl.concat('/file');
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: file,
  }).then(
    (response) => response.json(),
  ).then(
    (success) => console.log(success),
  ).catch(
    (error) => console.log(error),
  );
}

export async function MakePost(creatorId, groupId) {
  const dispatch = useDispatch();
  const history = useHistory();
  const url = baseUrl.concat('/posting');
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creatorId,
      groupId,
    }),
  }).then((resp) => {
    switch (resp.status) {
      case 200:
        dispatch(showModal({ headerText: 'Post', bodyText: 'Successfully created a new post' }));
        history.push('/posting');
        break;
      default:
        throw new Error('Invalid response');
    }
  }).catch(() => {
    dispatch(showModal({ headerText: 'Network Error', bodyText: 'Unable to connect to the server. Please try again later.' }));
  });
}
