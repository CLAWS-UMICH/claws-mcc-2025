import React from 'react';
import "../styles/suitCO2ScrubberStorage.css";
const ScrubberDisplay = ({ label, percentage, min = 20, max = 100 }) => {
  return (
    <div className="scrubber-display">
      <p>{label}</p>
      <div className="scrubber-content">
        <div className="meter-container">
          <div className="meter-fill" style={{ height: `${percentage}%` }} />
          <span className="meter-value" style={{ top: '-20px' }}>{max}</span>
          <span className="meter-value" style={{ bottom: '-20px' }}>{min}</span>
        </div>
        <span className="percentage">{percentage}%</span>
      </div>
    </div>
  );
};

const SuitCO2ScrubberStorage = ({scrubberA, scrubberB}) => {
  return (
    <div className="scrubber-container">
      <h3 className="scrubber-title">Suit CO2 Scrubber Storage</h3>
      <div className="scrubber-card">
        <div className="scrubber-content">
          <ScrubberDisplay label="Scrubber A" percentage={scrubberA} />
          <div className="separator" />
          <ScrubberDisplay label="Scrubber B" percentage={scrubberB}/>
        </div>
      </div>
    </div>
  );
};

export default SuitCO2ScrubberStorage;
