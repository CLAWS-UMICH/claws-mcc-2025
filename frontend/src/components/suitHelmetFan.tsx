import React from "react";
import "../styles/suitHelmetFan.css";
import { fans } from "../../public/fans/";
import fanIcon from "../../public/mode_fan.png";

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

function SuitHelmetFan({ fanPriRpm, fanSecRpm }) {
  return (
    <div className="suit-helmet-fan-container">
      <h3 className="suit-helmet-fan-title">Suit Helmet Fan</h3>
      <div className="suit-helmet-fan">
        <div className="fan-info">
          <div className="flex-container">
            <div className="flex-item">
              <div className="fan-data">
                <div className="label-with-icon">
                  <div className="icon-container">
                    <img
                      src={fanIcon}
                      alt="Fan Icon"
                      className="fan-label-icon"
                    />
                  </div>
                  <div className="text-container">
                    <p>Primary</p>
                  </div>
                </div>
                <img
                  src={fans[getImageIndex(fanPriRpm)]}
                  alt="Primary Fan"
                  className="fan-image"
                />
                <p className="rpm-value">{fanPriRpm} RPM</p>
              </div>
            </div>
            <div className="separator"></div>
            <div className="flex-item">
              <div className="fan-data">
                <div className="label-with-icon">
                  <div className="icon-container">
                    <img
                      src={fanIcon}
                      alt="Fan Icon"
                      className="fan-label-icon"
                    />
                  </div>
                  <div className="text-container">
                    <p>Secondary</p>
                  </div>
                </div>
                <img
                  src={fans[getImageIndex(fanSecRpm)]}
                  alt="Secondary Fan"
                  className="fan-image"
                />
                <p className="rpm-value">{fanSecRpm} RPM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuitHelmetFan;