import './Vitals.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import SuitAtmosphere from './components/suitAtmosphere';
import SuitResources from './components/suitResources';

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