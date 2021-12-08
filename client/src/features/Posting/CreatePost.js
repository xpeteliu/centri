import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Row, Col, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MakePost } from './PostingMethods';

export default function CreatePost() {
  const creatorId = useSelector((state) => state.user.id);
  const groupId = 1;

  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  // const [attachedFile, setAttachedFile] = useState(null);
  // const handleUploadAttachment = (event) => {
  //   const file = event.target.files[0];
  //   if (ACCEPTED_FILE_TYPES.includes(file.type)) {
  //     setAttachedFile(file);
  //   }
  // };

  const handleSubmit = (event) => {
    MakePost(creatorId, groupId);
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
            <form className="post-form" onSubmit={handleSubmit}>
              <label htmlFor="title">
                Title
                <input className="form-control" name="title" rows={1} cols={300} value={heading} onChange={(event) => setHeading(event.target.value)} required />
              </label>
              <br />
              <br />
              <label htmlFor="body">
                <textarea className="form-control" name="body" type="textarea" rows={10} cols={300} value={content} onChange={(event) => setContent(event.target.value)} required />
              </label>
              <br />
              <Link to="/"><button className="btn btn-secondary float-right" type="button">Cancel</button></Link>
              &nbsp;&nbsp;&nbsp;
              {/* <button className="btn btn-primary float-right" type="button">Post</button> */}
              <input type="submit" value="Submit" className="btn btn-secondary float-right" />
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
