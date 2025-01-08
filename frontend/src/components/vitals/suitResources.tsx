import React, { useState } from 'react';
import '../../styles/Styles.css';
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
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());

  const {
    batt_time_left,
    oxy_pri_storage,
    oxy_sec_storage,
    oxy_pri_pressure,
    oxy_sec_pressure,
    oxy_time_left,
    coolant_storage,
    alerts,
  } = data;

  const handleDismissNotification = (vitalName) => {
    setDismissedNotifications(prev => new Set([...prev, vitalName]));
  };

  const validVitals = [
    'Batt Time Left',
    'Oxy Time Left',
    'Oxy Pri Storage',
    'Oxy Sec Storage',
    'Oxy Pri Pressure',
    'Oxy Sec Pressure',
    'Coolant Storage'
  ];

  const hasAlert = (vitalName) => {
    return alerts?.AllAlerts?.some(alert => 
      alert.vital === vitalName && 
      validVitals.includes(vitalName)
    ) || false;
  };

  const hasNotification = (vitalName) => {
    return hasAlert(vitalName) && !dismissedNotifications.has(vitalName);
  };

  const batteryHours = Math.floor(batt_time_left / 3600);
  const batteryMinutes = Math.floor((batt_time_left % 3600) / 60);
  const batteryTimeDisplay = `${batteryHours}hr ${batteryMinutes}Min`;

  const oxygenHours = Math.floor(oxy_time_left / 3600);
  const oxygenMinutes = Math.floor((oxy_time_left % 3600) / 60);
  const oxygenTimeDisplay = `${oxygenHours}hr ${oxygenMinutes}Min`;

  const calculateNeedleRotation = (value) => {
    const clampedValue = Math.min(Math.max(value, 0), 3000);
    const percentage = (clampedValue / 3000);
    const angle = (percentage * 180) - 90;
    return `rotate(${angle}deg)`;
  };

  const getBatteryClassName = () => {
    return `progress-fill ${(batt_time_left / 10800) < 0.29 || hasAlert('Batt Time Left') ? 'warning' : ''}`;
  };

  const getOxygenTimeClassName = () => {
    return `progress-fill ${(oxy_time_left / 10800) < 0.29 || hasAlert('Oxy Time Left') ? 'warning' : ''}`;
  };

  const getOxyPriStorageClassName = () => {
    return `gauge-fill ${oxy_pri_storage < 20 || hasAlert('Oxy Pri Storage') ? 'warning' : ''}`;
  };

  const getOxySecStorageClassName = () => {
    return `gauge-fill ${oxy_sec_storage < 20 || hasAlert('Oxy Sec Storage') ? 'warning' : ''}`;
  };

  const getOxyPriPressureClassName = () => {
    return `needle ${oxy_pri_pressure < 600 || hasAlert('Oxy Pri Pressure') ? 'warning' : ''}`;
  };

  const getOxySecPressureClassName = () => {
    return `needle ${oxy_sec_pressure < 600 || hasAlert('Oxy Sec Pressure') ? 'warning' : ''}`;
  };

  const getCoolantClassName = () => {
    return `gauge-fill ${coolant_storage < 80 || hasAlert('Coolant Storage') ? 'warning' : ''}`;
  };

  const renderAlerts = () => {
    if (!alerts?.AllAlerts) return null;

    const alertMappings = {
      'Batt Time Left': 'Time Left for Battery',
      'Oxy Time Left': 'Oxygen Time',
      'Oxy Pri Storage': 'Primary Oxygen Storage',
      'Oxy Sec Storage': 'Secondary Oxygen Storage',
      'Oxy Pri Pressure': 'Primary Oxygen Pressure',
      'Oxy Sec Pressure': 'Secondary Oxygen Pressure',
      'Coolant Storage': 'Coolant Storage'
    };

    return alerts.AllAlerts
      .filter(alert => 
        hasNotification(alert.vital) && 
        Object.keys(alertMappings).includes(alert.vital)
      )
      .map(alert => (
        <AlertNotification
          key={alert.vital}
          vital={alertMappings[alert.vital]}
          onClose={() => handleDismissNotification(alert.vital)}
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
                {hasAlert('Batt Time Left') && (
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
                {hasAlert('Oxy Time Left') && (
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
            {(coolant_storage < 80 || hasAlert('Coolant Storage')) && (
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
                {hasAlert('Oxy Pri Storage') && (
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
                {hasAlert('Oxy Sec Storage') && (
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
                {hasAlert('Oxy Pri Pressure') && (
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
                {hasAlert('Oxy Sec Pressure') && (
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
