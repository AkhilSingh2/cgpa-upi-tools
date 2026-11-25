import { expect, test } from '@playwright/test'
import { publicRoutes } from '../src/lib/routes'

const BASE = '/cgpa-upi-tools'

function route(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BASE}${normalized}`
}

test.describe('built site under the base path', () => {
  for (const entry of publicRoutes()) {
    test(`loads ${entry.path}`, async ({ page }) => {
      const response = await page.goto(route(entry.path))
      expect(response?.status()).toBeLessThan(400)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toContain(`${BASE}${entry.path === '/' ? '/' : entry.path}`)
      const brand = page.getByRole('link', { name: 'Hundredmark', exact: true })
      await expect(brand).toHaveAttribute('href', `${BASE}/`)
    })
  }

  test('home keeps the website, app, and FAQ structured data', async ({ page }) => {
    await page.goto(route('/'))
    const types = await jsonLdTypes(page)
    expect(types).toEqual(expect.arrayContaining(['WebSite', 'WebApplication', 'FAQPage']))
    expect(types.filter((type) => type === 'FAQPage')).toHaveLength(1)
  })

  test('VTU page keeps one FAQ graph and converts 8.2 on the 2018 scheme to 74.5', async ({ page }) => {
    await page.goto(route('/cgpa-to-percentage/vtu/?scheme=2018&mode=cgpa&cgpa=8.2'))
    const types = await jsonLdTypes(page)
    expect(types).toEqual(expect.arrayContaining(['BreadcrumbList', 'FAQPage', 'WebApplication']))
    expect(types.filter((type) => type === 'FAQPage')).toHaveLength(1)
    const result = page.locator('.sutra-result-value')
    await expect(result).toContainText('74.5')
    await page.getByLabel('Scheme', { exact: true }).selectOption({ label: '2022 regulations · CGPA × 10' })
    await expect(result).toContainText('82')
    await expect(result).not.toContainText('74.5')
  })

  test('UPI page builds a scannable link in the browser', async ({ page }) => {
    await page.goto(route('/upi-qr-code-generator/'))
    await page.getByRole('textbox', { name: 'UPI ID' }).fill('9876543210@ybl')
    await page.getByRole('textbox', { name: 'Payee name' }).fill('Ravi Stores')
    await page.getByRole('textbox', { name: 'Amount in ₹, optional' }).fill('250')
    const link = page.getByRole('textbox', { name: 'UPI payment link' })
    await expect(link).toHaveValue(/upi:\/\/pay\?/)
    await expect(link).toHaveValue(/pa=9876543210%40ybl/)
    await expect(link).toHaveValue(/am=250/)
    await expect(page.getByRole('img', { name: /UPI QR code for Ravi Stores/ })).toBeVisible()
  })

  test('token variables are applied and the theme switch stores a choice', async ({ page }) => {
    await page.goto(route('/'))
    const canvas = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--sutra-color-bg-canvas').trim())
    expect(canvas).toMatch(/^#/)
    await page.getByRole('button', { name: 'Dark' }).click()
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark')
    await page.getByRole('button', { name: 'Light' }).click()
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('light')
  })

  test('unknown paths serve the not-found page', async ({ page }) => {
    const response = await page.goto(route('/missing-page/'))
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('That page is not here')
  })
})

async function jsonLdTypes(page: import('@playwright/test').Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.map((node) => {
      const data = JSON.parse(node.textContent || '{}') as { '@type'?: string }
      return data['@type'] ?? ''
    }),
  )
}
