import '../../styles/SuitAtmosphere.css';


function PersonalData({ suitData }) {
    return (
        <div className="panel personal-data">
            <div className="panel-header">
                <img src="personal_data_icon.png" width="25rem" height="25rem" className="panel-header-icon"/>
                <h3>Personal Data</h3>
            </div>

            <div className="data-section">
                <div className="data-row">
                    <span className="data-value">
                        {suitData.heart_rate}
                    </span>
                    <div className="data-labels">
                        <span className="unit">BPM</span>
                        <span className="label">Heart Rate</span>
                    </div>
                </div>
                <hr className="horizontal-line" />

                <div className="data-row">
                    <span className="data-value">
                        {suitData.oxy_consumption}
                    </span>
                    <div className="data-labels">
                        <span className="unit">PSI/MIN</span>
                        <span className="label">O₂ Consumption</span>
                    </div>
                </div>
                <hr className="horizontal-line" />

                <div className="data-row">
                    <span className="data-value">
                        {suitData.co2_production}
                    </span>
                    <div className="data-labels">
                        <span className="unit">PSI/MIN</span>
                        <span className="label">CO₂ Production</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalData;