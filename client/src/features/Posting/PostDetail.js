/* eslint jsx-a11y/media-has-caption: 0 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
// import { GetPost, GetUsernameById, GetFile } from './PostMethods';
import { GetPost, GetFile } from './PostMethods';

export default function PostDetail() {
  const { postingId } = useParams();
  const [post, setPost] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  let fileId;
  let authorId;
  let title;
  let body;
  let commentsList;

  useEffect(async () => {
    if (!post) {
      const response = await GetPost(postingId);
      setPost(response);
      fileId = response.attachmentId;
      authorId = response.creatorId;
      title = response.heading;
      body = response.content;
      commentsList = response.comments;

      if (fileId) {
        const file = await GetFile(fileId);
        setAttachedFile(file);
      }
    }
  }, [postingId]);

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
            {title}
            {authorId}
            {body}
            {commentsList}
            !!!!!!!!!!!!!!!!!!!!!!!!
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}
