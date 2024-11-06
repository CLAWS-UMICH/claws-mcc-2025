import React, { useState, useEffect } from 'react';
import useSubscribe from '../hooks/useSubscribe';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080'); // Replace with your server URL

const BackendDemo: React.FC = () => {
  // State for the number to be displayed
  const [number, setNumber] = useState<number>(0);

  // State for data from backend (optional, depending on backend setup)
  const [backendDemoStream] = useSubscribe('DEMO');

  // Load the initial number from the API on component mount
  useEffect(() => {
    const fetchNumber = async () => {
      const response = await fetch('http://localhost:8080/api/number');
      const data = await response.json();
      setNumber(data.number);  // Initialize the number from the API
    };

    fetchNumber();
  }, []);

  // Function to increment the number
  const incrementNumber = () => {
    const newNumber = number + 1;
    setNumber(newNumber);
    updateNumberInDatabase(newNumber);  // Save to database
  };

  // Function to save the number to the database
  const updateNumberInDatabase = async (newNumber: number) => {
    await fetch('http://localhost:8080/api/number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ number: newNumber })
    });
  };

  const emitEventOne = () => {
    const message = JSON.stringify({ number: number });
    console.log(`Sending Number ${number} to Astronaut 1`);
    socket.emit('send_to_room', {
      room: 'hololens_1',
      message: message
    });
  };

  const emitEventTwo = () => {
    const message = JSON.stringify({ number: number });
    console.log(`Sending Number ${number} to Astronaut 2`);
    socket.emit('send_to_room', {
      room: 'hololens_2',
      message: message
    });
  };

  return (
    <div>
      <h1>Backend Demo</h1>

      {/* Display the current number */}
      <div>
        <h2>Number: {number}</h2>
      </div>

      {/* Button to increment the number */}
      <button onClick={incrementNumber}>Increase Number</button>

      {/* Buttons for the emit functions */}
      <button onClick={emitEventOne}>Send Number to Astronaut 0</button>
      <button onClick={emitEventTwo}>Send Number to Astronaut 1</button>
    </div>
  );
};

export default BackendDemo;
