import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('Kbd API lists all 24 key symbols with readable names', async ({ page }) => {
  await page.goto('/components/kbd');
  await page.getByRole('tab', { name: 'API', exact: true }).click();
  const table = page.getByRole('table', { name: 'Standard key symbols', exact: true });
  await expect(table.getByRole('row')).toHaveCount(25);
  const win = table
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: 'win', exact: true }) });
  await expect(win.locator('[aria-hidden="true"]')).toHaveText('Win');
  await expect(win.locator('.aeris-kbd__readable')).toHaveText('Windows ');
  const help = table
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: 'help', exact: true }) });
  await expect(help.locator('[aria-hidden="true"]')).toHaveText('?');
  await expect(help.locator('.aeris-kbd__readable')).toHaveText('Help ');
  expect(
    (await new AxeBuilder({ page }).include('#kbd-key-reference').analyze()).violations,
  ).toEqual([]);
});

test('Kbd composes readable standard keys and consistent visual variants', async ({ page }) => {
  await page.goto('/components/kbd');
  const variants = page.locator('#kbd-variants kbd.aeris-kbd');
  await expect(variants).toHaveCount(2);
  await expect(variants.first()).toHaveAttribute('data-variant', 'filled');
  await expect(variants.last()).toHaveAttribute('data-variant', 'ghost');
  const geometry = await variants.evaluateAll((elements) =>
    elements.map((element) => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      background: getComputedStyle(element).backgroundColor,
    })),
  );
  expect(geometry[0].width).toBeCloseTo(geometry[1].width, 1);
  expect(geometry[0].height).toBeCloseTo(geometry[1].height, 1);
  expect(geometry[1].background).toBe('rgba(0, 0, 0, 0)');
  const shortcut = page.locator('#kbd-combinations kbd.aeris-kbd').nth(2);
  await expect(shortcut.locator('.aeris-kbd__readable')).toHaveText(['Command ', 'Shift ']);
  await expect(shortcut.locator('.aeris-kbd__content')).toHaveText('P');
  const names = page.locator('#kbd-standard-keys .aeris-kbd__readable');
  await expect(names).toHaveCount(15);
  const styles = await names.first().evaluate((element) => ({
    position: getComputedStyle(element).position,
    clip: getComputedStyle(element).clipPath,
  }));
  expect(styles.position).toBe('absolute');
  expect(styles.clip).toBe('inset(50%)');
  await expect(
    page.locator('#kbd-standard-keys kbd[tabindex], #kbd-standard-keys kbd [tabindex]'),
  ).toHaveCount(0);
});

test('Menu documentation uses real bounded Kbd hints without adding focus stops', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const kind of ['menu', 'menubar', 'tiered-menu']) {
    await page.goto(`/components/${kind}`);
    const example = page.locator(`#${kind}-basic`);
    if (kind === 'menubar') {
      await example.getByRole('menuitem', { name: 'File', exact: true }).focus();
      await page.keyboard.press('ArrowDown');
    }
    const hint = example.locator('kbd.aeris-kbd').first();
    await expect(hint).toBeVisible();
    await expect(hint).not.toHaveAttribute('tabindex');
    const dimensions = await hint.evaluate((element) => ({
      width: element.clientWidth,
      scroll: element.scrollWidth,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
    await page.keyboard.press('Escape');
  }
});

test('Kbd stays readable across palettes, modes and corner presets', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'docs-layout-chromium',
    'Palette snapshots are reviewed once; every engine covers semantics and geometry.',
  );
  test.setTimeout(90_000);
  await page.goto('/components/kbd');
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
      const report = await new AxeBuilder({ page }).include('app-kbd-page').analyze();
      expect(report.violations).toEqual([]);
      await page
        .locator('#kbd-combinations')
        .screenshot({ path: `.angular/kbd-review/${palette}-${mode}.png`, animations: 'disabled' });
    }
  }
  for (const radius of ['soft', 'rounded', 'pill']) {
    await page.evaluate((radius) => localStorage.setItem('aeris-docs-radius', radius), radius);
    await page.reload();
    const key = page.locator('#kbd-basic kbd').first();
    const geometry = await key.evaluate((element) => ({
      radius: parseFloat(getComputedStyle(element).borderTopLeftRadius),
      height: element.getBoundingClientRect().height,
    }));
    expect(geometry.radius).toBeLessThan(geometry.height / 2);
  }
});

test('Kbd retains native semantics, readable sizes and bounded long labels in LTR and RTL', async ({
  page,
}) => {
  await page.goto('/components/kbd');
  const example = page.locator('#kbd-sizes');
  const keys = example.locator('kbd[aerisKbd]');
  await expect(keys).toHaveCount(3);
  const sizes = await keys.evaluateAll((elements) =>
    elements.map((element) => parseFloat(getComputedStyle(element).fontSize)),
  );
  expect(sizes[0]).toBeLessThan(sizes[1]);
  expect(sizes[1]).toBeLessThan(sizes[2]);
  await expect(page.locator('kbd.aeris-kbd[tabindex], kbd.aeris-kbd[role]')).toHaveCount(0);
  await expect(page.locator('#kbd-icons .kbd-readable')).toHaveText(['Command', 'Shift', 'Option']);
  for (const dir of ['ltr', 'rtl']) {
    await page.setViewportSize({ width: 320, height: 740 });
    await page
      .locator('html')
      .evaluate((element, direction) => element.setAttribute('dir', direction), dir);
    const key = keys.last();
    await key.evaluate((element) => {
      element.textContent = 'ControlAlternateMetaSuperKeyWithAVeryLongReadableLabel';
    });
    const geometry = await key.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        parent: element.parentElement?.getBoundingClientRect().width ?? 0,
        scroll: element.scrollWidth,
        client: element.clientWidth,
      };
    });
    expect(geometry.width).toBeLessThanOrEqual(geometry.parent + 1);
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
  const result = await new AxeBuilder({ page }).include('app-kbd-page').analyze();
  expect(result.violations).toEqual([]);
});

test('Kbd custom properties stay local and keyboard hints do not capture shortcuts', async ({
  page,
}) => {
  await page.goto('/components/kbd');
  const basic = page.locator('#kbd-basic kbd').first();
  const custom = page.locator('#kbd-tokens-example kbd').first();
  const background = await basic.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(await custom.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
    background,
  );
  const native = await basic.evaluate((element) => {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    element.dispatchEvent(event);
    return {
      tag: element.tagName,
      cancelled: event.defaultPrevented,
      tabindex: element.getAttribute('tabindex'),
    };
  });
  expect(native).toEqual({ tag: 'KBD', cancelled: false, tabindex: null });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(basic).toHaveCSS('animation-name', 'none');
});
