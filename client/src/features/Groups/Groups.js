import { React, useEffect, useState } from 'react';
import {
  Button, Image, Stack, Row, Col, Container, Card, Modal, Form,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import { HeaderBar } from '../common/HeaderBar';
import { getGroups, createGroup } from './FetchGroups';

// TODO: change this to user id from Redux store
const userId = '61a8e7c806aea993b4bb7545';

function GroupListPage() {
  const [show, setShow] = useState(false); // show create group popup
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  // TODO: this will be a list of unique IDs instead when connected to db
  // console.log(getGroups());
  // const [groups, setGroups] = useState(['Group Name', 'Group Name 2', 'Group Name 3']);
  const [groups, setGroups] = useState([]);
  useEffect(async () => {
    if (groups.length === 0) {
      const groupList = await getGroups(userId);
      setGroups(groupList.map((group) => group.title));
    }
  });
  const createGroupButtonClicked = async () => {
    const groupName = document.getElementById('groupNameField').value;
    await createGroup(userId, groupName);
    // const newGroups = groups.slice();
    // newGroups.push(String(groupName));
    // setGroups(newGroups);
    const groupList = await getGroups(userId);
    setGroups(groupList.map((group) => group.title));
    handleClose();
  };
  return (
    <Container className="App">
      <HeaderBar />
      <Stack direction="vertical" gap={5} className="mainContent">
        <Row className="groupButtons">
          <Col xs="4">
            <Button variant="secondary">Private Groups</Button>
          </Col>
          <Col xs="4">
            <Button variant="secondary">Public Groups</Button>
          </Col>
          <Col xs="4">
            <Button variant="primary" onClick={handleOpen}>Create Group</Button>
          </Col>
        </Row>
        <Row>
          <Stack direction="vertical" gap={5} id="groupList">
            {groups.map((group) => <GroupListItem name={group} key={group} />)}
          </Stack>
        </Row>
        <Row>
          <div className="ms-auto">
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Col xs={2}>
                  <Button onClick={() => {}}>Filter by Tag</Button>
                </Col>
                <Col xs={2}>
                  <Form.Control placeholder="Tag" />
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
            <Form.Group className="mb-3">
              <Form.Label>Admin</Form.Label>
              <Form.Control id="adminField" placeholder="Add an admin" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Invite a Member</Form.Label>
              <Form.Control id="adminField" placeholder="Enter username" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form.Group className="mb-3 me-auto" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Make Group Private" />
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
  const [show, setShow] = useState(false); // show edit group popup
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const history = useHistory();
  const leaveGroup = () => {
    history.push('/groups');
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
              <h3>Group Name</h3>
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
            <GroupPost postId={0} />
            <GroupPost postId={1} />
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
              <Form.Label>Name</Form.Label>
              <Form.Control id="groupNameField" placeholder="Enter group name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Topics</Form.Label>
              <Form.Control id="groupTopicField" placeholder="Add a topic" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Admin</Form.Label>
              <Form.Control id="adminField" placeholder="Add an admin" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Invite a Member</Form.Label>
              <Form.Control id="adminField" placeholder="Enter username" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function GroupListItem(props) {
  const { name } = props;
  const [requested, setRequested] = useState(false);
  return (
    <Stack direction="horizontal" gap={4} className="groupListItem">
      <div className="bg-light">
        <Image src="./photo.jpg" width="30" height="30" roundedCircle />
      </div>
      <div>
        <h3>
          <a href="./group">{name}</a>
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
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Post Title (id:
          {postId}
          )
        </Card.Title>
        <Card.Text>
          {'Vitae massa id tortor sed tortor, commodo. Platea blandit mauris elementum est maecenas iaculis. Ut sodales diam, nam commodo gravida faucibus nisl. Aliquet id pulvinar id lacinia. Lectus auctor vel elementum tristique. Vitae non morbi dolor quisque amet faucibus justo. Sollicitudin vitae augue tortor lobortis sem ultrices neque. Eget ornare et varius in lectus. Lectus est ante morbi ipsum. \
        Aliquam sit non viverra suspendisse eleifend. Et mauris, et quam dolor duis. Lacus porttitor felis, a, vel sed enim. Quam nisi, est nulla scelerisque sollicitudin faucibus erat. Tincidunt purus mauris felis fringilla sit. Commodo dignissim amet vel in ultrices sagittis ultrices. Sem malesuada donec nam eget a, risus laoreet. Egestas malesuada ipsum lacus, quis. A eleifend dolor, id tincidunt diam tincidunt. Tellus suspendisse ut luctus mauris bibendum. Eu sed in convallis neque. In amet convallis sit eros, leo. Id volutpat sit morbi sagittis neque. \
        Dolor, tortor aliquet dictumst mattis mi, netus in. Egestas blandit nunc nulla eget in lacus a, sit. Nulla.'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export { GroupListPage, GroupPage };
// export default GroupListItem;
