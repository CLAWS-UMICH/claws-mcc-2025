import React from 'react';
import rockyardMapBorder from './rockyardMapBorders.png';
import rockyardMap from './rockyardMap.png';
import WaypointMarkers from './WaypointMarkers';
import { Waypoint } from '../types';

export default function Map({ waypoints, setWaypoints }: { waypoints: Waypoint[]; setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>; }) {
    const SCALE = 0.16;
    const LARGE_WIDTH = 4251 * SCALE;
    const LARGE_HEIGHT = 3543 * SCALE;
    const MAP_WIDTH = 3839 * SCALE;
    const MAP_HEIGHT = 3069 * SCALE;

    // coords from google maps
    const topLeft = { lat: 29.565369133556835, long: -95.0819529674787 };
    const bottomRight = { lat: 29.56440830845782, long: -95.08071056957434 };
    const bottomLeftSquare = { lat: 29.564939230058076, long: -95.08120752873609 };
    const topRightSquare = { lat: 29.565157705835315, long: -95.08070786870931 };

    const gridRows = 27;
    const gridCols = 33;

    const latRange = Math.abs(Math.abs(topLeft.lat) - Math.abs(bottomRight.lat));
    const longRange = Math.abs(Math.abs(bottomRight.long) - Math.abs(topLeft.long));

    const latPerGrid = latRange / gridRows;
    const longPerGrid = longRange / gridCols;

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    };

    const relativeContainerStyle = {
        position: 'relative' as 'relative',
        width: LARGE_WIDTH,
        height: LARGE_HEIGHT
    };

    const absoluteImageStyle = {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0
    };

    // Example points (use the correct coordinates to plot)
    const top_left_point = plotPoint(topLeft.lat, topLeft.long, MAP_WIDTH, MAP_HEIGHT);
    const bottom_right_point = plotPoint(bottomRight.lat, bottomRight.long, MAP_WIDTH, MAP_HEIGHT);
    const bottom_left_square = plotPoint(bottomLeftSquare.lat, bottomLeftSquare.long, MAP_WIDTH, MAP_HEIGHT);
    const top_right_square = plotPoint(topRightSquare.lat, topRightSquare.long, MAP_WIDTH, MAP_HEIGHT);

    function latLongToGrid(lat: number, long: number) {
        const latdiff = Math.abs(Math.abs(topLeft.lat) - Math.abs(lat));
        const longdiff = Math.abs(Math.abs(long) - Math.abs(topLeft.long));
        const row = latdiff / latPerGrid;
        const col = longdiff / longPerGrid;
        return { row, col };
    }

    function gridToPixel(gridRow: number, gridCol: number, imageWidth: number, imageHeight: number) {
        const pixelX = (gridCol / gridCols) * imageWidth;
        const pixelY = (gridRow / gridRows) * imageHeight;
        return { x: pixelX, y: pixelY };
    }

    function plotPoint(lat: number, long: number, imageWidth: number, imageHeight: number) {
        const gridPos = latLongToGrid(lat, long);
        return gridToPixel(gridPos.row, gridPos.col, imageWidth, imageHeight);
    }

    return (
        <div style={containerStyle}>
            <div style={relativeContainerStyle}>
                <img
                    src={rockyardMapBorder}
                    alt="Map Border"
                    width={LARGE_WIDTH}
                    height={LARGE_HEIGHT}
                    style={{ ...absoluteImageStyle, zIndex: 1 }}
                />
                <img
                    src={rockyardMap}
                    alt="Map"
                    width={MAP_WIDTH}
                    height={MAP_HEIGHT}
                    style={{ ...absoluteImageStyle, top: (LARGE_HEIGHT - MAP_HEIGHT) / 2, left: (LARGE_WIDTH - MAP_WIDTH) / 2, zIndex: 2 }}
                />
                <div style={{ ...absoluteImageStyle, top: (LARGE_HEIGHT - MAP_HEIGHT) / 2, left: (LARGE_WIDTH - MAP_WIDTH) / 2, width: MAP_WIDTH, height: MAP_HEIGHT, zIndex: 3 }}>
                    <WaypointMarkers waypoints={waypoints} MAP_WIDTH={MAP_WIDTH} MAP_HEIGHT={MAP_HEIGHT} plotPoint={plotPoint} />
                </div>
            </div>
        </div>
    );
}