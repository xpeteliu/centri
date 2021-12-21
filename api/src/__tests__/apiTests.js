import * as request from 'supertest';
import app from '../app';

describe('Backend endpoints', () => {
  const agent = request.agent(app);

  beforeAll(async () => new Promise((resolve) => {
    app.on('appStarted', () => {
      resolve(0);
    });
  }));

  afterAll(async () => {
    app.emit('appHalting');
  });

  test('should be able to allow common user operations', async () => {
    let resp;

    resp = await agent
      .post('/api/user')
      .send({
        username: 'apiTest1Username',
        email: 'apiTest1@email.com',
        password: 'apiTest1Pwd',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to register: ${JSON.stringify(resp.body)}`);
    }
    const userId1 = resp.body._id;

    resp = await agent
      .post('/api/user/filter/count')
      .send({ filter: { _id: userId1 } });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to accept a group invitation: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.count)
      .toEqual(1);

    resp = await agent
      .post('/api/user/filter/paginate')
      .send({ filter: { _id: userId1 } });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to accept a group invitation: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.length)
      .toEqual(1);

    resp = await agent
      .post('/api/user')
      .send({
        username: 'apiTest2Username',
        email: 'apiTest2@email.com',
        password: 'apiTest2Pwd',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to register: ${JSON.stringify(resp.body)}`);
    }
    const userId2 = resp.body._id;

    resp = await agent
      .post('/api/user/login')
      .send({
        username: 'apiTest1Username',
        password: 'apiTest1Pwd',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to login: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .post('/api/group')
      .send({
        creatorId: userId1,
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to create group: ${JSON.stringify(resp.body)}`);
    }
    const groupId = resp.body._id;

    resp = await agent
      .post('/api/group/filter/sort')
      .send({
        filter: { _id: groupId },
        sortMethod: 'latestUpdates',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to query group: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.length)
      .toEqual(1);

    resp = await agent
      .post('/api/group/filter/sort')
      .send({
        filter: { _id: groupId },
        sortMethod: 'numOfPosts',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to query group: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.length)
      .toEqual(1);

    resp = await agent
      .post('/api/group/filter/sort')
      .send({
        filter: { _id: groupId },
        sortMethod: 'numOfMembers',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to query group: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.length)
      .toEqual(1);

    resp = await agent
      .get(`/api/group/${groupId}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to find a group: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .get(`/api/group/${groupId}/member/${userId1}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to find a member's status: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.role)
      .toEqual('creator');

    resp = await agent
      .put(`/api/group/${groupId}/tag/testTag`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to add a group tag: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .delete(`/api/group/${groupId}/tag/testTag`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to remove a group tag: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .post('/api/message')
      .send({
        senderId: userId1,
        recipientId: userId2,
        content: 'Test Group Invitation 1',
        invitingGroupId: groupId,
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to invite user to join group: ${JSON.stringify(resp.body)}`);
    }
    const invitationMessageId1 = resp.body._id;

    resp = await agent
      .post('/api/message')
      .send({
        senderId: userId1,
        recipientId: userId2,
        content: 'Test Group Invitation 2',
        invitingGroupId: groupId,
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to invite user to join group: ${JSON.stringify(resp.body)}`);
    }
    const invitationMessageId2 = resp.body._id;

    resp = await agent
      .post('/api/message/filter/count')
      .send({ filter: { _id: invitationMessageId1 } });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to count messages: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.count)
      .toEqual(1);

    resp = await agent
      .post('/api/message/filter/paginate')
      .send({ filter: { _id: invitationMessageId1 } });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to query messages: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.length)
      .toEqual(1);

    resp = await agent
      .put(`/api/message/${invitationMessageId1}/decline`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to decline a group invitation: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .put(`/api/message/${invitationMessageId2}/accept`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to accept a group invitation: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .put(`/api/group/${groupId}/member/${userId2}`)
      .send({ role: 'member' });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to add member to group: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .delete(`/api/group/${groupId}/member/${userId2}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to remove member from group: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .post('/api/posting')
      .send({
        heading: 'Test Heading',
        content: 'Test Posting',
        creatorId: userId1,
        groupId,
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to create a post: ${JSON.stringify(resp.body)}`);
    }
    const postingId = resp.body._id;

    resp = await agent
      .post('/api/posting/filter/count')
      .send({ filter: { _id: postingId } });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to count posts: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.count)
      .toEqual(1);

    resp = await agent
      .post('/api/posting/filter/paginate')
      .send({ filter: { _id: postingId } });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to query posts: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.length)
      .toEqual(1);

    resp = await agent
      .post('/api/comment')
      .send({
        content: 'Test Comment',
        creatorId: userId1,
        postingId,
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to create a comment: ${JSON.stringify(resp.body)}`);
    }
    const commentId = resp.body._id;

    resp = await agent
      .post('/api/comment/filter/count')
      .send({ filter: { _id: commentId } });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to count comments: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.count)
      .toEqual(1);

    resp = await agent
      .post('/api/comment/filter/paginate')
      .send({ filter: { _id: commentId } });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to query comments: ${JSON.stringify(resp.body)}`);
    }
    expect(resp.body.length)
      .toEqual(1);

    resp = await agent
      .put(`/api/comment/${commentId}`)
      .send({
        content: 'New Test Comment',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to modify a comment: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .get(`/api/comment/${commentId}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to find a comment: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .delete(`/api/comment/${commentId}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to remove a comment: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .put(`/api/posting/${postingId}`)
      .send({
        heading: 'New Posting Heading',
        flaggerId: userId1,
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to modify a post: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .put(`/api/posting/${postingId}`)
      .send({
        flaggerId: null,
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to de-flag a post: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .put(`/api/posting/${postingId}/hide`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to hide a post: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .get(`/api/posting/${postingId}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to modify a post: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .delete(`/api/posting/${postingId}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to remove a post: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .delete(`/api/user/${userId1}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to delete user: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .post('/api/user/logout');
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to logout: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .post('/api/user/login')
      .send({
        username: 'apiTest2Username',
        password: 'apiTest2Pwd',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to login: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .put(`/api/user/${userId2}`)
      .send({
        email: 'apiTest2@newemail.com',
      });
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to modify user: ${JSON.stringify(resp.body)}`);
    }

    resp = await agent
      .delete(`/api/user/${userId2}`);
    if (resp.status !== 200 && resp.status !== 204) {
      throw new Error(`Unable to delete user: ${JSON.stringify(resp.body)}`);
    }
  });
});
