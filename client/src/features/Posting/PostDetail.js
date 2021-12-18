/* eslint jsx-a11y/media-has-caption: 0 */
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Card, Button, Stack, Form, Row, Col,
} from 'react-bootstrap';
import {
  GetPost, GetFile, GetComment, DeleteComment,
} from './PostMethods';
import { FilterCommentsByHashTag } from './FilterByHashTag';

export default function PostDetail() {
  const { postingId } = useParams();
  const { groupId } = useParams();
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [commentList, setCommentList] = useState(undefined);

  let fileId;
  let commentsField;

  useEffect(async () => {
    if (!post) {
      const response = await GetPost(postingId);
      setPost(response);
      fileId = response.attachmentId;
      if (fileId) {
        const file = await GetFile(fileId);
        setAttachedFile(file);
      }
      commentsField = response.comments;
      setCommentList(commentsField.map((comment) => String(comment._id)));
    }
  }, [postingId]);

  const DeleteCommentButtonClicked = async (id) => {
    await DeleteComment(id);
    const response = await GetPost(postingId);
    const newComments = response.comments;
    setCommentList(newComments.map((comment) => String(comment._id)));
  };

  const filterByHashTagButtonClicked = async () => {
    const hashtag = document.getElementById('hashtagField').value;
    const filteredComments = await FilterCommentsByHashTag(hashtag);
    setCommentList(filteredComments.map((comment) => comment._id));
  };

  let media;
  if (attachedFile) {
    const { attachmentType } = post.attachmentType;
    const attachmentUrl = process.env.REACT_APP_API_URL || `/api/file/${fileId}`;
    if (attachmentType.startsWith('image')) {
      media = (
        <img src={attachmentUrl} alt="attached img" width="360px" />
      );
    } else if (attachmentType.startsWith('audio')) {
      media = (
        <audio controls src={attachmentUrl} alt="attached audio" type="{attachmentType}" width="360px" />
      );
    } else if (attachmentType.startsWith('video')) {
      media = (
        <video controls src={attachmentUrl} alt="attached video" type="{attachmentType}" width="360px" />
      );
    }
  }
  return (
    <Card>
      <Card.Body className="p-4">
        {media}
        <div align="left" style={{ whiteSpace: 'pre-wrap' }}>
          <Card.Text className="mb-2 h6 p-2">
            {post && post.heading}
            <br />
            {post && post.creatorId}
            <br />
            {post && post.content}
          </Card.Text>
        </div>
        <Button onClick={() => history.push(`/group/${groupId}/posting/${postingId}/comment`)}>Comment</Button>
        <Stack direction="vertical" gap={2}>
          {commentList && commentList.map((commentId) => (
            <PostComment
              commentId={commentId}
              key={commentId}
              onDelete={DeleteCommentButtonClicked}
            />
          ))}
        </Stack>
        <div className="ms-auto">
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Col xs={2}>
                <Button onClick={() => filterByHashTagButtonClicked()}>Filter by Hashtag</Button>
              </Col>
              <Col xs={2}>
                <Form.Control id="hashtagField" placeholder="Hashtag" />
              </Col>
            </Form.Group>
          </Form>
        </div>
      </Card.Body>
    </Card>
  );
}

function PostComment(props) {
  const history = useHistory();
  const { groupId } = useParams();
  const { postingId } = useParams();
  const { commentId, onDelete } = props;
  const [comment, setComment] = useState({});
  useEffect(async () => {
    if (!comment.content) {
      const newComment = await GetComment(commentId);
      setComment(newComment);
    }
  });
  return (
    <Card>
      <Card.Body>
        <Card.Body>
          {`${comment.content}`}
          <Button onClick={() => onDelete(commentId)}>delete</Button>
          <Button onClick={() => history.push(`/group/${groupId}/posting/${postingId}/comment/${commentId}`)}>edit</Button>
        </Card.Body>
      </Card.Body>
    </Card>
  );
}
