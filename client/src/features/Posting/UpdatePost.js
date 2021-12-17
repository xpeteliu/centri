import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Row, Col, Card, Button,
} from 'react-bootstrap';
import { showModal } from '../common/MessageModal/modalSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetPost } from './PostMethods';

export default function UpdatePost(postingId) {
  const dispatch = useDispatch();
  const history = useHistory();

  const response = GetPost(postingId);
  const originalHeading = response.heading;
  const originalContent = response.content;
  const creatorId = response.creatorId;
  const groupId = response.groupId;

  const handleSubmit = (event) => {
    const heading = document.getElementById('inputHeading').value;
    const content = document.getElementById('inputContent').value;
    fetch(`https://cis557-group20-project.herokuapp.com/api/${postingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupId,
        heading,
        creatorId,
        content,
      }),
    }).then((resp) => {
      switch (resp.status) {
        case 200:
          dispatch(showModal({ headerText: 'Update', bodyText: 'Successfully updated a new post' }));
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
        case 409:
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
      <Card.Title>
        <h2>Update the post</h2>
      </Card.Title>
      <Card.Body>
        <Row className="h-100">
          <Col className="my-auto">
            <form className="post-form">
              <label htmlFor="title">
                Title
                <input id="inputHeading" className="form-control" name="title" rows={1} cols={300} value={originalHeading} required />
              </label>
              <br />
              <br />
              <label htmlFor="body">
                <textarea id="inputContent" className="form-control" name="body" type="textarea" rows={10} cols={300} value={originalContent} required />
              </label>
              <br />
              <Link to="/"><button className="btn btn-secondary float-right" type="button">Cancel</button></Link>
              &nbsp;&nbsp;&nbsp;
              {/* <button className="btn btn-primary float-right" type="button">Post</button> */}
              <Button variant="secondary" onClick={handleSubmit}>Save</Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
