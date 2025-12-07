import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userName: (state) => state.user?.name ?? 'Guest',
    userInitials: (state) => {
      if (!state.user?.name) return 'G'
      const names = state.user.name.split(' ')
      return names.map(n => n[0]).join('').toUpperCase()
    }
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.error = null
    },

    clearUser() {
      this.user = null
      this.error = null
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setError(error: string) {
      this.error = error
      this.isLoading = false
    },

    async fetchUser() {
      this.setLoading(true)
      try {
        // Example API call
        const response = await $fetch<{ user: User }>('/api/auth/session')
        this.setUser(response.user)
      } catch (error) {
        this.setError('Failed to fetch user')
      } finally {
        this.setLoading(false)
      }
    }
  },

  persist: {
    storage: persistedState.localStorage
  }
})