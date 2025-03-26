// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import ChatNotes from './components/ChatNotes';
import WebSocketService from './services/websocket';
import { getSessions } from './services/api';
import { Session } from './models/session';
import './App.css';

function App() {
  const [sessions, setSessions] = useState([
    new Session(1, 'Session 1')
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(1);
  const [nextSessionId, setNextSessionId] = useState(2);
  const webSocketService = useRef(null);

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const fetchedSessions = await getSessions();
        const sessionModels = fetchedSessions.map(Session.fromJSON);
        setSessions(sessionModels);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  // Initialize WebSocket
  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      addMessageToSession(currentSessionId, {
        text: data.message,
        type: 'bot'
      });
    };

    webSocketService.current = new WebSocketService(handleWebSocketMessage);
    webSocketService.current.connect();

    return () => {
      if (webSocketService.current) {
        webSocketService.current.disconnect();
      }
    };
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
    if (message.trim() === '') return;

    // Immediately add user message to chat
    addMessageToSession(currentSessionId, {
      text: message,
      type: 'user'
    });

    // Send message via WebSocket
    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (webSocketService.current) {
      webSocketService.current.sendMessage(
        currentSessionId, 
        message, 
        currentSession.notes
      );
    }
  };

  const handleSelectSession = (sessionId) => {
    const selectedSession = sessions.find(session => session.id === sessionId);
    
    if (selectedSession) {
      setCurrentSessionId(sessionId);
    } else {
      console.error('Session not found:', sessionId);
    }
  };

  const handleCreateSession = () => {
    const newSession = new Session(
      nextSessionId, 
      `Session ${nextSessionId}`
    );
    
    setSessions(prevSessions => [newSession, ...prevSessions]);
    setCurrentSessionId(newSession.id);
    setNextSessionId(prevId => prevId + 1);
  };

  const handleNotesChange = (notes) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === currentSessionId 
          ? { ...session, notes } 
          : session
      )
    );
  };

  const currentSession = sessions.find(session => session.id === currentSessionId) 
    || new Session(1, 'Session 1');

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