import { useParams } from "react-router";
import { GetPost, GetUsernameById } from "./PostMethods";


export default function PostDetail() {
  const { postingId } = useParams();
  const post = GetPost(postingId);
  const creatorId = post.creatorId;
  const username = GetUsernameById(creatorId);
//   const attachedFile = post.attachedFile;

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {`${post.heading}`}
        </Card.Title>
        <Card.Text>
          { username }
          <br />
          {post.createdAt}
          <br />
          {post.updatedAt}
          <br />
          {post.content}
          
        </Card.Text>
        <Link to="/comment"><button className="btn btn-secondary float-right" type="button">Show Comments</button></Link>
      </Card.Body>
      
    </Card>
  );

}
