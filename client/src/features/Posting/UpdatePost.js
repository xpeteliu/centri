import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Row, Col, Card,
} from 'react-bootstrap';
import { showModal } from '../common/MessageModal/modalSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UpdatePost() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  
  const handleSubmit = (event) => {
    fetch('https://cis557-group20-project.herokuapp.com/api/${postingId}', {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      })
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
    })
    event.preventDefault();
  };

  return (
    <Card>
      <Card.Body>
        <Row className="h-100">
          <Col className="my-auto">
            <form className="post-form" onSubmit={handleSubmit}>
              <label htmlFor="title">
                Title
                <input className="form-control" name="title" rows={1} cols={300} value={heading} onChange={(event) => setHeading(event.target.value)} required />
              </label>
              <br />
              <label htmlFor="body">
                Body
                <textarea className="form-control" name="body" type="textarea" rows={10} cols={300} value={content} onChange={(event) => setContent(event.target.value)} required />
              </label>
              <br />
              <Link to="/"><button className="btn btn-secondary float-right" type="button">Cancel</button></Link>
              <button className="btn btn-primary float-right" type="button">Post</button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
