import React, { useState } from 'react';
import './NavOptions.css';
import AddWaypoint from './AddWaypoint';
const NavOptions = () => {
    const handleWaypointModeChange = (isActive: boolean) => {
        // Handle any parent logic when waypoint mode changes
        console.log('Waypoint mode:', isActive);
    };

    return (
        <div className="nav-options">
            <div className="left-section">Navigation</div>
            <div className="right-section">
                <AddWaypoint onWaypointModeChange={handleWaypointModeChange} />
                <button className="btn">
                    <span> 
                        {/* <img src="./Nav/images/locationAdd.png"/> */}
                        Create Route
                    </span>
                </button>
            </div>
        </div>
    );
};

export default NavOptions;