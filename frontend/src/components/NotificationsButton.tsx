import React from 'react';
import './NotificationsButton.css';

interface NotificationsButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

// Bell icon component
const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const NotificationsButton: React.FC<NotificationsButtonProps> = ({ onClick, hasUnread = false }) => {
  return (
    <button 
      className={`notifications-button ${hasUnread ? 'has-unread' : ''}`}
      onClick={onClick}
      aria-label="Open notifications"
    >
      <BellIcon />
      {hasUnread && <span className="notification-badge" />}
    </button>
  );
};

export default NotificationsButton; 