import '../../styles/SuitAtmosphere.css';


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
        <div className="panel personal-data">
            <div className="panel-header">
                <img src="personal_data_icon.png" width="25rem" height="25rem" className="panel-header-icon"/>
                <h3>Personal Data</h3>
            </div>

            <div className="data-section">
                <div className="data-row">
                    <span className="data-value">
                        {renderVital(suitData.heart_rate, 'Heart Rate')}
                    </span>
                    <div className="data-labels">
                        <span className="unit">BPM</span>
                        <span className="label">Heart Rate</span>
                    </div> 
                </div>
                {getAlertForVital('Heart Rate') && (
                    <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                        <div className="alert-icon">⚠</div>
                        <div className="alert-text">Heart Rate</div>
                    </div>
                )}
                <hr className="horizontal-line" />

                <div className="data-row">
                    <span className="data-value">
                        {renderVital(suitData.oxy_consumption, 'Oxygen Consumption')}
                    </span>
                    <div className="data-labels">
                        <span className="unit">PSI/MIN</span>
                        <span className="label">O₂ Consumption</span>
                    </div>
                </div>
                {getAlertForVital('Oxygen Consumption') && (
                    <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                        <div className="alert-icon">⚠</div>
                        <div className="alert-text">Oxygen Consumption</div>
                    </div>
                )}
                <hr className="horizontal-line" />

                <div className="data-row">
                    <span className="data-value">
                        {renderVital(suitData.co2_production, 'CO2 Production')}
                    </span>
                    <div className="data-labels">
                        <span className="unit">PSI/MIN</span>
                        <span className="label">CO₂ Production</span>
                    </div>
                </div>
                {getAlertForVital('CO2 Production') && (
                    <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                        <div className="alert-icon">⚠</div>
                        <div className="alert-text">CO2 Production</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalData;