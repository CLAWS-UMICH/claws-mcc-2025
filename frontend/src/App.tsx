import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import NotificationsSettings from './components/NotificationsSettings';
import SettingsButton from './components/SettingsButton';
import NotificationsButton from './components/NotificationsButton';
import NotificationsPanel from './components/NotificationsPanel';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:8080');

    // Join the VITALS room on connection
    socket.on('connect', () => {
      console.log('Connected to server');

      // Join VITALS room
      socket.emit('join_room', { room: 'VITALS' });
    });

    // Listen for messages sent to the VITALS room
    socket.on('room_data', (data) => {
      console.log('Message received in VITALS room:', data);
      // When receiving a notification, set hasUnreadNotifications to true
      setHasUnreadNotifications(true);
    });

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <NotificationsButton 
        onClick={() => setIsNotificationsOpen(true)}
        hasUnread={hasUnreadNotifications}
      />
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      <NotificationsPanel 
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          setHasUnreadNotifications(false);
        }}
      />
      <NotificationsSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
