import './Vitals.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import SuitAtmosphere from './components/suitAtmosphere';
import SuitResources from './components/suitResources';

// interface VitalsProps {
//   data: {
//     batt_time_left: number;
//     oxy_pri_stroage: number;
//     oxy_sec_storage: number;
//     oxy_pri_pressure: number;
//     oxy_sec_pressure: number;
//     oxy_time_left: number;
//     coolant_storage: number;
//     heart_rate: number;
//     oxy_consumption: number;
//     co2_production: number;
//     suit_pressure_oxy: number;
//     suit_pressure_co2: number;
//     suit_pressure_other: number;
//     suit_pressure_total: number;
//     helmet_pressure_co2: number;
//     fan_pri_rpm: number;
//     fan_sec_rpm: number;
//     scrubber_a_co2_storage: number;
//     scrubber_b_co2_storage: number;
//     temperature: number;
//     coolant_liquid_pressure: number;
//     coolant_gas_pressure: number;
//   };
//   setSuitData: (data: any) => void;
// }

function Vitals({ data, setSuitData }:any) { 
  const [suitData, setSuitDataState] = useState({});

  useEffect(() => {
    if (data) {
      setSuitDataState(data);  // Update local state with new data
      setSuitData(data); // calls the setVitalsData function in App.tsx, updates state in App.tsx
    }
  }, [data, setSuitData]);

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

Vitals.propTypes = {
  data: PropTypes.object,
  setSuitData: PropTypes.func.isRequired,
};