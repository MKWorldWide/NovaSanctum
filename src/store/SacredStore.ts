import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SacredState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  recentItems: Array<{
    id: string;
    type: string;
    name: string;
    timestamp: number;
  }>;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleSidebar: () => void;
  addNotification: (
    notification: Omit<SacredState['notifications'][0], 'id' | 'timestamp'>
  ) => void;
  removeNotification: (id: string) => void;
  addRecentItem: (item: Omit<SacredState['recentItems'][0], 'timestamp'>) => void;
  clearRecentItems: () => void;
}

export const useSacredStore = create<SacredState>()(
  persist(
    set => ({
      theme: 'dark',
      sidebarOpen: false,
      notifications: [],
      recentItems: [],

      setTheme: theme => set({ theme }),

      toggleSidebar: () =>
        set(state => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      addNotification: notification =>
        set(state => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: Date.now(),
            },
          ].slice(-5), // Keep only the last 5 notifications
        })),

      removeNotification: id =>
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        })),

      addRecentItem: item =>
        set(state => ({
          recentItems: [
            {
              ...item,
              timestamp: Date.now(),
            },
            ...state.recentItems,
          ].slice(0, 10), // Keep only the last 10 items
        })),

      clearRecentItems: () => set({ recentItems: [] }),
    }),
    {
      name: 'sacred-storage',
      partialize: state => ({
        theme: state.theme,
        recentItems: state.recentItems,
      }),
    }
  )
);
