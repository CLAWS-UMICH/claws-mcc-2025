// for web to do in houston
// receive video stream from hololens

// steps
// 1. connect to "VIDEO" room
// 2. receive video stream data (await )
// 3. display video stream in a video element

// FIXME
import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';

const VideoStream: React.FC = () => {
  const [streamData, setStreamData] = useState<string | null>(null); // Base64 or blob data for the video stream
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Join the VIDEO room on component mount
    socket.emit('join_room', { room: 'VIDEO' });

    // Listen for video stream data
    socket.on('room_data', (data: string) => {
      console.log('Received video stream data:', data);
      setStreamData(data);
    });

    // Clean up on component unmount
    return () => {
      socket.emit('leave_room', { room: 'VIDEO' });
      socket.off('room_data');
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && streamData) {
      // Update the video source when new stream data is received
      videoRef.current.src = `data:video/mp4;base64,${streamData}`;
      videoRef.current.play().catch((err) => console.error('Error playing video:', err));
    }
  }, [streamData]);

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Video Stream</h1>

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {streamData ? (
          <video
            ref={videoRef}
            style={{ width: '100%', borderRadius: '8px', backgroundColor: 'black' }}
            controls
            muted
          />
        ) : (
          <p style={{ color: '#888' }}>Waiting for video stream...</p>
        )}
      </div>
    </div>
  );
};

export default VideoStream;