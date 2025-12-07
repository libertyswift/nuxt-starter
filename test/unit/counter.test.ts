import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '~/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with count 0', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
  })

  it('increments count', () => {
    const counter = useCounterStore()
    counter.increment()
    expect(counter.count).toBe(1)
  })

  it('decrements count', () => {
    const counter = useCounterStore()
    counter.decrement()
    expect(counter.count).toBe(-1)
  })

  it('increments by amount', () => {
    const counter = useCounterStore()
    counter.incrementBy(5)
    expect(counter.count).toBe(5)
  })

  it('calculates double count', () => {
    const counter = useCounterStore()
    counter.incrementBy(3)
    expect(counter.doubleCount).toBe(6)
  })

  it('tracks history', () => {
    const counter = useCounterStore()
    counter.increment()
    counter.increment()
    expect(counter.history).toEqual([0, 1])
  })

  it('resets count', () => {
    const counter = useCounterStore()
    counter.incrementBy(10)
    counter.reset()
    expect(counter.count).toBe(0)
  })
})