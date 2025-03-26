import React from 'react';

const ChatHistory = ({ sessions, currentSessionId, onSelectSession, onCreateSession }) => {
  return (
    <div className="chat-history">
      <div className="current-session">
        <h3>
          Current Session
          <button className="add-btn" onClick={onCreateSession}>+</button>
        </h3>
      </div>
      <div className="session-history">
        <h4>History</h4>
        <ul>
          {sessions.filter(session => session.id !== currentSessionId).map((session) => (
            <li
              key={session.id}
              onClick={() => onSelectSession(session.id)}
            >
              {session.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatHistory;
