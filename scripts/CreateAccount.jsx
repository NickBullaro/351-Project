import * as React from 'react';
import Socket from './Socket';


function createAccount() {
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState(true);
    
  function handleSubmit(event) {
    const newUsername = document.getElementById('usernameCreate');
    const newPassword = document.getElementById('passwordCreate');
    const newEmail = document.getElementById('emailCreate');

    Socket.emit('new account creation', {
      username: newUsername.value,
      password: newPassword.value,
      email: newEmail.value
    });
    newUsername.value = '';
    newPassword.value = '';
    newEmail.value = '';

    event.preventDefault();
  }
  
  function handleBadCreation() {
    React.useEffect(() => {
        console.log("badcreate");
        Socket.on("bad creation", (data) => {
            console.log("set bad message");
            setStatus(true);
            setMessage(data['message']);
        });
    });
  }
  
  handleBadCreation();

  return (
    <div>
      {
          status
          ? <div className="badCreationMessage">{message}</div>
          : ''
      }
      <form onSubmit={handleSubmit}>
        <div className="container">
          <label htmlFor="email"><b>Email</b></label>
          <input id="emailCreate" type="text" placeholder="Enter Email" name="email" required></input>
          
          <label htmlFor="username"><b>Username</b></label>
          <input id="usernameCreate" type="text" placeholder="Enter Username" name="username" required></input>
      
          <label htmlFor="psw"><b>Password</b></label>
          <input id="passwordCreate" type="password" placeholder="Enter Password" name="psw" required></input>
      
          <div className="clearfix">
            <button type="submit" className="signupbtn">Sign Up</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default createAccount;