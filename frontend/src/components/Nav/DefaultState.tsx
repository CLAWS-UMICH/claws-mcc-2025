import React, { useState } from 'react';
import Select from 'react-select';
import './DefaultStatePanel.css';
import './Nav.css';
import './Dropdown.css';
import { Waypoint, WaypointType } from './types';

import filterImage from './images/filter.png';
import webAssetImage from './images/webAsset.png';
import upBtn from './images/upBtn.png';
import downBtn from './images/downBtn.png';
import location from './images/locationIcon.png';
import samples from './images/samplesIcon.png';

interface DefaultStateProps {
    waypoints: Waypoint[];
    setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
}

const DefaultState: React.FC<DefaultStateProps> = ({ waypoints, setWaypoints }) => {
    const [stationsTab, setStationsTab] = useState(false);
    const [samplesTab, setSamplesTab] = useState(false);

    const getWaypointTypeLabel = (type: WaypointType): string => {
        switch (type) {
            case WaypointType.STATION: return "Station";
            case WaypointType.NAV: return "Navigation";
            case WaypointType.GEO: return "Geographic";
            case WaypointType.DANGER: return "Danger";
            default: return "Unknown";
        }
    };

    const getWaypointTypeColor = (type: WaypointType): string => {
        switch (type) {
            case WaypointType.STATION: return "#4287f5"; // Blue
            case WaypointType.NAV: return "#f542e5"; // Pink
            case WaypointType.GEO: return "#42f54b"; // Green
            case WaypointType.DANGER: return "#f54242"; // Red
            default: return "#ffffff"; // White
        }
    };

    const waypointComponents = waypoints.map((waypoint) => (
        <div className="station" key={waypoint.waypoint_id}>
            <h3>{waypoint.title}</h3>
            <div className="station-details">
                <div className="station-attribute">
                    <span className="attribute-label">ID: </span>
                    <span className="attribute-value">{waypoint.waypoint_id}</span>
                </div>
                <div className="station-attribute">
                    <span className="attribute-label">Type: </span>
                    <span className="attribute-value" style={{ color: getWaypointTypeColor(waypoint.type) }}>
                        {getWaypointTypeLabel(waypoint.type)}
                    </span>
                </div>
                <div className="station-attribute">
                    <img className="icon" src={location} alt="location icon" />
                    <span className="attribute-label">Coordinates: </span>
                    <span className="attribute-value">
                        {waypoint.location.lat.toFixed(6)}, {waypoint.location.long.toFixed(6)}
                    </span>
                </div>
            </div>
        </div>
    ));

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
        control: (provided: any) => ({
            ...provided,
            backgroundColor: '#000', // Black background
            border: '1px solid #555', // Border color
            borderRadius: '8px', // Rounded corners
            boxShadow: 'none',
            minHeight: '35px',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#aaa', // Placeholder text color
        }),
        singleValue: (provided: any) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            color: '#fff', // White text color
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: '#000', // Dark background for tags
            borderRadius: '8px', // Rounded corners for tags
            display: 'flex',
            alignItems: 'center',
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: '#fff', // White text for tag labels
            display: 'flex',
            alignItems: 'center',
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: '#fff', // White "X" color
            cursor: 'pointer',
            ':hover': {
                color: '#f00', // Red on hover
                backgroundColor: 'transparent',
            },
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: '#fff', // White dropdown arrow
            ':hover': {
                color: '#aaa', // Lighter arrow on hover
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#222', // Dropdown menu background
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#333' : '#222', // Highlighted option
            color: state.isSelected ? '#fff' : '#aaa', // Selected/Unselected text color
        }),
    };

    const formatOptionLabel = ({ label, icon }: { label: string, icon: string }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>{icon}</span> {/* Icon */}
            {label}
        </div>
    );

    return (
        <>
            <div className="panel-container">
                <div className="panel-contents">
                    <div className="top-container">
                        {/* Search Bar */}
                        <div className="search-bar-section">
                            <div className="search-bar">
                                <input type="text" placeholder="Search" />
                            </div>
                        </div>
                        <div className="filter-section">
                            <span className="icon-header">
                                <img className="icon" src={filterImage} alt="filter" />
                                <b>Filter</b>
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
                    </div>

                    <div className="stations-section">
                        <span className="stations-header">
                            <span className="icon-header">
                                <img className="icon" src={webAssetImage} alt="stations" />
                                <b>Stations</b>
                            </span>
                            <button
                                type="button"
                                className="dropdown-btn"
                                onClick={() => setStationsTab(!stationsTab)}
                            >
                                {!stationsTab ? (
                                    <img className="icon" src={downBtn} alt="expand" />
                                ) : (
                                    <img className="icon" src={upBtn} alt="collapse" />
                                )}
                            </button>
                        </span>
                        <div className="scrolling-container">
                            {stationsTab && (
                                <>
                                    {waypointComponents}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Samples Section */}
                    <div className="samples-section">
                        <span className="samples-header">
                            <span className="icon-header">
                                <img className="icon" src={samples} alt="samples" />
                                <b>Samples</b>
                            </span>
                            <button
                                type="button"
                                className="dropdown-btn"
                                onClick={() => setSamplesTab(!samplesTab)}
                            >
                                {!samplesTab ? (
                                    <img className="icon" src={downBtn} alt="expand" />
                                ) : (
                                    <img className="icon" src={upBtn} alt="collapse" />
                                )}
                            </button>
                        </span>
                        <div className="scrolling-container">
                            {samplesTab && (
                                <>
                                    {/* Sample Components will go here */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DefaultState;