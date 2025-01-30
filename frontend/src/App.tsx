import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import GeosampleManager from './components/geosamples/Geosamples';
import GeosampleMap from './components/geosamples/GeosampleMap';

function App() {
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
    });

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      socket.disconnect();
    };
  }, []);

  return <GeosampleManager />;
}

export default App;
