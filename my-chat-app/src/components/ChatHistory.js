import React from 'react';

const ChatHistory = ({ sessions, onSelectSession, currentSessionId }) => {
  return (
    <div className="chat-history">
      <h3>Chat History</h3>
      <ul>
        {sessions.map((session) => (
          <li 
            key={session.id}
            className={currentSessionId === session.id ? "active" : ""}
            onClick={() => onSelectSession(session.id)}
          >
            {session.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
