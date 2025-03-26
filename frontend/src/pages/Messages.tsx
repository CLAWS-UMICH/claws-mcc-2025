import "./Messages.css";
import React, { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface Contact {
  id: number;           // must match the 'sent_to' ID in the DB
  name: string;
  lastMessage: string;
  timestamp: string;
  initials?: string;
  color?: string;
  fetched: boolean;
  messages: Message[];
}

const socket: Socket = io("http://localhost:8080");

const getSenderColor = (sender: string) => {
  if (sender === "LMCC") return "#A74109"; 
  if (sender === "Steve") return "#0078D4";
  if (sender === "Alex") return "#009688";
  return "#333333";
};

const Messages = () => {
  // We define our "Contacts" so that ID 0 => Steve, ID 1 => Alex, ID 3 => Group
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 0, // Steve
      name: "Steve",
      lastMessage: "",
      timestamp: "",
      initials: "S",
      color: "#0078D4",
      fetched: false,
      messages: [],
    },
    {
      id: 1, // Alex
      name: "Alex",
      lastMessage: "",
      timestamp: "",
      initials: "A",
      color: "#009688",
      fetched: false,
      messages: [],
    },
    {
      id: 3, // Group
      name: "Group Chat",
      lastMessage: "",
      timestamp: "",
      initials: "G",
      color: "#333333",
      fetched: false,
      messages: [],
    }
  ]);

  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const selectedContact = contacts.find(c => c.id === selectedContactId) || null;

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  // handle outside clicks for the emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Join the MESSAGING room, and set up socket listeners
  useEffect(() => {
    socket.emit("join_room", { room: "MESSAGING" });

    // When a new message arrives from the server:
    socket.on("new_message", (msgDoc: any) => {
      setContacts(prevContacts =>
        prevContacts.map(contact => {
          if (contact.id === msgDoc.sent_to) {
            const date = new Date(msgDoc.timestamp);
            const shortTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            const newMsg: Message = {
              id: contact.messages.length + 1,
              sender: idToSenderName(msgDoc.from), // we'll define a helper to map from 0->"Steve"
              content: msgDoc.message,
              timestamp: shortTime,
            };
            return {
              ...contact,
              messages: [...contact.messages, newMsg],
              lastMessage: newMsg.content,
              timestamp: shortTime
            };
          }
          return contact;
        })
      );
    });

    // When we load older messages from DB:
    socket.on("load_messages", (data: any) => {
      const loaded = data.messages || [];
      setContacts(prevContacts =>
        prevContacts.map(contact => {
          if (contact.id === selectedContactId) {
            const loadedAsMsgs = loaded.map((doc: any, index: number) => {
              const dateObj = new Date(doc.timestamp);
              const shortTime = dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
              return {
                id: contact.messages.length + index + 1,
                sender: idToSenderName(doc.from),
                content: doc.message,
                timestamp: shortTime,
              };
            });
            const merged = [...contact.messages, ...loadedAsMsgs];
            const finalMsg = merged.length > 0 ? merged[merged.length - 1] : null;
            return {
              ...contact,
              fetched: true,
              messages: merged,
              lastMessage: finalMsg ? finalMsg.content : contact.lastMessage,
              timestamp: finalMsg ? finalMsg.timestamp : contact.timestamp
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

  // Helper to map numeric 'from' IDs to a name, so the chat shows "Steve" etc.
  const idToSenderName = (fromId: number) => {
    if (fromId === 0) return "Steve";
    if (fromId === 1) return "Alex";
    if (fromId === 2) return "LMCC";
    return "Unknown";
  };

  // When user clicks a contact in the sidebar
  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
    if (!contact.fetched) {
      // fetch from DB
      socket.emit("get_messages", { room: "MESSAGING", contact_id: contact.id });
    }
  };

  // If user hits Enter in the input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Submit new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    if (newMessage.trim()) {
      // We know 'LMCC' is ID=2 for the 'from' field, or 'Steve'=0, etc.
      // But for the sake of your code, you want LMCC as the sender for all messages from the UI
      const fromId = 2; // LMCC
      socket.emit("send_message", {
        room: "MESSAGING",
        message_id: selectedContact.messages.length, // or +1
        sent_to: selectedContact.id,
        message: newMessage.trim(),
        from: fromId
      });
      setNewMessage("");
    }
  };

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
        {/* SIDEBAR CONTACTS */}
        <div className="message-list">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`message-contact ${selectedContact?.id === contact.id ? "selected" : ""}`}
              onClick={() => handleSelectContact(contact)}
            >
              <div className="message-icon" style={{ backgroundColor: contact.color }}>
                {contact.initials}
              </div>
              <div className="message-details">
                <div className="contact-header-row">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-timestamp">{contact.timestamp}</span>
                </div>
                <div className="message-preview">{contact.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CHAT AREA */}
        <div className="chat-container">
          <div className="chat-messages">
            {selectedContact?.messages.map(message => {
              const senderColor = getSenderColor(message.sender);
              return (
                <div key={message.id} className="chat-message">
                  <div className="message-sender-icon" style={{ backgroundColor: senderColor }}>
                    {message.sender.charAt(0)}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <div className="message-sender">{message.sender}</div>
                      <div className="message-time">{message.timestamp}</div>
                    </div>
                    <div className="message-text">{message.content}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New message input */}
          <form onSubmit={handleSendMessage} className="message-input-container">
            <div className="action-buttons" style={{ position: "relative" }}>
              <button type="button" className="action-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                {/* Some emoji icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 
                       10 10 10 10-4.48 
                       10-10S17.52 2 12 2zm0 
                       18c-4.41 0-8-3.59-8-8s3.59-8 
                       8-8 8 3.59 8 
                       8-3.59 8-8 8zM7 
                       14c.78 2.34 2.72 
                       4 5 4s4.22-1.66 
                       5-4H7zm8-4c.55 0 
                       1-.45 1-1s-.45-1-1-1-1 
                       .45-1 1 .45 1 
                       1 1zm-6 0c.55 0 
                       1-.45 1-1s-.45-1-1-1-1 
                       .45-1 1 .45 
                       1 1 1z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker" ref={emojiPickerRef}>
                  {emojis.map(e => (
                    <span key={e} style={{ cursor: "pointer", fontSize: "18px" }}
                          onClick={() => {
                            setNewMessage(prev => prev + e);
                            setShowEmojiPicker(false);
                          }}>
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="message-input-wrapper">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedContact ? `Message ${selectedContact.name}` : "Select a contact"}
                className="message-input"
              />
              <button type="submit" className="send-button" title="Send">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 15.8333L17.5 10 L2.5 4.16667V8.33333 L12.5 10 L2.5 11.6667V15.8333Z" fill="currentColor"/>
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
