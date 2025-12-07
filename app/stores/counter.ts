import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    history: [] as number[]
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    lastValue: (state) => state.history[state.history.length - 1] ?? 0
  },

  actions: {
    increment() {
      this.history.push(this.count)
      this.count++
    },

    decrement() {
      this.history.push(this.count)
      this.count--
    },

    incrementBy(amount: number) {
      this.history.push(this.count)
      this.count += amount
    },

    reset() {
      this.history.push(this.count)
      this.count = 0
    },

    clearHistory() {
      this.history = []
    }
  }
})