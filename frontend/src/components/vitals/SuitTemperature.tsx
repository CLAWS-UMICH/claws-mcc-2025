import './styles/suitAtmosphere.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/ToastStyles.css';


function SuitTemperature({ suitData }) {
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
            <span>
                Suit Temperature
            </span>
            <div className="panel panel-header-padding">
                <div className="data-section">
                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.temperature, 'Temperature')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">°F</span>
                            <span className="label">Temperature</span>
                        </div>
                    </div>
                    {getAlertForVital('temperature') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Temperature</div>
                        </div>
                    )}
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.coolant_liquid_pressure, 'coolant_liquid_pressure')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Coolant Liq. Press.</span>
                        </div>
                    </div>
                    {getAlertForVital('coolant_liquid_pressure') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Coolant Liquid Pressure</div>
                        </div>
                    )}
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {renderVital(suitData.coolant_gas_pressure, 'coolant_gas_pressure')}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Coolant Gas Press.</span>
                        </div>
                    </div>
                    {getAlertForVital('coolant_gas_pressure') && (
                        <div style={{ paddingLeft: '2rem' }} className="alert-indicator">
                            <div className="alert-icon">⚠</div>
                            <div className="alert-text">Coolant Gas Pressure</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default SuitTemperature;