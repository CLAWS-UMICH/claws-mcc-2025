import React, { useState } from 'react';
import RecentTripsModal from '../components/RecentTripsModal';
import './PRScreen.css';
import map from '../images/map.jpeg'; // Keep the background image

const GaugeDisplay = ({ value, unit, label, className = '' }: { value: number | string, unit?: string, label?: string, className?: string }) => (
    <div className={`gauge-display-area ${className}`}>
        {label && <div className="gauge-label">{label}</div>}
        <span className="gauge-main-value">{value}</span>
        {unit && <span className="gauge-sub-unit">{unit}</span>}
    </div>
);

const VerticalGauge = ({ value, label, max = 100 }: { value: number, label: string, max?: number }) => (
    <div className="vertical-gauge-placeholder">
        <div className="vertical-gauge-label">{label}</div>
        <div className="vertical-gauge-content">
            <div className="vertical-gauge-bar-container">
                <div
                    className="vertical-gauge-bar-value"
                    style={{ height: `${Math.min((value / max) * 100, 100)}%` }}
                ></div>
            </div>
            <div className="vertical-gauge-percentage">{value}%</div>
        </div>
    </div>
);

const initialRecentTrips = [
    { id: 1, date: "April 08 2025", distance: 45, duration: "1 hour 15 min 02 sec", battery: 35, timeRange: "14:30:10 - 15:45:12" },
    { id: 2, date: "April 07 2025", distance: 103, duration: "2 hours 8 min 19 sec", battery: 53, timeRange: "09:24:52 - 11:33:11" },
    // ... other trips
];

// --- Mock Data for Map ---
const mockWaypoints = [
    { id: 'wp1', label: 'A', top: '65%', left: '35%', shape: 'circle', color: '#FFEB3B' }, // Yellow Circle
    { id: 'wp2', label: 'B', top: '45%', left: '60%', shape: 'circle', color: '#FF9800' }, // Orange Diamond
    { id: 'wp3', label: 'C', top: '30%', left: '80%', shape: 'circle', color: '#4CAF50' }, // Green Hexagon
];

const mockRover = {
    top: '55%', // Position between waypoint 1 and 2
    left: '47.5%',
    rotation: 80, // Pointing towards waypoint 2 from waypoint 1 (approx)
};
// --- End Mock Data ---

const PRScreen = () => {
    const batteryTime = "18hr 46Min";
    const oxygenTime = "18hr 46Min";
    const isBatteryLow = true;
    const oxygenPressure = 2000;
    const oxygenStorage = 70;
    const coolantStorage = 40;
    const speed = 40;
    const surfaceIncline = 32;
    const currentTrip = { distance: 12, duration: "5 min", battery: 21 };
    const mostRecentTripForDisplay = initialRecentTrips.length > 0 ? initialRecentTrips[0] : null;
    const currentPosition = { x: 0.0009, y: 0.2453 }; // Still used for the text display

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allRecentTrips, setAllRecentTrips] = useState(initialRecentTrips);
    const [selectedTripIds, setSelectedTripIds] = useState([]);

    const openModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTripIds([]);
    };

    // --- Handlers for Modal (Keep existing) ---
    const handleSelectTrip = (tripId) => {
        setSelectedTripIds(prevSelected =>
            prevSelected.includes(tripId)
                ? prevSelected.filter(id => id !== tripId)
                : [...prevSelected, tripId]
        );
    };
    const handleSelectAll = () => {
        setSelectedTripIds(allRecentTrips.map(trip => trip.id));
    };
    const handleDeselectAll = () => {
        setSelectedTripIds([]);
    };
    const handleDeleteTrip = (tripIdToDelete) => {
        console.log("Deleting trip:", tripIdToDelete);
        setAllRecentTrips(prev => prev.filter(t => t.id !== tripIdToDelete));
        setSelectedTripIds(prev => prev.filter(id => id !== tripIdToDelete));
    };
    const handleDeleteSelectedTrips = () => {
        console.log("Deleting selected trips:", selectedTripIds);
        setAllRecentTrips(prev => prev.filter(t => !selectedTripIds.includes(t.id)));
        setSelectedTripIds([]);
    };
    // --- End Handlers ---

    // Calculate SVG path data string from waypoint coordinates
    const calculatePath = (waypoints) => {
        if (waypoints.length < 2) return "";
        // Convert percentages to pixel values (assuming a container size, or use relative units)
        // For SVG, we often use viewBox and percentages directly work well.
        const points = waypoints.map(wp => `${wp.left.replace('%', '')},${wp.top.replace('%', '')}`).join(' ');
        return `M ${points}`; // Creates a polyline path
    };

    const pathData = calculatePath(mockWaypoints);

    return (
        <div className="rover-dashboard-container">
            <h1 className="main-title">Rover</h1>
            <div className="rover-content">

                {/* Rover Info Column (Keep existing structure) */}
                <div className="rover-info-column">
                    <h2 className="column-title">Rover Information</h2>
                    {/* ... Existing info cards ... */}
                     <div className="info-card current-crews-card">
                        <h2 className="card-title">
                        <span className="icon-placeholder">👥</span>
                        Current Crews
                        </h2>
                        <div className="crew-list">
                        <div className="crew-member">
                            <div className="crew-icon alex-icon">A</div>
                            <span>Alex</span>
                            <span className="status-dot green"></span>
                        </div>
                        <div className="crew-member">
                            <div className="crew-icon steve-icon">S</div>
                            <span>Steve</span>
                            <span className="status-dot red"></span>
                        </div>
                        </div>
                    </div>

                    <div className="dual-card-row left-col-row">
                        <div className="info-card time-left-card">
                            <h2 className="card-title">
                                <span className="icon-placeholder">⏱️</span>
                                Time Left
                            </h2>
                            {/* ... time left content ... */}
                            <div className="time-left-blocks-container">
                                <div className="time-left-block">
                                    {/* ... battery ... */}
                                     <div className="item-row">
                                        <span className="icon-placeholder small-icon">🔋</span>
                                        <label>Battery</label>
                                        <div className="pr-progress-bar-container">
                                            <div className="pr-progress-bar battery-bar" style={{ width: '30%' }}></div>
                                        </div>
                                    </div>
                                    <div className="details-row">
                                        <span className="pr-time-value">{batteryTime}</span>
                                        {isBatteryLow && (
                                            <div className="warning-message">
                                                <span className="warning-icon">▲</span> Rover's Battery is Low
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="time-left-block">
                                    {/* ... oxygen ... */}
                                      <div className="item-row">
                                        <span className="icon-placeholder small-icon">💨</span>
                                        <label>Oxygen</label>
                                        <div className="pr-progress-bar-container">
                                            <div className="pr-progress-bar oxygen-bar" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                    <div className="details-row">
                                        <span className="pr-time-value">{oxygenTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-card pressure-card">
                        <h2 className="card-title">
                            <span className="icon-placeholder">🌡️</span>
                            Oxygen Pressure
                        </h2>
                        <GaugeDisplay value={oxygenPressure} unit="PSI" className="oxygen-pressure-gauge" />
                        </div>
                    </div>

                    <div className="info-card storage-card oxygen-storage-card">
                        <h2 className="card-title">
                        <span className="icon-placeholder">📦</span>
                        Oxygen Storage
                        </h2>
                        <VerticalGauge value={oxygenStorage} label="" />
                    </div>

                    <div className="info-card storage-card coolant-storage-card">
                        <h2 className="card-title">
                        <span className="icon-placeholder">❄️</span>
                        Coolant Storage
                        </h2>
                        <VerticalGauge value={coolantStorage} label="" />
                    </div>
                </div>

                <div className="trip-info-column">
                    <h2 className="column-title">Trip Information</h2>

                    <div className="info-card map-card">
                        <div className="map-container">
                            <img src={map} alt="Satellite Map Background" className="map-background-img" />

                            <svg className="map-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <polyline
                                    points={mockWaypoints.map(wp => `${wp.left.replace('%', '')},${wp.top.replace('%', '')}`).join(' ')}
                                    className="waypoint-connector-line"
                                />
                            </svg>

                            <div className="map-overlays">
                                {mockWaypoints.map((wp) => (
                                    <div
                                        key={wp.id}
                                        className={`map-waypoint waypoint-${wp.shape}`}
                                        style={{
                                            top: wp.top,
                                            left: wp.left,
                                            backgroundColor: wp.color,
                                            borderColor: 'rgba(0, 0, 0, 0.6)'
                                        }}
                                    >
                                        {wp.label}
                                    </div>
                                ))}

                                <div
                                    className="rover-indicator"
                                    style={{
                                        top: mockRover.top,
                                        left: mockRover.left,
                                        transform: `translate(-50%, -50%) rotate(${mockRover.rotation}deg)`
                                    }}
                                >
                                </div>
                            </div>

                            <div className="map-controls">
                                <button className="map-button selected">Satellite</button>
                                <button className="map-button">Topographic</button>
                            </div>

                            <div className="current-position">
                                Current Position <br />
                                x : {currentPosition.x.toFixed(4)} <br />
                                y : {currentPosition.y.toFixed(4)}
                            </div>
                        </div>
                    </div>

                    <div className="dual-card-row">
                        <div className="info-card speed-card">
                             <h2 className="card-title">
                                <span className="icon-placeholder">⚡</span>
                                Speed
                            </h2>
                            <GaugeDisplay value={speed} unit="Miles" className="speed-gauge" />
                        </div>
                        <div className="info-card incline-card">
                           <h2 className="card-title">
                                <span className="icon-placeholder">📐</span>
                                Surface Incline
                            </h2>
                            <GaugeDisplay value={`${surfaceIncline}°`} className="incline-gauge" />
                        </div>
                    </div>

                    {/* Trip Details Cards (Keep existing) */}
                     <div className="info-card trip-details-card">
                        <h2 className="card-title">
                        <span className="icon-placeholder">📍</span>
                        Current Trip
                        </h2>
                        <div className="trip-stats">
                        <div>
                            <label>Distance</label>
                            <span>{currentTrip.distance} mi</span>
                        </div>
                        <div>
                            <label>Duration</label>
                            <span>{currentTrip.duration}</span>
                        </div>
                        <div>
                            <label>Battery Consumption</label>
                            <span>{currentTrip.battery}%</span>
                        </div>
                        </div>
                    </div>

                    <div className="info-card trip-details-card recent-trips-card">
                         <div className="card-title-row">
                            <h2 className="card-title">
                                <span className="icon-placeholder">⏪</span>
                                Recent Trips
                            </h2>
                            <a href="#" className="view-more-link" onClick={openModal}>View More</a>
                            </div>
                            {mostRecentTripForDisplay ? (
                            <>
                                <div className="recent-trip-header">
                                <span>{mostRecentTripForDisplay.date}</span>
                                <span>{mostRecentTripForDisplay.timeRange}</span>
                                </div>
                                <div className="trip-stats">
                                 <div>
                                    <label>Distance</label>
                                    <span>{mostRecentTripForDisplay.distance} mi</span>
                                </div>
                                <div>
                                    <label>Duration</label>
                                    <span>{mostRecentTripForDisplay.duration}</span>
                                </div>
                                <div>
                                    <label>Battery Consumption</label>
                                    <span>{mostRecentTripForDisplay.battery}%</span>
                                </div>
                                </div>
                            </>
                            ) : (
                            <p>No recent trips recorded.</p>
                            )}
                    </div>

                </div>
            </div>

            <RecentTripsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                trips={allRecentTrips}
                selectedIds={selectedTripIds}
                onSelectTrip={handleSelectTrip}
                onDeleteTrip={handleDeleteTrip}
                onDeleteSelected={handleDeleteSelectedTrips}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
            />
        </div>
    );
};

export default PRScreen;