import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('Toolbar coordinates actions, toggles, group selection and keyboard focus', async ({
  page,
}) => {
  await page.goto('/components/toolbar');
  const zoom = page.getByRole('toolbar', { name: 'Zoom controls', exact: true });
  await zoom.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(zoom.locator('output')).toHaveText('110%');
  await zoom.getByRole('button', { name: 'Reset zoom' }).click();
  await expect(zoom.locator('output')).toHaveText('100%');
  const format = page.getByRole('toolbar', { name: 'Text formatting', exact: true });
  const bold = format.getByRole('button', { name: 'Bold', exact: true });
  await bold.focus();
  await bold.press('Space');
  await expect(bold).toHaveAttribute('aria-pressed', 'true');
  await bold.press('ArrowRight');
  await expect(format.getByRole('button', { name: 'Italic', exact: true })).toBeFocused();
  const group = page.getByRole('group', { name: 'Alignment', exact: true });
  await group.getByRole('button', { name: 'Align end', exact: true }).click();
  await expect(group.getByRole('button', { name: 'Align start', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(group.getByRole('button', { name: 'Align end', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.locator('html').evaluate((node) => (node.dir = 'rtl'));
  await bold.focus();
  await bold.press('ArrowLeft');
  await expect(format.getByRole('button', { name: 'Italic', exact: true })).toBeFocused();
});

test('Toolbar menus remain anchored, restore focus and leave input editing intact', async ({
  page,
}) => {
  await page.goto('/components/toolbar');
  const toolbar = page.getByRole('toolbar', { name: 'Document actions', exact: true });
  const trigger = toolbar.getByRole('button', { name: 'Export', exact: true });
  await trigger.focus();
  await trigger.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'Export format', exact: true });
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const triggerBounds = await trigger.boundingBox();
  const menuBounds = await menu.boundingBox();
  expect(Math.abs((menuBounds?.x ?? 0) - (triggerBounds?.x ?? 0))).toBeLessThan(25);
  await menu.getByRole('menuitem').first().press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  const input = page.getByRole('textbox', { name: 'Find commands', exact: true });
  await input.fill('Save');
  await input.press('ArrowLeft');
  await expect(input).toBeFocused();
  expect(await input.evaluate((node) => (node as HTMLInputElement).selectionStart)).toBe(3);
  await expect(page.locator('#toolbar-mixed')).toContainText('Matches: Save.');
});

test('Toolbar overflow fades, wrapping and vertical separators adapt to narrow screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/components/toolbar');
  const scrollable = page.getByRole('toolbar', { name: 'Scrollable actions', exact: true });
  await scrollable.scrollIntoViewIfNeeded();
  await expect(scrollable).toHaveAttribute('data-scroll-end', 'true');
  const viewport = scrollable.locator('.aeris-toolbar__viewport');
  await expect(viewport).toHaveCSS('scrollbar-width', 'none');
  const edge = await scrollable.evaluate((node) => {
    const bounds = node.getBoundingClientRect();
    const fade = node.querySelector('.aeris-toolbar__fade--end')?.getBoundingClientRect();
    return {
      gap: bounds.right - (fade?.right ?? 0),
      border: parseFloat(getComputedStyle(node).borderRightWidth),
    };
  });
  expect(edge.gap).toBeCloseTo(edge.border, 1);
  await viewport.evaluate((node) => (node.scrollLeft = node.scrollWidth));
  await expect(scrollable).not.toHaveAttribute('data-scroll-end');
  await expect(scrollable).toHaveAttribute('data-scroll-start', 'true');
  const wrap = page.getByRole('toolbar', { name: 'Wrapping actions', exact: true });
  await expect(wrap).not.toHaveAttribute('data-scroll-end');
  expect(await wrap.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  const vertical = page.getByRole('toolbar', { name: 'Drawing tools', exact: true });
  await expect(vertical.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  await vertical.getByRole('button', { name: 'Select', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(vertical.getByRole('button', { name: 'Draw', exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});

test('Toolbar vertical buttons stay centered and full-width sections have balanced insets', async ({
  page,
}) => {
  await page.goto('/components/toolbar');
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const vertical = page.getByRole('toolbar', { name: 'Drawing tools', exact: true });
    const geometry = await vertical.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      return Array.from(node.querySelectorAll('button')).map((button) => {
        const item = button.getBoundingClientRect();
        return {
          center: item.left + item.width / 2 - bounds.left - bounds.width / 2,
          inset: bounds.right - item.right,
        };
      });
    });
    for (const item of geometry) {
      expect(Math.abs(item.center)).toBeLessThanOrEqual(1);
      expect(item.inset).toBeGreaterThanOrEqual(6);
    }
    const fullWidth = page.getByRole('group', { name: 'File actions', exact: true });
    const insets = await fullWidth.evaluate((node) => {
      const frame = node.getBoundingClientRect();
      const title = node.querySelector('strong');
      const last = node.querySelector('button:last-child');
      if (!title || !last) throw new Error('Missing toolbar section content');
      const titleBounds = title.getBoundingClientRect();
      const buttonBounds = last.getBoundingClientRect();
      return {
        title: titleBounds.left + parseFloat(getComputedStyle(title).paddingLeft) - frame.left,
        action: frame.right - buttonBounds.right + parseFloat(getComputedStyle(last).paddingRight),
        order: Array.from(node.querySelector('.aeris-toolbar__content')?.children ?? []).map(
          (child) => child.className,
        ),
      };
    });
    expect(Math.abs(insets.title - insets.action)).toBeLessThanOrEqual(1);
    expect(insets.title).toBeGreaterThanOrEqual(12);
    expect(insets.order[1]).toBe('aeris-toolbar__spacer');
    expect(insets.order[2]).toContain('aeris-toolbar__section--end');
  }
});

for (const direction of ['ltr', 'rtl']) {
  test(`Toolbar drag scrolling and partial-item reveal preserve actions in ${direction}`, async ({
    page,
  }) => {
    await page.goto('/components/toolbar');
    await page.locator('html').evaluate((node, direction) => (node.dir = direction), direction);
    const toolbar = page.getByRole('toolbar', { name: 'Scrollable actions', exact: true });
    await toolbar.scrollIntoViewIfNeeded();
    const viewport = toolbar.locator('.aeris-toolbar__viewport');
    await viewport.evaluate((node) => {
      node.scrollLeft = 0;
      const item = node.querySelectorAll('button')[5]?.getBoundingClientRect();
      if (!item) throw new Error('Missing overflow item');
      const frame = node.getBoundingClientRect();
      node.scrollLeft +=
        getComputedStyle(node).direction === 'rtl'
          ? item.left - frame.left + 24
          : item.right - frame.right - 24;
    });
    const partial = await toolbar.evaluate((node) => {
      const frame = node.querySelector('.aeris-toolbar__viewport')?.getBoundingClientRect();
      if (!frame) throw new Error('Missing toolbar viewport');
      const buttons = Array.from(node.querySelectorAll('button'));
      for (const [index, button] of buttons.entries()) {
        if (index !== 5) continue;
        const bounds = button.getBoundingClientRect();
        const start = Math.max(frame.left, bounds.left);
        const end = Math.min(frame.right, bounds.right);
        if (end - start >= 10 && (bounds.left < frame.left - 1 || bounds.right > frame.right + 1)) {
          return {
            index,
            label: button.textContent?.trim(),
            x: (start + end) / 2,
            y: bounds.top + bounds.height / 2,
          };
        }
      }
      throw new Error('Expected a partially visible toolbar item');
    });
    const pageOffset = await page.evaluate(() => scrollY);
    await page.mouse.click(partial.x, partial.y);
    await expect(page.locator('#toolbar-wrapping .toolbar-note')).toContainText(
      `Selected: ${partial.label}.`,
    );
    const reveal = await toolbar.evaluate((node, index) => {
      const frame = node.querySelector('.aeris-toolbar__viewport')?.getBoundingClientRect();
      const buttons = node.querySelectorAll('button');
      const selected = buttons[index]?.getBoundingClientRect();
      const next = buttons[index + 1]?.getBoundingClientRect();
      if (!frame || !selected || !next) throw new Error('Missing reveal geometry');
      return {
        clipped: selected.left < frame.left - 1 || selected.right > frame.right + 1,
        glimpse: Math.min(frame.right, next.right) - Math.max(frame.left, next.left),
      };
    }, partial.index);
    expect(reveal.clipped).toBe(false);
    expect(reveal.glimpse).toBeGreaterThanOrEqual(30);
    expect(await page.evaluate(() => scrollY)).toBe(pageOffset);

    await viewport.evaluate((node) => (node.scrollLeft = 0));
    const frame = await viewport.boundingBox();
    if (!frame) throw new Error('Missing toolbar');
    const sign = direction === 'rtl' ? 1 : -1;
    const x = direction === 'rtl' ? frame.x + 45 : frame.x + frame.width - 45;
    const y = frame.y + frame.height / 2;
    const status = await page.locator('#toolbar-wrapping .toolbar-note').textContent();
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + sign * 85, y, { steps: 8 });
    await expect(viewport).toHaveAttribute('data-dragging', 'true');
    await page.mouse.up();
    await expect(viewport).not.toHaveAttribute('data-dragging');
    expect(Math.abs(await viewport.evaluate((node) => node.scrollLeft))).toBeGreaterThan(60);
    await expect(page.locator('#toolbar-wrapping .toolbar-note')).toHaveText(status ?? '');
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + sign * 250, y, { steps: 10 });
    const atEdge = Math.abs(await viewport.evaluate((node) => node.scrollLeft));
    await page.mouse.move(x + sign * 230, y, { steps: 2 });
    expect(Math.abs(await viewport.evaluate((node) => node.scrollLeft))).toBeCloseTo(
      atEdge - 20,
      0,
    );
    await page.mouse.up();
    await expect(page.locator('#toolbar-wrapping .toolbar-note')).toHaveText(status ?? '');
    await toolbar.getByRole('button', { name: 'Pan', exact: true }).click();
    await expect(page.locator('#toolbar-wrapping .toolbar-note')).toContainText('Selected: Pan.');
  });
}

for (const mode of ['light', 'dark']) {
  test(`Toolbar touch targets and accessibility semantics remain consistent in ${mode} mode`, async ({
    page,
  }) => {
    await page.addInitScript((mode) => localStorage.setItem('aeris-ui-theme-mode', mode), mode);
    await page.goto('/components/toolbar');
    await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    });
    const result = await new AxeBuilder({ page }).include('.toolbar-docs [preview]').analyze();
    expect(
      result.violations.map(({ id, nodes }) => ({
        id,
        nodes: nodes.map((node) => ({
          target: node.target,
          checks: node.any.map((check) => check.data),
        })),
      })),
    ).toEqual([]);
    const size = await page
      .locator('#toolbar-basic button')
      .first()
      .evaluate((node) => {
        const bounds = node.getBoundingClientRect();
        return {
          width: bounds.width,
          height: bounds.height,
          coarse: matchMedia('(pointer: coarse)').matches,
        };
      });
    if (size.coarse) {
      expect(size.width).toBeGreaterThanOrEqual(44);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
  });
}
