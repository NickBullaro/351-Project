import * as React from 'react';
import Socket from './Socket';


function LoginField() {
    const [message, setMessage] = React.useState('');
    const [status, setStatus] = React.useState(true);
    
    function handleSubmit(event) {
        const newPassword = document.getElementById('passwordInput');
        const newEmail = document.getElementById('emailInput');
        console.log("handle");

        Socket.emit('new login attempt', {
          password: newPassword.value,
          email: newEmail.value
        });
        newPassword.value = '';
        newEmail.value = '';
    
        event.preventDefault();
    }
    
    function handleIncorrectLogin() {
        React.useEffect(() => {
            console.log("bad");
            Socket.on("bad login", (data) => {
                console.log("set bad message");
                setStatus(true);
                setMessage(data['message']);
            });
        });
    }
    
    handleIncorrectLogin();
    return (
        <div>
            {
                status
                ? <div className="badLoginMessage">{message}</div>
                : ''
            }
            <form onSubmit={handleSubmit}>
              <div className="container">
                <label htmlFor="email"><b>Email</b></label>
                <input id="emailInput" type="text" placeholder="Enter Email" name="email" required></input>
            
                <label htmlFor="psw"><b>Password</b></label>
                <input id="passwordInput" type="password" placeholder="Enter Password" name="psw" required></input>
            
                <div className="clearfix">
                  <button type="submit" className="signupbtn">Log In</button>
                </div>
              </div>
            </form>
        </div>
    );
}

export default LoginField;