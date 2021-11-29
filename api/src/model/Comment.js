import Message from './Message';

class Comment extends Message {
  constructor(props) {
    super(props);
    this.postingId = props.postingId;
    this.numOfLikes = props.numOfLikes || 0;
    this.lastModifiedDate = props.lastModifiedDate;
    this.version = props.version || 0;
  }
}

export default Comment;
