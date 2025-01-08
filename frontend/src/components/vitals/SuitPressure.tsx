import '../../styles/SuitAtmosphere.css';


function SuitPressure({ suitData }) {
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
                            {suitData.suit_pressure_oxy || '4'}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Pressure Oxy</span>
                        </div>
                    </div>
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {suitData.suit_pressure_co2 || '0.0'}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Pressure CO₂</span>
                        </div>
                    </div>
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {suitData.suit_pressure_other || '0.0'}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Pressure Other</span>
                        </div>
                    </div>
                </div>

                <div className="pressure-column">
                    <div className="data-row">
                        <span className="data-value">
                            {suitData.suit_pressure_total || '4'}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Pressure Total</span>
                        </div>
                    </div>
                    <hr className="horizontal-line" />

                    <div className="data-row">
                        <span className="data-value">
                            {suitData.helmet_pressure || '0.10'}
                        </span>
                        <div className="data-labels">
                            <span className="unit">PSI</span>
                            <span className="label">Helmet Pressure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuitPressure;