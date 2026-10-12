import { expect, test } from './fixtures';

const densities = [
  ['compact', 4.5, 11.5, 16, 22, 12],
  ['medium', 6, 14, 20, 28, 16],
  ['comfortable', 7.5, 16.5, 24, 34, 20],
] as const;

test('chrome and content surfaces share density-aware geometry and keep local overrides', async ({
  page,
}) => {
  for (const [route, selector, paddingRole] of [
    ['toolbar', '#toolbar-basic .aeris-toolbar__content', 'chrome'],
    ['menu', '#menu-basic .aeris-menu__panel', 'chrome'],
    ['card', '#card-basic [preview] .aeris-card__body', 'content'],
    ['panel', '#panel-basic .aeris-panel__content', 'content'],
  ] as const) {
    await page.goto(`/components/${route}`);
    const target = page.locator(selector).first();
    await expect(target).toBeVisible();
    for (const [density, chrome, small, medium, large, gap] of densities) {
      // Use a nested density boundary to exercise inheritance, not only the root preset.
      await target.evaluate(
        (element, density) =>
          element
            .closest('app-form-demo, app-button-demo')
            ?.setAttribute('data-aeris-density', density),
        density,
      );
      await expect(target).toHaveCSS(
        'padding-left',
        `${paddingRole === 'chrome' ? chrome : medium}px`,
      );
      await expect(target).toHaveCSS(
        'padding-right',
        `${paddingRole === 'chrome' ? chrome : medium}px`,
      );
      if (route === 'card') {
        await expect(target).toHaveCSS('gap', `${gap}px`);
        const card = target.locator('..');
        await card.evaluate((element) => element.setAttribute('data-padding', 'sm'));
        await expect(target).toHaveCSS('padding-left', `${small}px`);
        await card.evaluate((element) => element.setAttribute('data-padding', 'lg'));
        await expect(target).toHaveCSS('padding-left', `${large}px`);
        await card.evaluate((element) => element.setAttribute('data-padding', 'md'));
      }
    }
    if (route === 'toolbar') {
      await target.evaluate((element) =>
        element.parentElement?.style.setProperty('--aeris-toolbar-padding-inline', '23px'),
      );
      await expect(target).toHaveCSS('padding-left', '23px');
      await expect(target).toHaveCSS('padding-right', '23px');
    }
    await page.locator('html').evaluate((element) => (element.dir = 'rtl'));
    const box = await target.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    await page.setViewportSize({ width: 320, height: 800 });
    await expect
      .poll(() =>
        target.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return (
            bounds.left >= 0 &&
            bounds.right <= innerWidth &&
            element.scrollWidth <= element.clientWidth + 1
          );
        }),
      )
      .toBe(true);
    await page.setViewportSize({ width: 1280, height: 900 });
  }
});

test('small form fields use the same height and horizontal padding across densities', async ({
  page,
}) => {
  for (const [route, selector] of [
    ['input-text', '.aeris-input-text--sm'],
    ['select', '.aeris-select[data-size="sm"] .aeris-select__trigger'],
    ['auto-complete', '.aeris-auto-complete[data-size="sm"] .aeris-auto-complete__input'],
    ['tree-select', '.aeris-tree-select[data-size="sm"] .aeris-tree-select__trigger'],
    ['cascade-select', '.aeris-cascade-select[data-size="sm"] .aeris-cascade-select__trigger'],
    ['date-picker', '.aeris-date-picker[data-size="sm"] .aeris-date-picker__trigger'],
  ]) {
    await page.goto(`/components/${route}`);
    const input = page.locator(`main ${selector}`).first();
    await expect(input).toBeVisible();
    for (const [density, padding, height] of [
      ['compact', 8.5, 26],
      ['medium', 10.2, 34],
      ['comfortable', 11.9, 42],
    ] as const) {
      await input.evaluate(
        (element, density) =>
          element.closest('app-form-demo')?.setAttribute('data-aeris-density', density),
        density,
      );
      await expect(input).toHaveCSS('padding-left', `${padding}px`);
      await expect(input).toHaveCSS('min-height', `${height}px`);
    }
  }
});
