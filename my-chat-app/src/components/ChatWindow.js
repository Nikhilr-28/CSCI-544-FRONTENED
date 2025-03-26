import React, { useState } from 'react';

const ChatWindow = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() !== '') {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
