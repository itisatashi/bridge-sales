import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { NotificationType } from '@/types';

export interface ToastProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string; // Changed from optional to required
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-dismiss toast after duration
  useEffect(() => {
    if (!isVisible || isPaused || duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, isVisible, isPaused, onClose]);

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300); // Wait for animation to finish
  };

  // Get icon and styles based on notification type
  const getToastStyles = () => {
    switch (type) {
      case NotificationType.SUCCESS:
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-500',
          titleColor: 'text-green-800 dark:text-green-300',
          messageColor: 'text-green-700 dark:text-green-400',
        };
      case NotificationType.ERROR:
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-500',
          titleColor: 'text-red-800 dark:text-red-300',
          messageColor: 'text-red-700 dark:text-red-400',
        };
      case NotificationType.WARNING:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-500',
          titleColor: 'text-yellow-800 dark:text-yellow-300',
          messageColor: 'text-yellow-700 dark:text-yellow-400',
        };
      case NotificationType.INFO:
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-500" />,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-500',
          titleColor: 'text-blue-800 dark:text-blue-300',
          messageColor: 'text-blue-700 dark:text-blue-400',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`max-w-md w-full ${styles.bgColor} border-l-4 ${styles.borderColor} rounded-md shadow-md transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      }`}
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex p-4">
        <div className="flex-shrink-0 mr-3">{styles.icon}</div>
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${styles.titleColor}`}>{title}</h3>
          {message && <p className={`mt-1 text-sm ${styles.messageColor}`}>{message}</p>}
        </div>
        <button
          type="button"
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={handleClose}
        >
          <span className="sr-only">Close</span>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
