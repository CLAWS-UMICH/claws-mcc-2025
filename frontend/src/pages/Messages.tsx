import "./Messages.css";
import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  initials?: string;
  color?: string;
  fetched: boolean;
  messages: Message[];
}

const socket: Socket = io("http://localhost:8080");

// Helper to match sender names to their colors:
const getSenderColor = (sender: string) => {
  if (sender === "LMCC") return "#A74109";   // Orange
  if (sender === "Steve") return "#0078D4";  // Blue
  if (sender === "Alex")  return "#009688";  // Teal
  // Fallback color
  return "#333333";
};

const Messages = () => {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // For toggling the emoji picker:
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  // Hide the emoji picker if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sample contacts with their respective messages
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Steve",
      lastMessage: "Hey, how's the mission going?",
      timestamp: "7:20 PM",
      initials: "S",
      color: "#0078D4",
      fetched: false,
      messages: [
        { id: 1, sender: "Steve", content: "Hey, how's the mission going?", timestamp: "7:20 PM" },
      ],
    },
    {
      id: 2,
      name: "Alex",
      lastMessage: "Where should I go next?",
      timestamp: "7:28 PM",
      initials: "A",
      color: "#009688",
      fetched: false,
      messages: [
        { id: 1, sender: "Alex", content: "Where should I go next?", timestamp: "7:28 PM" },
      ],
    },
    {
      id: 3,
      name: "Group Chat",
      lastMessage: "Yes, I'm here too!",
      timestamp: "7:23 PM",
      initials: "G",
      color: "#333333",
      fetched: false,
      messages: [
        { id: 1, sender: "Alex", content: "Hello from the group chat", timestamp: "7:22 PM" },
        { id: 2, sender: "Steve", content: "Yes, I'm here too!", timestamp: "7:23 PM" },
      ],
    },
  ]);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || null;

  // Join room and listen for new or older messages
  useEffect(() => {
    socket.emit("join_room", { room: "MESSAGING" });

    socket.on("new_message", (msgDoc: any) => {
      setContacts((prevContacts) =>
        prevContacts.map((contact) => {
          if (contact.id === msgDoc.sent_to) {
            const date = new Date(msgDoc.timestamp);
            const shortTime = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });
            const newMsg: Message = {
              id: contact.messages.length + 1,
              sender: msgDoc.from,
              content: msgDoc.message,
              timestamp: shortTime,
            };
            return {
              ...contact,
              messages: [...contact.messages, newMsg],
              lastMessage: newMsg.content,
              timestamp: shortTime,
            };
          }
          return contact;
        })
      );
    });

    socket.on("load_messages", (data: any) => {
      const loadedMessages = data.messages || [];
      setContacts((prevContacts) =>
        prevContacts.map((contact) => {
          if (contact.id === selectedContactId) {
            const loadedAsMessages = loadedMessages.map((doc: any, index: number) => {
              const dateObj = new Date(doc.timestamp);
              const shortTime = dateObj.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              });
              return {
                id: contact.messages.length + index + 1,
                sender: doc.from,
                content: doc.message,
                timestamp: shortTime,
              };
            });
            // Merge or append
            const merged = [...contact.messages, ...loadedAsMessages];
            const finalLastMsg = merged.length > 0 ? merged[merged.length - 1] : null;

            return {
              ...contact,
              fetched: true,
              messages: merged,
              lastMessage: finalLastMsg ? finalLastMsg.content : contact.lastMessage,
              timestamp: finalLastMsg ? finalLastMsg.timestamp : contact.timestamp,
            };
          }
          return contact;
        })
      );
    });

    return () => {
      socket.off("new_message");
      socket.off("load_messages");
    };
  }, [selectedContactId]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
    if (!contact.fetched) {
      socket.emit("get_messages", {
        room: "MESSAGING",
        contact_id: contact.id,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      socket.emit("send_message", {
        room: "MESSAGING",
        message_id: selectedContact.messages.length + 1,
        sent_to: selectedContact.id,
        message: newMessage.trim(),
        from: "LMCC",
      });
      setNewMessage("");
    }
  };

  const renderMessageContent = (message: Message) => (
    <div className="message-text">{message.content}</div>
  );

  // A small set of emojis
  const emojis = ["👍","👎","☺️","😁","🎉","✅"];

  return (
    <div className="messages-container">
      <div className="messages-header">
        <div className="sidebar-header">Messages</div>
        <div className="message-name-header">
          {selectedContact ? selectedContact.name : "No astronaut selected"}
        </div>
      </div>

      <div className="messages-content">
        {/* LEFT SIDEBAR CONTACTS */}
        <div className="message-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`message-contact ${selectedContact?.id === contact.id ? "selected" : ""}`}
              onClick={() => handleSelectContact(contact)}
            >
              {/* Profile icon */}
              <div
                className="message-icon"
                style={{ backgroundColor: contact.color }}
              >
                {contact.initials}
              </div>

              {/* This container holds name, timestamp, plus the preview line */}
              <div className="message-details">
                {/* single row with name + timestamp */}
                <div className="contact-header-row">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-timestamp">{contact.timestamp}</span>
                </div>
                {/* truncated text of the last message */}
                <div className="message-preview">{contact.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="chat-container">
          <div className="chat-messages">
            {selectedContact?.messages.map((message) => {
              const senderColor = getSenderColor(message.sender);
              return (
                <div key={message.id} className="chat-message">
                  <div
                    className="message-sender-icon"
                    style={{ backgroundColor: senderColor }}
                  >
                    {message.sender.charAt(0)}
                  </div>
                  <div className="message-content">
                    {/* Name and timestamp on a single line */}
                    <div className="message-header">
                      <div className="message-sender">{message.sender}</div>
                      <div className="message-time">{message.timestamp}</div>
                    </div>
                    {renderMessageContent(message)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message input container */}
          <form onSubmit={handleSendMessage} className="message-input-container">
            <div className="action-buttons" style={{ position: "relative" }}>
              <button
                type="button"
                className="action-button"
                title="Add emoji"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 
                       12s4.48 10 10 10 
                       10-4.48 10-10S17.52 
                       2 12 2zm0 
                       18c-4.41 0-8-3.59-8-8s3.59-8 
                       8-8 8 3.59 8 8-3.59 
                       8-8 8zM7 14c.78 
                       2.34 2.72 4 
                       5 4s4.22-1.66 
                       5-4H7zm8-4c.55 
                       0 1-.45 
                       1-1s-.45-1-1-1-1 
                       .45-1 1 
                       .45 1 1 
                       1zm-6 
                       0c.55 0 
                       1-.45 1-1s-.45-1-1-1-1 
                       .45-1 1 
                       .45 1 1 
                       1z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker" ref={emojiPickerRef}>
                  {emojis.map((emoji) => (
                    <span
                      key={emoji}
                      onClick={() => {
                        setNewMessage((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      style={{ cursor: "pointer", fontSize: "18px" }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Text input w/ send button inside */}
            <div className="message-input-wrapper">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedContact?.name || "Astronaut"}`}
                className="message-input"
              />
              <button type="submit" className="send-button" title="Send message">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M2.5 15.8333L17.5 10 
                       L2.5 4.16667V8.33333
                       L12.5 10
                       L2.5 11.6667V15.8333Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
