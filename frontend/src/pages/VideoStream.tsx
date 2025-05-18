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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startStream = () => {
    if (!ipAddress) return;
    
    setError(null);
    setIsStreaming(false);
    
    const streamUrl = `https://${ipAddress}/api/holographic/stream/live_med.mp4?holo=true&pv=true&mic=false&loopback=false&RenderFromCamera=true`;
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timed out')), 10000);
    });

    if (videoRef.current) {
      videoRef.current.src = streamUrl;
      
      // Add error event listener to get more detailed error information
      videoRef.current.onerror = (e) => {
        console.error('Video error:', videoRef.current?.error);
        const errorCode = videoRef.current?.error?.code;
        let errorMessage = 'Failed to connect to stream. ';
        
        switch (errorCode) {
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage += 'A network error occurred. This might be due to a self-signed certificate. Try opening the stream URL directly in a browser first and accept the certificate.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage += 'The stream format is not supported. Please check if the HoloLens streaming service is running.';
            break;
          default:
            errorMessage += 'Please check the IP address and try again.';
        }
        setError(errorMessage);
      };

      Promise.race([
        videoRef.current.play(),
        timeoutPromise
      ])
        .then(() => {
          setIsStreaming(true);
          setError(null);
        })
        .catch((err) => {
          console.error('Error playing video:', err);
          setIsStreaming(false);
          if (err.message === 'Connection timed out') {
            setError('Connection timed out. Make sure the HoloLens is turned on and connected to the network.');
          }
          // Don't set error here for other cases as it will be handled by onerror event
        });
    }
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
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Enter HoloLens IP Address"
            style={{
              padding: '0.5rem',
              marginRight: '1rem',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              width: '200px'
            }}
          />
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
          </div>
        )}

        <video
          ref={videoRef}
          style={{
            width: '100%',
            borderRadius: '8px',
            backgroundColor: 'black',
            display: isStreaming ? 'block' : 'none'
          }}
          controls
          muted
        />
        
        {!isStreaming && !error && (
          <p style={{ color: '#888' }}>
            {ipAddress ? 'Click connect to start streaming' : 'Enter HoloLens IP address to start streaming'}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoStream;