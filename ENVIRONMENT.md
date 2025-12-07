# Управление окружениями

Проект использует подход с централизованной конфигурацией окружений + возможность переопределения через `.env`.

## 📁 Структура

```
config/
  environments.ts       # Конфигурации всех окружений
.env.example           # Шаблон (в git)
.env                   # Локальные переменные (НЕ в git)
nuxt.config.ts         # Nuxt конфигурация
```

## 🎯 Доступные окружения

| Окружение | Описание |
|-----------|----------|
| `local` | Локальная разработка (по умолчанию) |
| `development` | Dev сервер |
| `staging` | Staging сервер |
| `production` | Production сервер |

## 🚀 Использование

### Запуск с разными окружениями

```bash
# Local (по умолчанию)
npm run dev

# Development
npm run dev:development

# Staging
npm run dev:staging

# Build для production
npm run build:production
```

### Настройка переменных

#### Вариант 1: Через `config/environments.ts` (рекомендуется)

```typescript
// config/environments.ts
const configs = {
  local: {
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    siteUrl: 'http://localhost:3000',
    features: {
      analytics: false,
      sentry: false,
      debugMode: true,
    }
  },

  production: {
    apiBaseUrl: 'https://api.example.com',
    siteUrl: 'https://example.com',
    features: {
      analytics: true,
      sentry: true,
      debugMode: false,
    }
  }
}
```

**Плюсы:**
- Все конфигурации в одном месте
- Типизация TypeScript
- Видно все окружения сразу
- Легко добавлять новые настройки

#### Вариант 2: Через `.env` (для переопределения)

```bash
# .env
APP_ENV=staging
NUXT_PUBLIC_API_BASE_URL=https://custom-api.example.com
NUXT_PUBLIC_SITE_URL=https://custom-site.com
```

**Когда использовать:**
- Для секретных ключей (ВСЕГДА!)
- Для локального тестирования другого API
- Для CI/CD переопределения

## 🔐 Секреты

**Все секреты** храним только в `.env`:

```bash
# .env (НЕ коммитим в git!)
GITHUB_CLIENT_SECRET=your_secret_here
GOOGLE_CLIENT_SECRET=your_secret_here
DATABASE_URL=postgresql://...
```

В `config/environments.ts` храним только **публичные URL и настройки**.

## 📝 Использование в коде

### В компонентах и composables:

```typescript
// Получить config
const config = useRuntimeConfig()

// Использовать
const apiUrl = config.public.apiBaseUrl
const environment = config.public.environment
const isProduction = environment === 'production'
const analyticsEnabled = config.public.features.analytics
```

### В server endpoints:

```typescript
// server/api/example.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  return {
    apiUrl: config.public.apiBaseUrl,
    environment: config.public.environment
  }
})
```

### В API функциях:

```typescript
// app/api/posts.ts
const getBaseUrl = () => {
  const config = useRuntimeConfig()
  return config.public.apiBaseUrl
}

export const fetchPosts = async () => {
  const baseUrl = getBaseUrl()
  return await $fetch(`${baseUrl}/posts`)
}
```

## 🎨 Добавление новых настроек

### Шаг 1: Обновить типы в `config/environments.ts`

```typescript
interface EnvironmentConfig {
  apiBaseUrl: string
  siteUrl: string
  features: {
    analytics: boolean
    sentry: boolean
    debugMode: boolean
  }
  // ✅ Добавляем новую настройку
  redis: {
    host: string
    port: number
  }
}
```

### Шаг 2: Добавить значения для каждого окружения

```typescript
const configs: Record<Environment, EnvironmentConfig> = {
  local: {
    // ...существующие настройки
    redis: {
      host: '127.0.0.1',
      port: 6379
    }
  },
  // ... и для остальных окружений
}
```

### Шаг 3: Использовать в коде

```typescript
const config = useRuntimeConfig()
const redisHost = config.public.redis.host
```

## 🌍 CI/CD интеграция

### Пример для Vercel:

```bash
# Environment Variables в Vercel
APP_ENV=production
GITHUB_CLIENT_SECRET=secret_here
```

### Пример для Docker:

```dockerfile
# Dockerfile
ENV APP_ENV=production
ENV NUXT_PUBLIC_API_BASE_URL=https://api.example.com
```

### Пример для GitHub Actions:

```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build:production
  env:
    APP_ENV: production
    GITHUB_CLIENT_SECRET: ${{ secrets.GITHUB_CLIENT_SECRET }}
```

## ✅ Best Practices

1. **Публичные URL** → `config/environments.ts`
2. **Секреты** → `.env` (НЕ коммитим!)
3. **Фичи-флаги** → `config/environments.ts`
4. **Переопределения** → `.env` (локально или CI/CD)

## 🔍 Отладка

Проверить текущую конфигурацию:

```typescript
// В любом компоненте
const config = useRuntimeConfig()
console.log('Current environment:', config.public.environment)
console.log('API URL:', config.public.apiBaseUrl)
console.log('Features:', config.public.features)
```

Или создать debug endpoint:

```typescript
// server/api/debug/config.get.ts
export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  return {
    environment: config.public.environment,
    apiBaseUrl: config.public.apiBaseUrl,
    features: config.public.features
  }
})
```

Затем открыть: `http://localhost:3000/api/debug/config`