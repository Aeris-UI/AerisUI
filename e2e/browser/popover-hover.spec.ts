import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('popover permits pointer transit, closes on departure and stays anchored on scroll', async ({
  page,
}) => {
  await page.goto('/components/popover');
  const example = page.locator('#popover-hover');
  const trigger = example.getByRole('button', { name: 'Preview content', exact: true });
  const panel = page.getByRole('dialog', { name: 'Content preview', exact: true });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.hover();
  await expect(panel).toBeVisible();
  await expect(trigger).not.toBeFocused();
  await expect(panel).not.toHaveAttribute('aria-modal');
  const t = await trigger.boundingBox();
  const p = await panel.boundingBox();
  expect(t).not.toBeNull();
  expect(p).not.toBeNull();
  if (!t || !p) throw new Error('Missing popover geometry');
  await page.mouse.move(p.x + p.width / 2, p.y + p.height / 2, { steps: 12 });
  await expect(panel).toBeVisible();
  await page.mouse.move(0, 0, { steps: 4 });
  await expect(panel).not.toBeVisible();

  await trigger.focus();
  await expect(panel).toBeVisible();
  await page.evaluate(() => window.scrollBy(0, 80));
  await expect
    .poll(async () => {
      const target = await trigger.boundingBox();
      const overlay = await panel.boundingBox();
      return target && overlay ? Math.abs(overlay.y - (target.y + target.height + 10)) : Infinity;
    })
    .toBeLessThan(2);
  await expect(trigger).toBeFocused();
});

test('popover keyboard entry is non-trapping and Escape does not reopen it', async ({ page }) => {
  await page.goto('/components/popover');
  const trigger = page
    .locator('#popover-hover')
    .getByRole('button', { name: 'Preview content', exact: true });
  const panel = page.getByRole('dialog', { name: 'Content preview', exact: true });
  await trigger.focus();
  await expect(panel).toBeVisible();
  await expect(trigger).toBeFocused();
  const accessibility = await new AxeBuilder({ page }).include('.aeris-popover__panel').analyze();
  expect(accessibility.violations).toEqual([]);
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { name: 'Close popover' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { name: 'Done' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(panel).toBeVisible();
});

test('popover button supports touch toggling and content dismissal', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Touch activation is covered by the mobile browser projects.');
  await page.goto('/components/popover');
  const trigger = page
    .locator('#popover-hover')
    .getByRole('button', { name: 'Preview content', exact: true });
  const panel = page.getByRole('dialog', { name: 'Content preview', exact: true });
  await trigger.tap();
  await expect(panel).toBeVisible();
  await trigger.tap();
  await expect(panel).not.toBeVisible();
  await trigger.tap();
  await expect(panel).toBeVisible();
  await panel.getByRole('button', { name: 'Done' }).tap();
  await expect(panel).not.toBeVisible();
});
