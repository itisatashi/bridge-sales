import React from 'react';
import { useNotificationsStore } from '@/store/notifications.store';
import Notification from './Notification';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationsStore();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-h-screen overflow-hidden pointer-events-none">
      <div className="flex flex-col items-end gap-3 w-full max-w-sm pointer-events-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="w-full">
            <Notification
              id={notification.id}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              duration={notification.duration}
              onClose={removeNotification}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
