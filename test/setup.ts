import { beforeEach, vi } from 'vitest'

// Mock Nuxt composables
beforeEach(() => {
  vi.mock('#app', () => ({
    useState: vi.fn((key, init) => {
      const state = ref(init?.())
      return state
    }),
    useRuntimeConfig: vi.fn(() => ({
      public: {
        siteUrl: 'http://localhost:3000'
      }
    })),
    useRoute: vi.fn(() => ({
      path: '/',
      params: {},
      query: {}
    })),
    navigateTo: vi.fn()
  }))
})