import { expect, test } from './fixtures';

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
