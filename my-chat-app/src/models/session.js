// src/models/Session.js
export class Session {
    constructor(id, name, messages = [], notes = '') {
      this.id = id;
      this.name = name;
      this.title = name; // Add this line to maintain compatibility
      this.messages = messages;
      this.notes = notes;
    }
  
    // Method to convert JSON to Session instance
    static fromJSON(json) {
      return new Session(
        json.id, 
        json.name || json.title, // Handle both name and title 
        json.messages || [], 
        json.notes || ''
      );
    }
  
    // Method to save sessions to localStorage
    static saveSessionsToLocalStorage(sessions) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  
    // Method to load sessions from localStorage
    static loadSessionsFromLocalStorage() {
      const savedSessions = localStorage.getItem('chatSessions');
      return savedSessions 
        ? JSON.parse(savedSessions).map(Session.fromJSON)
        : [];
    }
  }