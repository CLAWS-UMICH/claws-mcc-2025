// for web to do in houston
// receive video stream from hololens

// steps
// 1. connect to "VIDEO" room
// 2. receive video stream data (await )
// 3. display video stream in a video element

// FIXME
import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';

interface VideoStreamProps {
  streamId: number;
}

const LoadingSpinner = () => (
  <div style={{
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '2px solid #ffffff33',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }}>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

const VideoStream: React.FC<VideoStreamProps> = ({ streamId }) => {
  const [ipAddress, setIpAddress] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<'low' | 'med' | 'high'>('med');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startStream = () => {
    if (!ipAddress) return;
    setIsConnecting(true);
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
          setIsConnecting(false);
          setError(null);
        })
        .catch((err) => {
          console.log('Play error:', err);
          setError('Failed to connect to stream. Try accepting the certificate first.');
          setIsStreaming(false);
          setIsConnecting(false);
        });
    }
  };

  const openStreamInNewTab = () => {
    if (!ipAddress) return;
    const streamUrl = `https://${ipAddress}/api/holographic/stream/live_${quality}.mp4?holo=true&pv=true&mic=false&loopback=false&RenderFromCamera=true`;
    window.open(streamUrl, '_blank');
  };

  useEffect(() => {
    socket.emit('join_room', { room: 'VIDEO' });
    return () => {
      socket.emit('leave_room', { room: 'VIDEO' });
      socket.off('room_data');
    };
  }, []);

  return (
    <div style={{ 
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <h3 style={{ margin: 0, color: 'white' }}>Stream {streamId}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="HoloLens IP"
            disabled={isConnecting}
            style={{
              padding: '0.25rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              width: '120px'
            }}
          />
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as 'low' | 'med' | 'high')}
            disabled={isConnecting}
            style={{
              padding: '0.25rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white'
            }}
          >
            <option value="low">Low</option>
            <option value="med">Med</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={startStream}
            disabled={isConnecting || !ipAddress}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: isConnecting || !ipAddress ? 'not-allowed' : 'pointer',
              opacity: isConnecting || !ipAddress ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {isConnecting ? <LoadingSpinner /> : 'Connect'}
          </button>
          <button
            onClick={openStreamInNewTab}
            disabled={!ipAddress}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: !ipAddress ? 'not-allowed' : 'pointer',
              opacity: !ipAddress ? 0.7 : 1,
            }}
            title="Open stream in new tab to accept certificate"
          >
            Accept
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#ff44336e',
          color: '#ffcccc',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.9em'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        flex: 1,
        backgroundColor: '#000',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          muted
          playsInline
          autoPlay
        />
        {!isStreaming && !error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            textAlign: 'center'
          }}>
            {isConnecting ? (
              <>
                <LoadingSpinner />
                <div>Connecting to stream...</div>
              </>
            ) : (
              ipAddress ? 'Click connect to start streaming' : 'Enter HoloLens IP address'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStream;