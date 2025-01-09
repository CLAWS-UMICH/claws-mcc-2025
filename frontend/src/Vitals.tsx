import './Vitals.css';
// import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import SuitAtmosphere from './components/vitals/SuitAtmosphere.tsx';
import SuitResources from './components/vitals/suitResources.tsx';
import SuitHelmetFan from './components/vitals/suitHelmetFan.tsx';
import SuitCO2ScrubberStorage from './components/vitals/suitCO2ScrubberStorage.tsx';
import SuitTemperature from './components/vitals/SuitTemperature.tsx';
import Dcu from './components/vitals/DCU.tsx';

const Vitals = ({}) => {
  const [suitData, setSuitDataState] = useState<SuitData>();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://localhost:8080');

    // Join the VITALS room on connection
    socket.on('connect', () => {
      console.log('Connected to server');

      // Join VITALS room
      socket.emit('join_room', { room: 'VITALS' });
      setSocket(socket);
    });

    // Listen for messages sent to the VITALS room
    socket.on('room_data', (data: any) => {
      console.log('Message received in VITALS room:', data);
      setSuitDataState(data.data);
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
    <div className="vitals-container">
      <div className="top-bar">
        <div className="time"></div>
        {/* INSERT NAV BAR */}
      </div>
      <div className="main-content">

        <div className="column left-column">
          <div className="user-section">
            <div className="avatar s">S</div>
            <div className="user-info">
              <span>Name 1</span>
              <span className="location">Location 1</span>
            </div>
          </div>
          <div className="camera-feed">
            {/* Camera feed placeholder */}
          </div>
          
          <div className="user-section">
            <div className="avatar a">A</div>
            <div className="user-info">
              <span>Name 2</span>
              <span className="location">Location 2</span>
            </div>
          </div>
          <div className="camera-feed">
            {/* Camera feed placeholder */}
          </div>
        </div>

        <div className="column middle_column">
          <SuitResources data={suitData} />
        </div>

        <div className="column right_column">
          <SuitAtmosphere suitData={suitData}/>
          <div className="flex-container">
          <div className="flex-item">
              {/* <SuitHelmetFan fanPriRpm={suitData.fan_pri_rpm} fanSecRpm={suitData.fan_sec_rpm} /> */}
            </div>
            <div className="flex-item">
              {/* <SuitCO2ScrubberStorage scrubberA={suitData.scrubber_a_co2_storage} scrubberB={suitData.scrubber_b_co2_storage} /> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="App-content">
        {socket ?
          <button onClick={() => {
            console.log('Button clicked');
            socket.emit('send_to_room', {room: 'VITALS'})}}>
              Button to send to room</button>
          :
          <div>Socket not connected</div>
          }
      </div> */}
    </div>
  );
}

export default Vitals;

export type Alert = {
  alert_id: number;
  vital: string;
  vital_val: number;
};

export type Alerts = {
  AllAlerts: Alert[];
};

export type SuitData = {
  eva_time: number,
  batt_time_left: number,
  oxy_pri_storage: number,
  oxy_sec_storage: number,
  oxy_pri_pressure: number,
  oxy_sec_pressure: number,
  oxy_time_left: number,
  coolant_storage: number,
  heart_rate: number,
  oxy_consumption: number,
  co2_production: number,
  suit_pressure_oxy: number,
  suit_pressure_co2: number,
  suit_pressure_other: number,
  suit_pressure_total: number,
  helmet_pressure_co2: number,
  fan_pri_rpm: number,
  fan_sec_rpm: number,
  scrubber_a_co2_storage: number,
  scrubber_b_co2_storage: number,
  temperature: number,
  coolant_liquid_pressure: number,
  coolant_gas_pressure: number,
  alerts: Alerts,
}
