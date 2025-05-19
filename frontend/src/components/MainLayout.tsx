import React, { useState, useEffect } from 'react';
import VideoStream from '../pages/VideoStream';

interface MainLayoutProps {
  children: React.ReactNode;
}

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ color: 'white', fontSize: '1.2rem', fontFamily: 'monospace' }}>
      {formatTime(time)}
    </div>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div style={{ 
      display: 'flex',
      width: '100%',
      height: 'calc(100vh - 48px)', // Account for nav bar
    }}>
      <div style={{ 
        width: '33%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        borderRight: '1px solid #333'
      }}>
        <VideoStream streamId={1} />
        <VideoStream streamId={2} />
      </div>
      <div style={{ 
        width: '67%',
        overflow: 'auto'
      }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout; 