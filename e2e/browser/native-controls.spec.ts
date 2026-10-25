import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('native Select examples remain accessible across palettes and light/dark modes', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'docs-layout-chromium', 'Review theme combinations once.');
  test.setTimeout(90_000);
  await page.goto('/components/select');
  for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
    for (const mode of ['light', 'dark']) {
      await page.evaluate(
        ({ palette, mode }) => {
          localStorage.setItem('aeris-docs-palette', palette);
          localStorage.setItem('aeris-ui-theme-mode', mode);
        },
        { palette, mode },
      );
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      expect(
        (await new AxeBuilder({ page }).include('#select-native-sizes').analyze()).violations,
      ).toEqual([]);
      if (palette === 'monochrome') {
        await page.locator('#select-native-sizes').screenshot({
          path: `.angular/native-select-review/${mode}.png`,
        });
      }
    }
  }
});

test('native Select preserves options, listbox sizing and Signal Forms validation', async ({
  page,
}) => {
  await page.goto('/components/select');
  const basic = page.locator('#select-native');
  const select = basic.getByLabel('Region', { exact: true });
  await expect(select).toHaveClass(/aeris-native-select/);
  await expect(select.locator('optgroup')).toHaveCount(2);
  await select.selectOption('jp');
  await expect(select).toHaveValue('jp');
  await expect(basic.locator('[role="dialog"], .aeris-select__panel')).toHaveCount(0);
  const multiple = page.locator('#select-native-multiple').getByLabel('Teams', { exact: true });
  await expect(multiple).toHaveAttribute('size', '4');
  await multiple.selectOption([{ label: 'Design' }, { label: 'Engineering' }]);
  await expect(page.locator('#select-native-multiple small')).toContainText('engineering');
  const form = page.locator('#select-native-forms');
  const required = form.getByLabel('Required region');
  await expect(required).not.toHaveAttribute('aria-invalid', 'true');
  await form.getByRole('button', { name: 'Validate', exact: true }).click();
  await expect(required).toHaveAttribute('aria-invalid', 'true');
  await required.selectOption('rs');
  await expect(required).not.toHaveAttribute('aria-invalid', 'true');
  await form.getByRole('button', { name: 'Validate', exact: true }).click();
  await expect(form.locator('small')).toHaveText('Validation successful.');
  const result = await new AxeBuilder({ page })
    .include('#select-native')
    .include('#select-native-multiple')
    .include('#select-native-forms')
    .analyze();
  expect(result.violations).toEqual([]);
});

test('native Select geometry stays bounded with aligned chevrons in narrow LTR/RTL layouts', async ({
  page,
}, testInfo) => {
  await page.goto('/components/select');
  for (const direction of ['ltr', 'rtl']) {
    await page.setViewportSize({ width: 320, height: 740 });
    await page
      .locator('html')
      .evaluate((element, direction) => element.setAttribute('dir', direction), direction);
    for (const field of await page.locator('#select-native-sizes select').all()) {
      const geometry = await field.evaluate((element) => ({
        width: element.getBoundingClientRect().width,
        parent: element.parentElement?.getBoundingClientRect().width ?? 0,
        appearance: getComputedStyle(element).appearance,
        arrow: getComputedStyle(element).backgroundImage,
        position: getComputedStyle(element).backgroundPosition,
        arrowSize: getComputedStyle(element).backgroundSize,
        start: parseFloat(getComputedStyle(element).paddingInlineStart),
        end: parseFloat(getComputedStyle(element).paddingInlineEnd),
        height: element.getBoundingClientRect().height,
        font: parseFloat(getComputedStyle(element).fontSize),
      }));
      expect(geometry.width).toBeLessThanOrEqual(geometry.parent + 1);
      expect(geometry.appearance).toBe('none');
      expect(geometry.arrow).toContain('svg');
      expect(geometry.arrowSize).toBe('16px 16px');
      expect(geometry.end - geometry.start).toBeCloseTo(24, 4);
      expect(geometry.position).toContain(direction === 'rtl' ? '0%' : '100%');
      if (testInfo.project.name.startsWith('mobile-')) {
        expect(geometry.height).toBeGreaterThanOrEqual(44);
        expect(geometry.font).toBeGreaterThanOrEqual(16);
      }
    }
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  const filled = page.locator('#native-filled');
  await filled.focus();
  await expect(filled).toHaveCSS('background-image', /svg/);
  await expect(page.locator('#select-native-multiple select')).toHaveCSS(
    'background-image',
    'none',
  );
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(filled).toHaveCSS('appearance', 'auto');
  await expect(filled).toHaveCSS('background-image', 'none');
});

test('search composition submits on Enter, buffers IME and clears without submitting', async ({
  page,
}) => {
  await page.goto('/components/input-text');
  const example = page.locator('#input-search');
  const status = example.getByRole('search').getByRole('status');
  const search = example.getByRole('searchbox', { name: 'Search query' });
  await search.fill('Select');
  await search.press('Enter');
  await expect(status).toHaveText('Submitted: Select');
  await search.dispatchEvent('compositionstart');
  await search.evaluate((element: HTMLInputElement) => {
    element.value = '検索';
    element.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
  });
  await expect(status).toHaveText('Submitted: Select');
  await search.dispatchEvent('compositionend');
  await search.press('Enter');
  await expect(status).toHaveText('Submitted: 検索');
  await example.getByRole('button', { name: 'Clear value', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(status).toHaveText('Submitted: 検索');
  expect((await new AxeBuilder({ page }).include('#input-search').analyze()).violations).toEqual(
    [],
  );
});
