import { debounce, throttle, chunk, uniq, groupBy, orderBy } from 'lodash-es'

// Re-export commonly used lodash functions
export { debounce, throttle, chunk, uniq, groupBy, orderBy }

// Custom utility functions
export const formatCurrency = (
  amount: number,
  currency: string = 'RUB',
  locale: string = 'ru-RU'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

export const formatNumber = (
  number: number,
  locale: string = 'ru-RU'
): string => {
  return new Intl.NumberFormat(locale).format(number)
}

export const truncate = (str: string, length: number = 100): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const randomId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}