import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('palette selection remains accessible across palettes and light/dark modes', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'docs-layout-chromium',
    'Theme combinations are reviewed once; every engine covers interaction and mobile geometry.',
  );
  test.setTimeout(90_000);
  await page.goto('/components/color-picker');
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
      const selected = page.locator('#color-picker-palette [aria-pressed="true"]');
      await expect(selected).toHaveAttribute('aria-label', 'Forest');
      await expect(selected.locator('.aeris-color-picker__preset-check')).toBeVisible();
      const mark = await selected.locator('[aerisInternalIcon="check"]').evaluate((element) => ({
        mask: getComputedStyle(element).maskImage,
        color: getComputedStyle(element).backgroundColor,
      }));
      expect(mark.mask).not.toBe('none');
      expect(mark.color).not.toBe('rgba(0, 0, 0, 0)');
      const result = await new AxeBuilder({ page })
        .include('#color-picker-palette')
        .include('#color-picker-palette-opacity')
        .analyze();
      expect(result.violations).toEqual([]);
      if (palette === 'monochrome') {
        await page
          .locator('#color-picker-palette')
          .screenshot({ path: `.angular/color-picker-palette-review/${mode}.png` });
      }
    }
  }
});

test('inline color palettes select with keyboard, skip disabled choices and support RTL', async ({
  page,
}) => {
  await page.goto('/components/color-picker');
  const example = page.locator('#color-picker-palette');
  const group = example.getByRole('group', { name: 'Accent color' });
  const forest = group.getByRole('button', { name: 'Forest', exact: true });
  const copper = group.getByRole('button', { name: 'Copper', exact: true });
  await expect(group.getByRole('button')).toHaveCount(6);
  await expect(
    group.getByRole('button', { name: 'Caramel (unavailable)', exact: true }),
  ).toBeDisabled();
  await expect(example.locator('.aeris-color-picker__trigger, [role="dialog"]')).toHaveCount(0);
  await forest.focus();
  await page.keyboard.press('ArrowRight');
  await expect(copper).toBeFocused();
  await expect(forest).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Enter');
  await expect(copper).toHaveAttribute('aria-pressed', 'true');
  await expect(example.locator('small')).toHaveText('Selected: #bc6c25');
  await page.keyboard.press('End');
  await expect(group.getByRole('button', { name: 'Paper', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(forest).toBeFocused();
  await group.evaluate((element) => element.setAttribute('dir', 'rtl'));
  await page.keyboard.press('ArrowLeft');
  await expect(copper).toBeFocused();
  expect(
    (await new AxeBuilder({ page }).include('#color-picker-palette').analyze()).violations,
  ).toEqual([]);
});

test('palette swatches wrap, use coarse-pointer targets and retain alpha independently of selection', async ({
  page,
}, testInfo) => {
  await page.goto('/components/color-picker');
  const example = page.locator('#color-picker-palette-opacity');
  const group = example.getByRole('group', { name: 'Transparent colors' });
  await group.getByRole('button', { name: 'Ocean, quarter opacity', exact: true }).click();
  const selected = group.locator('[aria-pressed="true"]');
  await expect(selected).toHaveCount(1);
  await expect(selected).toHaveAttribute('aria-label', 'Ocean, quarter opacity');
  await group.getByRole('button', { name: 'Plum, inherited opacity', exact: true }).click();
  await expect(example.locator('small')).toContainText('rgba(153, 51, 102, 0.25098039)');
  await group.getByRole('button', { name: 'Ocean, full opacity', exact: true }).click();
  await expect(example.locator('small')).toHaveText('Selected: rgb(51, 102, 153)');
  await group.getByRole('button', { name: 'Transparent', exact: true }).click();
  await expect(example.locator('small')).toHaveText('Selected: rgba(0, 0, 0, 0)');
  await page.setViewportSize({ width: 320, height: 740 });
  const geometry = await group.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    scroll: element.scrollWidth,
    client: element.clientWidth,
  }));
  expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);
  if (testInfo.project.name.startsWith('mobile-')) {
    const bounds = await group.getByRole('button').first().boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
  }
  expect(
    (await new AxeBuilder({ page }).include('#color-picker-palette-opacity').analyze()).violations,
  ).toEqual([]);
});
