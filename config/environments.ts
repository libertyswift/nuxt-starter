
/**
 * Конфигурация для разных окружений
 *
 * Секретные ключи всё равно храним в .env
 * Здесь только публичные URL и настройки
 */

export type Environment = 'local' | 'staging' | 'production'

interface EnvironmentConfig {
  apiBaseUrl: string
  siteUrl: string
  features: {
    analytics: boolean
    sentry: boolean
    debugMode: boolean
  }
  // Добавляй свои настройки
}

const configs: Record<Environment, EnvironmentConfig> = {
  local: {
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    siteUrl: 'http://localhost:3000',
    features: {
      analytics: false,
      sentry: false,
      debugMode: true,
    },
  },

  staging: {
    apiBaseUrl: 'https://staging-api.example.com',
    siteUrl: 'https://staging.example.com',
    features: {
      analytics: true,
      sentry: true,
      debugMode: false,
    },
  },

  production: {
    apiBaseUrl: 'https://api.example.com',
    siteUrl: 'https://example.com',
    features: {
      analytics: true,
      sentry: true,
      debugMode: false,
    },
  },
}

/**
 * Определяем текущее окружение
 */
export function getCurrentEnvironment(): Environment {
  const env = process.env.NODE_ENV || 'development'
  const customEnv = process.env.APP_ENV as Environment

  // Если задана кастомная переменная - используем её
  if (customEnv && customEnv in configs) {
    return customEnv
  }

  // Иначе определяем по NODE_ENV
  if (env === 'production') return 'production'
  if (env === 'development') return 'local'

  return 'local'
}

/**
 * Получить конфигурацию для текущего окружения
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = getCurrentEnvironment()
  return configs[environment]
}

/**
 * Получить конфигурацию с возможностью переопределения через .env
 */
export function getConfig(): EnvironmentConfig {
  const baseConfig = getEnvironmentConfig()

  return {
    ...baseConfig,
    // Переопределяем из .env если есть
    apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || baseConfig.apiBaseUrl,
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || baseConfig.siteUrl,
  }
}

export default configs