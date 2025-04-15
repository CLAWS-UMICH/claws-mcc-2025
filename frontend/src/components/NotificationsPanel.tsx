import React, { useState } from 'react';
import './NotificationsPanel.css';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'unread' | 'past'>('unread');

  if (!isOpen) return null;

  return (
    <div className="notifications-panel-overlay" onClick={onClose}>
      <div className="notifications-panel" onClick={e => e.stopPropagation()}>
        <div className="notifications-header">
          <h2>Notifications</h2>
          <div className="notifications-actions">
            <button onClick={() => console.log('Mark all as read')} className="mark-read-button">
              Mark all as read
            </button>
            <button onClick={onClose} className="close-button" aria-label="Close notifications">
              ×
            </button>
          </div>
        </div>

        <div className="notifications-tabs">
          <button
            className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
          <button
            className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>

        <div className="notifications-content">
          {activeTab === 'unread' && (
            <div className="empty-state">
              <p>No unread notifications</p>
            </div>
          )}
          {activeTab === 'past' && (
            <div className="empty-state">
              <p>No past notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel; 