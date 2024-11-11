import './Vitals.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import SuitAtmosphere from './components/suitAtmosphere';
import SuitResources from './components/suitResources';

function Vitals() {
  const [suitData, setSuitDataState] = useState();

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
    socket.on('room_data', (data: any) => {
      console.log('Message received in VITALS room:', data);
      setSuitDataState(data);
    });

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      socket.disconnect();
    };
  }, []);

  if (!suitData) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <div className="column left_column">
        {/* Live Camera Feed*/}
      </div>
      <div className="column middle_column">
      <SuitResources data={suitData} />
      </div>
      <div className="column right_column">
        <SuitAtmosphere suitData={suitData}/>
      </div>
      <div className="App-content">
      </div>
    </div>
  );
}

export default Vitals;
