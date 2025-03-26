import React, { useState, useRef, useEffect } from 'react';

function ChatWindow({ messages, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.type}-message`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-group">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;