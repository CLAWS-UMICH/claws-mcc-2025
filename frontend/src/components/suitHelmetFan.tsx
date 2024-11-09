import React from "react";
import "../styles/suitHelmetFan.css";
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
