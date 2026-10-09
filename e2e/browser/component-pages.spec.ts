import { expect, test } from './fixtures';

for (const width of [390, 768, 1440]) {
  test(`landing showcase fits a ${width}px viewport and names its navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('.home-live-showcase').scrollIntoViewIfNeeded();
    const gallery = page.locator('app-aeris-showcase-gallery');
    await expect(gallery.locator('.components-preview')).toBeVisible();
    for (const name of ['Components', 'Dashboard', 'Chat', 'CRM', 'Mail', 'Finances']) {
      const tab = gallery.getByRole('tab', { name, exact: true });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      const toolbar = gallery.locator('.product-toolbar').first();
      if (await toolbar.count()) {
        const title = toolbar.locator('[aerisToolbarStart] strong');
        await expect(title).toBeVisible();
        expect(
          await title.evaluate((element) => element.getBoundingClientRect().height),
        ).toBeLessThan(60);
        const contentOverflow = await toolbar
          .locator('.aeris-toolbar__content')
          .evaluate((element) => element.scrollWidth - element.clientWidth);
        expect(contentOverflow).toBeLessThanOrEqual(1);
      }
      await expect
        .poll(() =>
          gallery.evaluate((element) => {
            const panel = element.querySelector<HTMLElement>('[role="tabpanel"]');
            return Math.max(
              document.documentElement.scrollWidth - document.documentElement.clientWidth,
              element.scrollWidth - element.clientWidth,
              panel ? panel.scrollWidth - panel.clientWidth : 0,
            );
          }),
        )
        .toBeLessThanOrEqual(1);
    }
  });
}

test('landing showcase exports real data and allows scrolling back into the page', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.home-live-showcase').scrollIntoViewIfNeeded();
  const gallery = page.locator('app-aeris-showcase-gallery');
  await gallery.getByRole('tab', { name: 'Dashboard', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await gallery.getByRole('button', { name: 'Export', exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('workspace-tasks.csv');
  await gallery.getByRole('tab', { name: 'CRM', exact: true }).click();
  await gallery.getByRole('button', { name: 'Add lead', exact: true }).click();
  await gallery.locator('[name="company"]').fill('Acme Workshop');
  await gallery.locator('[name="contact"]').fill('Jamie Smith');
  await gallery.getByRole('button', { name: 'Save lead', exact: true }).click();
  await expect(gallery.locator('.crm-preview__contact')).toContainText('Jamie Smith');
  const panel = gallery.getByRole('tabpanel').first();
  await panel.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const pageTop = await page.evaluate(() => window.scrollY);
  await panel.hover();
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(pageTop);
});

test('documentation search loads on demand and focuses its search field', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Search documentation', exact: true });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('searchbox');
  await expect(input).toBeFocused();
  await input.fill('select');
  await expect(dialog.getByRole('link', { name: /^Select / })).toBeVisible();
  await input.press('Escape');
  await expect(dialog).not.toBeVisible();
});

const COMPONENT_ROUTES = [
  'button',
  'button-group',
  'speed-dial',
  'split-button',
  'auto-complete',
  'cascade-select',
  'input-text',
  'input-number',
  'input-mask',
  'key-filter',
  'input-otp',
  'checkbox',
  'color-picker',
  'editor',
  'form-field',
  'icon-field',
  'input-group',
  'radio-button',
  'rating',
  'select',
  'textarea',
  'toggle-switch',
  'tree-select',
  'date-picker',
  'slider',
  'multi-select',
  'password',
  'accordion',
  'card',
  'divider',
  'panel',
  'scroll-panel',
  'splitter',
  'stepper',
  'tabs',
  'toolbar',
  'breadcrumb',
  'context-menu',
  'menu',
  'mega-menu',
  'menubar',
  'tiered-menu',
  'confirm-dialog',
  'confirm-popup',
  'dialog',
  'drawer',
  'dynamic-dialog',
  'popover',
  'tooltip',
  'file-upload',
  'carousel',
  'galleria',
  'compare',
  'chart',
  'progress-bar',
  'toast',
  'message',
  'table',
  'pick-list',
  'order-list',
  'organization-chart',
  'timeline',
  'tree',
  'tree-table',
  'paginator',
  'scroll-top',
  'animate-on-scroll',
  'auto-focus',
  'class-names',
  'filter-service',
  'focus-trap',
  'glass',
  'style-class',
  'chip',
  'fluid',
  'inplace',
  'meter-group',
  'progress-spinner',
  'skeleton',
  'block-ui',
  'avatar',
  'badge',
] as const;

for (const route of COMPONENT_ROUTES) {
  test(`${route} page renders without browser errors`, async ({ page }) => {
    const response = await page.goto(`/components/${route}`);
    expect(response?.ok()).toBe(true);
    await expect(page.locator('h1').first()).toBeVisible();
  });
}

test('IconField search clear uses the Aeris button hover and clears the value', async ({
  page,
}) => {
  await page.goto('/components/icon-field');
  const search = page.locator('#site-search');
  await search.fill('button');

  const clear = page.locator('#icon-field-basic').getByRole('button', { name: 'Clear value' });
  await expect(clear).toBeVisible();
  await expect(clear).toHaveCSS('width', '24px');
  await expect(clear).toHaveCSS('height', '24px');
  await expect(clear).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await clear.hover();
  await expect(clear).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const iconMask = await clear.locator('span').evaluate((element) => {
    const style = getComputedStyle(element);
    return style.maskImage || style.webkitMaskImage;
  });
  expect(iconMask).toContain('M6');
  await clear.click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(clear).toHaveCount(0);
});
