import React, { useState } from 'react';
import './NotificationPanel.css';
import NotificationsSettings from './NotificationsSettings';

// Define the Notification type
export interface Notification {
  id: string | number;
  category: string;
  message: string;
  isUnread: boolean;
}

// Props
interface NotificationPanelProps {
  notifications: Notification[];
  onClose?: () => void;
  onMarkAllAsRead?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
}) => {
  const [activeTab, setActiveTab] = useState<'unread' | 'past'>('unread');
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'panel' | 'settings'>('panel');


  const unreadNotifications = notifications.filter((n) => n.isUnread);
  const pastNotifications = notifications.filter((n) => !n.isUnread);
  const activeNotifications =
    activeTab === 'unread' ? unreadNotifications : pastNotifications;

    return (
      <div className="notification-panel">
        {viewMode === 'panel' ? (
          <>
            {/* Header */}
            <div className="notification-panel-header">
              <h2>Notifications</h2>
              <button className="mark-all" onClick={onMarkAllAsRead}>
                Mark all as read
              </button>
              {onClose && (
                <button className="close-button" onClick={onClose}>
                  ✕
                </button>
              )}
            </div>
    
            {/* Tabs + Gear Icon */}
            <div className="notification-tabs-wrapper">
              <div className="notification-panel-tabs-with-settings">
                <div className="notification-panel-tabs">
                  <button
                    className={`tab-button ${
                      activeTab === 'unread' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('unread')}
                  >
                    Unread
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === 'past' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('past')}
                  >
                    Past
                  </button>
                </div>
    
                {/* Gear Icon */}
                <button
                  className="settings-button"
                  onClick={() => setViewMode('settings')}
                  aria-label="Settings"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.14,12.94a7.48,7.48,0,0,0,.05-1l1.65-1.28a.5.5,0,0,0,.12-.66l-1.57-2.72a.5.5,0,0,0-.61-.22l-1.94.78a6.9,6.9,0,0,0-1.67-.97L14.5,4.6A.5.5,0,0,0,14,4H10a.5.5,0,0,0-.5.6L9.53,7.09a6.9,6.9,0,0,0-1.67.97L5.92,7.28a.5.5,0,0,0-.61.22L3.74,10.22a.5.5,0,0,0,.12.66l1.65,1.28a7.48,7.48,0,0,0,0,2l-1.65,1.28a.5.5,0,0,0-.12.66l1.57,2.72a.5.5,0,0,0,.61.22l1.94-.78a6.9,6.9,0,0,0,1.67.97l.06,2.49A.5.5,0,0,0,10,20h4a.5.5,0,0,0,.5-.6l-.06-2.49a6.9,6.9,0,0,0,1.67-.97l1.94.78a.5.5,0,0,0,.61-.22l1.57-2.72a.5.5,0,0,0-.12-.66ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>
                </button>
              </div>
            </div>
    
            {/* Body */}
            <div className="notification-panel-body">
              {activeNotifications.length === 0 ? (
                <div className="notification-panel-empty">
                  {activeTab === 'unread'
                    ? 'No unread notifications'
                    : 'No past notifications'}
                </div>
              ) : (
                <div className="notification-list">
                  {groupNotificationsByCategory(activeNotifications).map(
                    ({ category, items }) => (
                      <div key={category} className="notification-group">
                        <div className="notification-group-header">
                          <span>{category}</span>
                          <span className="notification-count">
                            {items.length} notifications
                          </span>
                        </div>
                        {items.map((notif) => (
                          <div key={notif.id} className="notification-item">
                            <p className="notification-message">{notif.message}</p>
                            {category === 'Vitals' && (
                              <button className="action-button">Open</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="notification-panel-header">
              <h2>Notifications Settings</h2>
              <button
                className="close-button"
                onClick={() => setViewMode('panel')}
              >
                ✕
              </button>
            </div>
            <div className="notification-panel-body">
            <NotificationsSettings onClose={() => setViewMode('panel')} />
            </div>
          </>
        )}
      </div>
    );
};    

// Helper function to group notifications by category
function groupNotificationsByCategory(
  notifications: Notification[]
): { category: string; items: Notification[] }[] {
  const categoryMap: Record<string, Notification[]> = {};
  notifications.forEach((notif) => {
    if (!categoryMap[notif.category]) {
      categoryMap[notif.category] = [];
    }
    categoryMap[notif.category].push(notif);
  });
  return Object.keys(categoryMap).map((category) => ({
    category,
    items: categoryMap[category],
  }));
}

export default NotificationPanel;
