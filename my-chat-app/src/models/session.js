// src/models/Session.js
export class Session {
    constructor(id, title, messages = [], notes = '') {
      this.id = id;
      this.title = title;
      this.messages = messages;
      this.notes = notes;
    }
  
    static fromJSON(json) {
      return new Session(
        json.id, 
        json.title, 
        json.messages || [], 
        json.notes || ''
      );
    }
  }