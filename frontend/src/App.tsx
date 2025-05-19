import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Messages from './pages/Messages';
import Vitals from './pages/vitals/Vitals';
import Navigation from './pages/Navigation';
import Nav from './pages/Nav/Nav';
import MainLayout from './components/MainLayout';

function App() {
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(document.location.origin + '/');

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("join_room", { room: "VITALS" });
    });

    socket.on('room_data', (data) => {
      console.log('Message received in VITALS room:', data);
    });

    return () => {
      socket.emit("leave_room", { room: "VITALS" });
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div style={{ 
        backgroundColor: '#121212', 
        color: 'white', 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navigation />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/vitals" replace />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/nav" element={<Nav />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;