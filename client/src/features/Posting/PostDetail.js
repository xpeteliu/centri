/* eslint jsx-a11y/media-has-caption: 0 */
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Button, Stack } from 'react-bootstrap';
import {
  GetPost, GetFile, GetComment, DeleteComment,
} from './PostMethods';

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
      console.log(commentsField);
      setCommentList(commentsField.map((comment) => String(comment._id)));
      console.log(commentList);
    }
  }, [postingId]);

  const deleteCommentButtonClicked = async (id) => {
    await DeleteComment(id);
    const response = await GetPost(postingId);
    const newComments = response.comments;
    setCommentList(newComments.map((comment) => String(comment._id)));
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
              onDelete={deleteCommentButtonClicked}
            />
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function PostComment(props) {
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
          {/* <Button onClick={() => onEdit(commentId)}>edit</Button> */}
        </Card.Body>
      </Card.Body>
    </Card>
  );
}
