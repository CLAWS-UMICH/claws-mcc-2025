import './styles/PersonalData.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/ToastStyles.css';


const PersonalData = ({ suitData }) => {
    const alerts = suitData.alerts.AllAlerts;

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
            <div className="personal-data-panel">
                <div className="panel-header">
                    <img src="personal_data_icon.png" width="25rem" height="25rem" className="panel-header-icon" />
                    <h3 className='panel-header-text'>Personal Data</h3>
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
        </>
    );
}

export default PersonalData;