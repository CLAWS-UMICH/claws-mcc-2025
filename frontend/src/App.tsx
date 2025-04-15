import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import NotificationPanel from './components/Notification/NotificationPanel';
import { Notification } from './components/Notification/NotificationPanel';
import NotificationsSettings from './components/Notification/NotificationsSettings';

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(true);

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
      // Handle the data received, like updating state or UI

      const newNotification: Notification = {
        id: Date.now(),
        category: 'Vitals',
        message: data.message,
        isUnread: true,
      };
      setNotifications((prev) => [...prev, newNotification]);
    });

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      socket.disconnect();
    };
  }, []);

  // "Mark all as read" logic
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isUnread: false }))
    );
  };

  return (
    <div className="app">
      {showPanel && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowPanel(false)}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
}

export default App;
