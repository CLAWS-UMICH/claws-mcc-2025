import React from 'react';
import './NavOptions.css';
import AddWaypoint from './AddWaypoint';
import { Waypoint } from './types';

interface NavOptionsProps {
    waypoints: Waypoint[];
    setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
    sendWaypoint: ( waypoint : Waypoint ) => void;
}

const NavOptions: React.FC<NavOptionsProps> = ({ waypoints, setWaypoints, sendWaypoint }) => {
    return (
        <div className="nav-options">
            <div className="left-section">Navigation</div>
            <div className="right-section">
                <AddWaypoint waypoints={waypoints} setWaypoints={setWaypoints} sendWaypoint={sendWaypoint} />
                <button className="btn">
                    <span>Create Route</span>
                </button>
            </div>
        </div>
    );
};

export default NavOptions;