import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    globals: true,
    // Настоящее окружение Nuxt: авто-импорты, #app, #imports, mockNuxtImport
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom'
      }
    },
    include: ['test/unit/**/*.{test,spec}.ts'],
    setupFiles: ['./test/setup.ts']
  }
})
