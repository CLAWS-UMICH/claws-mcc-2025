import React, { useState } from 'react';
import './NotificationPanel.css';
import NotificationsSettings from './NotificationsSettings';
import sampleImage from './image.png';
import { 
  Notification,
  NotificationSeverity,
  NotificationType
} from '../../types/notifications';

// Icons for different severities
const SEVERITY_ICONS = {
  [NotificationSeverity.EMERGENCY]: '⚠️',
  [NotificationSeverity.ALERT]: '🔔',
  [NotificationSeverity.LOW]: 'ℹ️'
};

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
  const [viewMode, setViewMode] = useState<'panel' | 'settings'>('panel');

  // Hardcoded Vitals notifications
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([
    {
      id: 'static-1',
      category: 'Vitals',
      message: 'New Geosample waypoint added by Roger',
      isUnread: true,
      severity: NotificationSeverity.ALERT,
      type: NotificationType.ACTION,
      persistence: 'PERSISTENT',
      timestamp: new Date(),
      metadata: { subcategory: 'Waypoints' }
    },
    {
      id: 'static-2',
      category: 'Vitals',
      message: 'New Geosample waypoint added by Roger',
      isUnread: true,
      severity: NotificationSeverity.LOW,
      type: NotificationType.ACTION,
      persistence: 'PERSISTENT',
      timestamp: new Date(),
      metadata: { subcategory: 'Waypoints' }
    },
  ]);
  
  // Merge hardcoded + backend
  const combinedNotifications = [...localNotifications, ...notifications];

  const handleMarkAllAsRead = () => {
    const updatedLocal = localNotifications.map((n) => ({
      ...n,
      isUnread: false,
    }));
    setLocalNotifications(updatedLocal);
  
    onMarkAllAsRead?.();
  };
  
  const unreadNotifications = combinedNotifications.filter((n) => n.isUnread);
  const pastNotifications = combinedNotifications.filter((n) => !n.isUnread);
  const activeNotifications =
    activeTab === 'unread' ? unreadNotifications : pastNotifications;

  // Format timestamp
  const formatTime = () => 'now';

  return (
    <div className="notification-panel">
      {viewMode === 'panel' ? (
        <>
          {/* Header */}
          <div className="notification-panel-header">
            <h2>Notifications</h2>
            <div className="header-actions">
              <button className="mark-all" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
              {onClose && (
                <button className="close-button" onClick={onClose}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="notification-tabs-wrapper">
            <div className="notification-panel-tabs-with-settings">
              <div className="notification-panel-tabs">
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
                  <path d="M19.14,12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l1.92-1.46c.17-.13.23-.36.14-.55l-1.82-3.16c-.09-.19-.3-.26-.5-.18l-2.26.91c-.47-.35-.98-.63-1.52-.83L14.54,3c-.3-.03-.41-.17-.41-.34V1.88c0-.19-.16-.34-.35-.34h-3.63c-.19 0-.35.16-.35.34v1.56c0 .17-.12.31-.31.34l-.57.14c-.62.21-1.17.49-1.67.85l-2.26-.91c-.2-.08-.41 0-.5.18L2.68,7.2c-.09.19-.03.42.14.55l1.92,1.46c-.05.3-.07.62-.07.94s.02.64.07.94l-1.92,1.46c-.17.13-.23.36-.14.55l1.82,3.16c.09.19.3.26.5.18l2.26-.91c.47.35.98.63 1.52.83l.57,2.73c.03.17.14.3.31.34l3.72.7c.17.04.34-.07.37-.24l.55-2.63c.52-.21 1.02-.48 1.47-.83l2.26.91c.2.08.41 0 .5-.18l1.82-3.16c.09-.19.03-.42-.14-.55l-1.92-1.46zm-7.14,2.56c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
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
                        <div 
                          key={notif.id} 
                          className={`notification-item with-thumbnail`}
                        >
                          <img src={sampleImage} alt="" className="notification-thumbnail" />
                          <div className="notification-content">
                            <p className="notification-message">{notif.message}</p>
                            <div className="notification-meta">
                              {notif.metadata?.subcategory && (
                                <>
                                  <span>{notif.metadata.subcategory}</span>
                                  <span className="dot-separator">•</span>
                                </>
                              )}
                              <span>{formatTime()}</span>
                            </div>
                            {notif.type === NotificationType.ACTION && (
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
                          <button className="notification-menu" title="More options">⋯</button>
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

// Grouping function
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

