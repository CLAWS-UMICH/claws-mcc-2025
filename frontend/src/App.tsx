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
import PRScreen from './pages/PRScreen/PRScreen';

function App() {

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
            <Route path="/pr" element={<PRScreen />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;