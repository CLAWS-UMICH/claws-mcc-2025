import React, { useState } from 'react';
import Select from 'react-select';
import './Panel.css';
import './Nav.css'

const DefaultState = () => {

    const options = [
        { value: 'samples', label: 'Samples' },
        { value: 'stations', label: 'Stations' }
    ];

    return (
        <>
            <div className="main-container">
                <div className="panel">
                    <div className="panel-contents">
                        {/* Search Bar */}
                        <button className="close-btn">✖</button>
                        <div className="search-bar">
                            <input type="text" placeholder="Search" />
                        </div>

                        {/* Filter Section */}
                        <div className="filter-section">
                            <h3>Filter</h3>
                            <div className="filter-type">
                                <label>Type</label>
                                <div className="tags">
                                    <Select className="tag" options={options} />
                                </div>
                            </div>
                            <div className="filter-distance">
                                <label>Distance</label>
                                <select>
                                    <option>Within 1 mile</option>
                                    <option>Within 5 miles</option>
                                    <option>Within 10 miles</option>
                                </select>
                            </div>
                        </div>

                        {/* Stations Section */}
                        <div className="stations-section">
                            <h3>Stations</h3>
                            <div className="station-item">
                                <span className="station-icon">A</span>
                                <div className="station-info">
                                    <h4>The Hab</h4>
                                    <p>Location: 42.265869, -83.750031</p>
                                    <p>Date: 1/25/2024</p>
                                    <p>Time: 14:21:12</p>
                                    <p>Slope: Avg. 7.5°</p>
                                    <p>Surface Texture: Soft</p>
                                </div>
                            </div>
                        </div>

                        <div className="station-item">
                            <span className="station-icon">B</span>
                            <div className="station-info">
                                <h4>Comms Tower</h4>
                                <p>Location: 42.265869, -83.750031</p>
                                <p>Date: 1/25/2024</p>
                                <p>Time: 14:21:12</p>
                                <p>Slope: Unavailable</p>
                                <p>Surface Texture: Hard</p>
                            </div>
                        </div>

                        {/* Samples Section */}
                        <div className="samples-section">
                            <h3>Samples</h3>
                            {/* Add sample items here */}
                        </div>
                    </div>
                </div>

                <div className="background-img">
                    
                </div>
            </div>
        </>
    );
};

export default DefaultState;