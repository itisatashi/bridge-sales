import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { NotificationType } from '@/types';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000, // Default duration: 5 seconds
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-close notification after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Wait for fade-out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300); // Wait for fade-out animation
  };

  // Type-specific icon and styles
  const getTypeStyles = () => {
    switch (type) {
      case NotificationType.SUCCESS:
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-500',
          iconColor: 'text-green-500',
          titleColor: 'text-green-800 dark:text-green-400',
          messageColor: 'text-green-700 dark:text-green-300',
        };
      case NotificationType.ERROR:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-500',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800 dark:text-red-400',
          messageColor: 'text-red-700 dark:text-red-300',
        };
      case NotificationType.WARNING:
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-500',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800 dark:text-yellow-400',
          messageColor: 'text-yellow-700 dark:text-yellow-300',
        };
      case NotificationType.INFO:
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-500',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800 dark:text-blue-400',
          messageColor: 'text-blue-700 dark:text-blue-300',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`
        w-full border-l-4 ${styles.borderColor} ${styles.bgColor} p-4 shadow-md rounded-r-md
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${styles.iconColor}`}>{styles.icon}</div>
        <div className="ml-3 flex-1 pt-0.5 overflow-hidden">
          {title && <p className={`text-sm font-medium ${styles.titleColor} truncate`}>{title}</p>}
          <p className={`text-sm ${styles.messageColor} mt-1 break-words`}>{message}</p>
        </div>
        <div className="ml-2 flex-shrink-0 flex">
          <button
            type="button"
            className={`inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
