import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-21',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils/module',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'shadcn-nuxt',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  i18n: {
    // i18n/i18n.config.ts и i18n/locales/ подхватываются по умолчанию
    defaultLocale: 'ru',
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: 'en.ts' },
      { code: 'ru', name: 'Русский', language: 'ru-RU', file: 'ru.ts' }
    ],
    strategy: 'no_prefix'
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  icon: {
    // Иконки берём из локального @iconify-json/lucide и вшиваем в бандл:
    // без запросов к Iconify API в рантайме.
    serverBundle: { collections: ['lucide'] },
    clientBundle: { scan: true }
  },

  // @nuxtjs/color-mode ставит класс `dark` на <html> и отдаёт anti-FOUC скрипт,
  // поэтому руками класс переключать не нужно.
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  // URL задаётся через NUXT_PUBLIC_SITE_URL, см. .env.example
  site: {
    name: 'Nuxt Starter',
    description: 'Современный стартер на Nuxt 4 с shadcn-vue, Tailwind CSS и i18n',
    defaultLocale: 'ru'
  },

  runtimeConfig: {
    // Приватные ключи — только на сервере.
    // Переопределяются переменными NUXT_* на рантайме.
    // apiSecret: '',

    public: {
      // Переопределяются переменными NUXT_PUBLIC_* на рантайме,
      // без пересборки: NUXT_PUBLIC_API_BASE_URL, NUXT_PUBLIC_SITE_URL и т.д.
      siteUrl: 'http://localhost:3000',
      apiBaseUrl: 'https://jsonplaceholder.typicode.com',
      environment: 'local',
      features: {
        analytics: false,
        sentry: false,
        debugMode: true
      }
    }
  }
})
