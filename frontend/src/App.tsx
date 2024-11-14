import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import './Vitals.css';
import Vitals from './Vitals';

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
    socket.on('room_data', (data:any) => { // data is read in as json obj
      console.log('Message received in VITALS room:', data);
      // Handle the data received, like updating state or UI
    });

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <Vitals />
    </div>
  );
}

export default App;
