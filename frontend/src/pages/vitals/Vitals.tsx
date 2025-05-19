import './Vitals.css';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/ToastStyles.css';

import SuitAtmosphere from './SuitAtmosphere';
import SuitResources from './suitResources';

const Vitals = () => {
  const [suitData, setSuitDataState] = useState<SuitData>();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io("http://localhost:8080");
    const socket = socketRef.current;

    // Join TSS room when component mounts
    socket.emit('join_tss_room');

    // Set up event listeners
    socket.on('join_response', (response) => {
      console.log(`Joined room: ${response.room}`);
    });

    socket.on('leave_response', (response) => {
      console.log(`Left room: ${response.room}`);
    });

    // handle incoming telemetry
    socket.on('tss_update', (data: any) => {
      console.log('TSS Update:', data);
      const telemetry = data.telemetry;
      // pick the EVA you want (here, eva1) and merge eva_time
      const payload = {
        ...telemetry.eva1,
        eva_time: telemetry.eva_time,
        // if your backend later includes alerts you can merge them here:
        alerts: telemetry.eva1.alerts ?? { AllAlerts: [] },
      };
      setSuitDataState(payload);
    });

    return () => {
      if (socket) {
        socket.emit('leave_tss_room');
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (suitData) {
      // const printAlerts: Record<string, string> = {
      //   batt_time_left: 'Battery Time Left',
      //   oxy_pri_storage: 'Primary Oxygen Storage',
      //   // …etc
      // };
      // suitData.alerts.AllAlerts.forEach(alert => {
      //   toast.error(
      //     <div>
      //       <div className="toast-header">
      //         <span className="toast-icon">⚠️</span>
      //         <span className="toast-text">
      //           Time Left for {printAlerts[alert.vital] ?? alert.vital} is Low
      //         </span>
      //       </div>
      //     </div>,
      //     {
      //       className: 'custom-toast',
      //       closeButton: true,
      //       autoClose: 5000,
      //       hideProgressBar: true,
      //       position: 'top-right',
      //     }
      //   );
      // });
    }
  }, [suitData]);

  if (!suitData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vitals-container">
      <ToastContainer />
      <div className="main-content">
        <div className="column middle_column">
          <SuitResources data={suitData} />
        </div>
        <div className="column right_column">
          <SuitAtmosphere suitData={suitData} />
        </div>
      </div>
    </div>
  );
};

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