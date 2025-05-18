import React, {useEffect} from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Messages from './pages/Messages';
import Vitals from './pages/vitals/Vitals';
import Navigation from './pages/Navigation';
import MainLayout from './components/MainLayout';

function App() {
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(document.location.origin + '/');

    // Join the VITALS room on connection
    socket.on("connect", () => {
      console.log("Connected to server");

      // Join VITALS room
      socket.emit("join_room", { room: "VITALS" });
    });

    // Listen for messages sent to the VITALS room
    socket.on('room_data', (data) => { // data is read in as json obj
      console.log('Message received in VITALS room:', data);
      // Handle the data received, like updating state or UI
    });

    // Clean up connection on component unmount
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
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;