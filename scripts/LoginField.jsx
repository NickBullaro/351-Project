import * as React from 'react';
import Socket from './Socket';


function LoginField() {
    const [message, setMessage] = React.useState('');
    const [status, setStatus] = React.useState(true);
    
    function handleSubmit(event) {
        const newPassword = document.getElementById('passwordInput');
        const newEmail = document.getElementById('emailInput');

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
            Socket.on("bad login", (data) => {
                setStatus(true);
                setMessage(data['message']);
            });
        });
    }
    
    handleIncorrectLogin();
    return (
        <div className="loginBox">
            {
                status
                ? <div className="badLoginMessage">{message}</div>
                : ''
            }
            <form onSubmit={handleSubmit}>
              <div className="LoginContainer">
                <div className="loginEmail">
                    <label htmlFor="email"><b>Email</b></label>
                    <input id="emailInput" type="text" placeholder="Enter Email" name="email" required></input>
                </div>
                <div className="loginPassword">
                    <label htmlFor="psw"><b>Password</b></label>
                    <input id="passwordInput" type="password" placeholder="Enter Password" name="psw" required></input>
                </div>
            
                <div className="clearfix">
                  <button type="submit" className="loginButton">Log In</button>
                </div>
              </div>
            </form>
        </div>
    );
}

export default LoginField;