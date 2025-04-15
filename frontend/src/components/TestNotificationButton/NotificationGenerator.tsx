import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  NotificationSeverity, 
  NotificationType, 
  NotificationPersistence,
  createNotification,
  Notification
} from '../../types/notifications';
import NotificationToast from '../Notification/NotificationToast';

const ICON_STYLES = {
  [NotificationSeverity.EMERGENCY]: { icon: '⚠️', color: '#ff4a4a' },
  [NotificationSeverity.ALERT]: { icon: '🔔', color: '#ffcc00' },
  [NotificationSeverity.LOW]: { icon: 'ℹ️', color: '#0088ff' }
};

// Categories from the image
const NOTIFICATION_CATEGORIES = [
  'Navigation',
  'Geosamples',
  'HeadSet Control',
  'Vitals',
  'Messaging',
  'Task List',
  'Others'
];

// Sample notification templates based on image
const NOTIFICATION_TEMPLATES = [
  // Navigation
  { category: 'Navigation', message: 'New waypoint created by astronaut', severity: NotificationSeverity.LOW },
  { category: 'Navigation', message: 'New waypoint created by MCC confirmation', severity: NotificationSeverity.LOW },
  { category: 'Navigation', message: 'Waypoint edited by astronaut', severity: NotificationSeverity.LOW },
  { category: 'Navigation', message: 'Waypoint edited by MCC confirmation', severity: NotificationSeverity.LOW },
  { category: 'Navigation', message: 'Danger zone / waypoint created', severity: NotificationSeverity.ALERT },
  { category: 'Navigation', message: 'Astronaut close to danger zone', severity: NotificationSeverity.ALERT },
  { category: 'Navigation', message: 'Astronaut deviation from recommended path', severity: NotificationSeverity.ALERT },
  { category: 'Navigation', message: 'Astronaut navigation completed', severity: NotificationSeverity.LOW },
  
  // Geosamples
  { category: 'Geosamples', message: 'New geosample waypoint added by Roger', severity: NotificationSeverity.LOW },
  { category: 'Geosamples', message: 'New geosample created by MCC confirmation', severity: NotificationSeverity.LOW },
  { category: 'Geosamples', message: 'Geosample edited by astronaut', severity: NotificationSeverity.LOW },
  { category: 'Geosamples', message: 'Geosample edited by MCC confirmation', severity: NotificationSeverity.LOW },
  { category: 'Geosamples', message: 'Geosample starred as important by MCC', severity: NotificationSeverity.ALERT },
  { category: 'Geosamples', message: 'Geosample starred as important by astronaut', severity: NotificationSeverity.ALERT },
  
  // HeadSet Control
  { category: 'HeadSet Control', message: 'Astronaut requesting headset control take over', severity: NotificationSeverity.ALERT },
  { category: 'HeadSet Control', message: 'Headset control mode begins confirmation', severity: NotificationSeverity.LOW },
  { category: 'HeadSet Control', message: 'Headset control mode ends confirmation', severity: NotificationSeverity.LOW },
  { category: 'HeadSet Control', message: 'Headset control on - continuous notification', severity: NotificationSeverity.LOW },
  { category: 'HeadSet Control', message: 'Remote control request (from MCC) sent', severity: NotificationSeverity.ALERT },
  { category: 'HeadSet Control', message: 'Remote control request (sent from MCC) accepted by astronaut', severity: NotificationSeverity.LOW },
  
  // Vitals
  { category: 'Vitals', message: 'Vitals change significantly', severity: NotificationSeverity.EMERGENCY },
  { category: 'Vitals', message: 'Vitals are out of ideal range', severity: NotificationSeverity.ALERT },
  
  // Messaging
  { category: 'Messaging', message: 'Astro sends text message', severity: NotificationSeverity.LOW },
  { category: 'Messaging', message: 'Astro sends message with attachment (image, waypoint, file, etc)', severity: NotificationSeverity.LOW },
  
  // Task List
  { category: 'Task List', message: 'Task/ subtask added confirmation', severity: NotificationSeverity.LOW },
  { category: 'Task List', message: 'Task / subtask deleted confirmation', severity: NotificationSeverity.LOW },
  { category: 'Task List', message: 'Astronaut completed task/subtask', severity: NotificationSeverity.LOW },
  { category: 'Task List', message: 'Sub-task/ task edited', severity: NotificationSeverity.LOW },
  { category: 'Task List', message: 'Assignee added/ removed/ edited', severity: NotificationSeverity.LOW },
  { category: 'Task List', message: 'Task Pinned / unpinned', severity: NotificationSeverity.LOW },
  
  // Others
  { category: 'Others', message: 'System failure for any app', severity: NotificationSeverity.EMERGENCY },
  { category: 'Others', message: 'Connection failures - file / message not sent', severity: NotificationSeverity.ALERT },
  { category: 'Others', message: 'Unable to connect with astronaut/ retrying', severity: NotificationSeverity.ALERT }
];

interface NotificationGeneratorProps {
  onNotificationCreate: (notification: Notification) => void;
}

const NotificationGenerator: React.FC<NotificationGeneratorProps> = ({ 
  onNotificationCreate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(NOTIFICATION_CATEGORIES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<NotificationType>(NotificationType.ACTION);
  const [selectedPersistence, setSelectedPersistence] = useState<NotificationPersistence>(NotificationPersistence.PERSISTENT);
  const [customMessage, setCustomMessage] = useState('');
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);

  // Filter templates by selected category
  const categoryTemplates = NOTIFICATION_TEMPLATES.filter(
    template => template.category === selectedCategory
  );

  const getCurrentTemplate = () => {
    if (categoryTemplates.length === 0) return NOTIFICATION_TEMPLATES[0];
    return categoryTemplates[selectedTemplate % categoryTemplates.length];
  };

  const handleCreateNotification = () => {
    const template = getCurrentTemplate();
    
    // Create notification object based on the selected options
    const notification = createNotification({
      message: customMessage || template.message,
      severity: template.severity,
      type: selectedType,
      persistence: selectedPersistence,
      category: template.category,
      actions: selectedType === NotificationType.ACTION ? [
        {
          label: 'View Details',
          handler: () => console.log('View details clicked')
        },
        {
          label: 'Dismiss',
          handler: () => console.log('Dismiss clicked')
        }
      ] : undefined,
      metadata: { subcategory: 'Waypoints' }
    });

    // Pass notification to parent
    onNotificationCreate(notification);
    
    // Add to active toasts
    setActiveToasts(prev => [...prev, notification]);
  };

  const removeToast = (id: string | number) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Create toast container if it doesn't exist
  React.useEffect(() => {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.position = 'fixed';
      toastContainer.style.top = '0';
      toastContainer.style.right = '0';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    return () => {
      if (toastContainer && document.body.contains(toastContainer)) {
        document.body.removeChild(toastContainer);
      }
    };
  }, []);

  return (
    <>
      {/* Render toast notifications */}
      {activeToasts.map(toast => {
        const portalTarget = document.getElementById('toast-container');
        if (portalTarget) {
          return ReactDOM.createPortal(
            <NotificationToast
              key={toast.id} 
              notification={toast}
              onClose={() => removeToast(toast.id)}
            />,
            portalTarget
          );
        }
        return null;
      })}

      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px', // Changed from right to left
        backgroundColor: '#1e1e1e',
        padding: '16px',
        borderRadius: '8px',
        color: 'white',
        width: '320px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Notification Generator</h3>
        
        {/* Category Selection */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>Category:</label>
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedTemplate(0);
            }}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2e2e2e',
              border: '1px solid #444',
              borderRadius: '4px',
              color: 'white'
            }}
          >
            {NOTIFICATION_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Notification Templates */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>Notification Template:</label>
          <select 
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2e2e2e',
              border: '1px solid #444',
              borderRadius: '4px',
              color: 'white'
            }}
          >
            {categoryTemplates.map((template, index) => (
              <option key={index} value={index}>
                {template.message}
              </option>
            ))}
          </select>
        </div>

        {/* Current Selection Display */}
        <div style={{ 
          marginBottom: '12px',
          padding: '8px',
          backgroundColor: '#2a2a2a',
          borderRadius: '4px',
          border: '1px solid #444'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>
            Selected template:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ 
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: ICON_STYLES[getCurrentTemplate().severity].color,
              marginRight: '8px'
            }}></span>
            <span>{getCurrentTemplate().message}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
            Severity: {getCurrentTemplate().severity}
          </div>
        </div>
        
        {/* Type Selection */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>Type:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setSelectedType(NotificationType.ACTION)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedType === NotificationType.ACTION ? '#444444' : '#2e2e2e',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                flex: 1
              }}
            >
              🔘 Action
            </button>
            <button 
              onClick={() => setSelectedType(NotificationType.PASSIVE)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedType === NotificationType.PASSIVE ? '#444444' : '#2e2e2e',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                flex: 1
              }}
            >
              📄 Passive
            </button>
          </div>
        </div>
        
        {/* Persistence Selection */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>Persistence:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setSelectedPersistence(NotificationPersistence.PERSISTENT)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedPersistence === NotificationPersistence.PERSISTENT ? '#444444' : '#2e2e2e',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                flex: 1
              }}
            >
              🔒 Persistent
            </button>
            <button 
              onClick={() => setSelectedPersistence(NotificationPersistence.NON_PERSISTENT)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedPersistence === NotificationPersistence.NON_PERSISTENT ? '#444444' : '#2e2e2e',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                flex: 1
              }}
            >
              ⏱️ Auto-dismiss
            </button>
          </div>
        </div>
        
        {/* Custom Message Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>Custom Message (optional):</label>
          <input 
            type="text" 
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={getCurrentTemplate().message}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2e2e2e',
              border: '1px solid #444',
              borderRadius: '4px',
              color: 'white'
            }}
          />
        </div>
        
        {/* Generate Button */}
        <button 
          onClick={handleCreateNotification}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0052cc',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Generate Notification
        </button>
      </div>
    </>
  );
};

export default NotificationGenerator; 