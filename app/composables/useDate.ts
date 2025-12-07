import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'

// Extend dayjs with plugins
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

export const useDate = () => {
  const { locale } = useI18n()

  // Set locale based on current i18n locale
  const currentLocale = computed(() => locale.value)

  const formatDate = (
    date: string | Date,
    format: string = 'DD.MM.YYYY'
  ): string => {
    return dayjs(date).locale(currentLocale.value).format(format)
  }

  const formatDateTime = (
    date: string | Date,
    format: string = 'DD.MM.YYYY HH:mm'
  ): string => {
    return dayjs(date).locale(currentLocale.value).format(format)
  }

  const formatRelative = (date: string | Date): string => {
    return dayjs(date).locale(currentLocale.value).fromNow()
  }

  const isToday = (date: string | Date): boolean => {
    return dayjs(date).isSame(dayjs(), 'day')
  }

  const isFuture = (date: string | Date): boolean => {
    return dayjs(date).isAfter(dayjs())
  }

  const isPast = (date: string | Date): boolean => {
    return dayjs(date).isBefore(dayjs())
  }

  const addDays = (date: string | Date, days: number): Date => {
    return dayjs(date).add(days, 'day').toDate()
  }

  const subtractDays = (date: string | Date, days: number): Date => {
    return dayjs(date).subtract(days, 'day').toDate()
  }

  const diffInDays = (date1: string | Date, date2: string | Date): number => {
    return dayjs(date1).diff(dayjs(date2), 'day')
  }

  return {
    formatDate,
    formatDateTime,
    formatRelative,
    isToday,
    isFuture,
    isPast,
    addDays,
    subtractDays,
    diffInDays,
    dayjs
  }
}