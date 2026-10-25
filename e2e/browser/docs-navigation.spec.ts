import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('quick links and Sidebar keep wrapped labels inset under every corner preset', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/button');
  const navigation = page.getByRole('navigation', { name: 'Documentation', exact: true });
  const sidebarLink = navigation.locator('a[aria-current="page"]');
  await expect(sidebarLink).toHaveAccessibleName('Button');
  const tocLink = page.locator('app-page-toc:visible a').first();

  for (const preset of ['soft', 'rounded', 'pill']) {
    const appearance = page.getByRole('button', { name: /^Customize appearance\./ });
    await appearance.click();
    await page
      .getByRole('group', { name: 'Documentation corner style' })
      .getByRole('button', { name: new RegExp(`^${preset}\\b`, 'i') })
      .click();
    await appearance.click();
    await expect(page.locator('html')).toHaveAttribute('data-aeris-radius', preset);
    const item = sidebarLink.locator('.aeris-sidebar__item-content');
    for (const link of [tocLink, item]) {
      const padding = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        return [parseFloat(style.paddingInlineStart), parseFloat(style.paddingInlineEnd)];
      });
      expect(padding.every((value) => value >= (preset === 'pill' ? 15 : 8))).toBe(true);
    }
  }

  // Exercise two-line labels without depending on the current section names.
  await sidebarLink.evaluate((element) => {
    element.style.inlineSize = '160px';
    const label = element.querySelector('.aeris-sidebar__label');
    if (!label) throw new Error('Expected Sidebar label.');
    label.textContent = 'Component navigation and keyboard behavior';
  });
  await tocLink.evaluate((element) => {
    element.style.inlineSize = '160px';
    element.textContent = 'Component navigation and keyboard behavior';
  });
  for (const direction of ['ltr', 'rtl']) {
    await page.locator('html').evaluate((element, direction) => {
      element.setAttribute('dir', direction);
    }, direction);
    for (const label of [sidebarLink.locator('.aeris-sidebar__label'), tocLink]) {
      const geometry = await label.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const lines = Array.from(range.getClientRects());
        const item = element.closest('.aeris-sidebar__item') ?? element;
        const bounds = item.getBoundingClientRect();
        return {
          lines: lines.length,
          inset: Math.min(
            ...lines.map((line) => Math.min(line.left - bounds.left, bounds.right - line.right)),
          ),
          height: bounds.height,
          textHeight: range.getBoundingClientRect().height,
        };
      });
      expect(geometry.lines).toBeGreaterThan(1);
      expect(geometry.inset).toBeGreaterThanOrEqual(14);
      expect(geometry.height - geometry.textHeight).toBeGreaterThanOrEqual(10);
    }
  }
});

// Bound repeated touch scrolling per case without skipping any section or raising timeouts.
for (const { route, parts } of [
  { route: '/components/table', parts: 4 },
  { route: '/components/tree-table', parts: 4 },
  { route: '/components/button', parts: 1 },
  { route: '/guides/installation', parts: 1 },
]) {
  for (let part = 0; part < parts; part++) {
    test(`quick links follow every section on ${route} (${part + 1}/${parts})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(route);
      const toc = page.locator('app-page-toc:visible').first();
      await expect(toc).toBeVisible();
      const links = toc.locator('a');
      const count = await links.count();
      expect(count).toBeGreaterThan(2);
      for (
        let index = Math.floor((count * part) / parts);
        index < Math.floor((count * (part + 1)) / parts);
        index++
      ) {
        const link = links.nth(index);
        await link.click();
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            ),
        );
        await expect(link).toHaveAttribute('aria-current', 'location');
        await expect(toc.locator('a[aria-current="location"]')).toHaveCount(1);
      }
      await links.first().click();
      await expect(links.first()).toHaveAttribute('aria-current', 'location');
    });
  }
}

test('header appearance controls still restore native button focus after Escape', async ({
  page,
}) => {
  await page.goto('/components/button');
  const trigger = page.getByRole('button', { name: /^Customize appearance/ });
  await trigger.click();
  await expect(page.locator('.docs-appearance-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.docs-appearance-menu')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('documentation uses one Sidebar and preserves native routes, categories and scroll position', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/button');
  const navigation = page.getByRole('navigation', { name: 'Documentation', exact: true });
  await expect(navigation).toHaveCount(1);
  await expect(navigation.getByRole('link', { name: 'Button', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  const form = navigation.getByRole('button', { name: /^Form \(/ });
  await form.click();
  const input = navigation.getByRole('link', { name: 'InputText', exact: true });
  await input.scrollIntoViewIfNeeded();
  const body = page.locator('app-docs-navigation .aeris-sidebar__body');
  const top = await body.evaluate((element) => element.scrollTop);
  await body.evaluate(
    (element) => ((element as HTMLElement).dataset['navigationIdentity'] = 'retained'),
  );
  await input.click();
  await expect(page).toHaveURL(/\/components\/input-text$/);
  await expect(input).toHaveAttribute('aria-current', 'page');
  await expect(body).toHaveAttribute('data-navigation-identity', 'retained');
  expect(await body.evaluate((element) => element.scrollTop)).toBeCloseTo(top, 0);
  expect(await input.evaluate((element) => getComputedStyle(element, '::before').width)).toBe(
    '2px',
  );
  await form.click();
  await expect(input).toHaveCount(0);
  await form.click();
  await expect(input).toHaveAttribute('aria-current', 'page');
  await expect(navigation.getByRole('link', { name: /^All components/ })).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).include('app-docs-navigation').analyze();
  expect(accessibility.violations).toEqual([]);
});

test('documentation mobile navigation keeps disclosures open, closes on navigation and restores focus', async ({
  page,
  isMobile,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/components/button');
  const launcher = page.getByRole('button', { name: 'Open documentation navigation', exact: true });
  await expect(page.getByRole('navigation', { name: 'Documentation', exact: true })).toHaveCount(0);
  if (isMobile) await launcher.tap();
  else await launcher.click();
  const dialog = page.getByRole('dialog', { name: 'Documentation', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('navigation', { name: 'Documentation', exact: true })).toHaveCount(
    1,
  );
  const group = dialog.getByRole('button', { name: /^Getting started \(/ });
  await group.click();
  await expect(group).toHaveAttribute('aria-expanded', 'true');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('link', { name: 'Installation', exact: true }).click();
  await expect(page).toHaveURL(/\/guides\/installation$/);
  await expect(dialog).not.toBeVisible();
  await expect(launcher).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await launcher.click();
  await expect(dialog.getByRole('link', { name: 'Installation', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  const accessibility = await new AxeBuilder({ page })
    .include('.aeris-drawer__panel[aria-label="Documentation"]')
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await dialog.getByRole('button', { name: 'Close documentation navigation', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(launcher).toBeFocused();
});

test('documentation navigation shares the header breakpoint and survives RTL and responsive transitions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1040, height: 900 });
  await page.goto('/components/button');
  const launcher = page.getByRole('button', { name: 'Open documentation navigation', exact: true });
  await launcher.click();
  const dialog = page.getByRole('dialog', { name: 'Documentation', exact: true });
  await expect(dialog).toBeVisible();
  await page.setViewportSize({ width: 1050, height: 900 });
  await expect(dialog).toBeVisible();
  await page.evaluate(() => (document.documentElement.dir = 'rtl'));
  await expect(dialog).toHaveAttribute('data-position', 'right');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(dialog).toHaveCount(0);
  const navigation = page.getByRole('navigation', { name: 'Documentation', exact: true });
  await expect(navigation).toHaveCount(1);
  await expect(navigation).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await navigation.getByRole('link', { name: 'Button', exact: true }).focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(launcher).toBeVisible();
  await expect(launcher).toBeFocused();
  await launcher.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close documentation navigation', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('landing page has no desktop sidebar but retains mobile documentation navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Documentation', exact: true })).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open documentation navigation', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Documentation', exact: true });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('link', { name: 'All components', exact: false }).click();
  await expect(page).toHaveURL(/\/components$/);
  await expect(dialog).not.toBeVisible();
});
