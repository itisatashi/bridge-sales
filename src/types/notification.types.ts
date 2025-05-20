export enum NotificationType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}
