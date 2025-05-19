import React, {useEffect} from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Import components
import Messaging from './pages/Messaging';
import Dashboard from './pages/Dashboard';
import Navigation from './pages/Nav/Nav';
import VideoStream from './pages/VideoStream';
import Vitals from './pages/vitals/Vitals.tsx'

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
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/video-stream" element={<VideoStream />} />
        <Route path="/video-stream" element={<VideoStream />} />
        <Route path="/video-stream" element={<VideoStream />} />
      </Routes>
    </Router>
  );
}

export default App;