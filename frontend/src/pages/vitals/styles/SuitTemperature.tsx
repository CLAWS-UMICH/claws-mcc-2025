import '../../styles/suitAtmosphere.css';


function SuitTemperature({ suitData }) {
    return (
        <>
            <span>
                Suit Temperature
            </span>
            <div className="panel panel-header-padding">
                <div className="data-section">
                    <div className="data-row">
                        <span className="data-value">
                            {suitData.temperature || '0'}
                        </span>
                        <div className="data-labels">
                            <span className="unit">°F</span>
                            <span className="label">Temperature</span>
                        </div>
                    </div>
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {suitData.coolant_liquid_pressure}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Coolant Liq. Press.</span>
                        </div>
                    </div>
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {suitData.coolant_gas_pressure}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Coolant Gas Press.</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SuitTemperature;