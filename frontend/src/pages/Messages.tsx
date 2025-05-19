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
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  initials?: string;
  color?: string;
  messages: Message[];
}

const socket: Socket = io("http://localhost:8080");

const getSenderColor = (sender: string) => {
  if (sender === "LMCC") return "#A74109"; 
  if (sender === "EV1") return "#0078D4";
  if (sender === "EV2") return "#009688";
  if (sender === "PR") return "#333333";
  return "#333333";
};

const Messages = () => {
  // We define our "Contacts" so that ID 1 => EV1, ID 2 => EV2, ID 3 => PR
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "EV1",
      lastMessage: "",
      timestamp: "",
      initials: "E1",
      color: "#0078D4",
      messages: [],
    },
    {
      id: 2,
      name: "EV2",
      lastMessage: "",
      timestamp: "",
      initials: "E2",
      color: "#009688",
      messages: [],
    },
    {
      id: 3,
      name: "PR",
      lastMessage: "",
      timestamp: "",
      initials: "PR",
      color: "#333333",
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
    console.log("Joined MESSAGING room");

    // When a new message arrives from the server:
    socket.on("room_data", (data: any) => {
      console.log('Received room_data:', data);
      if (!data || !data.data) {
        console.error('Invalid message format:', data);
        return;
      }

      setContacts(prevContacts =>
        prevContacts.map(contact => {
          const messageData = data.data;
          if (contact.id === messageData.sent_to) {
            console.log(`Updating contact ${contact.id} with new message:`, messageData);
            const date = new Date();
            const shortTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            const newMsg: Message = {
              id: contact.messages.length + 1,
              sender: idToSenderName(messageData.from),
              content: messageData.message,
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

    return () => {
      socket.emit('leave_room', { room: 'MESSAGING' });
      socket.off("room_data");
      console.log("Cleanup: left room and removed listeners");
    };
  }, []);

  // Helper to map numeric 'from' IDs to a name, so the chat shows "EV1" etc.
  const idToSenderName = (fromId: number) => {
    if (fromId === 1) return "EV1";
    if (fromId === 2) return "EV2";
    if (fromId === 3) return "PR";
    if (fromId === 4) return "LMCC";
    return "Unknown";
  };

  // When user clicks a contact in the sidebar
  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
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
      const dataToSend = {
        client: selectedContact.id === 3 ? 'pr_client' : `hololens_${selectedContact.id}`,
        room: 'MESSAGING',
        data: {
          message_id: selectedContact.messages.length,
          sent_to: selectedContact.id,
          message: newMessage.trim(),
          from: 4  // 4 == LMCC
        }
      };

      // Use the same event names as messaging.tsx
      const eventName = selectedContact.id === 3 ? 'send_to_pr' : 'send_to_hololens';
      socket.emit(eventName, JSON.stringify(dataToSend));
      
      // Update local state with the sent message
      const date = new Date();
      const shortTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      
      setContacts(prevContacts =>
        prevContacts.map(contact => {
          if (contact.id === selectedContact.id) {
            const newMsg: Message = {
              id: contact.messages.length + 1,
              sender: "LMCC",
              content: newMessage.trim(),
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
              const isSentByMe = message.sender === "LMCC";
              const isEmoji = emojis.includes(message.content); // Check if message is an emoji

              return (
                <div key={message.id} className={`chat-message ${isSentByMe ? 'sent' : ''}`}>
                  <div className="message-sender-icon" style={{ backgroundColor: senderColor }}>
                    {message.sender.charAt(0)}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <div className="message-sender">{message.sender}</div>
                      <div className="message-time">{message.timestamp}</div>
                    </div>
                    <div className={`message-text ${isEmoji ? 'emoji-message' : ''}`}>
                      {message.content}
                    </div>
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
                       .45-1 1 .45 
                       1 1 1zM-6 0c.55 0 
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
                    <span 
                      key={e} 
                      style={{ cursor: "pointer", fontSize: "18px" }}
                      onClick={() => {
                        if (!selectedContact) return;
                        
                        const dataToSend = {
                          client: selectedContact.id === 3 ? 'pr_client' : `hololens_${selectedContact.id}`,
                          room: 'MESSAGING',
                          data: {
                            message_id: selectedContact.messages.length,
                            sent_to: selectedContact.id,
                            message: e,
                            from: 4  // 4 == LMCC
                          }
                        };

                        // Use the same event names as messaging.tsx
                        const eventName = selectedContact.id === 3 ? 'send_to_pr' : 'send_to_hololens';
                        socket.emit(eventName, JSON.stringify(dataToSend));
                        
                        // Update local state with the sent emoji
                        const date = new Date();
                        const shortTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                        
                        setContacts(prevContacts =>
                          prevContacts.map(contact => {
                            if (contact.id === selectedContact.id) {
                              const newMsg: Message = {
                                id: contact.messages.length + 1,
                                sender: "LMCC",
                                content: e,
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
