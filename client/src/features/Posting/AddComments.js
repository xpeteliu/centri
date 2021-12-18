import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button, Row, Col, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { showModal } from '../common/MessageModal/modalSlice';

export default function AddComment() {
  const { postingId } = useParams();
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const baseUrl = 'https://cis557-group20-project.herokuapp.com/api';
  const url = baseUrl.concat('/comment');
  const creatorId = '61a65336c4a2d7594d3f58f6';
  // const creatorId = useSelector((state) => state.user.id);
  const handleSubmit = (event) => {
    const content = document.getElementById('inputContent').value;
    if (content.length > 0) {
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
            history.push(`/group/${groupId}/posting/${postingId}`);
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
    }
    event.preventDefault();
  };

  return (
    <Card>
      <Card.Title>
        <h2>Add comment</h2>
      </Card.Title>
      <Card.Body>
        <Row className="h-100">
          <Col className="my-auto">
            <form className="post-form">
              <label htmlFor="body">
                <textarea id="inputContent" className="form-control" name="body" type="textarea" rows={5} cols={300} required />
              </label>
              <br />
              <Button onClick={() => history.push(`/group/${groupId}/posting/${postingId}`)}>cancel</Button>
            &nbsp;&nbsp;&nbsp;
              <Button variant="secondary" onClick={handleSubmit}>Comment</Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
