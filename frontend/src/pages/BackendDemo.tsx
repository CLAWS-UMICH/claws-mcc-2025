import React, { useState, useEffect } from 'react';
import useSubscribe from '../hooks/useSubscribe';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080'); // Replace with your server URL

const BackendDemo: React.FC = () => {
  // State for the number to be displayed
  const [number, setNumber] = useState<number>(0);

  // State for data from backend (optional, depending on backend setup)
  const [backendDemoStream] = useSubscribe('DEMO');

  // Function to increment the number
  const incrementNumber = () => {
    const newNumber = number + 1;
    setNumber(newNumber);
  };

  const emitEventOne = () => {
    const message = JSON.stringify({
        type: "TEST",
        use: "PUT",
        data: { num: number }
    });
    console.log(`Sending Number ${number} to Astronaut 0`);
    socket.emit('send_to_hololens', {
      room: 'hololens_0',
      data: message
    });
  };

  const emitEventTwo = () => {
    const message = JSON.stringify({
        type: "TEST",
        use: "PUT",
        data: { num: number }
    });
    console.log(`Sending Number ${number} to Astronaut 1`);
    socket.emit('send_to_hololens', {
      room: 'hololens_1',
      data: message
    });
  };

  return (
    <div>
      <h1>Current Demo</h1>

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
