import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Singleton pattern for the socket instance
let socket: Socket;

function useSubscribe(room: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!socket) {
      // Only initialize the socket connection once
      const socketUrl = window.location.protocol + '//' + window.location.host;
      console.log(`Initializing socket connection to: ${socketUrl}`);
      socket = io(socketUrl);
    }

    // Join the room when connected
    const handleConnect = () => {
      console.log(`Connected and joining room: ${room}`);
      socket.emit('join_room', { room });
    };

    // Handle incoming data
    const handleRoomData = (incomingData: any) => {
      setData(incomingData);
    };

    // Attach event listeners
    socket.on('connect', handleConnect);
    socket.on('room_data', handleRoomData);

    // Clean up only on component unmount
    return () => {
      if (socket.connected) {
        socket.emit('leave_room', { room });
        console.log(`Leaving room: ${room}`);
      }
      socket.off('connect', handleConnect);
      socket.off('room_data', handleRoomData);
    };
  }, [room]);  // Dependency array ensures it only re-runs if `room` changes

  return [data];
}

export default useSubscribe;
