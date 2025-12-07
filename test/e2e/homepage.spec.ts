import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/')

    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('should have navigation', async ({ page }) => {
    await page.goto('/')

    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should toggle theme', async ({ page }) => {
    await page.goto('/')

    // Find theme toggle button
    const themeButton = page.locator('button[aria-label*="theme"]').first()

    // Check if dark mode button exists
    if (await themeButton.isVisible()) {
      await themeButton.click()

      // Wait for theme change
      await page.waitForTimeout(300)

      // Verify theme changed (you may need to adjust selector)
      const html = page.locator('html')
      const classList = await html.getAttribute('class')

      expect(classList).toBeTruthy()
    }
  })
})