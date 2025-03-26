import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() !== '') {
      onSendMessage(input);
      setInput('');
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.startsWith('User:') ? 'user-message' : 'bot-message'}`}
          >
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
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