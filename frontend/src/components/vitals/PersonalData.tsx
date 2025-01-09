import '../../styles/SuitAtmosphere.css';
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/ToastStyles.css';


const PersonalData = ({ suitData }) => {
    const alerts = suitData.alerts.AllAlerts;

    useEffect(() => {
        const allowedVitals = ['heart_rate', 'oxy_consumption', 'co2_production'];

        alerts.forEach((alert) => {
            if (allowedVitals.includes(alert.vital)) {
                toast.error(
                    <div>
                        <div className="toast-header">
                            <span className="toast-icon">⚠️</span>
                            <span>Time Left for Battery is Low</span>
                        </div>
                        <div className="toast-body">
                            *Add Recommended action if needed
                        </div>
                    </div>,
                    {
                    className: 'custom-toast',
                    closeButton: true,
                    autoClose: 5000,
                    hideProgressBar: true,
                    position: 'top-right',
                    }
                );           
            }   
        });
    }, [suitData]);

    const getAlertForVital = (vital) => {
        return alerts.find((alert) => alert.vital === vital);
    };

    const renderVital = (value, vitalName) => {
        const alert = getAlertForVital(vitalName);
        const isAlert = !!alert;
    
        return (
            <div className="data-row">
                <span
                className="data-value"
                style={{ color: isAlert ? 'red' : 'white' }}
                >
                {value}
                </span>
                <div className="error-message">
                    {/* {alert.vital} is Low: {alert.vital_val} */}
                </div>
            </div>
        );
    };


    return (
        <>
            <div className="panel personal-data">
                <div className="panel-header">
                    <img src="personal_data_icon.png" width="25rem" height="25rem" className="panel-header-icon"/>
                    <h3>Personal Data</h3>
                </div>

                <div className="data-section">
                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.heart_rate, 'heart_rate')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">BPM</span>
                            <span className="label">Heart Rate</span>
                        </div> 
                    </div>
                    {getAlertForVital('heart_rate') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Heart Rate</div>
                        </div>
                    )}
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.oxy_consumption, 'oxy_consumption')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI/MIN</span>
                            <span className="label">O₂ Consumption</span>
                        </div>
                    </div>
                    {getAlertForVital('oxy_consumption') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Oxygen Consumption</div>
                        </div>
                    )}
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.co2_production, 'co2_production')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI/MIN</span>
                            <span className="label">CO₂ Production</span>
                        </div>
                    </div>
                    {getAlertForVital('co2_production') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">CO2 Production</div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer aria-label={undefined} />
        </>
    );
}

export default PersonalData;