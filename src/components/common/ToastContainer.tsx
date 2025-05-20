import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';
import { useNotificationsStore } from '@/store/notifications.store';

export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right' }) => {
  const { notifications, removeNotification } = useNotificationsStore();

  // Position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-center':
        return 'top-0 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-center':
        return 'bottom-0 left-1/2 transform -translate-x-1/2';
      case 'top-right':
      default:
        return 'top-0 right-0';
    }
  };

  // If there are no notifications, don't render anything
  if (notifications.length === 0) {
    return null;
  }

  return createPortal(
    <div
      className={`fixed ${getPositionStyles()} z-50 p-4 space-y-4 max-h-screen overflow-hidden pointer-events-none`}
      aria-live="assertive"
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <Toast
            id={notification.id}
            type={notification.type}
            title={notification.title || ''}
            message={String(notification.message || '')} // Convert to string to ensure it's always a string
            duration={notification.duration}
            onClose={removeNotification}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
