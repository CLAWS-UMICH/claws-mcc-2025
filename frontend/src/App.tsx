import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Import components
import Messaging from './pages/Messaging';
import Dashboard from './pages/Dashboard';
import Navigation from './pages/Nav/Nav';
import VideoStream from './pages/VideoStream';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/video-stream" element={<VideoStream />} />
      </Routes>
    </Router>
  );
}

export default App;