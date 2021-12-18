import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Row, Col, Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { showModal } from '../common/MessageModal/modalSlice';
import { GetComment } from './PostMethods';

export default function UpdateComment(commentId) {
  const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';
  const url = baseUrl.concat(`/${commentId}`);
  const [comment, setComment] = useState(null);

  useEffect(async () => {
    if (!comment) {
      const response = await GetComment(commentId);
      setComment(response);
    }
  });

  const handleSubmit = (event) => {
    const content = document.getElementById('inputContent').value;
    const creatorId = comment.creatorId;
    const postingId = comment.postingId;
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        creatorId,
        postingId,
      }),
    });
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
                <textarea id="inputContent" className="form-control" name="body" type="textarea" rows={5} cols={300} value={comment.content} required />
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
