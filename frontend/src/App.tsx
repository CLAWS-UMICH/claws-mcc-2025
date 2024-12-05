import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import BackendDemo from './pages/BackendDemo';
import TaskList from './components/tasklist/Tasklist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
      </Routes>
    </Router>
  );
}

export default App;
