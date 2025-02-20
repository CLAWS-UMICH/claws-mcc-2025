import React, { useState } from 'react';
import Select from 'react-select';
import './Panel.css';
import './Nav.css'

import filterImage from './images/filter.png';
import webAssetImage from './images/webAsset.png';


const DefaultState = () => {

    const typeOptions = [
        { value: 'samples', label: 'Samples', icon: '⬡' },
        { value: 'stations', label: 'Stations', icon: 'S' },
    ];

    const distanceOptions = [
        { value: '1_mile', label: 'Within 1 mile', icon: '' },
        { value: '5_miles', label: 'Within 5 miles', icon: '' },
        { value: '10_miles', label: 'Within 10 miles', icon: '' },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#000', // Black background
            border: '1px solid #555', // Border color
            borderRadius: '8px', // Rounded corners
            boxShadow: 'none',
            minHeight: '35px',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#aaa', // Placeholder text color
        }),
        singleValue: (provided) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            color: '#fff', // White text color
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#000', // Dark background for tags
            borderRadius: '8px', // Rounded corners for tags
            display: 'flex',
            alignItems: 'center',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#fff', // White text for tag labels
            display: 'flex',
            alignItems: 'center',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#fff', // White "X" color
            cursor: 'pointer',
            ':hover': {
                color: '#f00', // Red on hover
                backgroundColor: 'transparent',
            },
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#fff', // White dropdown arrow
            ':hover': {
                color: '#aaa', // Lighter arrow on hover
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#222', // Dropdown menu background
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#333' : '#222', // Highlighted option
            color: state.isSelected ? '#fff' : '#aaa', // Selected/Unselected text color
        }),
    };

    const formatOptionLabel = ({ label, icon }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>{icon}</span> {/* Icon */}
            {label}
        </div>
    );

    return (
        <>
            <div style={{ width: "33%", backgroundColor: "black", color: "white" }}>
                <div className="panel-contents">
                    {/* Search Bar */}
                    <div className="search-bar-section">
                        <button className="close-btn">✖</button>
                        <div className="search-bar">
                            <input type="text" placeholder="Search" />
                        </div>
                    </div>
                    {/* Filter Section */}
                    <div className="filter-section">
                        <span className="icon-header">
                            <img className="icon" src={filterImage} alt="test" />
                            <text>Filter</text>
                        </span>
                        <div className="type-section">
                            <label>Type</label>
                            <Select
                                options={typeOptions}
                                isMulti
                                placeholder=""
                                styles={customStyles}
                                formatOptionLabel={formatOptionLabel}
                            />
                        </div>
                        <div className="distance-section">
                            <label>Distance</label>
                            <Select
                                options={distanceOptions}
                                placeholder=""
                                styles={customStyles}
                                formatOptionLabel={formatOptionLabel}
                            />
                        </div>
                    </div>

                    {/* Stations Section */}
                    <div className="stations-section">
                        <span className="icon-header">
                            <img className="icon" src={webAssetImage} alt="test" />
                            <text>Stations</text>
                        </span>
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
        </>
    );
};

export default DefaultState;