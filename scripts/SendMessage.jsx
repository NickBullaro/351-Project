import * as React from 'react';
import Socket from './Socket';
var aesjs = require('aes-js');

const SendMessage = () => {
  const [message, setMessage] = React.useState('');
  
  var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

  function getNewMessage() {
    React.useEffect(() => {
      Socket.on(Socket.id, (data) => {
        console.log("Received the encrypted message:", data['message']);
            // When ready to decrypt the hex string, convert it back to bytes
        var encryptedBytes = aesjs.utils.hex.toBytes(data['message']);
         
        // The cipher-block chaining mode of operation maintains internal
        // state, so to decrypt a new instance must be instantiated.
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
         
        // Convert our bytes back into text
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        setMessage(data['senderName'] + " : " + decryptedText);
        console.log("Decrypted the message:", decryptedText);
      });
    });
  }

  getNewMessage();

  return (
    <div className="container" id="chatbox">
      <div className="chat_messages" id="chatBoxScroll">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SendMessage;
