import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  Button, Row, Col, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { showModal } from '../common/MessageModal/modalSlice';
import { MakePost, PostFile } from './PostMethods';

export default function CreatePost() {
  const dispatch = useDispatch();
  const history = useHistory();
  const creatorId = '61a65336c4a2d7594d3f58f6';
  const groupId = '61b23e2b9e59d62b561baae3';
  // const creatorId = useSelector((state) => state.user._id);
  const [attachedFile, setAttachedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setAttachedFile(file);
  };

  const handleSubmitPost = async (event) => {
    event.preventDefault();
    const heading = document.getElementById('inputHeading').value;
    const content = document.getElementById('inputContent').value;
    if (heading.length > 0 && content.length > 0) {
      if (attachedFile == null) {
        MakePost(
          groupId,
          heading,
          creatorId,
          content,
          'none',
          'none',
        ).then((resp) => {
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
      } else {
        const response = await PostFile(attachedFile);
        const attachmentId = response.id;
        const attachmentType = attachedFile.type;
        MakePost(
          groupId,
          heading,
          creatorId,
          content,
          attachmentId,
          attachmentType,
        ).then((resp) => {
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
      }
    }
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
              <form encType="multipart/form-data">
                <input type="file" name="file" onChange={handleFileUpload} />
              </form>
              <br />
              <Link to="/"><button className="btn btn-secondary float-right" type="button">Cancel</button></Link>
              &nbsp;&nbsp;&nbsp;
              {/* <button className="btn btn-primary float-right" type="button">Post</button> */}
              <Button variant="secondary" onClick={handleSubmitPost}>Post</Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
