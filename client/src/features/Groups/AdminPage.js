import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  getGroupById, getUserById, acceptUser, promoteAdmin,
  getFlaggedPosts,
  flagPost,
  deletePost,
} from './FetchGroups';

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
      <Button onClick={() => onAccept(groupId, userId, true)}>Accept</Button>
      <Button onClick={() => onAccept(groupId, userId, false)}>Decline</Button>
    </div>
  );
}

function AdminItem(props) {
  const { groupId } = useParams();
  const { adminId, onPromote } = props;
  const [user, setUser] = useState({});
  useEffect(async () => {
    if (!user.username) {
      const userData = await getUserById(adminId);
      setUser(userData);
    }
  });
  return (
    <div>
      <h3>{user.username}</h3>
      <Button onClick={() => onPromote(groupId, adminId, false)}>Demote</Button>
    </div>
  );
}

function MemberItem(props) {
  const { groupId } = useParams();
  const { memberId, onPromote } = props;
  const [user, setUser] = useState({});
  useEffect(async () => {
    if (!user.username) {
      const userData = await getUserById(memberId);
      setUser(userData);
    }
  });
  return (
    <div>
      <h3>{user.username}</h3>
      <Button onClick={() => onPromote(groupId, memberId, true)}>Promote to Admin</Button>
    </div>
  );
}

function FlaggedPostItem(props) {
  // const { groupId } = useParams();
  const { post, onHandleFlag } = props;
  // useEffect(async () => {
  //   if (!user.username) {
  //     const userData = await getUserById(memberId);
  //     setUser(userData);
  //   }
  // });
  return (
    <div>
      <h3>{post.heading}</h3>
      <p>{`Flagged by ${post.flaggerId}`}</p>
      <Button onClick={() => onHandleFlag(post._id, true)}>Delete</Button>
      <Button onClick={() => onHandleFlag(post._id, false)}>Unflag</Button>
    </div>
  );
}

function AdminPage() {
  const history = useHistory();
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  const [pendingIds, setPendingIds] = useState([]);
  const [adminIds, setAdminIds] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  useEffect(async () => {
    if (!group.title) {
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
      setPendingIds(groupData.pendingMemberIds);
      setAdminIds(groupData.adminIds);
      setMemberIds(groupData.memberIds);
      const flagged = await getFlaggedPosts(groupId);
      setFlaggedPosts(flagged);
    }
  });
  const acceptInvitedUser = async (groupIdInvited, userIdInvited, accept) => {
    await acceptUser(groupIdInvited, userIdInvited, accept);
    const groupData = await getGroupById(groupId);
    setGroup(groupData);
    setPendingIds(groupData.pendingMemberIds);
    setAdminIds(groupData.adminIds);
    setMemberIds(groupData.memberIds);
    // history.push(`/group/${groupId}`);
  };
  const promoteDemoteAdmin = async (groupIdAdmin, userIdAdmin, promoteStatus) => {
    await promoteAdmin(groupIdAdmin, userIdAdmin, promoteStatus);
    const groupData = await getGroupById(groupId);
    setGroup(groupData);
    setPendingIds(groupData.pendingMemberIds);
    setAdminIds(groupData.adminIds);
    setMemberIds(groupData.memberIds);
  };
  const handleFlaggedPost = async (flaggedPostId, deleteStatus) => {
    if (deleteStatus) {
      await deletePost(flaggedPostId);
    } else {
      // unflag post
      await flagPost(flaggedPostId, null);
    }
    const flagged = await getFlaggedPosts(groupId);
    setFlaggedPosts(flagged);
  };

  return (
    <div>
      <h3>Pending Requests</h3>
      {pendingIds.map((pendingId) => (
        <PendingUserItem
          userId={pendingId}
          onAccept={acceptInvitedUser}
          key={pendingId}
        />
      ))}
      <h3>Admins</h3>
      {adminIds.map((adminId) => (
        <AdminItem
          adminId={adminId}
          onPromote={promoteDemoteAdmin}
          key={adminId}
        />
      ))}
      <h3>Members</h3>
      {memberIds.map((memberId) => (
        <MemberItem
          memberId={memberId}
          onPromote={promoteDemoteAdmin}
          key={memberId}
        />
      ))}
      <h3>Flagged Posts</h3>
      {flaggedPosts.map((flaggedPost) => (
        <FlaggedPostItem
          post={flaggedPost}
          onHandleFlag={handleFlaggedPost}
        />
      ))}
      <Button onClick={() => history.push(`/group/${groupId}`)}>Back to Group</Button>
    </div>
  );
}

export default AdminPage;
