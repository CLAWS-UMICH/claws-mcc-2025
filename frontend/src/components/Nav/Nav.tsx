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
        { waypoint_id: 1, location: { latitude: 29.565249461045536, longitude: -95.08134679492866 }, type: WaypointType.GEO, title: "Waypoint 1" },
        { waypoint_id: 2, location: { latitude: 29.56476723137908, longitude: -95.08149860397305 }, type: WaypointType.GEO, title: "Waypoint 2" },
        { waypoint_id: 3, location: { latitude: 29.564939230058076, longitude: -95.08120752873609 }, type: WaypointType.GEO, title: "Waypoint 3" },
        { waypoint_id: 4, location: { latitude: 29.565157705835315, longitude: -95.08070786870931 }, type: WaypointType.GEO, title: "Waypoint 3" },
        { waypoint_id: 5, location: { latitude: 29.56507128, longitude: -95.0813060 }, type: WaypointType.GEO, title: "Waypoint 3" },
        { waypoint_id: 6, location: { latitude: 90.7128, longitude: 70.0060 }, type: WaypointType.GEO, title: "Waypoint 3" }
    ];

    /*
    const topLeft = { lat: 29.565369133556835, long: -95.0819529674787 };
    const bottomRight = { lat: 29.56440830845782, long: -95.08071056957434 };
    const bottomLeftSquare = { lat: 29.564939230058076, long: -95.08120752873609 };
    const topRightSquare = { lat: 29.565157705835315, long: -95.08070786870931 };
    */

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