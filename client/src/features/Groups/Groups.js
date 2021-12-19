import { React, useEffect, useState } from 'react';
import {
  Button, Stack, Row, Col, Container, Card, Modal, Form, DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  getMyGroups, createGroup, getGroupById, getPostsByGroupId, getPostById,
  filterGroupsByTag, getPublicGroups, getUsersByName, inviteUser, addTag,
  leaveGroup, deletePost, inviteUserMessage,
} from './FetchGroups';

function GroupListPage() {
  const userId = useSelector((state) => state.user.id);
  const [show, setShow] = useState(false); // show create group popup
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  // TODO: this will be a list of unique IDs instead when connected to db
  // console.log(getGroups());
  // const [groups, setGroups] = useState(['Group Name', 'Group Name 2', 'Group Name 3']);
  const [groups, setGroups] = useState(undefined);
  useEffect(async () => {
    if (!groups) {
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
  const publicGroupsButtonClicked = async (sortMethod) => {
    const publicGroups = await getPublicGroups(sortMethod);
    setGroups(publicGroups.map((group) => group._id));
  };
  const myGroupsButtonClicked = async () => {
    const myGroups = await getMyGroups(userId);
    setGroups(myGroups.map((group) => group._id));
  };
  return (
    <Container className="App">
      <Stack direction="vertical" gap={5} className="mainContent">
        <Row className="groupButtons">
          <Col xs="4">
            <Button variant="secondary" onClick={() => myGroupsButtonClicked()}>My Groups</Button>
          </Col>
          <Col xs="4">
            <Button variant="secondary" onClick={() => publicGroupsButtonClicked('latestUpdates')}>Public Groups</Button>
          </Col>
          <Col xs="4">
            <Button variant="primary" onClick={handleOpen}>Create Group</Button>
          </Col>
        </Row>
        <Row>
          <Stack direction="vertical" gap={5} id="groupList">
            {groups && groups.map((group) => <GroupListItem groupId={group} key={group} />)}
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
                <Col xs={4} className="ms-auto">
                  <DropdownButton title="Sort Groups">
                    <Dropdown.Item>
                      <div role="presentation" onClick={() => publicGroupsButtonClicked('latestUpdates')} onKeyPress={() => null}>
                        Newest Message
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <div role="presentation" onClick={() => publicGroupsButtonClicked('numOfPosts')} onKeyPress={() => null}>
                        Number of Posts
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <div role="presentation" onClick={() => publicGroupsButtonClicked('numOfMembers')} onKeyPress={() => null}>
                        Number of Members
                      </div>
                    </Dropdown.Item>
                  </DropdownButton>
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
  const userId = useSelector((state) => state.user.id);
  const [group, setGroup] = useState({});
  useEffect(async () => {
    if (!group.title) {
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
    }
  });

  const [posts, setPosts] = useState(undefined);
  useEffect(async () => {
    if (!posts) {
      const postList = await getPostsByGroupId(groupId);
      setPosts(postList.map((post) => String(post._id)));
    }
  });

  const [show, setShow] = useState(false); // show edit group popup
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const history = useHistory();
  const leaveGroupButtonClicked = async () => {
    await leaveGroup(groupId, userId);
    history.push('/groups');
  };
  const goAdminPage = () => {
    history.push(`/group/${groupId}/admin`);
  };

  const editGroupButtonClicked = async () => {
    // invite user
    const newMemberName = document.getElementById('inviteField').value;
    if (newMemberName !== '') {
      const userArray = await getUsersByName(newMemberName);
      if (userArray.length > 0) {
        const newMemberId = userArray[0]._id;
        // await inviteUser(groupId, newMemberId);
        await inviteUserMessage(groupId, userId, newMemberId);
      }
    }
    // add tag
    const newTag = document.getElementById('groupTopicField').value;
    if (newTag !== '') {
      await addTag(groupId, newTag);
    }
    handleClose();
  };

  const deletePostButtonClicked = async (id) => {
    await deletePost(id);
    const newPosts = await getPostsByGroupId(groupId);
    setPosts(newPosts.map((post) => String(post._id)));
  };

  return (
    <Container className="App">
      <Stack direction="vertical" gap={5} className="mainContent">
        <Row className="groupHeader">
          <Stack direction="horizontal" gap={4} className="groupListItem">
            <div>
              <h3>{group.title}</h3>
            </div>
            <div className="ms-auto">
              <Stack direction="horizontal" gap={3}>
                <Button variant="warning" onClick={() => goAdminPage()}>Admin</Button>
                <Button onClick={() => history.push(`/group/${groupId}/posting`)}>Create Post</Button>
                <Button onClick={handleOpen}>Edit Group</Button>
                <Button onClick={() => leaveGroupButtonClicked()}>Leave Group</Button>
              </Stack>
            </div>
          </Stack>
        </Row>
        <Row className="groupPostList">
          <Stack direction="vertical" gap={5}>
            {posts && posts.map((postId) => (
              <GroupPost
                postId={postId}
                key={postId}
                onDelete={deletePostButtonClicked}
              />
            ))}
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
  const userId = useSelector((state) => state.user.id);
  // store group info
  const [group, setGroup] = useState({});
  const [requested, setRequested] = useState(false);
  useEffect(async () => {
    if (!group.title) {
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
      setRequested((groupData.pendingMemberIds.includes(userId)
        || groupData.memberIds.includes(userId) || groupData.adminIds.includes(userId)));
    }
  });
  const joinButtonPressed = async () => {
    await inviteUser(groupId, userId);
    setRequested(true);
  };
  return (
    <Stack direction="horizontal" gap={4} className="groupListItem">
      <div>
        <h3>
          <span role="presentation" onClick={() => history.push(`./group/${groupId}`)} onKeyPress={() => null}>{group.title}</span>
        </h3>
        <p>{group.status === 'private' ? 'Private' : ''}</p>
      </div>
      <div className="ms-auto">
        {requested ? <Button variant="primary" disabled>Requested</Button>
          : <Button variant="secondary" onClick={() => joinButtonPressed()}>Join Group</Button>}
      </div>
    </Stack>
  );
}

function GroupPost(props) {
  const history = useHistory();
  const { postId, onDelete } = props;
  const [isAuthor, setIsAuthor] = useState(false);
  const userId = useSelector((state) => state.user.id);
  // TODO: use post id to get title and text
  const [post, setPost] = useState({});
  useEffect(async () => {
    if (!post.heading) {
      const newPost = await getPostById(postId);
      setPost(newPost);
      if (newPost.creatorId === userId) {
        setIsAuthor(true);
      }
    }
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <span role="presentation" onClick={() => history.push(`./posting/${postId}`)} onKeyPress={() => null}>
            {`${post.heading}`}
          </span>
          {
            isAuthor
              ? <Button onClick={() => onDelete(postId)}>Delete Post</Button>
              : <Button>Flag Post</Button>
          }
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
