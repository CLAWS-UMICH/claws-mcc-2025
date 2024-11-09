import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import './Vitals.css';
import Vitals from './Vitals';

// Mock data
const mockData = {
  batt_time_left: 5632,
  oxy_pri_stroage: 42,
  oxy_sec_storage: 100,
  oxy_pri_pressure: 1200,
  oxy_sec_pressure: 3000,
  oxy_time_left: 5687,
  coolant_storage: 100,
  heart_rate: 87,
  oxy_consumption: 0.09,
  co2_production: 0.12,
  suit_pressure_oxy: 4.0,
  suit_pressure_co2: 0.0,
  suit_pressure_other: 0.0,
  suit_pressure_total: 4.0,
  helmet_pressure_co2: 0.1,
  fan_pri_rpm: 30000,
  fan_sec_rpm: 30000,
  scrubber_a_co2_storage: 32,
  scrubber_b_co2_storage: 0,
  temperature: 70,
  coolant_liquid_pressure: 400,
  coolant_gas_pressure: 0
};

function App() {
  const [vitalsData, setVitalsData] = useState(mockData);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:8080');

    // Join the VITALS room on connection
    socket.on('connect', () => {
      console.log('Connected to server');

      // Join VITALS room
      socket.emit('join_room', { room: 'VITALS' });
    });

    // Listen for messages sent to the VITALS room
    socket.on('room_data', (data:any) => { // data is read in as json obj
      console.log('Message received in VITALS room:', data);
      // Handle the data received, like updating state or UI
      setVitalsData(data);
    });

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <Vitals data={vitalsData} setSuitData={setVitalsData} /> {/* passing props to vitals component */}
    </div>
  );
}

export default App;
