// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/seo'
  ],

  i18n: {
    vueI18n: './i18n/i18n.config.ts',
    defaultLocale: 'ru',
    locales: [
      { code: 'en', name: 'English', file: 'en.ts' },
      { code: 'ru', name: 'Русский', file: 'ru.ts' }
    ],
    langDir: 'locales',
    strategy: 'no_prefix'
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  css: ['~/assets/css/tailwind.css'],

  alias: {
    '@': './app'
  },

  colorMode: {
    classSuffix: ''
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: 'Nuxt Starter',
    description: 'A modern Nuxt 3 starter with shadcn-vue, Tailwind CSS, and more',
    defaultLocale: 'ru'
  },

  seo: {
    enabled: true
  },

  runtimeConfig: {
    // Private keys (только на сервере)
    // Секреты берём из .env
    // apiSecret: process.env.API_SECRET,
    // githubClientSecret: process.env.GITHUB_CLIENT_SECRET,

    public: {
      // Публичные переменные (доступны на клиенте и сервере)
      // Берём из config/environments.ts с возможностью переопределения через .env
      ...(() => {
        const { getConfig } = require('./config/environments')
        const config = getConfig()
        return {
          apiBaseUrl: config.apiBaseUrl,
          siteUrl: config.siteUrl,
          environment: process.env.APP_ENV || 'local',
          features: config.features
        }
      })()
    }
  }
})