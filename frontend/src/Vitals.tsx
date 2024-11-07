import './Vitals.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

import SuitAtmosphere from './components/suitAtmosphere';
import SuitResources from './components/SuitResources';

function Vitals() {
  const [suitData, setSuitData] = useState({
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
  });

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
  suitData: PropTypes.instanceOf(Array).isRequired,
};