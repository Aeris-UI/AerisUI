import { expect, test } from './fixtures';

test('viewport overlays follow keyboard-size viewport changes and safe areas', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const viewport = Object.assign(new EventTarget(), {
      offsetLeft: 0,
      offsetTop: 0,
      width: innerWidth,
      height: innerHeight,
    });
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport });
    document.documentElement.style.setProperty('--aeris-safe-area-bottom', '24px');
    document.documentElement.style.setProperty('--aeris-safe-area-top', '20px');
  });
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  await page.evaluate(() => {
    Object.assign(window.visualViewport ?? {}, { height: 420, offsetTop: 12 });
    window.visualViewport?.dispatchEvent(new Event('resize'));
  });
  const dialog = page.getByRole('dialog', { name: 'Create project' });
  await expect.poll(async () => (await dialog.boundingBox())?.y).toBeGreaterThanOrEqual(32);
  await expect
    .poll(async () => {
      const box = await dialog.boundingBox();
      return box ? box.y + box.height : 10000;
    })
    .toBeLessThanOrEqual(432);
  await expect(dialog.getByRole('button', { name: 'Create project', exact: true })).toBeVisible();
  await dialog.getByRole('combobox', { name: 'Owner role' }).click();
  const options = page.getByRole('listbox');
  await expect(options).toBeVisible();
  await expect
    .poll(async () => {
      const bounds = await options.boundingBox();
      return bounds ? bounds.y + bounds.height : 10000;
    })
    .toBeLessThanOrEqual(432);
  await page.getByRole('option', { name: 'Engineer' }).click();
  await expect(options).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Open drawer', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Filters' });
  await expect
    .poll(async () => {
      const box = await drawer.boundingBox();
      return box ? box.y + box.height : 10000;
    })
    .toBeLessThanOrEqual(432);
  await expect(drawer.getByRole('button', { name: 'Apply filters' })).toBeVisible();
});

test('hardware Back closes the dropdown before its modal and restores focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Create project' });
  const select = dialog.getByRole('combobox', { name: 'Owner role' });
  await select.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  const firstHandled = await page.evaluate(
    () => !window.dispatchEvent(new Event('aeris-hardware-back', { cancelable: true })),
  );
  expect(firstHandled).toBe(true);
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await expect(select).toBeFocused();
  await page.evaluate(() =>
    window.dispatchEvent(new Event('aeris-hardware-back', { cancelable: true })),
  );
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open dialog', exact: true })).toBeFocused();
});

test('coarse-pointer fields avoid small-font focus zoom and actions have usable targets', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Requires a coarse-pointer mobile context.');
  await page.goto('/');
  const input = page.getByRole('textbox', { name: 'Required name' });
  await expect(input).toHaveCSS('font-size', '16px');
  const button = page.getByRole('button', { name: 'Open dialog', exact: true });
  const box = await button.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect(box?.width).toBeGreaterThanOrEqual(44);
  const group = page.locator('aeris-input-group');
  const field = await group.getByRole('textbox', { name: 'Compact search' }).boundingBox();
  const action = await group.getByRole('button', { name: 'Search', exact: true }).boundingBox();
  expect(field && action).toBeTruthy();
  expect(Math.abs((field?.height ?? 0) - (action?.height ?? 0))).toBeLessThanOrEqual(1);
  for (const indicator of await page.locator('.aeris-carousel__indicators button').all()) {
    const bounds = await indicator.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
  }
});

test('fullscreen galleries respect visible viewport sizing and hardware Back', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const viewport = Object.assign(new EventTarget(), {
      offsetLeft: 0,
      offsetTop: 0,
      width: innerWidth,
      height: 480,
    });
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport });
    document.documentElement.style.setProperty('--aeris-safe-area-bottom', '24px');
  });
  await page.getByRole('button', { name: 'Enter fullscreen', exact: true }).click();
  const gallery = page.getByRole('dialog', { name: 'Mobile fullscreen gallery' });
  await expect(gallery).toBeVisible();
  await expect
    .poll(async () => {
      const box = await gallery.boundingBox();
      return box ? box.y + box.height : 10000;
    })
    .toBeLessThanOrEqual(480);
  await page.evaluate(() =>
    window.dispatchEvent(new Event('aeris-hardware-back', { cancelable: true })),
  );
  await expect(gallery).toHaveCount(0);
});
