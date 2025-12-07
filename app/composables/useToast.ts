import { useAppStore } from '~/stores/app'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  title: string
  message?: string
  duration?: number
  type?: ToastType
}

export const useToast = () => {
  const appStore = useAppStore()

  const toast = (options: ToastOptions) => {
    appStore.addNotification({
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration || 5000
    })
  }

  const success = (title: string, message?: string, duration?: number) => {
    toast({ title, message, duration, type: 'success' })
  }

  const error = (title: string, message?: string, duration?: number) => {
    toast({ title, message, duration, type: 'error' })
  }

  const warning = (title: string, message?: string, duration?: number) => {
    toast({ title, message, duration, type: 'warning' })
  }

  const info = (title: string, message?: string, duration?: number) => {
    toast({ title, message, duration, type: 'info' })
  }

  return {
    toast,
    success,
    error,
    warning,
    info
  }
}