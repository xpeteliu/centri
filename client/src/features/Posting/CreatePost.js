import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  Button, Row, Col, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { showModal } from '../common/MessageModal/modalSlice';

export default function CreatePost(groupId) {
  const dispatch = useDispatch();
  const history = useHistory();
  const creatorId = '61a65336c4a2d7594d3f58f6';
  // const groupId = '61b23e2b9e59d62b561baae3';
  // const creatorId = useSelector((state) => state.user._id);
  const baseUrl = 'https://cis557-group20-project.herokuapp.com/api';
  // const currUrl = window.location.href;
  // const groupId = currUrl.split('/').pop();
  const url = baseUrl.concat('/posting');

  const [file, setFile] = useState(null);
  const handleFileUpload = (event) => {
    setFile({ file: event.target.files[0] });
    const formData = new FormData();
    formData.append(
      file,
    );
    const fileUrl = baseUrl.concat('/file');
    fetch(fileUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    });
  };

  const handleSubmit = (event) => {
    const heading = document.getElementById('inputHeading').value;
    const content = document.getElementById('inputContent').value;
    fetch(url, {
      method: 'POST',
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
          dispatch(showModal({ headerText: 'Post', bodyText: 'Successfully created a new post' }));
          history.push('/posting');
          break;
        default:
          throw new Error('Invalid response');
      }
    }).catch((error) => {
      console.log(error);
      dispatch(showModal({ headerText: 'Network Error', bodyText: 'Unable to connect to the server. Please try again later.' }));
    });
    event.preventDefault();
  };

  return (
    <Card>
      <Card.Title>
        <h2>Create a new post</h2>
      </Card.Title>
      <Card.Body>
        <Row className="h-100">
          <Col className="my-auto">
            <form className="post-form">
              <label htmlFor="title">
                Title
                <input id="inputHeading" className="form-control" name="title" rows={1} cols={300} required />
              </label>
              <br />
              <br />
              <label htmlFor="body">
                <textarea id="inputContent" className="form-control" name="body" type="textarea" rows={10} cols={300} required />
              </label>
              <br />
              <Button variant="secondary" onClick={handleFileUpload}>Attachment</Button>
              &nbsp;&nbsp;&nbsp;
              <Link to="/"><button className="btn btn-secondary float-right" type="button">Cancel</button></Link>
              &nbsp;&nbsp;&nbsp;
              {/* <button className="btn btn-primary float-right" type="button">Post</button> */}
              <Button variant="secondary" onClick={handleSubmit}>Post</Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
