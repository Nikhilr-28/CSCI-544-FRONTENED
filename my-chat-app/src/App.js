import React, { useState, useEffect, useRef } from 'react';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import ChatNotes from './components/ChatNotes';
import WebSocketService from './services/websocket';
import { getSessions } from './services/api';
import { Session } from './models/session';
import './App.css';

function App() {
  // Load initial sessions and current session ID from localStorage
  const [sessions, setSessions] = useState(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    return savedSessions 
      ? JSON.parse(savedSessions).map(sessionData => 
          new Session(sessionData.id, sessionData.name, sessionData.messages, sessionData.notes)
        )
      : [new Session(1, 'Session 1')];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const savedCurrentSessionId = localStorage.getItem('currentSessionId');
    return savedCurrentSessionId ? parseInt(savedCurrentSessionId, 10) : 1;
  });

  const [nextSessionId, setNextSessionId] = useState(() => {
    const maxId = Math.max(...sessions.map(s => s.id), 0);
    return maxId + 1;
  });

  const webSocketService = useRef(null);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save current session ID to localStorage
  useEffect(() => {
    localStorage.setItem('currentSessionId', currentSessionId.toString());
  }, [currentSessionId]);

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const fetchedSessions = await getSessions();
        const sessionModels = fetchedSessions.map(Session.fromJSON);
        
        // Merge fetched sessions with existing sessions
        setSessions(prevSessions => {
          // Create a map of existing sessions for easy lookup
          const existingSessionsMap = new Map(
            prevSessions.map(session => [session.id, session])
          );

          // Add or update fetched sessions
          sessionModels.forEach(fetchedSession => {
            if (!existingSessionsMap.has(fetchedSession.id)) {
              // Add new session if it doesn't exist
              existingSessionsMap.set(fetchedSession.id, fetchedSession);
            } else {
              // Update existing session, preserving local modifications
              const existingSession = existingSessionsMap.get(fetchedSession.id);
              existingSessionsMap.set(fetchedSession.id, {
                ...fetchedSession,
                messages: existingSession.messages,
                notes: existingSession.notes
              });
            }
          });

          // Convert map back to array and sort
          return Array.from(existingSessionsMap.values())
            .sort((a, b) => b.id - a.id);
        });
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
      `Session ${nextSessionId}`,  // This will set both name and title
      [],  // Empty messages
      ''   // Empty notes
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