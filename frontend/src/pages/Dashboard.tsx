import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Dashboard</h1>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <p>Welcome to the CLAWS System Dashboard. Navigate to different sections below:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/vitals" style={linkStyle}>
            Go to Vitals
          </Link>
          <Link to="/messaging" style={linkStyle}>
            Go to Messaging
          </Link>
          <Link to="/video-stream" style={linkStyle}>
            Go to Video Stream
          </Link>
        </div>
      </div>
    </div>
  );
};

const linkStyle: React.CSSProperties = {
  backgroundColor: '#0066ff',
  color: 'white',
  padding: '0.75rem 1rem',
  borderRadius: '4px',
  textDecoration: 'none',
  textAlign: 'center',
  transition: 'background-color 0.2s ease',
};

export default Dashboard;