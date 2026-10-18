import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
  for (const mode of ['light', 'dark']) {
    test(`${palette} ${mode} action geometry stays reusable across densities and corners`, async ({
      page,
    }) => {
      await page.goto(`/?palette=${palette}&mode=${mode}`);
      const area = page.locator('[data-fixture="button-foundation"]');
      await expect(area).toBeVisible();
      for (const density of ['compact', 'medium', 'comfortable']) {
        for (const radius of ['soft', 'rounded', 'pill']) {
          await page.locator('html').evaluate(
            (element, settings) => {
              element.setAttribute('data-aeris-density', settings.density);
              element.setAttribute('data-aeris-radius', settings.radius);
            },
            { density, radius },
          );
          const result = await area.evaluate((element) => {
            const geometry = (button: Element) => {
              const css = getComputedStyle(button);
              const bounds = button.getBoundingClientRect();
              return {
                // Different positions can introduce floating-point subtraction noise in Firefox.
                height: Math.round(bounds.height * 64) / 64,
                width: Math.round(bounds.width * 64) / 64,
                fontSize: css.fontSize,
                lineHeight: css.lineHeight,
                padding: css.paddingInline,
                radius: css.borderRadius,
                border: css.borderWidth,
              };
            };
            return [...element.querySelectorAll('.samples[data-size]')].map((row) => {
              const buttons = [...row.querySelectorAll('button')];
              return buttons.map(geometry);
            });
          });
          for (const row of result) {
            expect(row).toHaveLength(8);
            // Native and wrapper geometry must agree for every variant, including links.
            for (let index = 0; index < row.length; index += 2) {
              expect(row[index]).toEqual(row[index + 1]);
            }
            // Links deliberately retain compact text-link geometry, not action-button height.
            expect(row[2]).toEqual(row[0]);
            expect(row[4]).toEqual(row[0]);
          }
          const icons = area.locator('[data-sample="icons"] svg');
          const dimensions = await icons.evaluateAll((elements) =>
            elements.map((icon) => {
              const bounds = icon.getBoundingClientRect();
              const button = icon.closest('button');
              if (!button) throw new Error('Projected icon must belong to a button.');
              return {
                width: bounds.width,
                height: bounds.height,
                expected:
                  parseFloat(
                    getComputedStyle(button).getPropertyValue('--aeris-action-icon-size'),
                  ) * 16,
              };
            }),
          );
          expect(dimensions).toHaveLength(2);
          expect(dimensions[0]).toEqual(dimensions[1]);
          expect(dimensions[0].width).toBe(dimensions[0].height);
          expect(dimensions[0].width).toBe(dimensions[0].expected);
        }
      }
      const results = await new AxeBuilder({ page })
        .include('[data-fixture="button-foundation"]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

for (const direction of ['ltr', 'rtl']) {
  test(`action groups keep native keyboard and disabled behavior in ${direction}`, async ({
    page,
  }) => {
    await page.goto(`/?direction=${direction}`);
    const area = page.locator('[data-fixture="button-foundation"]');
    const group = area.getByRole('group', { name: 'Foundation actions' });
    const save = group.getByRole('button', { name: 'Save', exact: true });
    const preview = group.getByRole('button', { name: 'Preview', exact: true });
    const finish = group.getByRole('button', { name: 'Finish', exact: true });
    await save.focus();
    await page.keyboard.press('ArrowRight');
    await expect(save).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(preview).toBeFocused();
    await expect(preview).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Enter');
    await expect(area.getByRole('status', { name: 'Foundation activations' })).toHaveText('1');
    await page.keyboard.press('Space');
    await expect(area.getByRole('status', { name: 'Foundation activations' })).toHaveText('2');
    await page.keyboard.press('Tab');
    await expect(finish).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(area.getByRole('button', { name: 'After actions' })).toBeFocused();
    await expect(
      group.locator('[aria-pressed], [aria-selected], [aria-checked], [role="radio"]'),
    ).toHaveCount(0);
    await expect(group.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
    await expect(group.getByRole('button', { name: 'Working' })).toBeDisabled();
    await expect(group.getByRole('button', { name: 'Working' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await page.setViewportSize({ width: 320, height: 720 });
    await expect(group).toHaveCSS('flex-direction', 'column');
    expect(await group.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    const buttons = group.locator('button');
    const widths = await buttons.evaluateAll((elements) =>
      elements.map((button) => button.getBoundingClientRect().width),
    );
    expect(new Set(widths).size).toBe(1);
  });
}

for (const direction of ['ltr', 'rtl']) {
  test(`shared button borders keep the same paint order on hover in ${direction}`, async ({
    page,
  }) => {
    await page.goto(`/?direction=${direction}`);
    await page
      .locator('html')
      .evaluate((element, dir) => element.setAttribute('dir', dir), direction);
    const group = page.getByRole('group', { name: 'Foundation actions' });
    const first = group.getByRole('button', { name: 'Save', exact: true });
    const second = group.getByRole('button', { name: 'Preview', exact: true });
    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await group.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      const a = await first.boundingBox();
      const b = await second.boundingBox();
      if (!a || !b) throw new Error('Both connected buttons must be visible.');
      const left = Math.max(a.x, b.x);
      const right = Math.min(a.x + a.width, b.x + b.width);
      const top = Math.max(a.y, b.y);
      const bottom = Math.min(a.y + a.height, b.y + b.height);
      expect(right - left).toBeGreaterThan(0);
      expect(bottom - top).toBeGreaterThan(0);
      const point = { x: (left + right) / 2, y: (top + bottom) / 2 };
      const owner = () =>
        page.evaluate(
          ({ x, y }) => document.elementFromPoint(x, y)?.closest('button')?.textContent?.trim(),
          point,
        );
      const resting = await owner();
      expect(resting).toBe('Preview');
      await first.hover();
      expect(await owner()).toBe(resting);
      await second.hover();
      expect(await owner()).toBe(resting);
    }
  });
}

test('touch actions activate once without leaving a hovered or selected state', async ({
  page,
  hasTouch,
}) => {
  test.skip(!hasTouch, 'Requires native touch emulation.');
  await page.goto('/');
  const area = page.locator('[data-fixture="button-foundation"]');
  const save = area.getByRole('button', { name: 'Save', exact: true });
  const background = await save.evaluate((button) => getComputedStyle(button).backgroundColor);
  await save.tap();
  await expect(area.getByRole('status', { name: 'Foundation activations' })).toHaveText('1');
  await expect(save).toHaveCSS('background-color', background);
  await expect(save).not.toHaveAttribute('aria-pressed');
  const bounds = await save.boundingBox();
  expect(bounds?.height).toBeGreaterThanOrEqual(44);
  expect(bounds?.width).toBeGreaterThanOrEqual(44);
});
