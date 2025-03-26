import React from 'react';

const ChatHistory = ({ sessions, currentSessionId, onSelectSession, onCreateSession }) => {
  return (
    <div className="chat-history">
      <div className="current-session">
        <h3>
          Current Session
          <button className="add-btn" onClick={onCreateSession}>+</button>
        </h3>
        {/* Add the current session to the list */}
        {sessions.filter(session => session.id === currentSessionId).map((session) => (
          <div 
            key={session.id} 
            className="current-session-item active"
          >
            {session.title}
          </div>
        ))}
      </div>
      <div className="session-history">
        <h4>History</h4>
        <ul>
          {sessions.filter(session => session.id !== currentSessionId).map((session) => (
            <li
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className="session-item"
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