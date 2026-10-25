import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('modal commands filter keywords, execute with Enter and restore the opener', async ({
  page,
}) => {
  await page.goto('/components/command-palette');
  const trigger = page.getByRole('button', { name: 'Open commands', exact: true });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Commands', exact: true });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await expect(dialog.locator('.aeris-command-palette__search svg')).toHaveCSS('width', '16px');
  await input.dispatchEvent('keydown', { key: 'Escape', isComposing: true, bubbles: true });
  await expect(dialog).toBeVisible();
  await input.press('Tab');
  const close = dialog.getByRole('button', { name: 'Close command palette' });
  await expect(close).toBeFocused();
  await close.press('Tab');
  await expect(input).toBeFocused();
  await input.fill('files');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(
    dialog.getByRole('option', { name: 'Search documents', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  await input.press('Enter');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('#command-palette-basic .preview p')).toHaveText(
    'Last command: Search documents',
  );
  await trigger.click();
  await expect(dialog.getByRole('combobox')).toHaveValue('files');
  await dialog.getByRole('combobox').press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('inline commands retain input focus and skip disabled results with actual touch execution', async ({
  page,
  isMobile,
}) => {
  await page.goto('/components/command-palette');
  const demo = page.locator('#command-palette-inline');
  const input = demo.getByRole('combobox');
  await input.focus();
  await input.press('End');
  const theme = demo.getByRole('option', { name: 'Change theme', exact: true });
  await expect(theme).toHaveAttribute('aria-selected', 'true');
  await expect(input).toBeFocused();
  await input.press('ArrowDown');
  await expect(demo.getByRole('option', { name: 'Search documents', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  if (isMobile) await theme.tap();
  else await theme.click();
  await expect(theme).toHaveAttribute('aria-selected', 'true');
  await expect(demo.locator('.preview p')).toHaveText('Last command: Change theme');
  await expect(input).toBeVisible();
  const disabled = demo.getByRole('option', { name: 'Archive selection', exact: true });
  await expect(disabled).toBeDisabled();
  await disabled.dispatchEvent('click');
  await expect(demo.locator('.preview p')).toHaveText('Last command: Change theme');
});

test('controlled methods, footer focus, and opt-in launcher work', async ({ page }) => {
  await page.goto('/components/command-palette');
  await page.getByRole('button', { name: 'Find theme command' }).click();
  const dialog = page.getByRole('dialog', { name: 'Controlled commands', exact: true });
  const input = dialog.getByRole('combobox');
  await expect(input).toHaveValue('theme');
  await input.press('Enter');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Focus search', exact: true }).click();
  await expect(input).toBeFocused();
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const launcher = page.getByRole('button', { name: 'Open shortcut palette' });
  await launcher.focus();
  await launcher.press('ControlOrMeta+j');
  const shortcut = page.getByRole('dialog', { name: 'Shortcut commands', exact: true });
  await expect(shortcut.getByRole('combobox')).toBeFocused();
  await shortcut.getByRole('combobox').press('Escape');
  await expect(shortcut).toHaveCount(0);
});

test('external matching, loading and empty state keep references valid', async ({ page }) => {
  await page.goto('/components/command-palette');
  const external = page.locator('#command-palette-external');
  const input = external.getByRole('combobox');
  await input.fill('dark');
  await expect(external.getByRole('option')).toHaveCount(0);
  await expect(input).not.toHaveAttribute('aria-activedescendant');
  await input.fill('Open');
  await expect(external.getByRole('option')).toHaveCount(1);
  const option = external.getByRole('option', { name: 'Open settings', exact: true });
  await expect(input).toHaveAttribute(
    'aria-activedescendant',
    (await option.getAttribute('id')) ?? '',
  );
  await page.getByRole('button', { name: 'Toggle loading' }).click();
  const loading = page.locator('#command-palette-states aeris-command-palette').first();
  await expect(loading.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
  await expect(loading.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
  await loading.getByRole('combobox').press('Enter');
  await expect(loading.getByRole('status')).toHaveText('Fetching commands');
});

test('modal stays within short mobile viewports and active results scroll without moving the page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.goto('/components/command-palette');
  await page.getByRole('button', { name: 'Open commands', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Commands', exact: true });
  for (const height of [480, 320]) {
    await page.setViewportSize({ width: 320, height });
    const input = dialog.getByRole('combobox');
    await input.focus();
    const before = await page.evaluate(() => scrollY);
    await input.press('End');
    await expect(
      dialog.getByRole('option', { name: 'Change theme', exact: true }),
    ).toBeInViewport();
    expect(await page.evaluate(() => scrollY)).toBe(before);
    const bounds = await dialog.boundingBox();
    if (!bounds) throw new Error('Missing dialog bounds');
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(321);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(height + 1);
    await expect(dialog.getByRole('button', { name: 'Close command palette' })).toBeInViewport();
  }
});

test('RTL, template artwork and the catalog use the real accessible palette', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('aeris-docs-direction', 'rtl'));
  await page.goto('/components/command-palette');
  const demo = page.locator('#command-palette-templates');
  const input = demo.getByRole('combobox');
  await input.focus();
  await input.press('End');
  await expect(demo.getByRole('option', { name: 'Change theme', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(demo.getByRole('group', { name: 'Appearance commands', exact: true })).toBeVisible();
  await expect(demo.locator('.command-item svg').first()).toHaveCSS('width', '16px');
  await page.goto('/components');
  await page.getByRole('searchbox', { name: 'Filter components' }).fill('CommandPalette');
  const card = page
    .locator('.catalog-preview-card')
    .filter({ has: page.locator('a[href="/components/command-palette"]') });
  await expect(card.locator('aeris-command-palette [role="option"]')).toHaveCount(3);
  await card.locator('a[href="/components/command-palette"]').click();
  await expect(page).toHaveURL(/\/components\/command-palette$/);
});

for (const [index, palette] of ['earth', 'coastal', 'orchid', 'monochrome'].entries()) {
  for (const mode of ['light', 'dark']) {
    test(`${palette} ${mode} palette semantics and contrast`, async ({ page }, info) => {
      test.skip(
        info.project.name !== 'docs-layout-chromium',
        'Run full palette matrix once; other engines cover interaction.',
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
      await page.goto('/components/command-palette');
      expect(
        (
          await new AxeBuilder({ page })
            .include('#command-palette-inline .preview')
            .include('#command-palette-templates .preview')
            .include('#command-palette-states .preview')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.getByRole('button', { name: 'Open commands', exact: true }).click();
      expect(
        (
          await new AxeBuilder({ page })
            .include('[role="dialog"]')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
    });
  }
}
