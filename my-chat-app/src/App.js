import React, { useState, useEffect, useRef } from 'react';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import ChatNotes from './components/ChatNotes';
import './App.css';

const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws';

function App() {
  const [sessions, setSessions] = useState([
    { id: 1, title: 'Session 1', messages: [], notes: '' },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [nextSessionId, setNextSessionId] = useState(2);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected:', WEBSOCKET_URL);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addMessageToSession(currentSessionId, `Bot: ${data.message}`);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => ws.current && ws.current.close();
  }, [currentSessionId]);

  const addMessageToSession = (sessionId, message) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      )
    );
  };

  const handleSendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        sessionId: currentSessionId,
        message,
        notes: sessions.find(s => s.id === currentSessionId).notes
      }));
      addMessageToSession(currentSessionId, `User: ${message}`);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const handleCreateSession = () => {
    const newSession = { 
      id: nextSessionId, 
      title: `Session ${nextSessionId}`, 
      messages: [], 
      notes: '' 
    };
    setSessions(prevSessions => [newSession, ...prevSessions]);
    setCurrentSessionId(nextSessionId);
    setNextSessionId(prevId => prevId + 1);
  };

  const handleNotesChange = (notes) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === currentSessionId ? { ...session, notes } : session
      )
    );
  };

  const currentSession = sessions.find(session => session.id === currentSessionId) || { messages: [], notes: '' };

  return (
    <div className="app-container">
      <ChatHistory
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
      />
      <div className="chat-main">
        <ChatWindow
          messages={currentSession.messages}
          onSendMessage={handleSendMessage}
        />
        <ChatNotes
          notes={currentSession.notes}
          onNotesChange={handleNotesChange}
        />
      </div>
    </div>
  );
}

export default App;
