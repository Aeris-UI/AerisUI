import { expect, test } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('custom icon examples retain their own sizing above the shared defaults', async ({ page }) => {
  await page.goto('/components/rating');
  const icon = page.locator('.preview .rating-template-icon').first();
  await expect(icon).toBeVisible();
  const geometry = await icon.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
  }));
  expect(geometry.fontSize).toBeGreaterThan(16);
  expect(Math.abs(geometry.width - geometry.fontSize)).toBeLessThan(1);
});

test('InputText icon composition uses the real clearable field and preserves focus', async ({
  page,
}) => {
  await page.goto('/components/input-text');
  const example = page.locator('#input-affixes');
  const field = example.getByRole('searchbox', { name: 'Search projects', exact: true });
  await expect(example.locator('aeris-icon-field')).toBeVisible();
  await field.fill('Design');
  await example.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(field).toHaveValue('');
  await expect(field).toBeFocused();
  const icons = example.locator('.preview svg[lucideIcon]');
  for (const icon of await icons.all()) {
    await expect(icon).toHaveCSS('width', '16px');
    await expect(icon).toHaveCSS('height', '16px');
  }
  expect((await new AxeBuilder({ page }).include('#input-affixes').analyze()).violations).toEqual(
    [],
  );
});

test('choice-card validation shows both outcomes and resets the example', async ({ page }) => {
  await page.goto('/components/checkbox');
  const example = page.locator('#checkbox-cards');
  const feedback = example.locator('#card-report-help');
  await expect(feedback).toContainText('required for this demonstration');
  await example.getByRole('button', { name: 'Validate selection', exact: true }).click();
  await expect(feedback).toHaveText('Select Weekly report to continue.');
  await expect(feedback).toHaveClass('error');
  await example.getByText('Weekly report', { exact: true }).click();
  await expect(feedback).toHaveText('Selection is valid.');
  await expect(feedback).not.toHaveClass('error');
  await example.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(feedback).toContainText('required for this demonstration');
  await expect(
    example.getByRole('checkbox', { name: 'Weekly report', exact: true }),
  ).not.toBeChecked();
  await expect(example.locator('[aria-invalid="true"]')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).include('#checkbox-cards').analyze()).violations).toEqual(
    [],
  );
});

test('paired field demos wrap to their available width rather than the whole viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/input-number');
  const grid = page.locator('#number-decimals .field-grid');
  await grid.evaluate((element) => {
    element.style.width = '280px';
  });
  const first = await grid.locator('.field').first().boundingBox();
  const second = await grid.locator('.field').nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs((first?.x ?? 0) - (second?.x ?? 0))).toBeLessThan(1);
  expect(second?.y ?? 0).toBeGreaterThan((first?.y ?? 0) + (first?.height ?? 0));
});

test('example code disclosure preserves the live preview and focus', async ({ page }) => {
  await page.goto('/components/button');
  const example = page.locator('app-button-demo').first();
  const preview = example.locator('.preview');
  const code = example.locator('.source');
  const toggle = example.getByRole('button', { name: /Hide code for/ });
  await expect(code).toBeVisible();
  await toggle.focus();
  await toggle.press('Enter');
  await expect(code).toBeHidden();
  await expect(preview).toBeVisible();
  await expect(example.getByRole('button', { name: /Show code for/ })).toBeFocused();
  await example.getByRole('button', { name: /Show code for/ }).press('Space');
  await expect(code).toBeVisible();
  const result = await new AxeBuilder({ page }).include('app-example-toolbar').analyze();
  expect(result.violations).toEqual([]);
});

test('headers expose the canonical Markdown and implementation source', async ({ page }) => {
  await page.goto('/components/input-text');
  const header = page.locator('app-component-page-header');
  await expect(header.getByRole('link', { name: /Source/ })).toHaveAttribute(
    'href',
    'https://github.com/Aeris-UI/AerisUI/tree/main/projects/aeris-ui/input-text',
  );
  await expect(header.getByRole('link', { name: /View Markdown/ })).toHaveAttribute(
    'href',
    '/ai/22/components/input-text.md',
  );
  const copied = '# InputText\n\n## API\n\n## Accessibility';
  await page.route('**/ai/22/components/input-text.md', (route) =>
    route.fulfill({
      contentType: 'text/markdown',
      body: copied,
    }),
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.body.dataset['copiedMarkdown'] = text;
        },
      },
    }),
  );
  await header.getByRole('button', { name: 'Copy Markdown' }).click();
  await expect(header.getByRole('status')).toHaveText(
    'Component documentation copied as Markdown.',
  );
  expect(await page.locator('body').getAttribute('data-copied-markdown')).toBe(copied);
});

test('hiding code preserves form input and is independent between examples', async ({ page }) => {
  await page.goto('/components/input-text');
  const basic = page.locator('#input-basic');
  const input = basic.getByRole('textbox', { name: 'Email address' });
  await input.fill('aeris@example.com');
  await basic.getByRole('button', { name: 'Hide code for Basic' }).click();
  await expect(input).toHaveValue('aeris@example.com');
  await expect(basic.locator('.source')).toBeHidden();
  await expect(page.locator('#input-types .source')).toBeVisible();
  await basic.getByRole('button', { name: 'Show code for Basic' }).click();
  await expect(input).toHaveValue('aeris@example.com');
  await basic.locator('h3').scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('example-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await basic.locator('h3').scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('example-phone.png') });
});

test('Markdown copying retains user activation while loading documentation', async ({
  page,
  context,
  browserName,
}) => {
  await page.goto('/components/input-text');
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-write'], { origin: new URL(page.url()).origin });
  await page.bringToFront();
  await page.route('**/ai/22/components/input-text.md', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.fulfill({ contentType: 'text/markdown', body: '# InputText\n\n## API' });
  });
  const header = page.locator('app-component-page-header');
  await header.getByRole('button', { name: 'Copy Markdown' }).click();
  await expect(header.getByRole('status')).toHaveText(
    'Component documentation copied as Markdown.',
  );
});

for (const route of ['/components/button', '/components/input-text', '/components/table']) {
  test(`${route} controls fit small viewports with independently scrollable code`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(route);
    const header = page.locator('app-component-page-header');
    await expect(header.getByRole('button', { name: 'Copy Markdown' })).toBeVisible();
    const examples = page.locator('app-example-toolbar');
    await expect(examples.first()).toBeVisible();
    for (const toolbar of await examples.all()) {
      expect(
        await toolbar.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= innerWidth;
        }),
      ).toBe(true);
    }
    const imports = page.locator('.import-section');
    await expect(imports).toBeVisible();
  });
}
