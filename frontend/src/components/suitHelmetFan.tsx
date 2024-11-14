import React from "react";
import "../styles/suitHelmetFan.css";
import {fan0, fan1, fan2, fan3, fan4, fan5, fan6, fan7} from '../../public/fans';

const getFilledSegments = (rpm: number) => {
  const minRPM = 20000;
  const maxRPM = 30000;
  const segmentCount = 7;
  
  // Clamp RPM between minRPM and maxRPM to ensure correct calculation
  const clampedRPM = Math.max(minRPM, Math.min(maxRPM, rpm));
  
  // Calculate the percentage of RPM relative to the 20k–30k range
  const percentage = ((clampedRPM - minRPM) / (maxRPM - minRPM)) * 100;

  // Map the percentage to the number of filled segments (out of 7)
  return Math.round((percentage / 100) * segmentCount);
};

function SuitHelmetFan({ fanPriRpm, fanSecRpm }) {
  return (
    <div className="suit-helmet-fan-title">
      <h3>Suit Helmet Fan</h3>
      <div className="suit-helmet-fan">
        <div className="fan-info">
          <div className="flex-container">
            <div className="flex-item">
              <div className="fan-data">
                <p>Primary</p>
                <div
                  className="rpm-bar primary"
                  style={{ width: `${fanPriRpm / 300}%` }}
                ></div>
                <p>{fanPriRpm} RPM</p>
              </div>
            </div>
            <div className="flex-item">
              <div className="fan-data">
                <p>Secondary</p>
                <div
                  className="rpm-bar secondary"
                  style={{ width: `${fanSecRpm / 300}%` }}
                ></div>
                <p>{fanSecRpm} RPM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuitHelmetFan;
