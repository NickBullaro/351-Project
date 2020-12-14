import * as React from 'react';
import Socket from './Socket';

function UserList() {
  const [users, setUsers] = React.useState([]);
  const [userIds, setIds] = React.useState([]);

  function getNewUser() {
    React.useEffect(() => {
      Socket.on('users received', (data) => {
        setUsers(Object.keys(data['all_users']));
        setIds(data['all_ids']);
      });
    });
  }
  

  getNewUser();

  return (
    <div className="container" id="userListing">
      <h1 className="userListTitle">User List</h1>
      <div className="userListing">
        {
          users.map((user, index) => 
          <div id="user" key={index}>
            <p>{user}</p>
          </div>)
        }
      </div>
    </div>
  );
}

export default UserList;