import '../../styles/SuitAtmosphere.css';

const SuitPressure = ({ suitData }) => {
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
            {parseFloat(value).toFixed(1)}
            </span>
            <div className="error-message">
                {/* {alert.vital} is Low: {alert.vital_val} */}
            </div>
            </div>
        );
    };


    return (
        <div className="panel suit-pressure">
            <div className="panel-header">
                <img src="suit_pressure_icon.png" width="25rem" height="25rem" className="panel-header-icon"/>
                <h3>Suit Pressure</h3>
            </div>

            <div className="pressure-grid">
                <div className="pressure-column">
                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.suit_pressure_oxy, 'Suit Pressure Oxy')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Pressure Oxy</span>
                        </div>
                    </div>
                    {getAlertForVital('Suit Pressure Oxy') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Suit Pressure Oxy</div>  
                        </div>
                    )}
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.suit_pressure_co2, 'Suit Pressure CO2')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Pressure CO₂</span>
                        </div>
                    </div>
                    {getAlertForVital('Suit Pressure CO2') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Suit Pressure CO2</div>
                        </div>
                    )}
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.suit_pressure_other, 'Suit Pressure Other')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Pressure Other</span>
                        </div>
                    </div>
                    {getAlertForVital('Suit Pressure Other') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Suit Pressure Other</div>
                        </div>
                    )}
                </div>

                <div className="pressure-column">
                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.suit_pressure_total, 'Suit Pressure Total')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Pressure Total</span>
                        </div>
                    </div>
                    {getAlertForVital('Suit Pressure Total') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Suit Pressure Total</div>
                        </div>
                    )}
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.helmet_pressure_co2, 'Helmet Pressure CO2')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Helmet Pressure</span>
                        </div>
                    </div>
                    {getAlertForVital('Helmet Pressure CO2') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Helmet Pressure CO2</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SuitPressure;