import { defineStore } from 'pinia'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface AppState {
  notifications: Notification[]
  sidebarOpen: boolean
  isLoading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    notifications: [],
    sidebarOpen: true,
    isLoading: false
  }),

  getters: {
    hasNotifications: (state) => state.notifications.length > 0,
    notificationCount: (state) => state.notifications.length
  },

  actions: {
    addNotification(notification: Omit<Notification, 'id'>) {
      const id = `notification-${Date.now()}`
      this.notifications.push({ ...notification, id })

      // Auto-remove after duration
      if (notification.duration) {
        setTimeout(() => {
          this.removeNotification(id)
        }, notification.duration)
      }
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    clearNotifications() {
      this.notifications = []
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    setSidebarOpen(open: boolean) {
      this.sidebarOpen = open
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    }
  }
})