import React, { useEffect, useState } from 'react';
import './styles/SuitResources.css';
import { Clock, Gauge as PressureIcon } from 'lucide-react'; // Renamed Gauge to PressureIcon for clarity
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
  currAlerts?: { AllAlerts: { vital: string }[] };
}

const SuitResources = ({ data }: { data: SuitData }) => {
  const [currAlerts, setCurrAlerts] = useState<Array<string>>([]);

  const {
    batt_time_left = 0,
    oxy_pri_storage = 0,
    oxy_sec_storage = 0,
    oxy_pri_pressure = 0,
    oxy_sec_pressure = 0,
    oxy_time_left = 0,
    coolant_ml = 0,
    currAlerts: alerts,
  } = data;

  useEffect(() => {
    if (!alerts || !alerts.AllAlerts) {
      const simulatedAlerts: string[] = [];
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

  // Removed calculateNeedleTransform as dials are gone

  const getBatteryClassName = () => {
    return `progress-fill ${(batt_time_left / 10800) * 100 < 20 || hasAlert('batt_time_left') ? 'warning' : ''}`;
  };

  const getOxygenTimeClassName = () => {
    return `progress-fill ${(oxy_time_left / 10800) * 100 < 20 || hasAlert('oxy_time_left') ? 'warning' : ''}`;
  };

  const getOxyPriStorageClassName = () => {
    return `gauge-fill ${(oxy_pri_storage < 20 || hasAlert('oxy_pri_storage')) ? 'warning' : ''}`;
  };

  const getOxySecStorageClassName = () => {
    return `gauge-fill ${(oxy_sec_storage < 20 || hasAlert('oxy_sec_storage')) ? 'warning' : ''}`;
  };

  // Pressure class names are no longer for needles but can be used for text styling if needed
  const getOxyPriPressureTextStyle = () => {
    return hasAlert('oxy_pri_pressure') || oxy_pri_pressure < 750 ? { color: '#FF3B30' } : {};
  };

  const getOxySecPressureTextStyle = () => {
    return hasAlert('oxy_sec_pressure') || oxy_sec_pressure < 750 ? { color: '#FF3B30' } : {};
  };

  const getCoolantClassName = () => {
    return `gauge-fill ${(coolant_ml < 20 || hasAlert('coolant_ml')) ? 'warning' : ''}`;
  };

  const roundToNearestTenth = (num: number): number => {
    return Math.round(num * 10) / 10;
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
      .filter(alertName => alertMappings[alertName])
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
              <Clock size={16} /> {/* Adjusted icon size */}
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
                <span>Coolant Ml</span>
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
              <span className="percentage">{roundToNearestTenth(coolant_ml)}</span>
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
                <span className="percentage storage-percentage">{roundToNearestTenth(oxy_pri_storage) || 0}%</span>
                {hasAlert('oxy_pri_storage') && (
                  <div className="alert-indicator">
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Primary Low</div> {/* Shortened text */}
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
                <span className="percentage storage-percentage">{roundToNearestTenth(oxy_sec_storage)}%</span>
                {hasAlert('oxy_sec_storage') && (
                  <div className="alert-indicator">
                    <div className="alert-icon">⚠</div>
                    <div className="alert-text">Secondary Low</div> {/* Shortened text */}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="oxygen-pressure">
            <div className="box-header large-text">
              <PressureIcon size={16} /> {/* Adjusted icon size, used PressureIcon alias */}
              <span>Oxygen Pressure</span>
            </div>
            <div className="pressure-content">
              <div className="pressure-section">
                <span className="small-text">Primary</span>
                <div className="pressure-display"> {/* New display div */}
                  <div className="pressure-value-direct" style={getOxyPriPressureTextStyle()}>{Math.round(oxy_pri_pressure)}</div>
                  <div className="pressure-unit-direct">PSI</div>
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
                 <div className="pressure-display"> {/* New display div */}
                  <div className="pressure-value-direct" style={getOxySecPressureTextStyle()}>{Math.round(oxy_sec_pressure)}</div>
                  <div className="pressure-unit-direct">PSI</div>
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