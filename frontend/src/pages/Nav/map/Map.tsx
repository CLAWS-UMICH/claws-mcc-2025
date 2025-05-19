import React from 'react';
import rockyardMapBorder from './rockyardMapBorders.png';
import rockyardMap from './rockyardMap.png';
import WaypointMarkers from './WaypointMarkers';
import { Waypoint } from '../../types';

export default function Map({ waypoints, setWaypoints }: { waypoints: Waypoint[]; setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>; }) {
    const SCALE = 0.3;
    const MAP_WIDTH = 2258 * SCALE;
    const MAP_HEIGHT = 1394 * SCALE;

    const num_rows = 13;
    const num_cols = 21;

    function plotPoint(lat: number, long: number, imageWidth: number, imageHeight: number) {
        // x
        // -5760 -> -5550
        // y
        // -9940 -> -10070
        let top_left_x = -5760
        let top_right_x = -5550
        let total_x_span = Math.abs(top_left_x - top_right_x)

        let top_left_y = -9940
        let bottom_left_y = -10070
        let total_y_span = Math.abs(top_left_y - bottom_left_y)

        let diff_from_left = Math.abs(lat - top_left_x)
        let left_percentage = diff_from_left / total_x_span
        let num_left_padding = left_percentage * imageWidth

        let diff_from_top = Math.abs(long - top_left_y)
        let top_percentage = diff_from_top / total_y_span
        let num_top_padding = top_percentage * imageHeight

        return { x: num_left_padding, y: num_top_padding }
    }

    return (
        <div style={{ position: 'relative', width: MAP_WIDTH, height: MAP_HEIGHT }}>
            <img
                src={rockyardMap}
                alt="Map"
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                style={{ display: 'block', width: '100%', height: '100%' }}
            />
            <div
                style={{
                    backgroundColor: 'transparent', // red with transparency for visibility
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT,
                    zIndex: 1,
                }}
            >
                <WaypointMarkers
                    waypoints={waypoints}
                    MAP_WIDTH={MAP_WIDTH}
                    MAP_HEIGHT={MAP_HEIGHT}
                    plotPoint={plotPoint}
                />
            </div>
        </div>

    );
}