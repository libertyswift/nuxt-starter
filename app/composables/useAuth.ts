import type { User } from 'better-auth'

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const loading = useState<boolean>('auth:loading', () => false)

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await $fetch<{ user: User }>('/api/auth/sign-in', {
        method: 'POST',
        body: { email, password }
      })
      user.value = response.user
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    loading.value = true
    try {
      const response = await $fetch<{ user: User }>('/api/auth/sign-up', {
        method: 'POST',
        body: { email, password, name }
      })
      user.value = response.user
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      await $fetch('/api/auth/sign-out', {
        method: 'POST'
      })
      user.value = null
      return { success: true }
    } catch (error) {
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    loading.value = true
    try {
      const response = await $fetch<{ user: User | null }>('/api/auth/session')
      user.value = response.user
      return response.user
    } catch (error) {
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    signIn,
    signUp,
    signOut,
    fetchUser,
    isAuthenticated: computed(() => !!user.value)
  }
}