import { React, useState } from 'react';
import {
  Button, Image, Stack, Row, Col, Container, Card, Modal, Form,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeaderBar } from '../common/HeaderBar';

function GroupListPage() {
  const [show, setShow] = useState(false); // show create group popup
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
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
        <Row className="groupList">
          <Stack direction="vertical" gap={5}>
            <GroupListItem name="Group Name" />
            <GroupListItem name="Group Name 2" />
            <GroupListItem name="Group Name 3" />
          </Stack>
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
          <Button variant="primary" onClick={handleClose}>
            Create
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
              <Button onClick={handleOpen}>Edit Group</Button>
            </div>
          </Stack>
        </Row>
        <Row className="groupList">
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
            <Form.Group className="mb-3" controlId="groupNameField">
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder="Enter group name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="adminField">
              <Form.Label>Admin</Form.Label>
              <Form.Control
                placeholder="Add an admin"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="usernameField">
              <Form.Label>Invite a Member</Form.Label>
              <Form.Control
                placeholder="Enter username"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Form.Group className="mb-3 me-auto" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Make Group Private" />
          </Form.Group>
          <Button variant="primary" onClick={handleClose}>
            Create Group
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
