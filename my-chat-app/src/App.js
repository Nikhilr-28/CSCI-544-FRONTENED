import React, { useState, useEffect, useRef } from 'react';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import ChatNotes from './components/ChatNotes';
import './App.css';

// The WebSocket URL will come from your environment variable
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws';

function App() {
  // Dummy data for chat sessions; in a real app, you'll fetch these from your backend.
  const [sessions, setSessions] = useState([
    { id: 1, title: 'Session 1' },
    { id: 2, title: 'Session 2' }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState('');
  const ws = useRef(null);

  // Establish websocket connection on component mount
  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected:', WEBSOCKET_URL);
    };

    ws.current.onmessage = (event) => {
      // Assume the backend sends JSON with a message field
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data.message]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Handle sending a message: send payload to backend via WebSocket and update local state.
  const handleSendMessage = (message) => {
    const payload = { sessionId: currentSessionId, message, notes };
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
      setMessages((prev) => [...prev, message]);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  // When a chat session is selected, load its data.
  // For now, we clear messages/notes; later, fetch session data from your backend.
  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setMessages([]);
    setNotes('');
  };

  return (
    <div className="app-container">
      <ChatHistory 
        sessions={sessions} 
        onSelectSession={handleSelectSession} 
        currentSessionId={currentSessionId}
      />
      <div className="chat-main">
        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSendMessage}
        />
        <ChatNotes 
          notes={notes} 
          onNotesChange={setNotes}
        />
      </div>
    </div>
  );
}

export default App;
