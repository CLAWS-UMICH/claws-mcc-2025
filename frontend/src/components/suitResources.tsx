import React from 'react';
import PropTypes from 'prop-types';
import '../styles/styles.css';
import { FaBatteryHalf, FaTint } from 'react-icons/fa';

const SuitResources = ({ data }) => {
  const {
    batt_time_left,
    oxy_pri_stroage,
    oxy_sec_storage,
    oxy_pri_pressure,
    oxy_sec_pressure,
    coolant_storage,
  } = data;

  const getFilledSegments = (percentage) => Math.round((percentage / 100) * 10);

  const getSegmentClass = (percentage) => {
    if (percentage > 70) return 'green-segment';
    if (percentage > 30) return 'yellow-segment';
    return 'red-segment';
  };

  return (
    <div>
      <h3 className="suit-resources-title">Suit Resources</h3>
      <div className="suit-resources">
        <div className="top-section">
          <div className="time-left">
            <div className="section-title">Time Left</div>
            <div className="resource-pair">
              <div className="time-left-box">
                <FaBatteryHalf className="resource-icon" />
                <div className="vertical-bar">
                  {[...Array(10)].map((_, index) => (
                    <div
                      key={index}
                      className={
                        index < getFilledSegments((batt_time_left / 6000) * 100)
                          ? getSegmentClass((batt_time_left / 6000) * 100)
                          : 'empty-segment'
                      }
                    />
                  ))}
                </div>
                <p className="resource-text">Battery</p>
                <p>{Math.round((batt_time_left / 6000) * 100)}%</p>
              </div>
              <div className="time-left-box">
                <span className="oxygen-icon">O₂</span>
                <div className="vertical-bar">
                  {[...Array(10)].map((_, index) => (
                    <div
                      key={index}
                      className={
                        index < getFilledSegments(oxy_pri_stroage)
                          ? getSegmentClass(oxy_pri_stroage)
                          : 'empty-segment'
                      }
                    />
                  ))}
                </div>
                <p className="resource-text">Oxygen</p>
                <p>{oxy_pri_stroage}%</p>
              </div>
            </div>
          </div>
          <div className="coolant-box">
            <div className="section-title">Coolant</div>
            <FaTint className="coolant-icon" />
            <div className="vertical-bar">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className={index < getFilledSegments(coolant_storage) ? 'filled-segment' : 'empty-segment'}
                />
              ))}
            </div>
            <p className="resource-text">Storage</p>
            <p>{coolant_storage}%</p>
          </div>
        </div>

        {/* Oxygen Storage Section */}
        <div className="oxygen-storage">
          <h3 className="section-title">Oxygen Storage</h3>
          <div className="storage-pair">
            <p>Primary: {oxy_pri_stroage}%</p>
            <p>Secondary: {oxy_sec_storage}%</p>
          </div>
        </div>

        {/* Oxygen Pressure Section */}
        <div className="oxygen-pressure">
          <h3 className="section-title">Oxygen Pressure</h3>
          <div className="pressure-pair">
            <p>Primary: {oxy_pri_pressure} psi</p>
            <p>Secondary: {oxy_sec_pressure} psi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SuitResources.propTypes = {
  data: PropTypes.shape({
    batt_time_left: PropTypes.number.isRequired,
    oxy_pri_stroage: PropTypes.number.isRequired,
    oxy_sec_storage: PropTypes.number.isRequired,
    oxy_pri_pressure: PropTypes.number.isRequired,
    oxy_sec_pressure: PropTypes.number.isRequired,
    coolant_storage: PropTypes.number.isRequired,
  }).isRequired,
};

export default SuitResources;
