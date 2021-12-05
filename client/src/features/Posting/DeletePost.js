import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Card, Button,
} from 'react-bootstrap';
import { showModal } from '../common/MessageModal/modalSlice';

export default function DeletePost() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (event) => {
    fetch('https://cis557-group20-project.herokuapp.com/api/${postingId}', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Post Title (id:
          {postingId}
          )
        </Card.Title>
        <Card.Text>
          {'Vitae massa id tortor sed tortor, commodo. Platea blandit mauris elementum est maecenas iaculis. Ut sodales diam, nam commodo gravida faucibus nisl. Aliquet id pulvinar id lacinia. Lectus auctor vel elementum tristique. Vitae non morbi dolor quisque amet faucibus justo. Sollicitudin vitae augue tortor lobortis sem ultrices neque. Eget ornare et varius in lectus. Lectus est ante morbi ipsum. \
        Aliquam sit non viverra suspendisse eleifend. Et mauris, et quam dolor duis. Lacus porttitor felis, a, vel sed enim. Quam nisi, est nulla scelerisque sollicitudin faucibus erat. Tincidunt purus mauris felis fringilla sit. Commodo dignissim amet vel in ultrices sagittis ultrices. Sem malesuada donec nam eget a, risus laoreet. Egestas malesuada ipsum lacus, quis. A eleifend dolor, id tincidunt diam tincidunt. Tellus suspendisse ut luctus mauris bibendum. Eu sed in convallis neque. In amet convallis sit eros, leo. Id volutpat sit morbi sagittis neque. \
        Dolor, tortor aliquet dictumst mattis mi, netus in. Egestas blandit nunc nulla eget in lacus a, sit. Nulla.'}
        </Card.Text>
        <div className="ms-auto">
          <Button variant="secondary" onClick={handleSubmit}>Delete</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
