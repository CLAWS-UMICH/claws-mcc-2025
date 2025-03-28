import React, { useState, useEffect } from 'react';
import './Nav.css';
import NavOptions from './NavOptions';
import DefaultState from './DefaultState';
import Map from './map/Map';
import { WaypointType, AuthorType, Waypoint, WaypointAR } from './types';
import { io, Socket } from 'socket.io-client';
import { PiUsbThin } from 'react-icons/pi';


const Nav: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([
        { waypoint_id: 1, author: AuthorType.LMCC, location: { lat: 29.565369133556835, long: -95.0819529674787 }, type: WaypointType.GEO, title: "Top Left" },
        { waypoint_id: 2, author: AuthorType.LMCC, location: { lat: 29.56476723137908, long: -95.08149860397305 }, type: WaypointType.NAV, title: "Waypoint 2" },
        { waypoint_id: 3, author: AuthorType.LMCC, location: { lat: 29.565249461045536, long: -95.08134679492866 }, type: WaypointType.STATION, title: "Waypoint 3" },
        { waypoint_id: 4, author: AuthorType.LMCC, location: { lat: 29.564939230058076, long: -95.08120752873609 }, type: WaypointType.DANGER, title: "Waypoint 4" },
        { waypoint_id: 5, author: AuthorType.LMCC, location: { lat: 29.565157705835315, long: -95.08070786870931 }, type: WaypointType.GEO, title: "Waypoint 5" },
        { waypoint_id: 6, author: AuthorType.LMCC, location: { lat: 29.564850123456789, long: -95.08100123456789 }, type: WaypointType.NAV, title: "Waypoint 6" },
        { waypoint_id: 7, author: AuthorType.LMCC, location: { lat: 29.56440830845782, long: -95.08071056957434 }, type: WaypointType.GEO, title: "Bottom Right" },
    ]);
    const [socket, setSocket] = useState<Socket>();

    const formatWaypoint = (waypoint_ar : WaypointAR["data"]) => {
      // Format waypoint from AR format to Web format
      return  {
        "waypoint_id": waypoint_ar.id,
        "author": waypoint_ar.author,
        "title": waypoint_ar.name,
        "location": {
          "lat": waypoint_ar.location.lat,
          "long": waypoint_ar.location.long
        },
        "type": waypoint_ar.type,
    }
    }

    const sendWaypoint = (waypoint : Waypoint) => {
      if (!socket) {
          console.error("Socket not connected");
          return;
      }

      // Waypoint in format AR is expecting
      const ar_waypoint = {
        "room": "NAV",
        "use": "PUT",
        "data" : {
          "id": waypoint.waypoint_id,
          "location": {
            "lat": waypoint.location.lat, 
            "long": waypoint.location.long
          },
          "type": waypoint.type,
          "author": waypoint.author
        }
      }

      socket.emit("send_to_room", { room: "NAV", ar_waypoint });
      console.log("Waypoint sent:", ar_waypoint);
  };


    useEffect(() => {
      // Connect to the Socket.IO server & listen for new waypoints to add
      const socket = io('http://localhost:8080');
  
      // Join the NAV room on connection
      socket.on('connect', () => {
        console.log('Connected to server');
  
        // Join NAV room
        socket.emit('join_room', { room: 'NAV' });
        setSocket(socket);
      });
  
      // Listen for messages sent to the NAV room
      socket.on('room_data', (data: any) => {
        console.log('Message received in NAV room:', data);
        
        // Ignore messages from WebSocket unless they are for adding waypoint
        if (data.use === 'PUT') {
          // Add waypoint from AR
          const newWaypoint = formatWaypoint(data.data); // data.data to get the actual waypoint, not metadata
          console.log('Appending new waypoint:', newWaypoint);
          setWaypoints((prevWaypoints) => [...prevWaypoints, newWaypoint]);
        }
      });    
      // Clean up connection on component unmount
      return () => {
        socket.emit('leave_room', { room: 'NAV' });
        socket.disconnect();
      };
  
    }, []);

    const togglePanel = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <NavOptions waypoints={waypoints} setWaypoints={setWaypoints} sendWaypoint={sendWaypoint} />
            <div style={{ display: "flex" }}>
                <DefaultState waypoints={waypoints} setWaypoints={setWaypoints} />
                <Map waypoints={waypoints} setWaypoints={setWaypoints} />
            </div>
        </>
    );
};

export default Nav;