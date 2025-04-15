import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import NotificationPanel from './components/Notification/NotificationPanel';
import NotificationButton from './components/Notification/NotificationButton';
import NotificationGenerator from './components/TestNotificationButton/NotificationGenerator';
import { 
  Notification, 
  NotificationSeverity, 
  NotificationType, 
  NotificationPersistence 
} from './types/notifications';

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

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
      // Convert socket data to our notification format
      const socketNotification: Notification = {
        id: Date.now(),
        category: 'Vitals',
        message: data.message,
        timestamp: new Date(),
        severity: NotificationSeverity.ALERT, // Default to ALERT for socket notifications
        type: NotificationType.PASSIVE,
        persistence: NotificationPersistence.PERSISTENT,
        isUnread: true,
      };
      handleNewNotification(socketNotification);
    });

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      socket.disconnect();
    };
  }, []);
  
  const handleNewNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    // Auto-show panel for emergency notifications
    if (notification.severity === NotificationSeverity.EMERGENCY) {
      setShowPanel(true);
    }
  };

  const hasUnreadNotifications = notifications.some(n => n.isUnread);
  // "Mark all as read" logic
  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isUnread: false }))
    );
  };

  return (
    <div className="app">
      <NotificationButton 
        onClick={() => setShowPanel(true)}
        hasUnread={hasUnreadNotifications}
      />
      {showPanel && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowPanel(false)}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
      <NotificationGenerator 
        onNotificationCreate={handleNewNotification}
      />
    </div>
  );
}

export default App;
