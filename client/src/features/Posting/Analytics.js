import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getGroupById, getPostsByGroupId } from '../Groups/FetchGroups';

export default function AnalyticsPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [NumberOfMembers, setNumberOfMembers] = useState(0);
  const [NumberOfAdmins, setNumberOfAdmins] = useState(0);
  const [NumberOfPosts, setNumberOfPosts] = useState(0);
  const [flaggedPosts, setFlaggedPosts] = useState(0);
  const [hiddenPosts, setHiddenPosts] = useState(0);

  useEffect(async () => {
    if (!group) {
      const response = await getGroupById(groupId);
      setGroup(response);
      const members = response.memberIds;
      const admins = response.adminIds;
      if (members) {
        const numberMembers = members.length;
        setNumberOfMembers(numberMembers);
      }
      if (admins) {
        const numberAdmins = admins.length;
        setNumberOfAdmins(numberAdmins);
      }
      const posts = await getPostsByGroupId(groupId);
      const numberPosts = posts.length;
      setNumberOfPosts(numberPosts);
      if (numberPosts > 0) {
        for (let i = 0; i < numberPosts; i += 1) {
          if (posts[i].flaggerId) {
            setFlaggedPosts(flaggedPosts + 1);
          }
          if (posts[i].hiderIds) {
            setHiddenPosts(hiddenPosts + 1);
          }
        }
      }
    }
  }, [groupId]);
  return (
    <Card>
      <Card.Title>
        Analytics
      </Card.Title>
      <Card.Body>
        Number of Administrators:
        {NumberOfAdmins}
        <br />
        Number of Members:
        {NumberOfMembers}
        <br />
        Number of Posts:
        {NumberOfPosts}
        <br />
        Number of Posts Flagged:
        {flaggedPosts}
        <br />
        Number of Hidden Posts:
        {hiddenPosts}
      </Card.Body>
    </Card>
  );
}
