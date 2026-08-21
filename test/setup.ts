import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

// Свежая Pinia на каждый тест — сторы не протекают между кейсами.
beforeEach(() => {
  setActivePinia(createPinia())
})
