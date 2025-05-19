import React from 'react';
import VideoStream from '../pages/VideoStream';

interface MainLayoutProps {
  children: React.ReactNode;
}

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