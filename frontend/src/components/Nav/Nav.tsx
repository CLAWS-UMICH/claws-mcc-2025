import React, { useState } from 'react';
import './Nav.css';
import NavOptions from './NavOptions.tsx';
import DefaultState from './DefaultState.tsx';
import Map from './map/Map'
import type { Waypoint } from './types.ts'


const Nav = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [waypoints, setWaypoints] = useState(Array<Waypoint>)

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