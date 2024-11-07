import React, { useState, useEffect } from 'react';
import '../styles/suitAtmosphere.css';


const SuitAtmosphere = ({ suitData = {} }) => {
    

    return (
        <div className="suit-atmosphere">
            {/* Personal Data Panel */}
            <div className="suit-section personal-data">
                <div className="section-header">
                    <span className="status-indicator"></span>
                    <h3>Personal Data</h3>
                </div>
                <div className="suit-data-row">
                    <span className="suit-data-value">{suitData.heart_rate || '00'}</span>
                    <div className="suit-data-label-group">
                        <span className="unit-label">BPM</span>
                        <span className="data-label">Heart Rate</span>
                    </div>
                </div>
                <div className="suit-data-row">
                    <span className="suit-data-value">{suitData.oxy_consumption || '00'}</span>
                    <div className="suit-data-label-group">
                        <span className="unit-label">Unit</span>
                        <span className="data-label">O₂ Consumption</span>
                    </div>
                </div>
                <div className="suit-data-row">
                    <span className="suit-data-value">{suitData.co2_production || '00'}</span>
                    <div className="suit-data-label-group">
                        <span className="unit-label">Unit</span>
                        <span className="data-label">CO₂ Production</span>
                    </div>
                </div>
            </div>

            {/* Suit Pressure Panel with Two Columns */}
            <div className="suit-section suit-pressure">
                <div className="section-header">
                    <span className="status-indicator"></span>
                    <h3>Suit Pressure</h3>
                </div>
                <div className="suit-pressure-columns">
                    {/* First Column */}
                    <div className="suit-pressure-column">
                        <div className="suit-data-row">
                            <span className="suit-data-value">{suitData.suit_pressure_oxy || '00'}</span>
                            <div className="suit-data-label-group">
                                <span className="unit-label">PSI</span>
                                <span className="data-label">Pressure O₂</span>
                            </div>
                        </div>
                        <div className="suit-data-row">
                            <span className="suit-data-value">{suitData.suit_pressure_co2 || '00'}</span>
                            <div className="suit-data-label-group">
                                <span className="unit-label">PSI</span>
                                <span className="data-label">Pressure CO₂</span>
                            </div>
                        </div>
                        <div className="suit-data-row">
                            <span className="suit-data-value">{suitData.suit_pressure_other || '00'}</span>
                            <div className="suit-data-label-group">
                                <span className="unit-label">PSI</span>
                                <span className="data-label">Pressure Other</span>
                            </div>
                        </div>
                    </div>

                    {/* Second Column */}
                    <div className="suit-pressure-column">
                        <div className="suit-data-row suit-data-row1">
                            <span className="suit-data-value">{suitData.suit_pressure_total || '00'}</span>
                            <div className="suit-data-label-group">
                                <span className="unit-label">PSI</span>
                                <span className="data-label">Pressure Total</span>
                            </div>
                        </div>
                        <div className="suit-data-row suit-data-row2">
                            <span className="suit-data-value">{suitData.helmet_pressure_co2 || '00'}</span>
                            <div className="suit-data-label-group">
                                <span className="unit-label">PSI</span>
                                <span className="data-label">Helmet Pressure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuitAtmosphere;