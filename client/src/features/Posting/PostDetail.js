/* eslint jsx-a11y/media-has-caption: 0 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { GetPost, GetUsernameById, GetFile } from './PostMethods';
// import { GetPost, GetFile } from './PostMethods';

export default function PostDetail() {
  const { postingId } = useParams();
  const [post, setPost] = useState(null);
  useEffect(async () => {
    if (!post) {
      const response = await GetPost(postingId);
      setPost(response);
    }
  });
  // const post = GetPost(postingId);
  if (post) {
    const author = post.creatorId;
    const username = GetUsernameById(author);
    const fileId = post.attachmentId;
    const attachedFile = GetFile(fileId);
    let media;
    if (attachedFile != null) {
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
        <Card.Body>
          { media }
          <Card.Title>
            { post.heading }
          </Card.Title>
          <Card.Text>
            { username }
            <br />
            {post.createdAt}
            <br />
            {post.updatedAt}
            <br />
            {post.content}
            <br />
            { post.comments }
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}
