import * as React from 'react';
import LoginScreen from './LoginScreen';
import LoggedInContent from './LoggedInContent';
import Socket from './Socket';


function Content() {
  const [loggedIn, setLoginState] = React.useState(false);
  const [sid, setSID] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [users, setUsers] = React.useState({});

  function setup() {
    React.useEffect(() => {
      Socket.on('login accepted', (data) => {
        console.log("accepted");
        setLoginState(true);
        setSID(data['sid']);
        setUsername(data['username']);
        setEmail(data['email']);
        setUsers(data['users']);
      });
    });
  }

  setup();

  return (
    <div id="content">
      {
        loggedIn
          ? <LoggedInContent sid={sid} username={username} email={email} user={users}/>
          : <LoginScreen />
      }
    </div>
  );
}

export default Content;
