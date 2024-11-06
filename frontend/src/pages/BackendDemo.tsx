import React, { useState } from 'react';
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
    setNumber(number + 1);
  };

  const emitEventOne = () => {
    const message = JSON.stringify({ number: number }); // Use current number value
    console.log(`Sending Number ${number} to Astronaut 1`);

    // Emit to room "hololens_1" with message containing the number
    socket.emit('send_to_room', {
      room: 'hololens_1',
      message: message
    });
  };

  const emitEventTwo = () => {
    const message = JSON.stringify({ number: number }); // Use current number value
    console.log(`Sending Number ${number} to Astronaut 2`);

    // Emit to room "hololens_2" with message containing the number
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
      <button onClick={emitEventOne}>Send Number to Astronaut 1</button>
      <button onClick={emitEventTwo}>Send Number to Astronaut 2</button>
    </div>
  );
};

export default BackendDemo;
