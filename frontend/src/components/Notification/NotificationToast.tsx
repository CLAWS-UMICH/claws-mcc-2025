import React, { useEffect, useRef } from 'react';
import { Notification } from '../../types/notifications';
import sampleImage from './image.png';
import './NotificationPanel.css';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onClose 
}) => {
  const toastRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-dismiss if set to non-persistent
    if (notification.persistence === 'NON_PERSISTENT') {
      const timer = setTimeout(() => {
        onClose();
      }, 7500);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  // Format timestamp to show "now" for fresh notifications
  const formatTime = () => 'now';

  return (
    <div 
      ref={toastRef}
      className="notification-toast"
    >
      <div className="notification-item with-thumbnail">
        <img src={sampleImage} alt="" className="notification-thumbnail" />
        
        <div className="notification-content">
          <p className="notification-message">{notification.message}</p>
          <div className="notification-meta">
            {notification.metadata?.subcategory && (
              <>
                <span>{notification.metadata.subcategory}</span>
                <span className="dot-separator">•</span>
              </>
            )}
            <span>{formatTime()}</span>
          </div>
          
          {notification.type === 'ACTION' && (
            <div className="notification-actions">
              <button className="action-button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                </svg>
                Open
              </button>
              <button className="action-button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
                </svg>
                Share
              </button>
            </div>
          )}
        </div>
        
        <button className="notification-menu" title="More options" onClick={(e) => e.stopPropagation()}>⋯</button>
        <button className="notification-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default NotificationToast; 