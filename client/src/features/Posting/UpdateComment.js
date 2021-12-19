import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
  Button, Row, Col, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GetComment } from './PostMethods';

export default function UpdateComment() {
  const history = useHistory();
  const { commentId } = useParams();
  const { groupId } = useParams();
  // const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';
  const baseUrl = '/api';
  const url = baseUrl.concat(`/comment/${commentId}`);
  const [comment, setComment] = useState(null);
  const [postingId, setPostingId] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(async () => {
    if (!comment) {
      const response = await GetComment(commentId);
      setComment(response);
      const id = response.postingId;
      setPostingId(id);
      const originalContent = response.content;
      setContent(originalContent);
    }
  }, [commentId]);

  const handleChange = (event) => {
    const { value } = event.target;
    setContent(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setContent(document.getElementById('inputContent').value);
    // const { creatorId } = comment.creatorId;
    // const { postingId } = comment.postingId;
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentId,
        content,
        // creatorId,
        postingId,
      }),
    });
    history.push(`/group/${groupId}/posting/${postingId}`);
  };

  return (
    <Card>
      <Card.Title>
        <h2>Update comment</h2>
      </Card.Title>
      <Card.Body>
        <Row className="h-100">
          <Col className="my-auto">
            <form className="post-form">
              <label htmlFor="body">
                <textarea id="inputContent" className="form-control" name="body" type="textarea" rows={5} cols={300} value={content} onChange={handleChange} required />
              </label>
              <br />
              <Link to={`/group/${groupId}/posting/${postingId}`}><button className="btn btn-secondary float-right" type="button">Cancel</button></Link>
            &nbsp;&nbsp;&nbsp;
              <Button variant="secondary" onClick={handleSubmit}>Save</Button>
            </form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
