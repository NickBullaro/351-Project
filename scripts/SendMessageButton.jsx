import * as React from 'react';
import Socket from './Socket';
var aesjs = require('aes-js');

const SendMessageButton = ({sid, username, email, user}) => {
  
  function handleSubmit(event) {
    
    // An example 128-bit key
    var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
     
    // Convert text to bytes (text must be a multiple of 16 bytes)
    var text = document.getElementById('message_input');
    console.log("The original plaintext message is:", text.value)
    var textBytes = aesjs.utils.utf8.toBytes(text.value);
     
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
     
    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    
    const newUsername = document.getElementById('usernameSelect');
    let userSID = user[newUsername.value];
    Socket.emit('new message input', {
      'message': encryptedHex,
      'target': userSID,
      'senderName': username,
      'senderSID': sid,
      'senderEmail': email
    });
    console.log('Sent the encrypted message:', encryptedHex);
    encryptedHex = '';
    newUsername.value = '';
    
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="submitButton">
      <input id="usernameSelect" placeholder="Enter username" className="username" required/>
      <input id="message_input" placeholder="Enter a message" className="input" autoComplete="off" required/>
      <button className="addButton" type="submit">Send</button>
    </form>
  );
};
export default SendMessageButton;