import React from "react";
import "../styles/suitCO2ScrubberStorage.css";
function SuitCO2ScrubberStorage({ scrubberA, scrubberB }) {
  return (
    <div className="suit-co2-scrubber-storage-title">
      <h3>Suit CO2 Scrubber Storage</h3>
      <div className="suit-co2-scrubber-storage">
        <div className="scrubber-info">
          <div className="flex-container">
            <div className="flex-item">
              <div className="scrubber">
                <p>Scrubber A</p>
                <div
                  className="scrubber-bar"
                  style={{ width: `${scrubberA}%` }}
                ></div>
                <p>{scrubberA}%</p>
              </div>
            </div>
            <div className="flex-item">
              <div className="scrubber">
                <p>Scrubber B</p>
                <div
                  className="scrubber-bar"
                  style={{ width: `${scrubberB}%` }}
                ></div>
                <p>{scrubberB}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuitCO2ScrubberStorage;
