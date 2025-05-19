import './styles/suitTemperature.css';
import './styles/ToastStyles.css';

function SuitTemperature({ suitData }) {
  const alerts = suitData.alerts.AllAlerts ?? [];

  const getAlert = vital => alerts.find(a => a.vital === vital);

  /** generic value renderer */
  const Vital = ({ value, vital, unit, label }) => {
    const isAlert = !!getAlert(vital);
    return (
      <>
        <div className="data-row">
          <span className="data-value-vital" style={{ color: isAlert ? '#FF3B30' : '#e0e0e0' }}>
            {parseFloat(value).toFixed(1)}
          </span>
          <div className="data-labels">
            <span className="unit">{unit}</span>
            <span className="vital-label">{label}</span>
          </div>
        </div>
        {isAlert && (
          <div className="alert-indicator" style={{ paddingLeft: '2rem' }}>
            <div className="alert-icon">⚠</div>
            <div className="alert-text">{label}</div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="suit-temperature-panel">
      <div className="temperature-box-header">
        <span className="large-text">Suit Temperature</span>
      </div>

      <div className="vital-data-section">
        <Vital
          value={suitData.temperature}
          vital="temperature"
          unit="°F"
          label="Temperature"
        />
        <hr className="vital-horizontal-line" />
        <Vital
          value={suitData.coolant_liquid_pressure}
          vital="coolant_liquid_pressure"
          unit="PSI"
          label="Coolant Liq. Press."
        />
        <hr className="vital-horizontal-line" />
        <Vital
          value={suitData.coolant_gas_pressure}
          vital="coolant_gas_pressure"
          unit="PSI"
          label="Coolant Gas Press."
        />
      </div>
    </div>
  );
}

export default SuitTemperature;
