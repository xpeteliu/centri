import { React, useEffect, useState } from 'react';
import {
  Button, Image, Stack, Row, Col, Container, Card, Modal, Form,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HeaderBar } from '../common/HeaderBar';
import {
  getMyGroups, createGroup, getGroupById, getPostsByGroupId, getPostById,
  filterGroupsByTag, getPublicGroups, getUsersByName, inviteUser,
} from './FetchGroups';

// TODO: change this to user id from Redux store
// const userId = '61a8e7c806aea993b4bb7545';

function GroupListPage() {
  const userId = useSelector((state) => state.user.id);
  const [show, setShow] = useState(false); // show create group popup
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  // TODO: this will be a list of unique IDs instead when connected to db
  // console.log(getGroups());
  // const [groups, setGroups] = useState(['Group Name', 'Group Name 2', 'Group Name 3']);
  const [groups, setGroups] = useState([]);
  useEffect(async () => {
    if (groups.length === 0) {
      const groupList = await getPublicGroups();
      setGroups(groupList.map((group) => String(group._id)));
    }
  });
  const createGroupButtonClicked = async () => {
    const groupName = document.getElementById('groupNameField').value;
    const groupType = document.getElementById('groupTypeCheckBox').checked ? 'private' : 'public';
    await createGroup(userId, groupName, groupType);
    const groupList = await getMyGroups(userId);
    setGroups(groupList.map((group) => String(group._id)));
    handleClose();
  };
  const filterByTagButtonClicked = async () => {
    const tag = document.getElementById('tagField').value;
    const filteredGroups = await filterGroupsByTag(tag);
    setGroups(filteredGroups.map((group) => group._id));
  };
  const publicGroupsButtonClicked = async () => {
    const publicGroups = await getPublicGroups();
    setGroups(publicGroups.map((group) => group._id));
  };
  const myGroupsButtonClicked = async () => {
    const myGroups = await getMyGroups(userId);
    setGroups(myGroups.map((group) => group._id));
  };
  return (
    <Container className="App">
      <HeaderBar />
      <Stack direction="vertical" gap={5} className="mainContent">
        <Row className="groupButtons">
          <Col xs="4">
            <Button variant="secondary" onClick={() => myGroupsButtonClicked()}>My Groups</Button>
          </Col>
          <Col xs="4">
            <Button variant="secondary" onClick={() => publicGroupsButtonClicked()}>Public Groups</Button>
          </Col>
          <Col xs="4">
            <Button variant="primary" onClick={handleOpen}>Create Group</Button>
          </Col>
        </Row>
        <Row>
          <Stack direction="vertical" gap={5} id="groupList">
            {groups.map((group) => <GroupListItem groupId={group} key={group} />)}
          </Stack>
        </Row>
        <Row>
          <div className="ms-auto">
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Col xs={2}>
                  <Button onClick={() => filterByTagButtonClicked()}>Filter by Tag</Button>
                </Col>
                <Col xs={2}>
                  <Form.Control id="tagField" placeholder="Tag" />
                </Col>
              </Form.Group>
            </Form>
          </div>
        </Row>
      </Stack>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control id="groupNameField" placeholder="Enter group name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Topics</Form.Label>
              <Form.Control id="groupTopicField" placeholder="Add a topic" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form.Group className="mb-3 me-auto" controlId="formBasicCheckbox">
            <Form.Check id="groupTypeCheckBox" type="checkbox" label="Make Group Private" />
          </Form.Group>
          <Button variant="primary" onClick={() => createGroupButtonClicked()}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function GroupPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  useEffect(async () => {
    if (!group.title) {
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
    }
  });

  const [posts, setPosts] = useState([]);
  useEffect(async () => {
    if (posts.length === 0) {
      const postList = await getPostsByGroupId(groupId);
      setPosts(postList.map((post) => String(post._id)));
    }
  });

  const [show, setShow] = useState(false); // show edit group popup
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const history = useHistory();
  const leaveGroup = () => {
    history.push('/groups');
  };

  const editGroupButtonClicked = async () => {
    const newMemberName = document.getElementById('inviteField').value;
    if (newMemberName !== '') {
      const userArray = await getUsersByName(newMemberName);
      if (userArray.length > 0) {
        const newMemberId = userArray[0]._id;
        await inviteUser(groupId, newMemberId);
      }
    }
    handleClose();
  };
  return (
    <Container className="App">
      <HeaderBar />
      <Stack direction="vertical" gap={5} className="mainContent">
        <Row className="groupHeader">
          <Stack direction="horizontal" gap={4} className="groupListItem">
            <div className="bg-light">
              <Image src="./photo.jpg" width="30" height="30" roundedCircle />
            </div>
            <div>
              <h3>{group.title}</h3>
            </div>
            <div className="ms-auto">
              <Stack direction="horizontal" gap={3}>
                <Button variant="warning">Admin</Button>
                <Button onClick={handleOpen}>Edit Group</Button>
                <Button onClick={() => leaveGroup()}>Leave Group</Button>
              </Stack>
            </div>
          </Stack>
        </Row>
        <Row className="groupPostList">
          <Stack direction="vertical" gap={5}>
            {posts.map((postId) => <GroupPost postId={postId} key={postId} />)}
          </Stack>
        </Row>
      </Stack>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Control id="groupTopicField" placeholder="Add a topic" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Invite a Member</Form.Label>
              <Form.Control id="inviteField" placeholder="Enter username" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => editGroupButtonClicked()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function GroupListItem(props) {
  const history = useHistory();
  const { groupId } = props;
  // store group info
  const [group, setGroup] = useState({});
  useEffect(async () => {
    if (!group.title) {
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
    }
  });
  const [requested, setRequested] = useState(false);
  return (
    <Stack direction="horizontal" gap={4} className="groupListItem">
      <div className="bg-light">
        <Image src="./photo.jpg" width="30" height="30" roundedCircle />
      </div>
      <div>
        <h3>
          {/* <a href={`./group/${groupId}`}>{group.title}</a> */}
          <span role="presentation" onClick={() => history.push(`./group/${groupId}`)} onKeyPress={() => null}>{group.title}</span>
        </h3>
      </div>
      <div className="ms-auto">
        {requested ? <Button variant="primary" disabled>Requested</Button>
          : <Button variant="secondary" onClick={() => setRequested(true)}>Join Group</Button>}
      </div>
    </Stack>
  );
}

function GroupPost(props) {
  const { postId } = props;
  // TODO: use post id to get title and text
  const [post, setPost] = useState({});
  useEffect(async () => {
    if (!post.heading) {
      const newPost = await getPostById(postId);
      setPost(newPost);
    }
  });
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {`${post.heading} (id:${postId})`}
        </Card.Title>
        <Card.Text>
          {post.content}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export { GroupListPage, GroupPage };
// export default GroupListItem;
