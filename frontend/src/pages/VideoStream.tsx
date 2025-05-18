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
  const [ipAddress, setIpAddress] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<'low' | 'med' | 'high'>('med');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startStream = () => {
    if (!ipAddress) return;
    
    setError(null);
    setIsStreaming(false);
    
    const streamUrl = `https://${ipAddress}/api/holographic/stream/live_${quality}.mp4?holo=true&pv=true&mic=false&loopback=false&RenderFromCamera=true`;
    
    if (videoRef.current) {
      // Reset video element
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
      
      // Set new source and play
      videoRef.current.src = streamUrl;
      videoRef.current.play()
        .then(() => {
          setIsStreaming(true);
          setError(null);
        })
        .catch((err) => {
          console.log('Play error:', err);
          setError('Failed to connect to stream. Please check if the HoloLens is streaming.');
          setIsStreaming(false);
        });
    }
  };

  const openStreamInNewTab = () => {
    if (!ipAddress) return;
    const streamUrl = `https://${ipAddress}/api/holographic/stream/live_${quality}.mp4?holo=true&pv=true&mic=false&loopback=false&RenderFromCamera=true`;
    window.open(streamUrl, '_blank');
  };

  useEffect(() => {
    // Join the VIDEO room on component mount
    socket.emit('join_room', { room: 'VIDEO' });

    return () => {
      socket.emit('leave_room', { room: 'VIDEO' });
      socket.off('room_data');
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Video Stream</h1>

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Enter HoloLens IP Address"
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              width: '200px'
            }}
          />
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as 'low' | 'med' | 'high')}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="low">Low Quality</option>
            <option value="med">Medium Quality</option>
            <option value="high">High Quality</option>
          </select>
          <button
            onClick={startStream}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Connect to Stream
          </button>
          <button
            onClick={openStreamInNewTab}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer'
            }}
            title="Open stream in new tab to accept certificate"
          >
            Accept Certificate
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#ff44336e',
            color: '#ffcccc',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <p style={{ margin: 0 }}>{error}</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9em' }}>
              Try clicking the "Accept Certificate" button to open the stream in a new tab first, 
              accept any security warnings, then come back and try connecting again.
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          style={{
            width: '100%',
            borderRadius: '8px',
            backgroundColor: 'black',
          }}
          controls
          muted
          playsInline
          autoPlay
        />
        
        {!isStreaming && !error && (
          <p style={{ color: '#888', marginTop: '1rem' }}>
            {ipAddress ? 'Click connect to start streaming' : 'Enter HoloLens IP address to start streaming'}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoStream;