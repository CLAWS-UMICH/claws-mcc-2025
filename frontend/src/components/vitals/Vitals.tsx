import './Vitals.css';
// import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/ToastStyles.css';

import SuitAtmosphere from './SuitAtmosphere.tsx';
import SuitResources from './suitResources.tsx';

const Vitals = ({ }) => {
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
    console.log("suit data", suitData);

    // Clean up connection on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VITALS' });
      socket.disconnect();
    };

  }, []);

  useEffect(() => {
    const printAlerts = {
      'batt_time_left': 'Battery Time Left',
      'oxy_pri_storage': 'Primary Oxygen Storage',
      'oxy_sec_storage': 'Secondary Oxygen Storage',
      'oxy_pri_pressure': 'Primary Oxygen Pressure',
      'oxy_sec_pressure': 'Secondary Oxygen Pressure',
      'oxy_time_left': 'Oxygen Time Left',
      'coolant_storage': 'Coolant Storage',
      'heart_rate': 'Heart Rate',
      'oxy_consumption': 'Oxygen Consumption',
      'co2_production': 'CO2 Production',
      'suit_pressure_oxy': 'Suit Pressure Oxygen',
      'suit_pressure_co2': 'Suit Pressure CO2',
      'suit_pressure_other': 'Suit Pressure Other',
      'suit_pressure_total': 'Suit Pressure Total',
      'helmet_pressure_co2': 'Helmet Pressure CO2',
      'fan_pri_rpm': 'Primary Fan RPM',
      'fan_sec_rpm': 'Secondary Fan RPM',
      'scrubber_a_co2_storage': 'Scrubber A CO2 Storage',
      'scrubber_b_co2_storage': 'Scrubber B CO2 Storage',
      'temperature': 'Temperature',
      'coolant_liquid_pressure': 'Coolant Liquid Pressure',
      'coolant_gas_pressure': 'Coolant Gas Pressure',
    }

    if (suitData) {
      const alerts = suitData.alerts.AllAlerts;
      // Rest of the code...
      alerts.forEach((alert) => {
        toast.error(
          <div>
            <div className="toast-header">
              <span className="toast-icon">⚠️</span>
              <span className="toast-text">Time Left for {printAlerts[alert.vital]} is Low</span>
            </div>
            <div className="toast-body">
            </div>
          </div>,
          {
            className: 'custom-toast',
            closeButton: true,
            autoClose: 5000,
            hideProgressBar: true,
            position: 'top-right',
          }
        );
      });
    }
  }, [suitData]);

  if (!suitData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vitals-container">
      <div className='main-content'>
        <div className="column middle_column">
          <SuitResources data={suitData} />
        </div>

        <div className="column right_column">
          <SuitAtmosphere suitData={suitData} />
        </div>
      </div>
      {/* <ToastContainer /> */}
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