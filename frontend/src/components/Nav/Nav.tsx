import React, { useState } from 'react';
import './Nav.css';
import NavOptions from './NavOptions';
import DefaultState from './DefaultState';
import Map from './map/Map';
import { WaypointType, Waypoint } from './types';

const Nav: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([
        { waypoint_id: 1, location: { lat: 29.565369133556835, long: -95.0819529674787 }, type: WaypointType.GEO, title: "Top Left" },
        { waypoint_id: 2, location: { lat: 29.56476723137908, long: -95.08149860397305 }, type: WaypointType.NAV, title: "Waypoint 2" },
        { waypoint_id: 3, location: { lat: 29.565249461045536, long: -95.08134679492866 }, type: WaypointType.STATION, title: "Waypoint 3" },
        { waypoint_id: 4, location: { lat: 29.564939230058076, long: -95.08120752873609 }, type: WaypointType.DANGER, title: "Waypoint 4" },
        { waypoint_id: 5, location: { lat: 29.565157705835315, long: -95.08070786870931 }, type: WaypointType.GEO, title: "Waypoint 5" },
        { waypoint_id: 6, location: { lat: 29.564850123456789, long: -95.08100123456789 }, type: WaypointType.NAV, title: "Waypoint 6" },
        { waypoint_id: 7, location: { lat: 29.56440830845782, long: -95.08071056957434 }, type: WaypointType.GEO, title: "Bottom Right" },
    ]);

    const togglePanel = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <NavOptions waypoints={waypoints} setWaypoints={setWaypoints} />
            <div style={{ display: "flex" }}>
                <DefaultState waypoints={waypoints} setWaypoints={setWaypoints} />
                <Map waypoints={waypoints} setWaypoints={setWaypoints} />
            </div>
        </>
    );
};

export default Nav;