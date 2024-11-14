import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import BackendDemo from './pages/BackendDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BackendDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
