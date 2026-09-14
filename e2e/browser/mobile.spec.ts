import { expect, test } from './fixtures';
import { expectInsideViewport } from './helpers';

test('touch selection closes Select and keeps its panel inside the viewport', async ({ page }) => {
  await page.goto('/');
  const select = page.getByRole('combobox', { name: 'Role' });
  await select.tap();
  const panel = page.locator('.aeris-select__panel');
  await expect(panel).toBeVisible();
  await expectInsideViewport(panel, page);
  await page.getByRole('option', { name: 'Researcher' }).tap();
  await expect(select).toHaveAttribute('aria-expanded', 'false');
  await expect(select).toHaveText('Researcher');
});

test('mobile drawer fits the viewport and its backdrop does not click through', async ({
  page,
}) => {
  await page.goto('/');
  const underlay = page.getByRole('button', { name: 'Underlay target' });
  const box = await underlay.boundingBox();
  expect(box).not.toBeNull();
  await page.getByRole('button', { name: 'Open drawer' }).tap();
  const drawer = page.getByRole('dialog', { name: 'Filters' });
  await expect(drawer).toBeVisible();
  await expectInsideViewport(drawer, page);
  await expect(drawer.getByRole('button', { name: 'Reset all filters' })).toBeVisible();
  await expect(drawer.getByRole('button', { name: 'Apply filters' })).toBeVisible();

  const overlay = page.locator('.aeris-drawer__overlay');
  if (box) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await expect(overlay).toHaveCount(0);
  await expect(page.getByLabel('Underlay click count')).toHaveText('0');
  await underlay.tap();
  await expect(page.getByLabel('Underlay click count')).toHaveText('1');
});

test('touch swipe dismisses a toast without overflowing the safe viewport', async ({
  browserName,
  context,
  page,
}) => {
  test.skip(browserName !== 'chromium', 'CDP touch gestures are available in Chromium only.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Show toast' }).tap();
  const item = page.locator('.aeris-toast__item');
  await expectInsideViewport(item, page);
  const box = await item.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  const startX = box.x + 12;
  const y = box.y + box.height / 2;
  const client = await context.newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: startX, y }],
  });
  for (const delta of [32, 72, 120]) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: startX + delta, y }],
    });
  }
  await expect(item).toHaveAttribute('data-swiping', 'true');
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(item).toHaveCount(0);
});
