import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('Sidebar expansion reveals labels only after its width settles and respects reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components/sidebar');
  const example = page.locator('#sidebar-collapsed');
  const sidebar = example.locator('aeris-sidebar');
  const brand = sidebar.locator('.aeris-sidebar__brand');
  await expect(sidebar).not.toHaveAttribute('data-reveal-labels');
  await example.getByRole('button', { name: 'Collapse navigation', exact: true }).first().click();
  await expect(sidebar).toHaveAttribute('data-icon-only', 'true');
  await example.getByRole('button', { name: 'Expand navigation', exact: true }).first().click();
  const during = await sidebar.evaluate((element) => {
    const animations = element.getAnimations({ subtree: true });
    for (const animation of animations) {
      animation.pause();
      animation.currentTime = 50;
    }
    return Array.from(element.querySelectorAll('.aeris-sidebar__label,.aeris-sidebar__brand')).map(
      (label) => ({
        opacity: getComputedStyle(label).opacity,
        wrapping: getComputedStyle(label).whiteSpace,
      }),
    );
  });
  expect(during.length).toBeGreaterThan(1);
  expect(during.every((label) => label.opacity === '0' && label.wrapping === 'nowrap')).toBe(true);
  await sidebar.evaluate((element) => {
    for (const animation of element.getAnimations({ subtree: true })) animation.finish();
  });
  await expect(brand).toHaveCSS('opacity', '1');
  await expect(brand).toHaveCSS('white-space', 'normal');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await example.getByRole('button', { name: 'Collapse navigation', exact: true }).first().click();
  await example.getByRole('button', { name: 'Expand navigation', exact: true }).first().click();
  await expect(brand).toHaveCSS('opacity', '1');
  await expect(brand).toHaveCSS('animation-name', 'none');
});

test('Sidebar catalog preview is left aligned, icon-only at rest and expands on hover', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Touch preview playback is covered by the shared catalog playback tests.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  const filter = page.getByRole('searchbox', { name: 'Filter components' });
  await filter.fill('Sidebar');
  const card = page.locator('.catalog-preview-card');
  const sidebar = card.locator('aeris-sidebar');
  await card.scrollIntoViewIfNeeded();
  await expect(sidebar).toHaveAttribute('data-icon-only', 'true');
  await expect(sidebar.locator('svg[aerisSidebarIcon]')).toHaveCount(4);
  const toggle = sidebar.locator('.aeris-sidebar__collapse');
  await expect(toggle).toHaveAttribute('aria-label', 'Expand navigation');
  await expect(toggle).toBeVisible();
  const toggleBounds = await toggle.boundingBox();
  const sidebarBounds = await sidebar.boundingBox();
  if (toggleBounds && sidebarBounds) {
    expect(toggleBounds.x).toBeGreaterThanOrEqual(sidebarBounds.x);
    expect(toggleBounds.x + toggleBounds.width).toBeLessThanOrEqual(
      sidebarBounds.x + sidebarBounds.width,
    );
  }
  const scene = await card.locator('.catalog-preview-scene').boundingBox();
  const initial = await sidebar.boundingBox();
  expect(scene).not.toBeNull();
  expect(initial).not.toBeNull();
  if (scene && initial) expect(Math.abs(initial.x - scene.x)).toBeLessThan(2);
  await card.hover();
  await expect(sidebar).not.toHaveAttribute('data-icon-only');
  await expect(toggle).toHaveAttribute('aria-label', 'Collapse navigation');
  await expect.poll(async () => (await sidebar.boundingBox())?.width ?? 0).toBeGreaterThan(150);
  await expect(sidebar.locator('.aeris-sidebar__brand')).toHaveCSS('opacity', '1');
  await filter.hover();
  await expect(sidebar).toHaveAttribute('data-icon-only', 'true');
});

test('Sidebar documentation uses the shared page spacing on desktop and mobile', async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/components/menubar');
    const expected = await page.locator('article.button-docs').evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.paddingTop, style.paddingLeft, style.paddingRight, style.maxWidth];
    });
    await page.goto('/components/sidebar');
    const actual = await page.locator('article.button-docs').evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.paddingTop, style.paddingLeft, style.paddingRight, style.maxWidth];
    });
    expect(actual).toEqual(expected);
    expect(Number.parseFloat(actual[1] ?? '0')).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
  }
});

test('Sidebar controls collapse, retain group state and expose focused icon labels', async ({
  page,
}) => {
  await page.goto('/components/sidebar');
  const example = page.locator('#sidebar-collapsed');
  const navigation = example.getByRole('navigation', { name: 'Compact example navigation' });
  await expect(navigation).toBeVisible();
  await example.getByRole('button', { name: 'Collapse navigation', exact: true }).first().click();
  await expect(navigation).toHaveAttribute('data-icon-only', 'true');
  const overview = navigation.getByRole('button', { name: 'Overview', exact: true });
  await overview.focus();
  await expect(page.getByRole('tooltip')).toHaveText('Overview');
  await expect(overview).toHaveAttribute('aria-current', 'page');
  const shape = await navigation.boundingBox();
  expect(shape?.width).toBeLessThan(90);
  for (const direction of ['ltr', 'rtl']) {
    await page.evaluate((dir) => (document.documentElement.dir = dir), direction);
    await expect
      .poll(() =>
        navigation.evaluate((element) => {
          const header = element.querySelector('.aeris-sidebar__header');
          const toggle = element.querySelector('.aeris-sidebar__collapse');
          if (!header || !toggle) return Infinity;
          const headerBox = header.getBoundingClientRect();
          const toggleBox = toggle.getBoundingClientRect();
          return Math.abs(headerBox.x + headerBox.width / 2 - (toggleBox.x + toggleBox.width / 2));
        }),
      )
      .toBeLessThan(1);
  }
  await page.evaluate(() => (document.documentElement.dir = 'ltr'));
  await example.getByRole('button', { name: 'Expand navigation', exact: true }).first().click();
  await expect(navigation).not.toHaveAttribute('data-icon-only');
  await expect(page.getByRole('tooltip')).toHaveCount(0);

  const groups = page.locator('#sidebar-groups');
  const disclosure = groups.getByRole('button', { name: 'Workspace', exact: true });
  await disclosure.click();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(groups.getByRole('button', { name: 'Archived projects' })).not.toBeVisible();
  await disclosure.focus();
  await page.keyboard.press('Space');
  await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
  const body = groups.locator('.aeris-sidebar__body');
  expect(await body.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await body.evaluate((element) => (element.scrollTop = element.scrollHeight));
  await expect(groups.getByRole('button', { name: 'Settings' })).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .include('#sidebar-groups .preview')
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test('Sidebar mobile drawer can keep item activation separate from dismissal', async ({
  page,
  isMobile,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/components/sidebar');
  const toggle = page.locator('#sidebar-mobile .preview button.aeris-button');
  if (isMobile) await toggle.tap();
  else await toggle.click();
  const dialog = page.getByRole('dialog', { name: 'Drawer example navigation' });
  await expect(dialog).toBeVisible();
  for (const name of ['Overview', 'Projects', 'Settings']) {
    const item = dialog.getByRole('button', { name, exact: true });
    if (isMobile) await item.tap();
    else await item.click();
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  }
  await dialog.getByRole('button', { name: 'Close navigation' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('Sidebar responsive preview changes its actual viewport and contains its drawer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/sidebar');
  const example = page.locator('#sidebar-responsive');
  const controls = example.getByRole('group', { name: 'Preview workspace width' });
  const iframe = example.locator('iframe');
  await iframe.scrollIntoViewIfNeeded();
  const frame = page.frameLocator('#sidebar-responsive iframe');
  const navigation = frame.getByRole('navigation', { name: 'Responsive example navigation' });
  await expect(navigation).toBeVisible();
  await expect(frame.getByRole('status')).toHaveText('Persistent navigation');
  await navigation.getByRole('button', { name: 'Projects', exact: true }).click();
  await expect(frame.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await controls.getByRole('button', { name: 'Compact width', exact: true }).click();
  await expect(frame.getByRole('status')).toHaveText('Drawer navigation');
  const toggle = frame.getByRole('button', { name: 'Expand navigation', exact: true });
  await toggle.click();
  const dialog = frame.getByRole('dialog', { name: 'Responsive example navigation' });
  await expect(dialog).toBeVisible();
  const bounds = await iframe.boundingBox();
  const drawer = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  expect(drawer).not.toBeNull();
  if (bounds && drawer) {
    expect(drawer.x).toBeGreaterThanOrEqual(bounds.x);
    expect(drawer.y).toBeGreaterThanOrEqual(bounds.y);
    expect(drawer.x + drawer.width).toBeLessThanOrEqual(bounds.x + bounds.width);
    expect(drawer.y + drawer.height).toBeLessThanOrEqual(bounds.y + bounds.height);
  }
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await dialog.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(frame.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
  await controls.getByRole('button', { name: 'Available width', exact: true }).click();
  await expect(navigation).toBeVisible();
  await expect(frame.getByRole('status')).toHaveText('Persistent navigation');
  await expect(frame.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
  await expect(frame.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('Sidebar uses a single mobile Drawer with trapped focus and restores its toggle', async ({
  page,
  isMobile,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/components/sidebar');
  await page.locator('#sidebar-responsive iframe').scrollIntoViewIfNeeded();
  const frame = page.frameLocator('#sidebar-responsive iframe');
  const toggle = frame.locator('.sidebar-workspace__header button.aeris-button');
  await expect(toggle).toBeVisible();
  await expect(
    frame.getByRole('navigation', { name: 'Responsive example navigation' }),
  ).toHaveCount(0);
  if (isMobile) await toggle.tap();
  else await toggle.click();
  const dialog = frame.getByRole('dialog', { name: 'Responsive example navigation' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('navigation')).toHaveCount(1);
  const closeGlyph = dialog.getByRole('button', { name: 'Close navigation' }).locator('span');
  await expect
    .poll(() => closeGlyph.evaluate((element) => getComputedStyle(element).maskImage))
    .toContain('data:image/svg+xml');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const accessibility = await new AxeBuilder({ page })
    .include(['#sidebar-responsive iframe', '.aeris-drawer__panel'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  // Re-enter the frame after Axe's cross-frame analysis before testing keyboard input.
  await dialog.getByText('Workspace', { exact: true }).click();
  const lastItem = dialog.getByRole('button', { name: 'Settings' });
  await lastItem.focus();
  await expect(lastItem).toBeFocused();
  await lastItem.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close navigation' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toBeFocused();
  if (isMobile) await toggle.tap();
  else await toggle.click();
  const destination = dialog.getByRole('button', { name: 'Projects', exact: true });
  if (isMobile) await destination.tap();
  else await destination.click();
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(await frame.locator('body').evaluate((body) => body.style.overflow)).not.toBe('hidden');
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('Sidebar preview survives responsive transitions and follows the documentation theme and RTL', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/sidebar');
  await page.locator('#sidebar-responsive iframe').scrollIntoViewIfNeeded();
  const frame = page.frameLocator('#sidebar-responsive iframe');
  const navigation = frame.getByRole('navigation', { name: 'Responsive example navigation' });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('button', { name: 'Projects' }).focus();
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = frame.locator('.sidebar-workspace__header button.aeris-button');
  await expect(toggle).toBeVisible();
  await toggle.click();
  const dialog = frame.getByRole('dialog', { name: 'Responsive example navigation' });
  await expect(dialog).toBeVisible();
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.style.setProperty('--sidebar-preview-test', 'synced');
  });
  await expect(dialog).toHaveAttribute('data-position', 'right');
  await expect
    .poll(() =>
      frame
        .locator('html')
        .evaluate((root) => root.style.getPropertyValue('--sidebar-preview-test')),
    )
    .toBe('synced');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(dialog).toHaveCount(0);
  await expect(navigation).toHaveCount(1);
  await expect(navigation).toBeVisible();
  expect(await frame.locator('body').evaluate((body) => body.style.overflow)).not.toBe('hidden');
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1441);
});
