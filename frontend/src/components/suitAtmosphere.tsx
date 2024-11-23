import React from 'React';
import '../styles/suitAtmosphere.css';
import { SuitData } from '../Vitals';

const SuitAtmosphere = ({ suitData }) => {
    if (!suitData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="suit-atmosphere">
            {/* Personal Data Panel */}
            <div className="suit-panel personal-data">
                <div className="panel-header">
                    <span className="status-indicator"></span>
                    <h3>Personal Data</h3>
                </div>

                <div className="data-content">
                    <div className="data-row">
                        <span className="data-value">{suitData.heart_rate || '90'}</span>
                        <div className="data-labels">
                            <span className="unit">BPM</span>
                            <span className="label">Heart Rate</span>
                        </div>
                        <div className="line"></div>
                    </div>

                    <div className="data-row">
                        <span className="data-value">{suitData.oxy_consumption || '0.10'}</span>
                        <div className="data-labels">
                            <span className="unit">PSI/MIN</span>
                            <span className="label">O₂ Consumption</span>
                        </div>
                        <div className="line"></div>
                    </div>

                    <div className="data-row">
                        <span className="data-value">{suitData.co2_production || '0.10'}</span>
                        <div className="data-labels">
                            <span className="unit">PSI/MIN</span>
                            <span className="label">CO₂ Production</span>
                        </div>
                        <div className="line"></div>
                    </div>
                </div>
            </div>

            {/* Suit Pressure Panel */}
            <div className="suit-panel suit-pressure">
                <div className="panel-header">
                    <span className="status-indicator"></span>
                    <h3>Suit Pressure</h3>
                </div>

                <div className="pressure-grid">
                    <div className="pressure-column">
                        <div className="data-row">
                            <span className="data-value">{suitData.suit_pressure_oxy || '4.0'}</span>
                            <div className="data-labels">
                                <span className="unit">PSI</span>
                                <span className="label">Pressure O₂</span>
                            </div>
                        </div>

                        <div className="data-row">
                            <span className="data-value">{suitData.suit_pressure_co2 || '0.0'}</span>
                            <div className="data-labels">
                                <span className="unit">PSI</span>
                                <span className="label">Pressure CO₂</span>
                            </div>
                        </div>

                        <div className="data-row">
                            <span className="data-value">{suitData.suit_pressure_other || '0.0'}</span>
                            <div className="data-labels">
                                <span className="unit">PSI</span>
                                <span className="label">Pressure Other</span>
                            </div>
                        </div>
                    </div>

                    <div className="pressure-column">
                        <div className="data-row">
                            <span className="data-value">{suitData.suit_pressure_total || '4.0'}</span>
                            <div className="data-labels">
                                <span className="unit">PSI</span>
                                <span className="label">Pressure Total</span>
                            </div>
                        </div>

                        <div className="data-row">
                            <span className="data-value">{suitData.helmet_pressure || '0.10'}</span>
                            <div className="data-labels">
                                <span className="unit">PSI</span>
                                <span className="label">Helmet Pressure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuitAtmosphere;