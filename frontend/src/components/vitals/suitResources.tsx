import React from 'react';
import '../../styles/Styles.css';
import { SuitData } from '../../Vitals';
import { Clock, Battery, Droplet, Gauge } from 'lucide-react';

const SuitResources = ({ data }: { data: SuitData }) => {
  const {
    batt_time_left,
    oxy_pri_storage,
    oxy_sec_storage,
    oxy_pri_pressure,
    oxy_sec_pressure,
    oxy_time_left,
    coolant_storage,
  } = data;

  // Convert battery time (seconds) to hours and minutes
  const batteryHours = Math.floor(batt_time_left / 3600);
  const batteryMinutes = Math.floor((batt_time_left % 3600) / 60);
  const batteryTimeDisplay = `${batteryHours}hr ${batteryMinutes}Min`;

  // Calculate oxygen time display using oxy_time_left
  const oxygenHours = Math.floor(oxy_time_left / 3600);
  const oxygenMinutes = Math.floor((oxy_time_left % 3600) / 60);
  const oxygenTimeDisplay = `${oxygenHours}hr ${oxygenMinutes}Min`;

  return (
    <div className="suit-resources">
      <h2 className="suit-resources-title">Suit Resources</h2>
      
      <div className="resources-grid">
        {/* Time Left */}
        <div className="time-left">
          <div className="box-header">
            <Clock size={20} />
            <span>Time Left</span>
          </div>
          
          <div className="time-content">
            <div className="time-row">
              <Battery size={20} />
              <span>Battery</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${(batt_time_left/6000) * 100}%`}} 
                />
              </div>
              <span className="time-value">{batteryTimeDisplay}</span>
            </div>

            <div className="time-row">
              <Droplet size={20} />
              <span>Oxygen</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${oxy_time_left ? (oxy_time_left / 6000) * 100 : 0}%`}} 
                />
              </div>
              <span className="time-value">{oxygenTimeDisplay}</span>
            </div>
          </div>
        </div>

        {/* Coolant Storage */}
        <div className="coolant">
          <div className="box-header">
            <Droplet size={20} />
            <div className="header-text">
              <span>Coolant</span>
              <span>Storage</span>
            </div>
          </div>
          
          <div className="gauge-container">
            <div className="measurement">
              <span>100</span>
              <span>80</span>
            </div>
            <div className="gauge">
              <div className="gauge-fill" style={{height: `${coolant_storage}%`}}>
                <div className="striped-background"></div>
              </div>
            </div>
            <span className="percentage">{coolant_storage}%</span>
          </div>
        </div>

        {/* Oxygen Storage */}
        <div className="oxygen-storage">
          <div className="box-header">
            <Droplet size={20} />
            <span>Oxygen Storage</span>
          </div>
          
          <div className="storage-content">
            <div className="storage-section">
              <span>Primary</span>
              <div className="storage-gauge">
                <span className="gauge-label">100</span>
                <div className="gauge-bar">
                  <div 
                    className="gauge-fill" 
                    style={{height: `${oxy_pri_storage || 0}%`}}
                  >
                    <div className="striped-background"></div>
                  </div>
                </div>
                <span className="gauge-label">20</span>
              </div>
              <span className="percentage">{oxy_pri_storage || 0}%</span>
            </div>

            <div className="storage-section">
              <span>Secondary</span>
              <div className="storage-gauge">
                <span className="gauge-label">100</span>
                <div className="gauge-bar">
                  <div 
                    className="gauge-fill" 
                    style={{height: `${oxy_sec_storage}%`}}
                  >
                    <div className="striped-background"></div>
                  </div>
                </div>
                <span className="gauge-label">20</span>
              </div>
              <span className="percentage">{oxy_sec_storage}%</span>
            </div>
          </div>
        </div>

        {/* Oxygen Pressure */}
        <div className="oxygen-pressure">
          <div className="box-header">
            <Gauge size={20} />
            <span>Oxygen Pressure</span>
          </div>
          
          <div className="pressure-content">
            <div className="pressure-section">
              <span>Primary</span>
              <div className="pressure-gauge">
                <div className="gauge-marks"></div>
                <div 
                  className="needle" 
                  style={{
                    transform: `rotate(${(oxy_pri_pressure / 3000) * 180}deg)`
                  }}
                ></div>
                <div className="pressure-value">{Math.round(oxy_pri_pressure)}</div>
                <div className="pressure-unit">PSI</div>
              </div>
            </div>

            <div className="pressure-section">
              <span>Secondary</span>
              <div className="pressure-gauge">
                <div className="gauge-marks"></div>
                <div 
                  className="needle" 
                  style={{
                    transform: `rotate(${(oxy_sec_pressure / 3000) * 180}deg)`
                  }}
                ></div>
                <div className="pressure-value">{Math.round(oxy_sec_pressure)}</div>
                <div className="pressure-unit">PSI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuitResources;