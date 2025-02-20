import React, { useState } from 'react';
import './Nav.css';
import NavOptions from './NavOptions.tsx';
import DefaultState from './DefaultState.tsx';
import Map from './map/Map'
import { WaypointType, type Waypoint } from './types.ts'


const Nav = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([{
        waypoint_id: 1,
        type: WaypointType.DANGER,
        title: 'test',
        location: {
            lat: 29.564360949786636,
            long: -95.08237721707329
        }
    }]);

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