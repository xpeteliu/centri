import { useParams } from "react-router";
import { GetPost, GetUsernameById, GetFile } from "./PostMethods";


export default function PostDetail() {
  const { postingId } = useParams();
  const post = GetPost(postingId);
  const creatorId = post.creatorId;
  const username = GetUsernameById(creatorId);
  const comments = post.comments;
  const attachmentId = post.attachmentId;
  const attachedFile = GetFile(attachmentId);

  if (attachedFile != null) {
    let media;
    const attachmentType = post.attachmentType;
    const attachmentUrl = process.env.REACT_APP_API_URL || `/api/file/${attachmentId}`;
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
        <video controls src={attachmentUrl} alt="attached audio" type="{attachmentType}" width="360px" />
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
          {post.comments}
        </Card.Text>
      </Card.Body>
    </Card>
  );

}
