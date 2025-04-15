export enum NotificationSeverity {
  EMERGENCY = 'EMERGENCY',      // requires immediate action
  ALERT = 'ALERT',             // important, requires attention
  LOW = 'LOW'                  // no immediate action needed
}

export enum NotificationType {
  ACTION = 'ACTION',           // user can take action
  PASSIVE = 'PASSIVE'          // informational, no action needed
}

export enum NotificationPersistence {
  NON_PERSISTENT = 'NON_PERSISTENT',  // disappears in 5-10 sec
  PERSISTENT = 'PERSISTENT'           // stays until manually dismissed
}

export interface NotificationAction {
  label: string;              // Text to show on action button
  handler: () => void;        // Function to execute on action
}

export interface Notification {
  id: string | number;
  category: string;           // e.g., 'Vitals', 'System', etc.
  message: string;
  timestamp: Date;
  severity: NotificationSeverity;
  type: NotificationType;
  persistence: NotificationPersistence;
  isUnread: boolean;
  actions?: NotificationAction[];
  thumbnail?: string;         // Optional image URL
}

// Helper to create a new notification with required fields
export const createNotification = (
  params: Partial<Notification> & Pick<Notification, 'message'>
): Notification => {
  return {
    id: Date.now(),
    category: 'General',
    timestamp: new Date(),
    severity: NotificationSeverity.LOW,
    type: NotificationType.PASSIVE,
    persistence: NotificationPersistence.PERSISTENT,
    isUnread: true,
    ...params
  };
}; 