import type { Locator, Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function drag(page: Page, handle: Locator, x: number, y: number, pause = 0): Promise<void> {
  const bounds = await handle.boundingBox();
  if (!bounds) throw new Error('Expected a visible swipe handle');
  const start = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + x, start.y + y, { steps: 8 });
  if (pause) await page.waitForTimeout(pause);
  await page.mouse.up();
}

test('swipes dismiss all four physical edges and restore focus without release clickthrough', async ({
  page,
}) => {
  await page.goto('/');
  const fixture = page.locator('[data-fixture="drawer-swipe"]');
  for (const [edge, x, y] of [
    ['left', -180, 0],
    ['right', 180, 0],
    ['top', 0, -180],
    ['bottom', 0, 180],
  ] as const) {
    const launcher = fixture.getByRole('button', { name: `Open swipe ${edge}`, exact: true });
    await launcher.focus();
    await launcher.press('Enter');
    const drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
    await drag(page, drawer.locator('.aeris-drawer__swipe-handle'), x, y);
    await expect(drawer).not.toBeVisible();
    await expect(fixture.getByRole('status', { name: 'Gesture close reason' })).toHaveText('swipe');
    await expect(launcher).toBeFocused();
    await expect(drawer).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  }
});

test('whole-drawer swiping needs no visible handle or reserved handle space', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Show swipe handle', exact: true }).click();
  for (const [edge, x, y] of [
    ['left', -180, 0],
    ['right', 180, 0],
    ['top', 0, -180],
    ['bottom', 0, 180],
  ] as const) {
    await page.getByRole('button', { name: `Open swipe ${edge}`, exact: true }).click();
    const drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
    await expect(drawer.locator('.aeris-drawer__swipe-handle')).toHaveCount(0);
    await expect(drawer).not.toHaveAttribute('data-swipe-handle');
    // The top header is close to the viewport edge: use a short deliberate flick there.
    // Body text selection and scrolling remain native rather than becoming mouse drags.
    const box = await drawer.locator('.aeris-drawer__header').boundingBox();
    if (!box) throw new Error('Expected a visible drawer header');
    const startX = box.x + box.width / 2;
    const startY = box.y + (edge === 'top' ? box.height - 4 : box.height / 2);
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + x, startY + (edge === 'top' ? -40 : y), {
      steps: edge === 'top' ? 1 : 8,
    });
    await page.mouse.up();
    await expect(drawer).not.toBeVisible();
    await expect(drawer).toHaveCount(0);
  }
});

test('short, perpendicular, cancelled and resized drags keep the drawer open', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open swipe bottom', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  const handle = drawer.locator('.aeris-drawer__swipe-handle');
  await drag(page, handle, 0, 20, 120);
  await expect(drawer).toBeVisible();
  await drag(page, handle, 35, 0);
  await expect(drawer).toBeVisible();
  const box = await handle.boundingBox();
  if (!box) throw new Error('Expected a visible swipe handle');
  await handle.evaluate((element) =>
    element.addEventListener(
      'pointerdown',
      (event) => element.setAttribute('data-test-pointer', String(event.pointerId)),
      { once: true },
    ),
  );
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 80, { steps: 4 });
  await handle.dispatchEvent('pointercancel', {
    pointerId: Number(await handle.getAttribute('data-test-pointer')),
  });
  await page.mouse.up();
  await expect(drawer).toBeVisible();
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('Expected a configured viewport');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 80, { steps: 4 });
  await page.setViewportSize({ width: viewport.width, height: viewport.height - 20 });
  await page.mouse.up();
  await expect(drawer).toBeVisible();
  await expect(drawer).not.toHaveAttribute('data-swiping');
});

test('body scrolling, text fields and nested controls are not swipe surfaces', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open swipe bottom', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  await drawer.getByRole('textbox', { name: 'Drawer project' }).fill('Updated project');
  // Native scroll containers keep their scroll chain and do not drive drawer progress.
  const scroll = drawer.getByRole('region', { name: 'Nested drawer content' });
  await scroll.evaluate((element) => {
    element.scrollTop = 100;
  });
  await expect.poll(() => scroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await drawer.getByRole('slider', { name: 'Volume' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(drawer.getByRole('slider', { name: 'Volume' })).toHaveValue('31');
  await drag(page, scroll, 0, 50);
  await expect(drawer).toBeVisible();
  await expect(drawer).not.toHaveAttribute('data-swiping');
  await expect(drawer.getByRole('textbox', { name: 'Drawer project' })).toHaveValue(
    'Updated project',
  );
});

test('the handle is a keyboard and touch alternative and is disabled while maximized', async ({
  page,
  hasTouch,
}) => {
  await page.goto('/');
  const launch = page.getByRole('button', { name: 'Open swipe right', exact: true });
  await launch.click();
  let drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  await drawer.getByRole('button', { name: 'Maximize drawer', exact: true }).click();
  await expect(drawer.locator('.aeris-drawer__swipe-handle')).toHaveCount(0);
  await drawer.getByRole('button', { name: 'Restore drawer size', exact: true }).click();
  const handle = drawer.locator('.aeris-drawer__swipe-handle');
  await handle.focus();
  await page.keyboard.press('Enter');
  await expect(drawer).not.toBeVisible();
  await launch.click();
  drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  if (hasTouch) await drawer.locator('.aeris-drawer__swipe-handle').tap();
  else await drawer.locator('.aeris-drawer__swipe-handle').click();
  await expect(drawer).not.toBeVisible();
});

test('custom append targets, headless content, safe areas and RTL retain correct swipe direction', async ({
  page,
}) => {
  await page.goto('/?direction=rtl');
  const fixture = page.locator('[data-fixture="drawer-swipe"]');
  await fixture.getByRole('button', { name: 'Use custom append target', exact: true }).click();
  await fixture.getByRole('button', { name: 'Use custom drawer content', exact: true }).click();
  await page.evaluate(() =>
    document.documentElement.style.setProperty('--aeris-safe-area-bottom', '20px'),
  );
  await fixture.getByRole('button', { name: 'Open swipe top', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  await expect(fixture.locator('[data-custom-append-target] .aeris-drawer__overlay')).toBeVisible();
  await expect(drawer.getByRole('heading', { name: 'Custom content' })).toBeVisible();
  const panelBounds = await drawer.boundingBox();
  const handleBounds = await drawer.locator('.aeris-drawer__swipe-handle').boundingBox();
  if (!panelBounds || !handleBounds) throw new Error('Expected visible custom drawer geometry');
  expect(handleBounds.y + handleBounds.height).toBeLessThanOrEqual(
    panelBounds.y + panelBounds.height - 20,
  );
  await drag(page, drawer.locator('.aeris-drawer__swipe-handle'), 0, -220);
  await expect(drawer).not.toBeVisible();
  await expect(fixture.getByRole('status', { name: 'Gesture close reason' })).toHaveText('swipe');
});

test('rapid reopen clears drag state and reduced motion removes return transitions', async ({
  page,
}) => {
  await page.goto('/');
  const launch = page.getByRole('button', { name: 'Open swipe bottom', exact: true });
  await launch.click();
  let drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  await drag(page, drawer.locator('.aeris-drawer__swipe-handle'), 0, 20, 120);
  await page.keyboard.press('Escape');
  await launch.click();
  drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  await expect(drawer).toBeVisible();
  await expect(drawer).not.toHaveAttribute('data-swiping');
  await expect(drawer).toHaveCSS('transition-duration', '0s');
});

test('drag progress tracks the pointer and animates back when motion is enabled', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open swipe bottom', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  await expect
    .poll(() =>
      drawer.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42),
    )
    .toBeCloseTo(0, 1);
  const overlay = page.locator('.aeris-drawer__overlay');
  const originalBackground = await overlay.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const box = await drawer.locator('.aeris-drawer__swipe-handle').boundingBox();
  if (!box) throw new Error('Expected a visible swipe handle');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + 60, { steps: 5 });
  await expect
    .poll(() =>
      drawer.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42),
    )
    .toBeGreaterThan(50);
  await expect
    .poll(() => overlay.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(originalBackground);
  await page.waitForTimeout(120);
  await page.mouse.up();
  await expect(drawer).toBeVisible();
  await expect
    .poll(() =>
      drawer.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42),
    )
    .toBeCloseTo(0, 1);
});

test('native mobile touch preserves scrolling and swipes content at its dismissal boundary', async ({
  page,
  context,
  browserName,
  hasTouch,
}) => {
  test.skip(
    browserName !== 'chromium' || !hasTouch,
    'Native touch movement uses Chromium CDP; iOS hardware validation remains manual.',
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Show swipe handle', exact: true }).click();
  await page.getByRole('button', { name: 'Open swipe bottom', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
  const client = await context.newCDPSession(page);
  const touch = async (x: number, y: number, delta: number, deltaX = 0) => {
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 6; step++) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + (deltaX * step) / 6, y: y + (delta * step) / 6 }],
      });
      await page.waitForTimeout(20);
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  try {
    const scroll = drawer.getByRole('region', { name: 'Nested drawer content' });
    await scroll.scrollIntoViewIfNeeded();
    const area = await scroll.boundingBox();
    if (!area) throw new Error('Expected visible nested content');
    await touch(area.x + area.width / 2, area.y + area.height - 20, -60);
    await expect.poll(() => scroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('.aeris-drawer__swipe-handle')).toHaveCount(0);
    // A downward swipe away from the top scroll boundary scrolls rather than dismissing.
    await touch(area.x + area.width / 2, area.y + 20, 30);
    await expect(drawer).toBeVisible();
    await scroll.evaluate((element) => {
      element.scrollTop = 0;
    });
    await touch(area.x + area.width / 2, area.y + 20, 220);
    await expect(drawer).not.toBeVisible();
    await expect(page.getByRole('status', { name: 'Gesture close reason' })).toHaveText('swipe');
    for (const edge of ['left', 'right', 'top'] as const) {
      await expect(drawer).toHaveCount(0);
      await page.getByRole('button', { name: `Open swipe ${edge}`, exact: true }).click();
      const current = page.getByRole('dialog', { name: 'Gesture drawer', exact: true });
      if (edge === 'top') {
        const region = current.getByRole('region', { name: 'Nested drawer content' });
        await region.evaluate((element) => {
          element.scrollTop = element.scrollHeight;
        });
        await current.locator('.aeris-drawer__body').evaluate((element) => {
          element.scrollTop = element.scrollHeight;
        });
        const bounds = await region.boundingBox();
        if (!bounds) throw new Error('Expected visible scroll content at its bottom boundary');
        await touch(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, -180);
      } else {
        const bounds = await current.locator('.aeris-drawer__header').boundingBox();
        if (!bounds) throw new Error('Expected visible drawer header');
        await touch(
          bounds.x + bounds.width / 2,
          bounds.y + bounds.height / 2,
          0,
          edge === 'left' ? -180 : 180,
        );
      }
      await expect(current).not.toBeVisible();
      await expect(page.getByRole('status', { name: 'Gesture close reason' })).toHaveText('swipe');
    }
  } finally {
    await client.detach();
  }
});
