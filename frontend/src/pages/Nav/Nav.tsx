import React, { useState, useEffect, useRef } from 'react';
import './Nav.css';
import NavOptions from './NavOptions';
import DefaultState from './DefaultState';
import Map from './map/Map';
import { WaypointType, Waypoint } from './types';
import { io, Socket } from 'socket.io-client';

const Nav: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([
        // { waypoint_id: 1, location: { lat: 29.565369133556835, long: -95.0819529674787 }, type: WaypointType.GEO, title: "Top Left" },
        // { waypoint_id: 2, location: { lat: 29.56476723137908, long: -95.08149860397305 }, type: WaypointType.NAV, title: "Waypoint 2" },
        // { waypoint_id: 3, location: { lat: 29.565249461045536, long: -95.08134679492866 }, type: WaypointType.STATION, title: "Waypoint 3" },
        // { waypoint_id: 4, location: { lat: 29.564939230058076, long: -95.08120752873609 }, type: WaypointType.DANGER, title: "Waypoint 4" },
        // { waypoint_id: 5, location: { lat: 29.565157705835315, long: -95.08070786870931 }, type: WaypointType.GEO, title: "Waypoint 5" },
        // { waypoint_id: 6, location: { lat: 29.564850123456789, long: -95.08100123456789 }, type: WaypointType.NAV, title: "Waypoint 6" },
        // { waypoint_id: 7, location: { lat: 29.56440830845782, long: -95.08071056957434 }, type: WaypointType.GEO, title: "Bottom Right" },
        // { waypoint_id: 1, location: { lat: -5660, long: -9950 }, type: WaypointType.GEO, title: "TSS sample" },
        {
            waypoint_id: -1, // eva1 waypoint
            location: { lat: -5660, long: -9980 },
            type: WaypointType.GEO, // Using NAV type for EVAs
            title: "EVA 1"
        },
        {
            waypoint_id: -2, // eva2 waypoint
            location: { lat: -5660, long: -9990 },
            type: WaypointType.DANGER, // Using NAV type for EVAs
            title: "EVA 2"
        }
    ]);

    // TSS state
    const [tssData, setTssData] = useState(null);
    const [isTssConnected, setIsTssConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Initialize socket connection and TSS room
    useEffect(() => {

        // Create socket connection
        socketRef.current = io("http://localhost:8080");
        const socket = socketRef.current;

        // Join TSS room when component mounts
        socket.emit('join_tss_room');

        // Set up event listeners
        socket.on('join_response', (response) => {
            console.log(`Joined room: ${response.room}`);
            setIsTssConnected(true);
        });

        socket.on('leave_response', (response) => {
            console.log(`Left room: ${response.room}`);
            setIsTssConnected(false);
        });

        socket.on('tss_update', (data) => {
            console.log('Received TSS update:', data);
            setTssData(data);
            // You might want to process the TSS data here or in another effect
            processTssData(data);
        });

        // Clean up on unmount
        return () => {
            if (socket) {
                socket.emit('leave_tss_room');
                socket.disconnect();
            }
        };
    }, []);


    // Process TSS data - customize this function based on your needs
    const processTssData = (data) => {
        if (!data || !data.imu) return;

        // Process EVA1 data
        if (data.imu.eva1) {
            const { posx, posy } = data.imu.eva1;
            console.log("EVA1 posx: ", posx);
            console.log("EVA1 posy: ", posy);
            // Convert IMU coordinates to lat/long
            // const location = UTMtoLatLong(posx, posy);
            const location = {
                lat: posx,
                long: posy
            }

            // Update EVA1 waypoint in waypoints array
            setWaypoints(prevWaypoints => {
                const updatedWaypoints = prevWaypoints.map(waypoint => {
                    if (waypoint.waypoint_id === -1) { // Assuming -1 is the ID for EVA1
                        return {
                            ...waypoint,
                            location
                        };
                    }
                    return waypoint;
                });
                return updatedWaypoints;
            });
        }

        // Process EVA2 data
        if (data.imu.eva2) {
            const { posx, posy } = data.imu.eva2;
            console.log("EVA2 posx: ", posx);
            console.log("EVA2 posy: ", posy);
            // Convert IMU coordinates to lat/long
            // const location = UTMtoLatLong(posx, posy);
            const location = {
                lat: posx,
                long: posy
            }

            // Update EVA2 waypoint in waypoints array
            setWaypoints(prevWaypoints => {
                const updatedWaypoints = prevWaypoints.map(waypoint => {
                    if (waypoint.waypoint_id === -2) { // Assuming -2 is the ID for EVA2
                        return {
                            ...waypoint,
                            location
                        };
                    }
                    return waypoint;
                });
                return updatedWaypoints;
            }
            );

        }

        console.log("Updated waypoints: ", waypoints);

    };


    const togglePanel = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <NavOptions
                waypoints={waypoints}
                setWaypoints={setWaypoints}
                tssConnected={isTssConnected}  // Pass TSS connection status if needed
            />
            <div style={{ display: "flex" }}>
                <DefaultState
                    waypoints={waypoints}
                    setWaypoints={setWaypoints}
                    tssData={tssData}  // Pass TSS data to components that need it
                />
                <Map
                    waypoints={waypoints}
                    setWaypoints={setWaypoints}
                    tssData={tssData}  // Pass TSS data to Map component
                />
            </div>

            {/* Optional: TSS Status Indicator */}
            <div className="tss-status">
                TSS Status: {isTssConnected ? 'Connected' : 'Disconnected'}
            </div>
        </>
    );
};

export default Nav;