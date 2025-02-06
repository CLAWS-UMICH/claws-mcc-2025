import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import BackendDemo from './pages/BackendDemo';
import TaskList from './components/tasklist/Tasklist';
import Messages from './pages/Messages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path ="/" element={<a href="http://localhost:5173/messages/">Click here to go to the Messages page</a>} />
        <Route path="/messages/" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;
