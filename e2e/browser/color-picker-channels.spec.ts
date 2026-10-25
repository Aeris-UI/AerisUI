import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('channel examples are independent and track gradients paint both rounded edges without repeating', async ({
  page,
  browserName,
}) => {
  await page.goto('/components/color-picker');
  const example = page.locator('#color-picker-channels [preview]');
  const sliders = example.getByRole('slider');
  await expect(sliders).toHaveCount(4);
  const original = await sliders.evaluateAll((elements) =>
    elements.map((element) => (element as HTMLInputElement).value),
  );
  const saturation = example.getByRole('slider', { name: 'Saturation', exact: true });
  await saturation.focus();
  await saturation.press('Home');
  await expect(saturation).toHaveValue('0');
  for (const index of [0, 2, 3]) await expect(sliders.nth(index)).toHaveValue(original[index]);
  await saturation.press('End');
  await expect(saturation).toHaveValue('100');
  for (const index of [0, 2, 3]) await expect(sliders.nth(index)).toHaveValue(original[index]);

  const styles = await saturation.evaluate((_element, browser) => {
    const pseudo = browser === 'firefox' ? '::-moz-range-track' : '::-webkit-slider-runnable-track';
    const rules = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .filter(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule && rule.selectorText.includes(pseudo),
      );
    const base = rules.find(
      (rule) =>
        rule.selectorText.includes('.aeris-color-picker__hue') &&
        !rule.selectorText.includes('__alpha') &&
        Boolean(rule.style.backgroundOrigin),
    );
    const channel = rules.find(
      (rule) =>
        rule.selectorText.includes('.aeris-color-picker__channel') &&
        rule.style.backgroundImage.includes('--aeris-color-picker-channel-gradient') &&
        !rule.selectorText.includes('[data-alpha]'),
    );
    return {
      origin: base?.style.backgroundOrigin,
      repeat: base?.style.backgroundRepeat,
      channelImage: channel?.style.backgroundImage,
      channelOrigin: channel?.style.backgroundOrigin,
      channelRepeat: channel?.style.backgroundRepeat,
    };
  }, browserName);
  expect(styles.origin).toBe('border-box');
  expect(styles.repeat).toBe('no-repeat');
  expect(styles.channelImage).toContain('--aeris-color-picker-channel-gradient');
  // The channel override must not reset the base track's edge painting rules.
  expect(styles.channelOrigin).toBe('');
  expect(styles.channelRepeat).toBe('');
});

test('inline color area and channel sliders share a value without opening an overlay', async ({
  page,
}) => {
  await page.goto('/components/color-picker');
  const example = page.locator('#color-picker-area [preview]');
  const area = example.getByRole('slider', { name: 'Saturation and brightness', exact: true });
  const hue = example.getByRole('slider', { name: 'Hue', exact: true });
  await area.scrollIntoViewIfNeeded();
  await area.focus();
  await area.press('ArrowDown');
  await expect(area).toHaveAttribute('aria-valuetext', /brightness 59%/);
  await hue.focus();
  await hue.press('Home');
  await expect(hue).toHaveValue('0');
  await expect(area).toHaveAttribute('aria-valuetext', /brightness 59%/);
  await expect(example.locator('.aeris-color-picker__trigger, [role="dialog"]')).toHaveCount(0);

  const box = await area.boundingBox();
  if (!box) throw new Error('The inline area must be visible.');
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.25, { steps: 5 });
  await page.mouse.up();
  // Pointer coordinates are quantized to device pixels by some engines.
  const coordinates = (await area.getAttribute('aria-valuetext'))?.match(/\d+/g)?.map(Number);
  expect(coordinates).toHaveLength(2);
  for (const coordinate of coordinates ?? [])
    expect(Math.abs(coordinate - 75)).toBeLessThanOrEqual(1);
});

test('vertical color sliders, RGB channels and opacity retain native interaction and responsive geometry', async ({
  page,
  isMobile,
}) => {
  await page.goto('/components/color-picker');
  const rgb = page.locator('#color-picker-rgb [preview]');
  const red = rgb.getByRole('slider', { name: 'Red', exact: true });
  await red.focus();
  await red.press('End');
  await expect(rgb.locator('small')).toHaveText('Selected: rgb(255, 102, 153)');

  const opacity = page.locator('#color-picker-slider-opacity [preview]');
  await opacity.getByRole('slider', { name: 'Opacity', exact: true }).focus();
  await page.keyboard.press('Home');
  await expect(opacity.locator('small')).toHaveText('Selected: #33669900');

  const states = page.locator('#color-picker-slider-states [preview]');
  const vertical = states.getByRole('slider', { name: 'Hue', exact: true });
  await vertical.scrollIntoViewIfNeeded();
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical');
  const box = await vertical.boundingBox();
  if (!box) throw new Error('The vertical slider must be visible.');
  expect(box.height).toBeGreaterThan(box.width * 3);
  const x = box.x + box.width / 2;
  if (isMobile) await page.touchscreen.tap(x, box.y + box.height * 0.2);
  else await page.mouse.click(x, box.y + box.height * 0.2);
  expect(Number(await vertical.inputValue())).toBeGreaterThan(250);
  await vertical.focus();
  await vertical.press('ArrowDown');
  await expect(states.getByRole('slider', { name: 'Disabled hue' })).toBeDisabled();
  const readonly = states.getByRole('slider', { name: 'Read-only hue' });
  const before = await readonly.inputValue();
  await readonly.focus();
  await readonly.press('Home');
  await expect(readonly).toHaveValue(before);

  await page.evaluate(() => (document.documentElement.dir = 'rtl'));
  await vertical.focus();
  await vertical.press('End');
  await expect(vertical).toHaveValue('359');
  const overflow = await states.evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

for (const mode of ['light', 'dark']) {
  test(`inline color controls are accessible in ${mode} mode`, async ({ page }, testInfo) => {
    await page.addInitScript((mode) => localStorage.setItem('aeris-ui-theme-mode', mode), mode);
    await page.goto('/components/color-picker');
    await page.locator('#color-picker-area [role="slider"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .include('#color-picker-area [preview]')
      .include('#color-picker-channels [preview]')
      .include('#color-picker-rgb [preview]')
      .include('#color-picker-slider-opacity [preview]')
      .include('#color-picker-slider-states [preview]')
      .analyze();
    expect(result.violations).toEqual([]);
    if (testInfo.project.name === 'docs-layout-chromium') {
      await page
        .locator('#color-picker-slider-states [preview]')
        .screenshot({ path: `.angular/color-picker-channels-review/${mode}.png` });
    }
  });
}

for (const palette of ['earth', 'coastal', 'orchid']) {
  for (const mode of ['light', 'dark']) {
    test(`inline color controls remain accessible with ${palette} in ${mode} mode`, async ({
      page,
    }, testInfo) => {
      test.skip(
        testInfo.project.name !== 'docs-layout-chromium',
        'Additional palette combinations are checked once.',
      );
      await page.addInitScript(
        ({ palette, mode }) => {
          localStorage.setItem('aeris-docs-palette', palette);
          localStorage.setItem('aeris-ui-theme-mode', mode);
        },
        { palette, mode },
      );
      await page.goto('/components/color-picker');
      await page.locator('#color-picker-area [role="slider"]').waitFor();
      const result = await new AxeBuilder({ page })
        .include('#color-picker-area [preview]')
        .include('#color-picker-channels [preview]')
        .include('#color-picker-rgb [preview]')
        .include('#color-picker-slider-opacity [preview]')
        .include('#color-picker-slider-states [preview]')
        .analyze();
      expect(result.violations).toEqual([]);
    });
  }
}
