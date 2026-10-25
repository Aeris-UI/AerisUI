import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('standalone toggles support keyboard and preserve stable names', async ({ page }) => {
  await page.goto('/components/button');
  const toggle = page.locator('#feature-toggle').getByRole('button', { name: 'Bold', exact: true });
  await toggle.focus();
  await toggle.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  const selected = await toggle.evaluate((element) => getComputedStyle(element).backgroundColor);
  await toggle.hover();
  await expect(toggle).toHaveCSS('background-color', selected);
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(
    page.locator('#feature-toggle').getByRole('button', { name: 'Disabled toggle' }),
  ).toBeDisabled();
  await page
    .locator('#feature-toggle-forms')
    .getByRole('button', { name: 'Enabled', exact: true })
    .click();
  await expect(page.locator('#feature-toggle-forms output')).toHaveText('Checked: true');
  const classic = page
    .locator('#feature-toggle-reactive')
    .getByRole('button', { name: 'Enabled', exact: true });
  await classic.click();
  await expect(classic).toHaveAttribute('aria-pressed', 'true');
  await classic.press('Space');
  await expect(classic).toHaveAttribute('aria-pressed', 'false');
});

for (const direction of ['ltr', 'rtl']) {
  test(`single selection follows ${direction} navigation and controlled updates`, async ({
    page,
  }) => {
    await page.addInitScript(
      (direction) => localStorage.setItem('aeris-docs-direction', direction),
      direction,
    );
    await page.goto('/components/button-group');
    const group = page.getByRole('radiogroup', { name: 'Single selection', exact: true });
    const day = group.getByRole('radio', { name: 'Day', exact: true });
    await day.focus();
    await day.press(direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
    await expect(group.getByRole('radio', { name: 'Week', exact: true })).toBeFocused();
    await expect(group.getByRole('radio', { name: 'Week', exact: true })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await page.keyboard.press('End');
    await expect(group.getByRole('radio', { name: 'Month', exact: true })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(day).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(day).not.toBeFocused();

    const controlled = page.getByRole('radiogroup', { name: 'Controlled selection', exact: true });
    await page.getByRole('button', { name: 'Select fourth', exact: true }).click();
    const fourth = controlled.getByRole('radio', { name: 'Fourth', exact: true });
    await expect(fourth).toHaveAttribute('tabindex', '0');
    await fourth.focus();
    await fourth.press('ArrowDown');
    await expect(controlled.getByRole('radio', { name: 'First', exact: true })).toBeFocused();
    await page.getByRole('button', { name: 'Toggle disabled', exact: true }).click();
    await expect(controlled.getByRole('radio')).toHaveCount(4);
    for (const item of await controlled.getByRole('radio').all()) await expect(item).toBeDisabled();
  });
}

test('multiple selection works with touch and separates focus from selection', async ({
  page,
  isMobile,
}) => {
  await page.goto('/components/button-group');
  const group = page.getByRole('group', { name: 'Multiple selection', exact: true });
  const italic = group.getByRole('button', { name: 'Italic', exact: true });
  if (isMobile) await italic.tap();
  else await italic.click();
  await expect(italic).toHaveAttribute('aria-pressed', 'true');
  await expect(group.getByRole('button', { name: 'Bold', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await italic.press('Home');
  await expect(italic).toHaveAttribute('aria-pressed', 'true');
  if (isMobile) await italic.tap();
  else await italic.click();
  await expect(italic).toHaveAttribute('aria-pressed', 'false');
  const optional = page
    .getByRole('radiogroup', { name: 'Optional selection', exact: true })
    .getByRole('radio', { name: 'Start', exact: true });
  await optional.click();
  await expect(optional).toHaveAttribute('aria-checked', 'true');
  await optional.click();
  await expect(optional).toHaveAttribute('aria-checked', 'false');
});

test('Signal Forms delays errors and clears them after selection', async ({ page }) => {
  await page.goto('/components/button-group');
  const group = page.getByRole('radiogroup', { name: 'Required selection', exact: true });
  await expect(group).not.toHaveAttribute('aria-invalid');
  await page.getByRole('button', { name: 'Mark touched', exact: true }).click();
  await expect(group).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#group-selection-error')).toBeVisible();
  await expect(group).toHaveAccessibleDescription('Choose one option.');
  expect(
    (
      await new AxeBuilder({ page })
        .include('#group-signal-forms .preview')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await group.getByRole('radio', { name: 'One', exact: true }).click();
  await expect(group).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('#group-selection-error')).toHaveCount(0);
});

test('selection content stays within narrow layouts and respects theme contrast', async ({
  page,
}) => {
  await page.goto('/components/button-group');
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    const group = page.getByRole('radiogroup', { name: 'Single selection', exact: true });
    await expect
      .poll(() =>
        group.evaluate(
          (element) =>
            element.getBoundingClientRect().width > 0 &&
            element.scrollWidth <= element.clientWidth + 1,
        ),
      )
      .toBe(true);
  }
  const result = await new AxeBuilder({ page })
    .include('#group-single .preview')
    .include('#group-multiple .preview')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);
});

for (const [index, palette] of ['earth', 'coastal', 'orchid', 'monochrome'].entries()) {
  for (const mode of ['light', 'dark']) {
    test(`${palette} ${mode} selected controls keep accessible contrast`, async ({
      page,
    }, info) => {
      test.skip(
        info.project.name !== 'docs-layout-chromium',
        'Full palette matrix runs once; other engines exercise interaction and representative contrast.',
      );
      await page.addInitScript(
        ({ palette, mode, index }) => {
          localStorage.setItem('aeris-docs-palette', palette);
          localStorage.setItem('aeris-ui-theme-mode', mode);
          localStorage.setItem('aeris-docs-density', index % 2 ? 'compact' : 'comfortable');
          localStorage.setItem('aeris-docs-radius', ['soft', 'rounded', 'pill'][index % 3]);
        },
        { palette, mode, index },
      );
      await page.goto('/components/button-group');
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      await expect(page.locator('html')).toHaveAttribute(
        'data-aeris-density',
        index % 2 ? 'compact' : 'comfortable',
      );
      expect(await page.evaluate(() => localStorage.getItem('aeris-docs-palette'))).toBe(palette);
      const result = await new AxeBuilder({ page })
        .include('#group-single .preview')
        .include('#group-multiple .preview')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations).toEqual([]);
    });
  }
}
