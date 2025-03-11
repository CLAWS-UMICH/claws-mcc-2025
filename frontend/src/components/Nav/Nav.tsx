import React, { useState } from 'react';
import './Nav.css';
import NavOptions from './NavOptions.tsx';
import DefaultState from './DefaultState.tsx';
import Map from './map/Map'
import { WaypointType, type Waypoint } from './types.ts'


const Nav = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

    const togglePanel = () => {
        setIsCollapsed(!isCollapsed);
    };

    const waypointData = [
        { waypoint_id: 1, location: { latitude: 37.7749, longitude: -122.4194 }, type: "Type A", title: "Waypoint 1" },
        { waypoint_id: 2, location: { latitude: 34.0522, longitude: -118.2437 }, type: "Type B", title: "Waypoint 2" },
        { waypoint_id: 3, location: { latitude: 40.7128, longitude: -74.0060 }, type: "Type C", title: "Waypoint 3" },
        { waypoint_id: 4, location: { latitude: 40.7128, longitude: -74.0060 }, type: "Type C", title: "Waypoint 3" },
        { waypoint_id: 5, location: { latitude: 40.7128, longitude: -74.0060 }, type: "Type C", title: "Waypoint 3" },
        { waypoint_id: 6, location: { latitude: 90.7128, longitude: 70.0060 }, type: "Type C", title: "Waypoint 3" }
    ];


    return (
        <>
            <NavOptions waypoints={waypoints} setWaypoints={setWaypoints} />
            <div style={{ display: "flex" }}>
                {/* <DefaultState waypoints={waypoints} setWaypoints={setWaypoints} /> */}
                <DefaultState waypoints={waypointData} setWaypoints={setWaypoints} />
                <Map waypoints={waypoints} setWaypoints={setWaypoints} />
            </div>
        </>
    );
};

export default Nav;