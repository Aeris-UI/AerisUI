import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('catalog uses a bounded real Listbox preview and opens its documentation', async ({
  page,
}) => {
  await page.goto('/components');
  await page.getByRole('searchbox', { name: 'Filter components' }).fill('Listbox');
  const card = page
    .locator('.catalog-preview-card')
    .filter({ has: page.locator('a[href="/components/listbox"]') });
  const preview = card.locator('aeris-listbox');
  await expect(preview.locator('[role="option"]')).toHaveCount(3);
  const bounds = await card.boundingBox();
  const scene = await preview.boundingBox();
  expect(bounds).not.toBeNull();
  expect(scene).not.toBeNull();
  if (!bounds || !scene) throw new Error('Missing preview bounds');
  expect(scene.x).toBeGreaterThanOrEqual(bounds.x);
  expect(scene.x + scene.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
  await card.locator('a[href="/components/listbox"]').click();
  await expect(page).toHaveURL(/\/components\/listbox$/);
  await expect(page.getByRole('listbox', { name: 'Single selection', exact: true })).toBeVisible();
});

test('listbox separates focus from selection and supports disabled skips and controlled updates', async ({
  page,
}) => {
  await page.goto('/components/listbox');
  const list = page.getByRole('listbox', { name: 'Single selection', exact: true });
  await list.focus();
  await list.press('ArrowDown');
  await expect(list.getByRole('option', { name: 'Design', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  const engineering = list.getByRole('option', { name: 'Engineering', exact: true });
  await expect(list).toHaveAttribute(
    'aria-activedescendant',
    (await engineering.getAttribute('id')) ?? '',
  );
  await list.press('Enter');
  await expect(engineering).toHaveAttribute('aria-selected', 'true');
  await list.press('End');
  await list.press(' ');
  await expect(list.getByRole('option', { name: 'Research', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(list.getByRole('option', { name: 'Operations', exact: true })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await list.press('Home');
  await list.press('r');
  await expect(list).toHaveAttribute(
    'aria-activedescendant',
    (await list.getByRole('option', { name: 'Research', exact: true }).getAttribute('id')) ?? '',
  );
  await page.getByRole('button', { name: 'Select Research', exact: true }).click();
  const controlled = page.getByRole('listbox', { name: 'Controlled selection', exact: true });
  await expect(controlled.getByRole('option', { name: 'Research', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('button', { name: 'Focus list', exact: true }).click();
  await expect(controlled).toBeFocused();
});

test('multiple selection works through actual taps and supports ranges', async ({
  page,
  isMobile,
}) => {
  await page.goto('/components/listbox');
  const list = page.getByRole('listbox', { name: 'Multiple selection', exact: true });
  const engineering = list.getByRole('option', { name: 'Engineering', exact: true });
  if (isMobile) await engineering.tap();
  else await engineering.click();
  await expect(engineering).toHaveAttribute('aria-selected', 'true');
  await expect(list.getByRole('option', { name: 'Design', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  if (isMobile) await engineering.tap();
  else await engineering.click();
  await expect(engineering).toHaveAttribute('aria-selected', 'false');
  await list.press('Home');
  await list.press('Space');
  await list.press('Shift+End');
  await expect(list.getByRole('option', { name: 'Research', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await list.press('ControlOrMeta+a');
  await expect(list.locator('[aria-selected="true"]')).toHaveCount(0);
});

test('filtering retains hidden selections and keeps active references valid', async ({ page }) => {
  await page.goto('/components/listbox');
  const demo = page.locator('#listbox-filter');
  const search = demo.getByRole('searchbox', { name: 'Filter options' });
  await search.fill('Analytics');
  const list = demo.getByRole('listbox');
  await expect(list.getByRole('option')).toHaveCount(1);
  await search.press('ArrowDown');
  await expect(list).toBeFocused();
  await list.press('Space');
  await search.fill('');
  await expect(list.getByRole('option', { name: 'Design', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(list.getByRole('option', { name: 'Analytics', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await search.fill('unmatched');
  await expect(demo.locator('aeris-listbox').getByRole('status')).toHaveText(
    'No matching options.',
  );
  await expect(list).not.toHaveAttribute('aria-activedescendant');
});

test('Signal Forms stays pristine-neutral then shows associated errors and clears them', async ({
  page,
}) => {
  await page.goto('/components/listbox');
  const list = page.getByRole('listbox', { name: 'Required choice', exact: true });
  await expect(list).not.toHaveAttribute('aria-invalid');
  await list.focus();
  await list.press('Tab');
  await expect(list).toHaveAttribute('aria-invalid', 'true');
  await expect(list).toHaveAccessibleDescription('Choose an option.');
  expect(
    (
      await new AxeBuilder({ page })
        .include('#listbox-signal-forms .preview')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await list.getByRole('option', { name: 'Design', exact: true }).click();
  await expect(list).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('#listbox-error')).toHaveCount(0);
  const reactive = page.getByRole('listbox', { name: 'Reactive choices', exact: true });
  await reactive.getByRole('option', { name: 'Research', exact: true }).click();
  await expect(reactive.locator('[aria-selected="true"]')).toHaveCount(2);
  await page
    .locator('#listbox-reactive')
    .getByRole('button', { name: 'Reset', exact: true })
    .click();
  await expect(reactive.locator('[aria-selected="true"]')).toHaveCount(0);
});

test('keyboard scroll stays inside the list and long content fits mobile widths', async ({
  page,
}) => {
  await page.goto('/components/listbox');
  const list = page.getByRole('listbox', { name: 'Long selection', exact: true });
  await list.scrollIntoViewIfNeeded();
  await list.focus();
  const before = await page.evaluate(() => scrollY);
  await list.press('End');
  await expect.poll(() => list.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await expect(list.getByRole('option', { name: 'Option 60', exact: true })).toBeInViewport();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect
      .poll(() => list.evaluate((element) => element.scrollWidth <= element.clientWidth + 1))
      .toBe(true);
  }
});

test('RTL navigation, groups, templates and loading keep correct semantics', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('aeris-docs-direction', 'rtl'));
  await page.goto('/components/listbox');
  const list = page.getByRole('listbox', { name: 'Grouped selection', exact: true });
  await list.focus();
  await list.press('End');
  await list.press('Enter');
  await expect(list.getByRole('option', { name: 'Analytics', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(list.getByRole('group', { name: 'Product', exact: true })).toBeVisible();
  const heading = list.locator('.aeris-listbox__group').first();
  const option = list.getByRole('option', { name: 'Design', exact: true });
  await expect(heading).toHaveCSS('text-transform', 'uppercase');
  await expect(heading).toHaveCSS('cursor', 'default');
  await expect(option).toHaveCSS('cursor', 'pointer');
  const headingStyle = await heading.evaluate((element) => ({
    fontSize: parseFloat(getComputedStyle(element).fontSize),
    inset: parseFloat(getComputedStyle(element).paddingInlineStart),
  }));
  const optionStyle = await option.evaluate((element) => ({
    fontSize: parseFloat(getComputedStyle(element).fontSize),
    inset: parseFloat(getComputedStyle(element).paddingInlineStart),
  }));
  expect(headingStyle.fontSize).toBeLessThan(optionStyle.fontSize);
  expect(optionStyle.inset).toBeGreaterThan(headingStyle.inset);
  await heading.click();
  await expect(list.getByRole('option', { name: 'Analytics', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  const templates = page.getByRole('listbox', { name: 'Templated selection', exact: true });
  await templates.getByRole('option', { name: 'Engineering', exact: true }).click();
  await expect(templates.getByRole('option', { name: 'Engineering', exact: true })).toContainText(
    'Selected',
  );
  await page.getByRole('button', { name: 'Toggle loading' }).click();
  const loading = page.getByRole('listbox', { name: 'Loading selection', exact: true });
  await expect(loading).toHaveAttribute('aria-busy', 'true');
  await loading.getByRole('option', { name: 'Design', exact: true }).click();
  await expect(loading.locator('[aria-selected="true"]')).toHaveCount(0);
});

for (const [index, palette] of ['earth', 'coastal', 'orchid', 'monochrome'].entries()) {
  for (const mode of ['light', 'dark']) {
    test(`${palette} ${mode} listbox contrast and responsive geometry`, async ({ page }, info) => {
      test.skip(
        info.project.name !== 'docs-layout-chromium',
        'Run full palette matrix once; all engines exercise interaction.',
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
      await page.goto('/components/listbox');
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      const results = await new AxeBuilder({ page })
        .include('#listbox-basic .preview')
        .include('#listbox-multiple .preview')
        .include('#listbox-groups .preview')
        .include('#listbox-templates .preview')
        .include('#listbox-filter .preview')
        .include('#listbox-states .preview')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
