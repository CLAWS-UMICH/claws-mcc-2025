import SendScreens from './pages/SendScreens.tsx'
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Vitals from './components/vitals/Vitals.tsx';
import BackendDemo from './pages/BackendDemo';
import PRScreen from './pages/PRScreen';
import './App.css';
import './components/vitals/Vitals.css';

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

    // Listen for messages sent to the VITALS room
    socket.on('room_data', (data) => { // data is read in as json obj
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
    <>
      <Router>
        <Routes>
          <Route path="/" element={<BackendDemo />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/sendscreens" element={<SendScreens />} />
          <Route path="/prscreen" element={<PRScreen />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
