import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getGroupById, getUserById, acceptUser } from './FetchGroups';
import { HeaderBar } from '../common/HeaderBar';

function PendingUserItem(props) {
  const { groupId } = useParams();
  const { userId, onAccept } = props;
  const [user, setUser] = useState({});
  useEffect(async () => {
    if (!user.username) {
      const userData = await getUserById(userId);
      setUser(userData);
    }
  });
  return (
    <div>
      <h3>{user.username}</h3>
      <Button onClick={() => onAccept(groupId, userId)}>Accept</Button>
    </div>
  );
}

function AdminPage() {
  const history = useHistory();
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  const [pendingIds, setPendingIds] = useState([]);
  useEffect(async () => {
    if (!group.title) {
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
    }
    if (group.pendingMemberIds) {
      setPendingIds(group.pendingMemberIds);
    }
  });
  const acceptInvitedUser = async (groupIdInvited, userIdInvited) => {
    await acceptUser(groupIdInvited, userIdInvited);
    history.push(`/group/${groupId}`);
  };
  return (
    <div>
      <HeaderBar />
      {/* {pendingIds.map((pendingId) => <p key={pendingId}>{pendingId}</p>)} */}
      {pendingIds.map((pendingId) => (
        <PendingUserItem
          userId={pendingId}
          onAccept={acceptInvitedUser}
          key={pendingId}
        />
      ))}
      <Button onClick={() => history.push(`/group/${groupId}`)}>Back to Group</Button>
    </div>
  );
}

export default AdminPage;
