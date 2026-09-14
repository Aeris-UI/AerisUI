import { expect, test } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('rapid toast creation, stacking, dismissal, and final geometry remain stable', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Show five toasts' }).click();
  const items = page.locator('.aeris-toast__item');
  await expect(items).toHaveCount(4);
  await expect(page.locator('.aeris-toast__overflow')).toHaveText('+1');

  const initialWidth = (await items.first().boundingBox())?.width;
  for (const expectedCount of [4, 3, 2, 1]) {
    await items.first().getByRole('button', { name: 'Close notification' }).click();
    await expect(items).toHaveCount(expectedCount);
  }
  const finalWidth = (await items.first().boundingBox())?.width;
  expect(initialWidth).toBeDefined();
  expect(finalWidth).toBeDefined();
  if (initialWidth && finalWidth) expect(Math.abs(finalWidth - initialWidth)).toBeLessThan(2);
});

test('toast supports pointer swipe dismissal', async ({ page }) => {
  await page.getByRole('button', { name: 'Show toast' }).click();
  const item = page.locator('.aeris-toast__item');
  await expect(item).toHaveCount(1);
  await item.hover();
  const box = await item.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  await page.mouse.move(
    Math.min(box.x + box.width + 80, viewportWidth - 1),
    box.y + box.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();
  await expect(item).toHaveCount(0);
});

test('density, corner, and direction settings reach the document root', async ({ page }) => {
  await page.getByRole('button', { name: 'RTL' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'Compact' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-aeris-density', 'compact');
  await page.getByRole('button', { name: 'Rounded' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-aeris-radius', 'rounded');
});
