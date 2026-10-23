import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('checkbox controls align with their labels in either label position', async ({ page }) => {
  await page.goto('/components/checkbox');
  const labels = page.locator('#checkbox-label-position .aeris-checkbox');
  await expect(labels).toHaveCount(2);
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const centers = await labels.evaluateAll((elements) =>
      elements.map((element) => {
        const control = element.querySelector('.aeris-checkbox__control');
        if (!control) throw new Error('Checkbox control missing');
        const box = control.getBoundingClientRect();
        return box.y + box.height / 2;
      }),
    );
    expect(Math.max(...centers) - Math.min(...centers)).toBeLessThanOrEqual(1);
    for (const label of await labels.all()) {
      const offset = await label.evaluate((element) => {
        const controlElement = element.querySelector('.aeris-checkbox__control');
        const textElement = element.querySelector('.aeris-checkbox__label');
        if (!controlElement || !textElement) throw new Error('Checkbox control or label missing');
        const control = controlElement.getBoundingClientRect();
        const text = textElement.getBoundingClientRect();
        return Math.abs(control.y + control.height / 2 - text.y - text.height / 2);
      });
      expect(offset).toBeLessThanOrEqual(1);
    }
  }
});

test('timeline titles and current marker rings stay centered', async ({ page }) => {
  await page.goto('/components/timeline');
  const items = page.locator('.aeris-timeline[data-orientation="vertical"] .aeris-timeline__item');
  await expect(items.first()).toBeVisible();
  for (const item of await items.all()) {
    const errors = await item.evaluate((element) => {
      const marker = element.querySelector('.aeris-timeline__marker');
      const dot = marker?.querySelector('.aeris-timeline__marker-dot');
      const title = element.querySelector('.aeris-timeline__content > strong');
      if (!marker || !dot || !title) return null;
      const m = marker.getBoundingClientRect();
      const d = dot.getBoundingClientRect();
      const t = title.getBoundingClientRect();
      const lineHeight = Number.parseFloat(getComputedStyle(title).lineHeight);
      return {
        dotX: Math.abs(m.x + m.width / 2 - d.x - d.width / 2),
        dotY: Math.abs(m.y + m.height / 2 - d.y - d.height / 2),
        titleY: Math.abs(m.y + m.height / 2 - t.y - lineHeight / 2),
      };
    });
    if (errors) for (const value of Object.values(errors)) expect(value).toBeLessThanOrEqual(1);
  }
});

test('accordion animates both directions and fully hides collapsed content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components/accordion');
  const item = page.locator('#accordion-basic .aeris-accordion__item').last();
  const trigger = item.locator('.aeris-accordion__trigger');
  const shell = item.locator('.aeris-accordion__body');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await expect(shell).not.toHaveAttribute('inert');
  expect(await shell.evaluate((el) => getComputedStyle(el).transitionProperty)).toContain(
    'grid-template-rows',
  );
  await expect
    .poll(() => shell.evaluate((el) => el.getBoundingClientRect().height))
    .toBeGreaterThan(20);
  await expect.poll(() => shell.evaluate((el) => el.getAnimations().length)).toBe(0);
  await trigger.click();
  await expect(shell).toHaveAttribute('inert', '');
  await expect.poll(() => shell.evaluate((el) => el.getBoundingClientRect().height)).toBe(0);
  await expect(shell).toHaveCSS('visibility', 'hidden');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await shell.evaluate((el) => Number.parseFloat(getComputedStyle(el).transitionDuration)),
  ).toBeLessThanOrEqual(0.00001);
});

test('splitter dividers are thin, centered, and usable without grips', async ({ page }) => {
  await page.goto('/components/splitter');
  const gutter = page.locator('#splitter-basic .aeris-splitter__gutter').first();
  await gutter.hover();
  const geometry = await gutter.evaluate((el) => {
    const line = getComputedStyle(el, '::after');
    const box = el.getBoundingClientRect();
    const grip = el.querySelector('.aeris-splitter__handle');
    if (!grip) throw new Error('Splitter grip missing');
    const handle = grip.getBoundingClientRect();
    return {
      lineWidth: line.width,
      background: getComputedStyle(el).backgroundColor,
      x: Math.abs(box.x + box.width / 2 - handle.x - handle.width / 2),
      y: Math.abs(box.y + box.height / 2 - handle.y - handle.height / 2),
    };
  });
  expect(geometry.lineWidth).toBe('1px');
  expect(geometry.background).toBe('rgba(0, 0, 0, 0)');
  expect(geometry.x).toBeLessThanOrEqual(0.5);
  expect(geometry.y).toBeLessThanOrEqual(0.5);
  const bare = page.locator('#splitter-divider aeris-splitter').last();
  await expect(bare.locator('.aeris-splitter__handle')).toHaveCount(0);
  const separator = bare.getByRole('separator');
  const previous = Number(await separator.getAttribute('aria-valuenow'));
  await separator.focus();
  await separator.press('ArrowRight');
  await expect(separator).toHaveAttribute('aria-valuenow', String(previous + 5));
});

test('compare shares splitter grip geometry and supports a line-only slider', async ({ page }) => {
  await page.goto('/components/compare');
  const basic = page.locator('#compare-basic .aeris-compare');
  await basic.hover();
  await expect(basic.locator('.aeris-compare__divider')).toHaveCSS('width', '1px');
  await expect(basic.locator('.aeris-compare__handle')).toHaveCSS('width', '3px');
  await expect(basic.locator('.aeris-compare__handle')).toHaveCSS('height', '32px');
  const vertical = page.locator('#compare-vertical .aeris-compare');
  await expect(vertical.locator('.aeris-compare__handle')).toHaveCount(0);
  await expect(vertical.locator('.aeris-compare__divider')).toHaveCSS('height', '1px');
  await expect(vertical.locator('input')).toBeEnabled();
});

test('BlockUI follows its wrapped surface radius', async ({ page }) => {
  await page.goto('/components/block-ui');
  const example = page.locator('#block-ui-element');
  await example.getByRole('button', { name: 'Block', exact: true }).click();
  const target = example.locator('.block-ui-panel');
  const overlay = example.locator('.aeris-block-ui__overlay');
  await expect(overlay).toHaveCSS(
    'border-radius',
    await target.evaluate((el) => getComputedStyle(el).borderRadius),
  );
  await example.getByRole('button', { name: 'Unblock', exact: true }).click();
  await expect(overlay).toHaveCount(0);
});
