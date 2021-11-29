class Message {
  constructor(props) {
    this._id = props._id;
    this.content = props.content;
    this.creatorId = props.creatorId;
    this.createdDate = props.createdDate;
  }
}

export default Message;
