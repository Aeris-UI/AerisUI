import { expect, test } from './fixtures';

test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

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
