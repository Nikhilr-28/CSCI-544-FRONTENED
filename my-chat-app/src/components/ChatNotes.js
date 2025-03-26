import React from 'react';

const ChatNotes = ({ notes, onNotesChange }) => {
  return (
    <div className="chat-notes">
      <h3>Chat Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add notes for this conversation..."
        rows={5}  // Added rows for better default size
      />
    </div>
  );
};

export default ChatNotes;