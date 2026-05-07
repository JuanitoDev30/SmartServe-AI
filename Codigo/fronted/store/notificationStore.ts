// store/notificationStore.ts

import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'pedido';
}

interface NotificationStore {
  notifications: Notification[];

  addNotification: (notification: Notification) => void;

  markAsRead: (id: string) => void;

  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],

  addNotification: notification =>
    set(state => ({
      notifications: [notification, ...state.notifications],
    })),

  markAsRead: id =>
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  clearNotifications: () =>
    set({
      notifications: [],
    }),
}));
