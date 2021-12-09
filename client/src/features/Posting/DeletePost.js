import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showModal } from '../common/MessageModal/modalSlice';

export default function DeletePost(postingId) {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (event) => {
    fetch(`https://cis557-group20-project.herokuapp.com/api/${postingId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postingId,
      }),
    }).then((resp) => {
      switch (resp.status) {
        case 200:
          dispatch(showModal({ headerText: 'Delete', bodyText: 'Successfully deleted a posting' }));
          history.push('/posting');
          break;
        case 400:
          dispatch(showModal({ headerText: 'Unable to delete', bodyText: 'Invalid ID supplied' }));
          history.push('/posting');
          break;
        case 404:
          dispatch(showModal({ headerText: 'Unable to delete', bodyText: 'Posting not found' }));
          history.push('/posting');
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
