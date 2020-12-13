import * as React from 'react';
import CreateAccount from './CreateAccount';
import LoginField from './LoginField';


function LoginScreen() {
  function Refresh() {
    return;
  }
  
  
  //TODO - Add create account option
  return (
    <div id="loginScreen">
      <h2>Create an Account!</h2>
      <CreateAccount />
      <h2>If you already have an account, sign in here!</h2>
      <LoginField />
    </div>
  );
}

export default LoginScreen;
