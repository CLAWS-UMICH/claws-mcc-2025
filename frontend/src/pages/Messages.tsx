import "./Messages.css";
import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './styles/ToastStyles.css';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isLMCC?: boolean;
  file?: {
    name: string;
    url: string;
    type: string;
  };
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

const Messages = () => {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      ]
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
      ]
    },
    {
      id: 3,
      name: "LMCC",
      lastMessage: "Mission control standing by.",
      timestamp: "7:22 PM",
      initials: "L",
      color: "#333333",
      fetched: false,
      messages: [
        { id: 1, sender: "LMCC", content: "Mission control standing by.", timestamp: "7:22 PM", isLMCC: true },
      ]
    },
  ]);

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) || null;

  useEffect(() => {

    // Default room
    socket.emit("join_room", { room: "MESSAGING" });
    
    // Listen for newly sent messages (real-time)
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

    // Listen for older messages loaded from DB
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

            // Merge or append the loaded messages
            const mergedMessages = [...contact.messages, ...loadedAsMessages];

            const finalLastMsg =
              mergedMessages.length > 0
                ? mergedMessages[mergedMessages.length - 1]
                : null;

            // Mark this contact as fetched so we don't fetch again
            return {
              ...contact,
              fetched: true,
              messages: mergedMessages,
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedContact) {
      // In a real app, you would upload the file to a server here
      // For now, we'll create a local URL
      const fileUrl = URL.createObjectURL(file);
      socket.emit("send_message", {
        room: "MESSAGING",
        message_id: selectedContact.messages.length + 1,
        sent_to: selectedContact.id,
        message: "Sent a file",
        from: "You",
      });
      setNewMessage("");
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
        from: "You",
      });
      setNewMessage("");
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.file) {
      if (message.file.type.startsWith("image/")) {
        return (
          <div className="message-file">
            <img src={message.file.url} alt={message.file.name} className="message-image" />
            <div className="file-name">{message.file.name}</div>
          </div>
        );
      }
      return (
        <div className="message-file">
          <a href={message.file.url} download={message.file.name} className="file-download">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor" />
            </svg>
            {message.file.name}
          </a>
        </div>
      );
    }
    return <div className="message-text">{message.content}</div>;
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <div className="sidebar-header">Messages</div>
        <div className="message-name-header">
          {selectedContact ? selectedContact.name : "No astronaut selected"}
        </div>
      </div>
      <div className="messages-content">
        <div className="message-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`message-contact ${selectedContact?.id === contact.id ? 'selected' : ''}`}
              onClick={() => handleSelectContact(contact)}
            >
              <div
                className="message-icon"
                style={{ backgroundColor: contact.color }}
              >
                {contact.initials}
              </div>
              <div className="message-details">
                <div className="message-name">{contact.name}</div>
                <div className="message-preview">{contact.lastMessage}</div>
              </div>
              <div className="message-timestamp">{contact.timestamp}</div>
            </div>
          ))}
        </div>
        <div className="chat-container">
          <div className="chat-messages">
            {selectedContact?.messages.map((message) => (
              <div key={message.id} className="chat-message">
                <div
                  className="message-sender-icon"
                  style={{
                    backgroundColor: message.isLMCC ? '#333333' : '#0078D4'
                  }}
                >
                  {message.sender.charAt(0)}
                </div>
                <div className="message-content">
                  <div className="message-sender">{message.sender}</div>
                  {renderMessageContent(message)}
                  <div className="message-time">{message.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="message-input-container">
            <div className="action-buttons">
              <button type="button" className="action-button" title="Voice message">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 14c0 3.31 2.69 6 6 6s6-2.69 6-6v-4c0-3.31-2.69-6-6-6s-6 2.69-6 6v4zm6-9.5c2.48 0 4.5 2.02 4.5 4.5v4c0 2.48-2.02 4.5-4.5 4.5s-4.5-2.02-4.5-4.5v-4c0-2.48 2.02-4.5 4.5-4.5z" fill="currentColor" />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                type="button"
                className="action-button"
                title="Add file"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor" />
                </svg>
              </button>
              <button type="button" className="action-button" title="Add emoji">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7zm8-4c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-6 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" fill="currentColor" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${selectedContact?.name || 'Astronaut'}`}
              className="message-input"
            />
            <button type="submit" className="send-button" title="Send message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.5 15.8333L17.5 10L2.5 4.16667V8.33333L12.5 10L2.5 11.6667V15.8333Z" fill="currentColor" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Messages;