import React from 'react';
import './RecentTripsModal.css';

const RecentTripsModal = ({
    isOpen,
    onClose,
    trips,
    selectedIds,
    onSelectTrip,
    onDeleteTrip,
    onDeleteSelected,
    onSelectAll,
    onDeselectAll
}) => {
    if (!isOpen) {
        return null;
    }

    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
            onSelectAll();
        } else {
            onDeselectAll();
        }
    };

    const allSelected = trips.length > 0 && selectedIds.length === trips.length;
    const noneSelected = selectedIds.length === 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
                <div className="modal-header">
                    <h2>Recent Trips</h2>
                    <button onClick={onClose} className="close-modal-btn">&times;</button>
                </div>

                <div className="modal-body">
                    <div className="modal-actions">
                         <label className="select-all-label">
                            <input
                                type="checkbox"
                                className="trip-checkbox large-checkbox"
                                checked={allSelected}
                                onChange={handleSelectAllChange}
                                // indeterminate state can be set via JS if needed, but CSS might be simpler for visuals
                                ref={input => {
                                    if (input) {
                                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < trips.length;
                                    }
                                }}
                            />
                            Select All
                        </label>
                        <button
                            className="delete-selected-btn"
                            onClick={onDeleteSelected}
                            disabled={noneSelected} // Disable if nothing is selected
                        >
                           <span className="icon-placeholder small-icon delete-icon">🗑️</span> Delete Selected
                        </button>
                    </div>

                    <ul className="modal-trip-list">
                        {trips.map((trip) => (
                            <li key={trip.id} className={`modal-trip-item ${selectedIds.includes(trip.id) ? 'selected' : ''}`}>
                                <input
                                    type="checkbox"
                                    className="trip-checkbox"
                                    checked={selectedIds.includes(trip.id)}
                                    onChange={() => onSelectTrip(trip.id)}
                                />
                                <div className="trip-info">
                                    <div className="trip-info-header">
                                        <span>{trip.date}</span>
                                        <span>{trip.timeRange}</span>
                                    </div>
                                    <div className="trip-info-stats">
                                        <div>
                                            <label>Distance</label>
                                            <span>{trip.distance} mi</span>
                                        </div>
                                        <div>
                                            <label>Duration</label>
                                            <span>{trip.duration}</span>
                                        </div>
                                        <div>
                                            <label>Battery Consumption</label>
                                            <span>{trip.battery}%</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => onDeleteTrip(trip.id)} className="delete-trip-btn">
                                     <span className="icon-placeholder small-icon delete-icon">🗑️</span>
                                </button>
                            </li>
                        ))}
                         {trips.length === 0 && (
                            <li className="no-trips-message">No recent trips found.</li>
                        )}
                    </ul>
                </div>
                 {/* Optional Footer - could add pagination controls here */}
                {/* <div className="modal-footer">
                    Footer content if needed
                </div> */}
            </div>
        </div>
    );
};

export default RecentTripsModal;