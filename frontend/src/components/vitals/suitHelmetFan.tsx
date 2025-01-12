import React from "react";
import "../../styles/suitHelmetFan.css";
import fanIcon from "../../../public/mode_fan.png";
import '../../styles/SuitAtmosphere.css';

const getImageIndex = (rpm) => {
  const minRPM = 20000;
  const maxRPM = 30000;
  const imageCount = 7;

  const clampedRPM = Math.max(minRPM, Math.min(maxRPM, rpm));
  return Math.round(((clampedRPM - minRPM) / (maxRPM - minRPM)) * imageCount);
};

function SuitHelmetFan({ fanPriRpm, fanSecRpm }) {
  return (
    <div className="suit-helmet-fan-container">
      <div className="suit-helmet-fan">
        <div className="fan-info">
          <div className="flex-container">
            <FanDisplay label="Primary" rpm={fanPriRpm} />
            <div className="separator"></div>
            <FanDisplay label="Secondary" rpm={fanSecRpm} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FanDisplay({ label, rpm }) {
  return (
    <div className="flex-item">
      <div className="fan-data">
        <div className="fan-label">
          <img src={fanIcon} alt="Fan Icon" className="fan-icon" />
          <span>{label}</span>
        </div>
        <FanBars rpm={rpm} />
      </div>
      <span className="label">{rpm.toLocaleString()} </span>
      <span className="unit">RPM</span>
    </div>
  );
}


function FanBars({ rpm }) {
  const activeIndex = getImageIndex(rpm); // Calculate the active bars based on RPM
  const barColors = Array.from({ length: 7 }, (_, i) =>
    i < activeIndex ? "#575FFF" : "#4F4F4F"
  );

  //return blue bars
  return (
    <svg
      width="88"
      height="28"
      viewBox="0 0 88 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="24" width="8" height="4" fill={barColors[0]} />
      <rect x="12" y="20" width="8" height="8" fill={barColors[1]} />
      <rect x="24" y="16" width="8" height="12" fill={barColors[2]} />
      <rect x="36" y="12" width="8" height="16" fill={barColors[3]} />
      <rect x="48" y="8" width="8" height="20" fill={barColors[4]} />
      <rect x="60" y="4" width="8" height="24" fill={barColors[5]} />
      <rect x="72" width="8" height="28" fill={barColors[6]} />
    </svg>
  );
}

export default SuitHelmetFan;
