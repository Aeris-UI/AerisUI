import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

test('CodeBlock highlights, switches tabs by keyboard, and changes syntax colors with the theme', async ({
  page,
}) => {
  await page.goto('/components/code-block');
  const example = page.locator('#code-block-basic [preview] aeris-code-block');
  await expect(example.locator('[data-token="highlighted"]').first()).toBeVisible();
  await expect(example.locator('code')).toContainText('export interface Greeting');
  const firstToken = example.locator('[data-token="highlighted"]').first();
  const initialColor = await firstToken.evaluate((element) => getComputedStyle(element).color);
  await page
    .locator('#code-block-basic [preview]')
    .evaluate((element) => element.setAttribute('data-aeris-theme', 'dark'));
  await expect
    .poll(() => firstToken.evaluate((element) => getComputedStyle(element).color))
    .not.toBe(initialColor);
  const dark = await example
    .locator('[data-token="highlighted"]')
    .first()
    .evaluate((element) => getComputedStyle(element).color);
  await page
    .locator('#code-block-basic [preview]')
    .evaluate((element) => element.setAttribute('data-aeris-theme', 'light'));
  await expect(firstToken).toHaveCSS('color', initialColor);
  const light = await example
    .locator('[data-token="highlighted"]')
    .first()
    .evaluate((element) => getComputedStyle(element).color);
  expect(light).not.toBe(dark);
  const files = page.locator('#code-block-sources [preview] aeris-code-block');
  const tabs = files.getByRole('tab');
  await tabs.first().scrollIntoViewIfNeeded();
  await tabs.first().focus();
  const initialScroll = await page.evaluate(() => scrollY);
  await tabs.first().press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(files.locator('code')).toContainText('export class Greeting');
  expect(await page.evaluate(() => scrollY)).toBe(initialScroll);
  await tabs.nth(1).press('End');
  await expect(tabs.nth(2)).toBeFocused();
  await tabs.nth(2).press('Home');
  await expect(tabs.first()).toBeFocused();
  const accessibility = await new AxeBuilder({ page })
    .include('#code-block-sources [preview]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});
for (const width of [320, 390, 1280]) {
  test(`CodeBlock separates copy actions and preserves scrolling at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/components/code-block');
    const block = page.locator('#code-block-sources [preview] aeris-code-block');
    await expect(block).toBeVisible();
    const geometry = await block.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const tabs = element.querySelector('.aeris-code-block__toolbar')?.getBoundingClientRect();
      const copy = element.querySelector('.aeris-code-block__copy')?.getBoundingClientRect();
      return {
        contained: box.left >= 0 && box.right <= innerWidth,
        separated: !!tabs && !!copy && tabs.right <= copy.left + 1,
      };
    });
    expect(geometry.contained).toBe(true);
    expect(geometry.separated).toBe(true);
    if (width < 640) {
      await expect(block.locator('.aeris-code-block__copy-label')).not.toBeVisible();
      await expect(block.locator('pre')).toHaveCSS('max-height', 'none');
    }
    const scroll = page.locator('#code-block-scroll [preview] aeris-code-block pre');
    await scroll.scrollIntoViewIfNeeded();
    await expect(scroll).toHaveCSS('max-height', '192px');
    // Older bundled WebKit builds do not expose overscroll-behavior. Their
    // native default also allows vertical scroll chaining.
    if (await page.evaluate(() => CSS.supports('overscroll-behavior-y', 'auto')))
      await expect(scroll).toHaveCSS('overscroll-behavior-y', 'auto');
    expect(await scroll.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(
      true,
    );
    const wrapped = page.locator('#code-block-wrap [preview] aeris-code-block pre');
    expect(
      await wrapped.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
  });
}
test('documentation code blocks are rendered by the library component', async ({ page }) => {
  for (const route of ['/guides/installation', '/components/button', '/']) {
    await page.goto(route);
    const blocks = page.locator('app-code-block');
    await expect(blocks.first()).toBeVisible();
    for (const block of await blocks.all())
      await expect(block.locator('aeris-code-block')).toHaveCount(1);
  }
});
