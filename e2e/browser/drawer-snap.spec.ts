import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const url = 'http://127.0.0.1:4301/components/drawer';

test('deferred documentation navigation opens, traps focus and restores its launcher', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  const launcher = page.getByRole('button', { name: 'Open documentation navigation', exact: true });
  await launcher.focus();
  await launcher.press('Enter');
  const navigation = page.getByRole('dialog', { name: 'Documentation', exact: true });
  await expect(navigation).toBeVisible();
  const close = navigation.getByRole('button', { name: 'Close documentation navigation' });
  await expect(close).toBeFocused();
  await close.press('Shift+Tab');
  expect(await navigation.evaluate((element) => element.contains(document.activeElement))).toBe(
    true,
  );
  await page.keyboard.press('Escape');
  await expect(navigation).not.toBeVisible();
  await expect(launcher).toBeFocused();
});

test('bottom snap points support controlled buttons, slider keys, semantics and responsive height', async ({
  page,
}) => {
  await page.goto(url);
  await page.locator('#drawer-snap').getByRole('button', { name: 'Open snap drawer' }).click();
  const drawer = page.getByRole('dialog', { name: 'Project details', exact: true });
  const handle = drawer.getByRole('slider', { name: 'Resize drawer' });
  await expect(handle).toHaveAttribute('aria-valuetext', '60% of available height');
  const bounds = await drawer.boundingBox();
  if (!bounds) throw new Error('Expected a visible snap drawer');
  expect(bounds.height).toBeCloseTo((page.viewportSize()?.height ?? 0) * 0.6, 0);
  await handle.focus();
  await handle.press('ArrowUp');
  await expect(handle).toHaveAttribute('aria-valuetext', '90% of available height');
  await handle.press('Home');
  await expect(handle).toHaveAttribute('aria-valuetext', '35% of available height');
  await drawer.getByRole('button', { name: '60%', exact: true }).click();
  await expect(handle).toHaveAttribute('aria-valuetext', '60% of available height');
  const result = await new AxeBuilder({ page })
    .include('.aeris-drawer__overlay[data-state="open"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  const field = drawer.getByRole('textbox', { name: 'Project name' });
  await field.focus();
  await page.setViewportSize({ width: 390, height: 640 });
  await expect.poll(async () => (await drawer.boundingBox())?.height).toBeCloseTo(384, 0);
  await expect(handle).toHaveAttribute('aria-valuetext', '60% of available height');
  await expect(field).toBeFocused();
  const fieldBounds = await field.boundingBox();
  if (!fieldBounds) throw new Error('Expected a visible focused field');
  expect(fieldBounds.y).toBeGreaterThanOrEqual(0);
  expect(fieldBounds.y + fieldBounds.height).toBeLessThanOrEqual(640);
});

test('dragging settles in either direction and cannot dismiss a non-dismissible snap drawer', async ({
  page,
}) => {
  await page.goto(url);
  await page.locator('#drawer-snap').getByRole('button', { name: 'Open snap drawer' }).click();
  const drawer = page.getByRole('dialog', { name: 'Project details', exact: true });
  const handle = drawer.getByRole('slider', { name: 'Resize drawer' });
  const height = page.viewportSize()?.height ?? 800;
  const drag = async (delta: number) => {
    const bounds = await handle.boundingBox();
    if (!bounds) throw new Error('Expected a visible resize handle');
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, Math.max(2, Math.min(height - 2, y + delta)), { steps: 12 });
    await page.waitForTimeout(120); // Release after movement velocity expires: test nearest-point settling.
    await page.mouse.up();
  };
  await drag(-height * 0.25);
  await expect(handle).toHaveAttribute('aria-valuetext', '90% of available height');
  await drag(height);
  await expect(drawer).toBeVisible();
  await expect(handle).toHaveAttribute('aria-valuetext', '35% of available height');
  await drawer.getByRole('button', { name: 'Close drawer', exact: true }).click();
  await expect(drawer).not.toBeVisible();
});

test('native touch expands the handle and scrolls the body at the largest point', async ({
  page,
  browserName,
  hasTouch,
}) => {
  test.skip(
    browserName !== 'chromium' || !hasTouch,
    'Native touch injection uses mobile Chromium CDP.',
  );
  await page.goto(url);
  await page.locator('#drawer-snap').getByRole('button', { name: 'Open snap drawer' }).click();
  const drawer = page.getByRole('dialog', { name: 'Project details', exact: true });
  const handle = drawer.getByRole('slider', { name: 'Resize drawer' });
  const client = await page.context().newCDPSession(page);
  const gesture = async (x: number, y: number, delta: number) => {
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 12; step++) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: y + (delta * step) / 12 }],
      });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  const bounds = await handle.boundingBox();
  if (!bounds) throw new Error('Expected resize handle');
  await gesture(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
    -(page.viewportSize()?.height ?? 800) * 0.25,
  );
  await expect(handle).toHaveAttribute('aria-valuetext', '90% of available height');
  const body = drawer.locator('.aeris-drawer__body');
  const bodyBounds = await body.boundingBox();
  if (!bodyBounds) throw new Error('Expected scrolling drawer body');
  await gesture(
    bodyBounds.x + bodyBounds.width / 2,
    bodyBounds.y + bodyBounds.height * 0.8,
    -bodyBounds.height * 0.5,
  );
  await expect.poll(() => body.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(handle).toHaveAttribute('aria-valuetext', '90% of available height');
  await client.detach();
});
