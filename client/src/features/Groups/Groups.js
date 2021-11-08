import React from 'react';
import { Button, Image, Stack } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GroupListItem(props) {
  const { name } = props;
  return (
    <Stack direction="horizontal" gap={4} className="groupListItem">
      <div className="bg-light">
        <Image src="./photo.jpg" width="30" height="30" roundedCircle />
      </div>
      <div>
        <h3>{name}</h3>
      </div>
      <div className="ms-auto">
        <Button>Join Group</Button>
      </div>
    </Stack>
  );
}

export { GroupListItem };
