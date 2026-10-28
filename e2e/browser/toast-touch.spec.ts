import { expect, test } from './fixtures';

test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

test('native touch tracks the first movement and cancellation restores the stack', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Native touch injection requires Chromium CDP');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components/toast');
  await page.locator('#toast-stacked').getByRole('button', { name: 'Show stacked toasts' }).tap();
  const region = page.locator('#toast-stacked .aeris-toast__region');
  const front = region.locator('.aeris-toast__item:not(.aeris-toast__item--leaving)').first();
  const content = front.locator('.aeris-toast__content');
  await expect(content).toBeVisible();
  // Wait for the entrance to settle, not an arbitrary device-dependent delay.
  await expect
    .poll(() =>
      front.evaluate(
        (element) =>
          element.getAnimations().filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0);
  const box = await content.boundingBox();
  if (!box) throw new Error('Toast content has no bounds');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const client = await page.context().newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await expect(front).not.toHaveAttribute('data-swiping');
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: x + 24, y }],
  });
  await expect(front).toHaveAttribute('data-swiping', 'true');
  await expect
    .poll(() => front.evaluate((element) => Number.parseFloat(getComputedStyle(element).translate)))
    .toBeCloseTo(24, 0);
  await expect(front).toHaveCSS('transition-property', 'transform, opacity, height');
  await client.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(front).not.toHaveAttribute('data-swiping');
  await expect(front).toHaveCSS('translate', '0px');
  await expect(region).toHaveAttribute('data-mode', 'stacked');
  await expect(region.locator('.aeris-toast__item:not(.aeris-toast__item--leaving)')).toHaveCount(
    4,
  );
  await content.tap();
  await expect(region).toHaveAttribute('data-mode', 'expanded');
  await content.tap();
  await expect(region).toHaveAttribute('data-mode', 'stacked');
  await client.detach();
});

test('stacked toasts expand and collapse when different notifications are tapped', async ({
  page,
}) => {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  await page.goto('/components/toast');
  await page.locator('#toast-stacked').getByRole('button', { name: 'Show stacked toasts' }).tap();
  const region = page.locator('#toast-stacked .aeris-toast__region');
  const items = region.locator('.aeris-toast__item:not(.aeris-toast__item--leaving)');
  await expect(items).toHaveCount(4);
  await expect(region).toHaveAttribute('data-mode', 'stacked');
  await items.first().locator('.aeris-toast__content').tap();
  await expect(region).toHaveAttribute('data-mode', 'expanded');
  await expect
    .poll(async () => {
      const first = await items.nth(0).boundingBox();
      const second = await items.nth(1).boundingBox();
      return first && second ? second.y - first.y > first.height / 2 : false;
    })
    .toBe(true);
  await items.nth(1).locator('.aeris-toast__content').tap();
  await expect(region).toHaveAttribute('data-mode', 'stacked');
  await expect
    .poll(async () => {
      const first = await items.nth(0).boundingBox();
      const second = await items.nth(1).boundingBox();
      return first && second ? Math.abs(second.y - first.y) < first.height / 2 : false;
    })
    .toBe(true);
  await expect(items).toHaveCount(4);
  await items.first().locator('.aeris-toast__content').tap();
  await expect(region).toHaveAttribute('data-mode', 'expanded');
  await items.first().getByRole('button', { name: 'Close notification' }).tap();
  await expect(region).toHaveAttribute('data-mode', 'expanded');
});
