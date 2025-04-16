import SendScreens from './pages/SendScreens.tsx'
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav/Nav.tsx';
import Vitals from './components/vitals/Vitals.tsx';
import BackendDemo from './pages/BackendDemo';
import './App.css';
import './components/vitals/Vitals.css';
import Messaging from './pages/messaging.tsx'; // Adjust the path as needed

function App() {
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(document.location.origin + '/');

    // Join the VITALS room on connection
    socket.on('connect', () => {
      console.log('Connected to server');

      // Join VITALS room
      socket.emit('join_room', { room: 'VITALS' });
  

    });

    // Listen for messages sent to the rooms
    socket.on('room_data', (data) => { // data is read in as json obj
      const room = data.room;
      console.log(`Message received in room ${room}:`, data);
    });

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      //socket.emit('leave_room', { room: 'MESSAGING' });
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<BackendDemo />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/sendscreens" element={<SendScreens />} />
          <Route path="/nav" element={<Nav />} />
          <Route path="/messaging" element={<Messaging />} />"
        </Routes>
      </Router>
    </>
  );
}

export default App;
