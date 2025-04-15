import React, { useState, useEffect } from 'react';
import './NotificationsSettings.css';

// Icons components
const BellIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>;
const TasksIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>;
const NavigationIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>;
const VitalsIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>;
const SamplesIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.59 12l-3.3-3.3a.996.996 0 1 0-1.41 1.41l1.59 1.59-1.59 1.59a.996.996 0 1 0 1.41 1.41l3.3-3.3zM7.41 12l-3.3-3.3a.996.996 0 1 0-1.41 1.41L4.29 12 2.7 13.59a.996.996 0 1 0 1.41 1.41l3.3-3.3zM15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45z"/></svg>;
const ScreenIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>;
const RemoteIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15 9H9c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1zm-1 12h-4V11h4v10zm-6-15c0 1.66-1.34 3-3 3-.55 0-1 .45-1 1s.45 1 1 1c2.76 0 5-2.24 5-5 0-.55-.45-1-1-1s-1 .45-1 1zm2-3c0 .55.45 1 1 1 3.87 0 7 3.13 7 7 0 .55.45 1 1 1s1-.45 1-1c0-4.97-4.03-9-9-9-.55 0-1 .45-1 1z"/></svg>;
const SoundIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
const EmergencyIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>;
const AlertsIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12zM16 13.01h-3v3h-2v-3H8V11h3V8h2v3h3v2.01z"/></svg>;
const AllNotificationsIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>;
const SystemIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z"/></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>;
const GroupIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>;

// Types
interface NotificationSettings {
  appNotifications: boolean;
  tasks: boolean;
  navigation: boolean;
  vitals: boolean;
  samples: boolean;
  screenSending: boolean;
  remoteConnect: boolean;
  notificationSounds: boolean;
  emergency: boolean;
  alerts: boolean;
  allNotifications: boolean;
  systemDiagnostics: boolean;
  showOnLockScreen: boolean;
  groupNotifications: boolean;
}

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  value: boolean;
  onChange: () => void;
}

interface SettingSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Toggle Component
const Toggle: React.FC<ToggleProps> = ({ isOn, onToggle }) => {
  return (
    <div className={`toggle ${isOn ? 'on' : 'off'}`} onClick={onToggle}>
      <div className="toggle-slider"></div>
    </div>
  );
};

// Setting Item Component
const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  label, 
  description, 
  value, 
  onChange 
}) => {
  return (
    <div className="setting-item">
      {icon && <div className="setting-icon">{icon}</div>}
      <div className="setting-content">
        <div className="setting-label">{label}</div>
        {description && <div className="setting-description">{description}</div>}
      </div>
      <Toggle isOn={value} onToggle={onChange} />
    </div>
  );
};

// Setting Section Component
const SettingSection: React.FC<SettingSectionProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <div className="setting-section">
      {title && (
        <div className="section-header">
          <div className="section-title">{title}</div>
          {description && <div className="section-description">{description}</div>}
        </div>
      )}
      <div className="section-content">{children}</div>
    </div>
  );
};

// Main Notifications Settings Component
const NotificationsSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {
  // State for notification settings
  const [settings, setSettings] = useState<NotificationSettings>({
    appNotifications: false,
    tasks: true,
    navigation: true,
    vitals: true,
    samples: true,
    screenSending: false,
    remoteConnect: false,
    notificationSounds: true,
    emergency: true,
    alerts: true,
    allNotifications: true,
    systemDiagnostics: true,
    showOnLockScreen: true,
    groupNotifications: true
  });

  // Toggle handler
  const handleToggle = (setting: keyof NotificationSettings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Close panel handler
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="notifications-settings-modal">
      <div className="notifications-settings">
        <div className="settings-header">
          <h2>Notifications Settings</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <SettingItem 
          icon={<BellIcon />}
          label="App Notifications" 
          description="Get notifications from all apps and all users"
          value={settings.appNotifications}
          onChange={() => handleToggle('appNotifications')}
        />
        
        <SettingSection>
          <SettingItem 
            icon={<TasksIcon />}
            label="Tasks" 
            value={settings.tasks}
            onChange={() => handleToggle('tasks')}
          />
          <SettingItem 
            icon={<NavigationIcon />}
            label="Navigation" 
            value={settings.navigation}
            onChange={() => handleToggle('navigation')}
          />
          <SettingItem 
            icon={<VitalsIcon />}
            label="Vitals" 
            value={settings.vitals}
            onChange={() => handleToggle('vitals')}
          />
          <SettingItem 
            icon={<SamplesIcon />}
            label="Samples" 
            value={settings.samples}
            onChange={() => handleToggle('samples')}
          />
          <SettingItem 
            icon={<ScreenIcon />}
            label="Screen Sending" 
            value={settings.screenSending}
            onChange={() => handleToggle('screenSending')}
          />
          <SettingItem 
            icon={<RemoteIcon />}
            label="Remote Connect" 
            value={settings.remoteConnect}
            onChange={() => handleToggle('remoteConnect')}
          />
        </SettingSection>
        
        <SettingSection 
          title="Notification Sounds" 
          description="Adjust the sound settings for different types of notifications"
        >
          <SettingItem 
            icon={<EmergencyIcon />}
            label="Emergency" 
            value={settings.emergency}
            onChange={() => handleToggle('emergency')}
          />
          <SettingItem 
            icon={<AlertsIcon />}
            label="Alerts" 
            value={settings.alerts}
            onChange={() => handleToggle('alerts')}
          />
          <SettingItem 
            icon={<AllNotificationsIcon />}
            label="All Notifications" 
            value={settings.allNotifications}
            onChange={() => handleToggle('allNotifications')}
          />
        </SettingSection>
        
        <SettingItem 
          icon={<SystemIcon />}
          label="System Diagnostics" 
          description="Get notified when there are software issues in LMCC systems"
          value={settings.systemDiagnostics}
          onChange={() => handleToggle('systemDiagnostics')}
        />
        
        <SettingItem 
          icon={<LockIcon />}
          label="Show on Lock Screen" 
          description="View notifications on screen saver or locked screen mode"
          value={settings.showOnLockScreen}
          onChange={() => handleToggle('showOnLockScreen')}
        />
        
        <SettingItem 
          icon={<GroupIcon />}
          label="Group notifications" 
          description="Notifications from the same app are grouped"
          value={settings.groupNotifications}
          onChange={() => handleToggle('groupNotifications')}
        />
      </div>
    </div>
  );
};

export default NotificationsSettings;
