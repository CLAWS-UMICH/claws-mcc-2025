import React, { useState } from "react";
import "./Messages.css";

const Messages = () => {
  const [selectedName, setSelectedName] = useState("No astronaut selected");

  // Sample message items for display
  const messages = [
    { id: 1, name: "Steve", lastMessage: "What's next?", timestamp: "7:25 PM" },
    { id: 2, name: "Alex", lastMessage: "Can you pin the location here?", timestamp: "7:30 PM" },
    { id: 3, name: "LMCC", lastMessage: "Sure give me a few.", timestamp: "7:22 PM" },
  ];

  const handleSelectMessage = (name) => {
    setSelectedName(name);
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <div className="sidebar-header">Messages</div>
        <div className="message-name-header">{selectedName}</div>
      </div>

      <div className="messages-content">
        <div className="message-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className="message-contact"
              onClick={() => handleSelectMessage(message.name)}
            >
              <div className="message-icon">{message.name.charAt(0)}</div>
              <div className="message-details">
                <div className="message-name">{message.name}</div>
                <div className="message-preview">{message.lastMessage}</div>
              </div>
              <div className="message-timestamp">{message.timestamp}</div>
            </div>
          ))}
        </div>
        <div className="message-body-content">
          Select a message to view the conversation (will integrate message body sub-comp in soon)
        </div>
      </div>
    </div>
  );
};

export default Messages;
