import { test, expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

/**
 * Страница отдаётся SSR, поэтому кликабельной кнопка становится раньше,
 * чем Vue закончит гидратацию (<NuxtPage> живёт внутри <Suspense>, и mount()
 * возвращается до её резолва). Клик «в статичный HTML» просто теряется.
 *
 * Поэтому кликаем повторно, пока ожидаемое состояние не наступит.
 * Проверка идемпотентна: как только условие выполнено, кликов больше нет.
 */
async function clickUntil(page: Page, testId: string, expectation: () => Promise<boolean>) {
  await expect(async () => {
    if (!(await expectation())) {
      await page.getByTestId(testId).click({ timeout: 1000 })
    }
    expect(await expectation()).toBe(true)
  }).toPass({ timeout: 15_000 })
}

const hasClass = (locator: Locator, name: string) => async () =>
  ((await locator.getAttribute('class')) ?? '').split(/\s+/).includes(name)

test.describe('Homepage', () => {
  test('показывает приветствие', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('переключает тему и запоминает выбор', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    const wasDark = await hasClass(html, 'dark')()
    const target = wasDark ? 'light' : 'dark'

    await clickUntil(page, 'theme-toggle', hasClass(html, target))

    // Выбор переживает перезагрузку — за это отвечает @nuxtjs/color-mode
    await page.reload()
    await expect(html).toHaveClass(new RegExp(`\\b${target}\\b`))
  })

  test('переключает язык', async ({ page }) => {
    await page.goto('/')

    const heading = page.getByRole('heading', { level: 1 })
    const before = (await heading.textContent())?.trim() ?? ''

    await clickUntil(
      page,
      'language-switcher',
      async () => ((await heading.textContent())?.trim() ?? '') !== before
    )
  })
})
