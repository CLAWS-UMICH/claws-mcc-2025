import React from 'react';
import { Waypoint, WaypointType } from '../types';

interface WaypointMarkersProps {
    waypoints: Waypoint[];
    MAP_WIDTH: number;
    MAP_HEIGHT: number;
    plotPoint: (lat: number, long: number, width: number, height: number) => { x: number; y: number };
}

const WaypointMarkers: React.FC<WaypointMarkersProps> = ({ waypoints, MAP_WIDTH, MAP_HEIGHT, plotPoint }) => {
    // Waypoint type to color mapping
    const getMarkerColor = (type: WaypointType): string => {
        switch (type) {
            case WaypointType.STATION:
                return 'blue';
            case WaypointType.NAV:
                return 'pink';
            case WaypointType.GEO:
                return 'green';
            case WaypointType.DANGER:
                return 'red';
            default:
                return 'white';
        }
    };

    return (
        <>
            {waypoints.map((waypoint) => {
                const point = plotPoint(waypoint.location.lat, waypoint.location.long, MAP_WIDTH, MAP_HEIGHT);
                return (
                    <div
                        key={waypoint.waypoint_id}
                        style={{
                            position: 'absolute',
                            left: `${point.x}px`,
                            top: `${point.y}px`,
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: getMarkerColor(waypoint.type),
                            transform: 'translate(-50%, -50%)',
                            cursor: 'pointer',
                            zIndex: 4,
                            fontSize: '12px'
                        }}
                        title={waypoint.title}
                    >
                        {waypoint.title}
                    </div>
                );
            })}
        </>
    );
};

export default WaypointMarkers;