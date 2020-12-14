import * as React from 'react';
import Socket from './Socket';
import UserList from './UserList';
import SendMessage from './SendMessage';
import SendMessageButton from './SendMessageButton';

const LoggedInContent = ({sid, username, email, user}) => {
  
  function setup() {
    React.useEffect(() => {
    });
  }
  
  setup();

  return (
    <div className="loggedInContent" id="loggedInContent">
      <UserList />
      <SendMessage />
      <SendMessageButton  sid={sid} username={username} email={email} user={user}/>
    </div>
  );
};

export default LoggedInContent;