import React, { useEffect, useState } from 'react';
import './styles/SuitResources.css';
import { Clock, Gauge } from 'lucide-react'; // Battery and Droplet were not used in the original TSX provided for the main component
import oxygenIcon from '../../assets/oxygen.svg';
import coolantIcon from '../../assets/coolant.svg';
import batteryIcon from '../../assets/battery.svg';

const AlertNotification = ({ vital, onClose }: { vital: string; onClose: () => void }) => {
  return (
    <div className="alert-notification">
      <div className="alert-notification-content">
        <div className="alert-warning-icon">⚠</div>
        <div className="alert-notification-text">
          <div>{vital} is Low</div>
          <div className="alert-notification-subtext">*Add Recommended action if needed</div>
        </div>
        <div className="alert-close-icon" onClick={onClose}>✕</div>
      </div>
    </div>
  );
};

interface SuitData {
  batt_time_left: number;
  oxy_pri_storage: number;
  oxy_sec_storage: number;
  oxy_pri_pressure: number;
  oxy_sec_pressure: number;
  oxy_time_left: number;
  coolant_ml: number;
  currAlerts?: { AllAlerts: { vital: string }[] }; // Made currAlerts optional and typed AllAlerts
}

const SuitResources = ({ data }: { data: SuitData }) => {
  const [currAlerts, setCurrAlerts] = useState<Array<string>>([]);

  const {
    batt_time_left = 0, // Default values to prevent runtime errors if data is incomplete
    oxy_pri_storage = 0,
    oxy_sec_storage = 0,
    oxy_pri_pressure = 0,
    oxy_sec_pressure = 0,
    oxy_time_left = 0,
    coolant_ml = 0,
    currAlerts: alerts, // Renamed to avoid conflict
  } = data;

  useEffect(() => {
    if (!alerts || !alerts.AllAlerts) {
      // Simulating alerts as per original code if not provided
      const simulatedAlerts = [
        // 'batt_time_left', 'oxy_time_left', 'oxy_pri_storage',
        // 'oxy_sec_storage', 'oxy_pri_pressure', 'oxy_sec_pressure', 'coolant_ml'
      ];
      // To test with all alerts active initially, uncomment the above line.
      // By default, no simulated alerts for a cleaner initial view.
      setCurrAlerts(simulatedAlerts);
      return;
    }
    const newAlerts = alerts.AllAlerts.map(alert => alert.vital);
    setCurrAlerts(newAlerts);
  }, [alerts]);

  const handleDismissNotification = (vitalName: string) => {
    setCurrAlerts(prevAlerts => prevAlerts.filter(a => a !== vitalName));
  };

  const validVitals = [
    'batt_time_left',
    'oxy_time_left',
    'oxy_pri_storage',
    'oxy_sec_storage',
    'oxy_pri_pressure',
    'oxy_sec_pressure',
    'coolant_ml'
  ];

  const hasAlert = (vitalName: string) => {
    return currAlerts.includes(vitalName) && validVitals.includes(vitalName);
  };

  const batteryHours = Math.floor(batt_time_left / 3600);
  const batteryMinutes = Math.floor((batt_time_left % 3600) / 60);
  const batteryTimeDisplay = `${batteryHours}hr ${batteryMinutes}Min`;

  const oxygenHours = Math.floor(oxy_time_left / 3600);
  const oxygenMinutes = Math.floor((oxy_time_left % 3600) / 60);
  const oxygenTimeDisplay = `${oxygenHours}hr ${oxygenMinutes}Min`;

  const calculateNeedleTransform = (value: number): string => {
    const minPSI = 600;
    const maxPSI = 3000;
    const startAngle = 240; // Corresponds to visual start on SVG
    const endAngle = 480;   // Corresponds to visual end on SVG

    const clampedValue = Math.max(minPSI, Math.min(value, maxPSI));
    const percentage = (clampedValue - minPSI) / (maxPSI - minPSI);
    let angle = startAngle + percentage * (endAngle - startAngle);

    // The needle CSS positions its top-center at the pivot.
    // translateX(-50%) is for centering the needle element itself as its left is at 50%.
    return `translateX(-50%) rotate(${angle}deg)`;
  };

  const getBatteryClassName = () => {
    return `progress-fill ${(batt_time_left / 10800) * 100 < 20 || hasAlert('batt_time_left') ? 'warning' : ''}`;
  };

  const getOxygenTimeClassName = () => {
    return `progress-fill ${(oxy_time_left / 10800) * 100 < 20 || hasAlert('oxy_time_left') ? 'warning' : ''}`;
  };

  const getOxyPriStorageClassName = () => {
    return `gauge-fill ${oxy_pri_storage < 20 || hasAlert('oxy_pri_storage') ? 'warning' : ''}`;
  };

  const getOxySecStorageClassName = () => {
    return `gauge-fill ${oxy_sec_storage < 20 || hasAlert('oxy_sec_storage') ? 'warning' : ''}`;
  };

  const getOxyPriPressureClassName = () => {
    return `needle ${oxy_pri_pressure < 750 || hasAlert('oxy_pri_pressure') ? 'warning' : ''}`;
  };

  const getOxySecPressureClassName = () => {
    return `needle ${oxy_sec_pressure < 750 || hasAlert('oxy_sec_pressure') ? 'warning' : ''}`;
  };

  const getCoolantClassName = () => {
    return `gauge-fill ${coolant_ml < 20 || hasAlert('coolant_ml') ? 'warning' : ''}`;
  };

  const renderAlertPopups = () => {
    if (!currAlerts.length) return null;

    const alertMappings: { [key: string]: string } = {
      'batt_time_left': 'Battery Time',
      'oxy_time_left': 'Oxygen Time',
      'oxy_pri_storage': 'Primary Oxygen Storage',
      'oxy_sec_storage': 'Secondary Oxygen Storage',
      'oxy_pri_pressure': 'Primary Oxygen Pressure',
      'oxy_sec_pressure': 'Secondary Oxygen Pressure',
      'coolant_ml': 'Coolant Storage'
    };

    return currAlerts
      .filter(alertName => alertMappings[alertName]) // Ensure only valid alerts are mapped
      .map(alertName => (
        <AlertNotification
          key={alertName}
          vital={alertMappings[alertName]}
          onClose={() => handleDismissNotification(alertName)}
        />
      ));
  };

  return (
    <div className="suit-resources">
      {renderAlertPopups()}
      <h2 className="suit-resources-title large-text">Suit Resources</h2>
      <div className="encasing-box">
        <div className="resources-grid">
          <div className="time-left">
            <div className="box-header large-text">
              <Clock size={18} /> {/* Adjusted icon size */}
              <span>Time Left</span>
            </div>
            <div className="time-content">
              <div className="time-item">
                <div className="time-row small-text">
                  <img src={batteryIcon} alt="Battery" className="time-icon" />
                  <span>Battery</span>
                  <div className="progress-bar">
                    <div className={getBatteryClassName()} style={{ width: `${(batt_time_left / 10800) * 100}%` }} />
                  </div>
                </div>
                <span className="time-value">{batteryTimeDisplay}</span>
                {hasAlert('batt_time_left') && (
                  <div className="alert-indicator">
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Battery Low</div>
                  </div>
                )}
              </div>
              <div className="time-item">
                <div className="time-row small-text">
                  <img src={oxygenIcon} alt="Oxygen" className="time-icon" />
                  <span>Oxygen</span>
                  <div className="progress-bar">
                    <div className={getOxygenTimeClassName()} style={{ width: `${oxy_time_left ? (oxy_time_left / 10800) * 100 : 0}%` }} />
                  </div>
                  <span className="time-value">{oxygenTimeDisplay}</span>
                </div>
                {hasAlert('oxy_time_left') && (
                  <div className="alert-indicator">
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Oxygen Time Low</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="coolant">
            <div className="box-header large-text">
              <img src={coolantIcon} alt="Coolant" className="header-icon" />
              <div className="header-text">
                <span>Coolant</span>
                <span>Ml</span>
              </div>
            </div>
            <div className="gauge-container">
              <div className="gauge-row">
                <div className="gauge">
                  <div className={getCoolantClassName()} style={{ height: `${coolant_ml}%` }}>
                    {coolant_ml > 0 && <div className="striped-background"></div>}
                  </div>
                </div>
                <div className="measurement">
                  <span>100</span>
                  <span>0</span>
                </div>
              </div>
              <span className="percentage">{coolant_ml}</span>
            </div>
            {hasAlert('coolant_ml') && (
              <div className="alert-indicator">
                <div className="alert-icon">⚠</div>
                <div className="alert-text">Coolant Low</div>
              </div>
            )}
          </div>

          <div className="oxygen-storage">
            <div className="box-header large-text">
              <img src={oxygenIcon} alt="Oxygen Storage" className="header-icon" />
              <span>Oxygen Storage</span>
            </div>
            <div className="storage-content">
              <div className="storage-item small-text">
                <span className="storage-label">Primary</span>
                <div className="storage-gauge-container">
                  <div className="gauge-bar">
                    <div className={getOxyPriStorageClassName()} style={{ height: `${oxy_pri_storage || 0}%` }}>
                     {oxy_pri_storage > 0 && <div className="striped-background"></div>}
                    </div>
                  </div>
                  <div className="measurement">
                    <span>100</span>
                    <span>0</span>
                  </div>
                </div>
                <span className="percentage storage-percentage">{oxy_pri_storage || 0}%</span>
                {hasAlert('oxy_pri_storage') && (
                  <div className="alert-indicator">
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Primary Storage Low</div>
                  </div>
                )}
              </div>
              <div className="storage-item small-text">
                <span className="storage-label">Secondary</span>
                <div className="storage-gauge-container">
                  <div className="gauge-bar">
                    <div className={getOxySecStorageClassName()} style={{ height: `${oxy_sec_storage}%` }}>
                      {oxy_sec_storage > 0 && <div className="striped-background"></div>}
                    </div>
                  </div>
                  <div className="measurement">
                    <span>100</span>
                    <span>0</span>
                  </div>
                </div>
                <span className="percentage storage-percentage">{oxy_sec_storage}%</span>
                {hasAlert('oxy_sec_storage') && (
                  <div className="alert-indicator">
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Secondary Storage Low</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="oxygen-pressure">
            <div className="box-header large-text">
              <Gauge size={18} /> {/* Adjusted icon size */}
              <span>Oxygen Pressure</span>
            </div>
            <div className="pressure-content">
              <div className="pressure-section">
                <span className="small-text">Primary</span>
                <div className="pressure-gauge">
                  <div className="gauge-marks"></div>
                  <div className={getOxyPriPressureClassName()} style={{ transform: calculateNeedleTransform(oxy_pri_pressure) }}></div>
                  <div className="pressure-value">{Math.round(oxy_pri_pressure)}</div>
                  <div className="pressure-unit">PSI</div>
                </div>
                {hasAlert('oxy_pri_pressure') && (
                  <div className="alert-indicator">
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Primary Pressure Low</div>
                  </div>
                )}
              </div>
              <div className="pressure-section">
                <span className="small-text">Secondary</span>
                <div className="pressure-gauge">
                  <div className="gauge-marks"></div>
                  {/* Removed non-existent gauge-overlay div */}
                  <div className={getOxySecPressureClassName()} style={{ transform: calculateNeedleTransform(oxy_sec_pressure) }}></div>
                  <div className="pressure-value">{Math.round(oxy_sec_pressure)}</div>
                  <div className="pressure-unit">PSI</div>
                </div>
                {hasAlert('oxy_sec_pressure') && (
                  <div className="alert-indicator">
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Secondary Pressure Low</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuitResources;