import React, { useEffect, useState } from 'react';
import '../../styles/SuitResources.css';
import { Clock, Battery, Droplet, Gauge } from 'lucide-react';
import oxygenIcon from '../../assets/oxygen.svg';
import coolantIcon from '../../assets/coolant.svg';
import batteryIcon from '../../assets/battery.svg';

const AlertNotification = ({ vital, onClose }) => {
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

const SuitResources = ({ data }) => {
  const [alerts, setAlerts] = useState<Array<string>>([]);

  const {
    batt_time_left,
    oxy_pri_storage,
    oxy_sec_storage,
    oxy_pri_pressure,
    oxy_sec_pressure,
    oxy_time_left,
    coolant_storage,
    alerts: sourceAlerts,
  } = data;

  useEffect(() => {
    if (!sourceAlerts) return;

    // const newAlerts = sourceAlerts.AllAlerts.map(alert => alert.vital);
    const newAlerts = ['batt_time_left', 'oxy_time_left', 'oxy_pri_storage', 'oxy_sec_storage', 'oxy_pri_pressure', 'oxy_sec_pressure', 'coolant_storage'];
    setAlerts(newAlerts);
  }, [sourceAlerts]);

  const handleDismissNotification = (vitalName: string) => {
    setAlerts(alerts.filter(a => a !== vitalName));
  };

  const validVitals = [
    'batt_time_left',
    'oxy_time_left',
    'oxy_pri_storage',
    'oxy_sec_storage',
    'oxy_pri_pressure',
    'oxy_sec_pressure',
    'coolant_storage'
  ];

  const hasAlert = (vitalName: string) => {
    return alerts.includes(vitalName) && validVitals.includes(vitalName);
  };

  // const hasNotification = (vitalName) => {
  //   return hasAlert(vitalName) && (!dismissedNotifications || !dismissedNotifications.has(vitalName));
  // };

  const batteryHours = Math.floor(batt_time_left / 3600);
  const batteryMinutes = Math.floor((batt_time_left % 3600) / 60);
  const batteryTimeDisplay = `${batteryHours}hr ${batteryMinutes}Min`;

  const oxygenHours = Math.floor(oxy_time_left / 3600);
  const oxygenMinutes = Math.floor((oxy_time_left % 3600) / 60);
  const oxygenTimeDisplay = `${oxygenHours}hr ${oxygenMinutes}Min`;

  
  const calculateNeedleRotation = (value) => {
    const minPSI = 600; // Minimum PSI value
    const maxPSI = 3000; // Maximum PSI value
    const startAngle = 240; // Start of the gauge in degrees
    const endAngle = 480; // End of the gauge in degrees

    // Clamp the input value to the valid range
    const clampedValue = Math.max(minPSI, Math.min(value, maxPSI));

    // Calculate the percentage within the clamped range
    const percentage = (clampedValue - minPSI) / (maxPSI - minPSI);

    // Map the percentage to the angle range
    const angle = startAngle + percentage * (endAngle - startAngle);

    return `rotate(${angle}deg)`;
};


  
  
  
  

  const getBatteryClassName = () => {
    return `progress-fill ${(batt_time_left / 10800) < 0.29 || hasAlert('batt_time_left') ? 'warning' : ''}`;
  };

  const getOxygenTimeClassName = () => {
    return `progress-fill ${(oxy_time_left / 10800) < 0.29 || hasAlert('oxy_time_left') ? 'warning' : ''}`;
  };

  const getOxyPriStorageClassName = () => {
    return `gauge-fill ${oxy_pri_storage < 20 || hasAlert('oxy_pri_storage') ? 'warning' : ''}`;
  };

  const getOxySecStorageClassName = () => {
    return `gauge-fill ${oxy_sec_storage < 20 || hasAlert('oxy_sec_storage') ? 'warning' : ''}`;
  };

  const getOxyPriPressureClassName = () => {
    return `needle ${oxy_pri_pressure < 600 || hasAlert('oxy_pri_pressure') ? 'warning' : ''}`;
  };

  const getOxySecPressureClassName = () => {
    return `needle ${oxy_sec_pressure < 600 || hasAlert('oxy_sec_pressure') ? 'warning' : ''}`;
  };

  const getCoolantClassName = () => {
    return `gauge-fill ${coolant_storage < 80 || hasAlert('coolant_storage') ? 'warning' : ''}`;
  };

  const renderAlerts = () => {
    if (!alerts.length) return null;

    const alertMappings = {
      'batt_time_left': 'Time Left for Battery',
      'oxy_time_left': 'Oxygen Time',
      'oxy_pri_storage': 'Primary Oxygen Storage',
      'oxy_sec_storage': 'Secondary Oxygen Storage',
      'oxy_pri_pressure': 'Primary Oxygen Pressure',
      'oxy_sec_pressure': 'Secondary Oxygen Pressure',
      'coolant_storage': 'Coolant Storage'
    };

    return alerts
      .map(alert => (
        <AlertNotification
          key={alert}
          vital={alertMappings[alert]}
          onClose={() => handleDismissNotification(alert)}
        />
      ));
  };

  return (
    <div className="suit-resources">
      {renderAlerts()}
      <h2 className="suit-resources-title large-text">Suit Resources</h2>
      <div className="encasing-box">
        <div className="resources-grid">
          <div className="time-left">
            <div className="box-header large-text">
              <Clock size={20} />
              <span>Time Left</span>
            </div>
            <div className="time-content">
              <div className="time-item">
                <div className="time-row small-text">
                  <img src={batteryIcon} alt="Battery Icon" style={{ width: '20px', height: '20px' }} />
                  <span>Battery</span>
                  <div className="progress-bar">
                    <div className={getBatteryClassName()} style={{ width: `${(batt_time_left / 10800) * 100}%` }} />
                  </div>
                  <span className="time-value">{batteryTimeDisplay}</span>
                </div>
                {hasAlert('batt_time_left') && (
                  <div className="alert-indicator" style={{ marginLeft: '90px', marginTop: '4px' }}>
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Battery is Low</div>
                  </div>
                )}
              </div>
              <div className="time-item">
                <div className="time-row small-text">
                  <img src={oxygenIcon} alt="Oxygen Icon" style={{ width: '20px', height: '20px' }} />
                  <span>Oxygen</span>
                  <div className="progress-bar">
                    <div className={getOxygenTimeClassName()} style={{ width: `${oxy_time_left ? (oxy_time_left / 10800) * 100 : 0}%` }} />
                  </div>
                  <span className="time-value">{oxygenTimeDisplay}</span>
                </div>
                {hasAlert('oxy_time_left') && (
                  <div className="alert-indicator" style={{ marginLeft: '90px', marginTop: '4px' }}>
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Oxygen Time is Low</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="coolant">
            <div className="box-header large-text">
              <img src={coolantIcon} alt="Coolant Icon" style={{ width: '20px', height: '20px' }} />
              <div className="header-text">
                <span>Coolant</span>
                <span>Storage</span>
              </div>
            </div>
            <div className="gauge-container">
              <div className="gauge-row">
                <div className="gauge">
                  <div className={getCoolantClassName()} style={{ height: `${coolant_storage}%` }}>
                    <div className="striped-background"></div>
                  </div>
                </div>
                <div className="measurement">
                  <span>100</span>
                  <span>0</span>
                </div>
              </div>
              <span className="percentage">{coolant_storage}%</span>
            </div>
            {(coolant_storage < 80 || hasAlert('coolant_storage')) && (
              <div className="alert-indicator">
                <div className="alert-icon">⚠</div>
                <div className="alert-text">Coolant Storage is Low</div>
              </div>
            )}
          </div>


          <div className="oxygen-storage">
            <div className="box-header large-text">
              <img src={oxygenIcon} alt="Oxygen Icon" style={{ width: '20px', height: '20px' }} />
              <span>Oxygen Storage</span>
            </div>
            <div className="storage-content">
              <div className="storage-item small-text">
                <span className="storage-label">Primary</span>
                <div className="storage-gauge-container">
                  <div className="gauge-bar">
                    <div className={getOxyPriStorageClassName()} style={{ height: `${oxy_pri_storage || 0}%` }}>
                      <div className="striped-background"></div>
                    </div>
                  </div>
                  <div className="measurement">
                    <span>100</span>
                    <span>0</span>
                  </div>
                  <span className="percentage">{oxy_pri_storage || 0}%</span>
                </div>
                {hasAlert('oxy_pri_storage') && (
                  <div className="alert-indicator" style={{ marginTop: '4px' }}>
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Primary Oxygen Storage is Low</div>
                  </div>
                )}
              </div>
              <div className="storage-item small-text">
                <span className="storage-label">Secondary</span>
                <div className="storage-gauge-container">
                  <div className="gauge-bar">
                    <div className={getOxySecStorageClassName()} style={{ height: `${oxy_sec_storage}%` }}>
                      <div className="striped-background"></div>
                    </div>
                  </div>
                  <div className="measurement">
                    <span>100</span>
                    <span>0</span>
                  </div>
                  <span className="percentage">{oxy_sec_storage}%</span>
                </div>
                {hasAlert('oxy_sec_storage') && (
                  <div className="alert-indicator" style={{ marginTop: '4px' }}>
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Secondary Oxygen Storage is Low</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="oxygen-pressure">
            <div className="box-header large-text">
              <Gauge size={20} />
              <span>Oxygen Pressure</span>
            </div>
            <div className="pressure-content">
              <div className="pressure-section">
                <span className="small-text">Primary</span>
                <div className="pressure-gauge">
                  <div className="gauge-marks"></div>
                  <div className={getOxyPriPressureClassName()} style={{ transform: calculateNeedleRotation(oxy_pri_pressure) }}></div>
                  <div className="pressure-value">{Math.round(oxy_pri_pressure)}</div>
                  <div className="pressure-unit">PSI</div>
                </div>
                {hasAlert('oxy_pri_pressure') && (
                  <div className="alert-indicator" style={{ marginTop: '4px' }}>
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Primary Oxygen Pressure is Low</div>
                  </div>
                )}
              </div>
              <div className="pressure-section">
                <span className="small-text">Secondary</span>
                <div className="pressure-gauge">
                  <div className="gauge-marks"></div>
                  <div className="gauge-overlay"></div>
                  <div className={getOxySecPressureClassName()} style={{ transform: calculateNeedleRotation(oxy_sec_pressure) }}></div>
                  <div className="pressure-value">{Math.round(oxy_sec_pressure)}</div>
                  <div className="pressure-unit">PSI</div>
                </div>
                {hasAlert('oxy_sec_pressure') && (
                  <div className="alert-indicator" style={{ marginTop: '4px' }}>
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Secondary Oxygen Pressure is Low</div>
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
