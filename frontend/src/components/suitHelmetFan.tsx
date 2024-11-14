import React from "react";
import "../styles/suitHelmetFan.css";
import { fan0, fan1, fan2, fan3, fan4, fan5, fan6, fan7 } from '../../public/fans';

// Function to map RPM to image index (0 to 7)
const getImageIndex = (rpm) => {
  const minRPM = 20000;
  const maxRPM = 30000;
  const imageCount = 7; // Total image count from 0 to 7

  // Clamp RPM between minRPM and maxRPM
  const clampedRPM = Math.max(minRPM, Math.min(maxRPM, rpm));
  
  // Calculate the image index based on RPM
  return Math.round(((clampedRPM - minRPM) / (maxRPM - minRPM)) * imageCount);
};

// Array of fan images for easier lookup
const fanImages = [fan0, fan1, fan2, fan3, fan4, fan5, fan6, fan7];

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
                {/* Display the image based on the RPM */}
                <img
                  src={fanImages[getImageIndex(fanPriRpm)]}
                  alt="Primary Fan"
                  className="fan-image"
                />
                <p>{fanPriRpm} RPM</p>
              </div>
            </div>
            <div className="flex-item">
              <div className="fan-data">
                <p>Secondary</p>
                {/* Display the image based on the RPM */}
                <img
                  src={fanImages[getImageIndex(fanSecRpm)]}
                  alt="Secondary Fan"
                  className="fan-image"
                />
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
