import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

test('Navbar content-fit breakpoint responds to width, hidden content changes and alignment without flickering', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/navbar');
  await page.evaluate(() => document.fonts.ready);
  const example = page.locator('#navbar-content-fit');
  const navbar = example.locator('aeris-navbar');
  await expect(navbar).not.toHaveAttribute('data-mobile');
  await example.getByRole('button', { name: 'Narrow container' }).click();
  await expect(navbar).toHaveAttribute('data-mobile', 'true');
  const toggle = navbar.getByRole('button', { name: 'Open navigation', exact: true });
  await toggle.focus();
  await example.locator('.navbar-preview-frame').evaluate((element) => {
    (element as HTMLElement).style.inlineSize = 'min(38rem, 100%)';
  });
  await expect(navbar).not.toHaveAttribute('data-mobile');
  await expect(navbar.getByRole('button', { name: 'Overview', exact: true })).toBeFocused();
  await example.getByRole('button', { name: 'Widen container' }).click();
  await expect(navbar).not.toHaveAttribute('data-mobile');
  await example.getByRole('button', { name: 'Long labels', exact: true }).click();
  await expect(navbar).toHaveAttribute('data-mobile', 'true');
  await expect(navbar.locator('nav')).toBeHidden();
  await example.getByRole('button', { name: 'Short labels', exact: true }).click();
  await expect(navbar).not.toHaveAttribute('data-mobile');
  const signIn = navbar.getByRole('button', { name: 'Sign in', exact: true });
  await signIn.evaluate((element) => {
    element.textContent = 'Account and workspace settings';
  });
  await expect(navbar).toHaveAttribute('data-mobile', 'true');
  await navbar
    .getByRole('button', { name: 'Account and workspace settings' })
    .evaluate((element) => {
      element.textContent = 'Sign in';
    });
  await expect(navbar).not.toHaveAttribute('data-mobile');
  const stable = await navbar.evaluate(async (element) => {
    let changes = 0;
    const observer = new MutationObserver((records) => {
      changes += records.length;
    });
    observer.observe(element, { attributes: true, attributeFilter: ['data-mobile'] });
    for (let frame = 0; frame < 12; frame++)
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    observer.disconnect();
    return changes;
  });
  expect(stable).toBe(0);
  await expect(navbar).not.toHaveAttribute('data-measuring');
});

test('Navbar nested menus fly out with hover, directional keys and viewport flipping', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/navbar');
  const navbar = page.locator('#navbar-disclosures aeris-navbar');
  const resources = navbar.getByRole('button', { name: 'Resources', exact: true });
  for (const dir of ['ltr', 'rtl']) {
    await navbar.evaluate((element, direction) => element.setAttribute('dir', direction), dir);
    await resources.click();
    const panel = page.getByRole('group', { name: 'Resources', exact: true });
    const more = panel.getByRole('button', { name: 'More resources', exact: true });
    await more.hover();
    const flyout = page.getByRole('group', { name: 'More resources', exact: true });
    await expect(flyout).toBeVisible();
    await expect(flyout).toHaveAttribute('data-aeris-append-to', 'body');
    await expect(flyout).toHaveAttribute('data-placement', dir === 'rtl' ? 'left' : 'right');
    await flyout.getByRole('button', { name: 'Release notes' }).hover();
    await expect(panel).toBeVisible();
    await expect(flyout).toBeVisible();
    await panel.getByRole('button', { name: 'Documentation', exact: true }).hover();
    await expect(flyout).toBeHidden();
    await more.focus();
    await page.keyboard.press(dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
    await expect(flyout.getByRole('button', { name: 'Release notes' })).toBeFocused();
    await page.keyboard.press(dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
    await expect(more).toBeFocused();
    await expect(flyout).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  }
  await navbar.evaluate((element) => element.setAttribute('dir', 'ltr'));
  await resources.click();
  const panel = page.getByRole('group', { name: 'Resources', exact: true });
  await panel.evaluate((element) => {
    element.style.left = `${innerWidth - element.getBoundingClientRect().width - 10}px`;
  });
  await panel.getByRole('button', { name: 'More resources', exact: true }).hover();
  const flyout = page.getByRole('group', { name: 'More resources', exact: true });
  await expect(flyout).toHaveAttribute('data-placement', 'left');
  const bounds = await flyout.boundingBox();
  expect(bounds).not.toBeNull();
  if (bounds) {
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(1440);
  }
  await resources.click();
  await page.setViewportSize({ width: 390, height: 844 });
  await navbar.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await resources.click();
  await navbar.getByRole('button', { name: 'More resources', exact: true }).click();
  const inline = navbar.getByRole('group', { name: 'More resources', exact: true });
  await expect(inline).toHaveAttribute('data-inline', 'true');
  await expect(inline).not.toHaveAttribute('data-aeris-append-to');
  await expect(inline.getByRole('button', { name: 'Release notes' })).toBeVisible();
});

test('Navbar underlines the top-level dropdown for active nested destinations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/navbar');
  const navbar = page.locator('#navbar-disclosures aeris-navbar');
  const resources = navbar.getByRole('button', { name: 'Resources', exact: true });
  const company = navbar.getByRole('button', { name: 'Company', exact: true });
  const indicator = navbar.locator('.aeris-navbar__indicator');
  for (const nested of [false, true]) {
    await resources.click();
    if (nested) await page.getByRole('button', { name: 'More resources', exact: true }).click();
    await page
      .getByRole('button', { name: nested ? 'Release notes' : 'Documentation', exact: true })
      .click();
    await expect(resources).toHaveAttribute('aria-expanded', 'false');
    await expect(resources).toHaveAttribute('data-active', 'true');
    const x = await resources.evaluate((element) => element.getBoundingClientRect().x + 12);
    await expect
      .poll(() => indicator.evaluate((element) => element.getBoundingClientRect().x))
      .toBeCloseTo(x, 0);
  }
  await company.click();
  await page.getByRole('button', { name: 'About', exact: true }).click();
  await expect(company).toHaveAttribute('data-active', 'true');
  await expect(resources).not.toHaveAttribute('data-active');
  const companyX = await company.evaluate((element) => element.getBoundingClientRect().x + 12);
  await expect
    .poll(() => indicator.evaluate((element) => element.getBoundingClientRect().x))
    .toBeCloseTo(companyX, 0);
  await navbar.getByRole('button', { name: 'Overview', exact: true }).click();
  await expect(company).not.toHaveAttribute('data-active');
  await expect(navbar.getByRole('button', { name: 'Overview', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('Every Navbar example updates its own active item', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/navbar');
  for (const id of [
    'navbar-responsive',
    'navbar-controlled',
    'navbar-disclosures',
    'navbar-custom',
    'navbar-variants',
    'navbar-sticky',
  ]) {
    const example = page.locator(`#${id}`);
    for (const navbar of await example.locator('aeris-navbar').all()) {
      const toggle = navbar.getByRole('button', { name: 'Open navigation', exact: true });
      if (await toggle.isVisible()) await toggle.click();
      const project = navbar.getByRole('button', { name: 'Projects', exact: true });
      await project.focus();
      await project.press('Enter');
      if (await toggle.isVisible()) await toggle.click();
      await expect(project).toHaveAttribute('aria-current', 'page');
      await expect(
        navbar.getByRole('button', { name: 'Overview', exact: true }),
      ).not.toHaveAttribute('aria-current');
      if (!(await navbar.getAttribute('data-mobile'))) {
        await expect(navbar.locator('.aeris-navbar__indicator')).toHaveCount(1);
      }
    }
  }
  await expect(
    page.locator('#navbar-basic').getByRole('button', { name: 'Overview', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});

test('Navbar slides one active underline, including RTL and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components/navbar');
  await page.evaluate(() => document.fonts.ready);
  const nav = page.locator('#navbar-basic nav');
  const indicator = nav.locator('.aeris-navbar__indicator');
  await expect(indicator).toHaveCount(1);
  await expect(indicator).toHaveAttribute('data-ready');
  for (const direction of ['ltr', 'rtl']) {
    await nav.evaluate((element, dir) => element.setAttribute('dir', dir), direction);
    await nav.getByRole('button', { name: 'Overview', exact: true }).click();
    const origin = await nav
      .getByRole('button', { name: 'Overview', exact: true })
      .evaluate((element) => element.getBoundingClientRect().x + 12);
    await expect
      .poll(() => indicator.evaluate((element) => element.getBoundingClientRect().x))
      .toBeCloseTo(origin, 0);
    await expect
      .poll(() => indicator.evaluate((element) => element.getAnimations().length))
      .toBe(0);
    const start = await indicator.evaluate((element) => element.getBoundingClientRect().x);
    await indicator.evaluate((element) => {
      element.addEventListener(
        'transitionrun',
        () => {
          for (const animation of element.getAnimations()) animation.pause();
        },
        { once: true },
      );
    });
    await nav.getByRole('button', { name: 'Projects', exact: true }).click();
    await expect
      .poll(() => indicator.evaluate((element) => element.getAnimations().length))
      .toBeGreaterThan(0);
    const moving = await indicator.evaluate((element) => {
      for (const animation of element.getAnimations()) {
        animation.pause();
        animation.currentTime = 100;
      }
      return element.getBoundingClientRect().x;
    });
    const target = await nav
      .getByRole('button', { name: 'Projects', exact: true })
      .evaluate((element) => element.getBoundingClientRect().x + 12);
    expect(moving).toBeGreaterThan(Math.min(start, target));
    expect(moving).toBeLessThan(Math.max(start, target));
    await indicator.evaluate((element) => {
      for (const animation of element.getAnimations()) animation.finish();
    });
    await expect
      .poll(() => indicator.evaluate((element) => element.getBoundingClientRect().x))
      .toBeCloseTo(target, 0);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await nav.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect
    .poll(() =>
      indicator.evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration)),
    )
    .toBeLessThanOrEqual(0.00001);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(indicator).toHaveCount(0);
});

test('Navbar preserves native semantics, active state and disabled items', async ({
  page,
  isMobile,
}) => {
  await page.goto('/components/navbar');
  const example = page.locator('#navbar-basic');
  const nav = example.getByRole('navigation', { name: 'Basic example navigation' });
  const toggle = example.getByRole('button', { name: 'Open navigation', exact: true });
  if (isMobile) {
    await expect(toggle).toBeVisible();
    await toggle.click();
  }
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Overview' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await nav.getByRole('button', { name: 'Projects' }).click();
  const reopen = example.getByRole('button', { name: 'Open navigation', exact: true });
  if (isMobile) {
    await expect(reopen).toBeVisible();
    await reopen.click();
  }
  await expect(nav.getByRole('button', { name: 'Projects' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(nav.getByRole('button', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  const controlled = page.locator('#navbar-controlled');
  await controlled.getByRole('button', { name: 'Expand', exact: true }).click();
  await expect(controlled.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  await expect(example.locator('[role="menu"]')).toHaveCount(0);
});

test('Navbar expands inline, dismisses on activation, and responds to container resizing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/navbar');
  const example = page.locator('#navbar-responsive');
  const navbar = example.locator('aeris-navbar');
  const nav = example.getByRole('navigation', { name: 'Responsive example navigation' });
  await expect(navbar).not.toHaveAttribute('data-mobile');
  await example.getByRole('button', { name: 'Compact width' }).click();
  await expect(navbar).toHaveAttribute('data-mobile', 'true');
  await expect(nav).toBeHidden();
  await expect(navbar.locator('.aeris-navbar__menu-icon')).not.toHaveCSS('mask-image', 'none');
  await example.getByRole('button', { name: 'Sign in' }).click();
  await expect(nav).toBeHidden();
  await example.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(nav).toBeVisible();
  await expect(navbar.locator('.aeris-navbar__close-icon')).not.toHaveCSS('mask-image', 'none');
  await expect(navbar.locator('nav')).toHaveCount(1);
  await nav.getByRole('button', { name: 'Projects' }).click();
  await expect(nav).toBeHidden();
  await example.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await example.getByRole('button', { name: 'Available width' }).click();
  await expect(navbar).not.toHaveAttribute('data-mobile');
  await expect(nav).toBeVisible();
  await example.getByRole('button', { name: 'Compact width' }).click();
  await expect(nav).toBeHidden();
});

test('Navbar follows theme palettes and corner presets', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'docs-layout-chromium',
    'Other engines cover navigation and geometry; palette rendering is reviewed once.',
  );
  test.setTimeout(60_000);
  await page.goto('/components/navbar');
  for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
    for (const mode of ['light', 'dark']) {
      await page.evaluate(
        ({ palette, mode }) => {
          localStorage.setItem('aeris-docs-palette', palette);
          localStorage.setItem('aeris-ui-theme-mode', mode);
        },
        { palette, mode },
      );
      await page.goto('/components/navbar');
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      await page.locator('#navbar-basic aeris-navbar').screenshot({
        path: `.angular/navbar-review/${palette}-${mode}.png`,
        animations: 'disabled',
      });
      const result = await new AxeBuilder({ page })
        .include('#navbar-basic aeris-navbar')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations).toEqual([]);
      await page.goto('/components/sidebar');
      const sidebarResult = await new AxeBuilder({ page })
        .include('#sidebar-basic aeris-sidebar')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(sidebarResult.violations).toEqual([]);
    }
  }
  const radii = new Set<string>();
  await page.goto('/components/navbar');
  for (const radius of ['soft', 'rounded', 'pill']) {
    await page.evaluate((radius) => localStorage.setItem('aeris-docs-radius', radius), radius);
    await page.reload();
    radii.add(
      await page
        .locator('#navbar-basic .aeris-navbar__item')
        .first()
        .evaluate((element) => getComputedStyle(element).borderTopLeftRadius),
    );
  }
  expect(radii.size).toBeGreaterThan(1);
});

test('Navbar supports keyboard toggles, controlled closure and focus restoration', async ({
  page,
}) => {
  await page.goto('/components/navbar');
  const example = page.locator('#navbar-controlled');
  const nav = example.getByRole('navigation');
  await example.getByRole('button', { name: 'Expand', exact: true }).click();
  await expect(example.locator('.navbar-preview-controls [role="status"]')).toHaveText('Expanded');
  await expect(nav).toBeVisible();
  await nav.getByRole('button', { name: 'Overview' }).focus();
  await page.keyboard.press('Escape');
  const toggle = example.getByRole('button', { name: 'Open navigation', exact: true });
  await expect(toggle).toBeFocused();
  await expect(nav).toBeHidden();
  await page.keyboard.press('Space');
  await expect(nav).toBeVisible();
  await example.getByRole('button', { name: 'Collapse', exact: true }).click();
  await expect(nav).toBeHidden();
  await expect(example.locator('.navbar-preview-controls [role="status"]')).toHaveText('Collapsed');
});

test('Navbar dropdowns anchor to their trigger and retain focus and nested state', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/navbar');
  const example = page.locator('#navbar-disclosures');
  const resources = example.getByRole('button', { name: 'Resources', exact: true });
  await resources.click();
  await expect(resources).toHaveAttribute('aria-expanded', 'true');
  const panelId = await resources.getAttribute('aria-controls');
  const panel = page.locator('#' + panelId);
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-aeris-append-to', 'body');
  await resources.focus();
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { name: 'Documentation', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(resources).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await page.keyboard.press('ArrowDown');
  await expect(panel.getByRole('button', { name: 'Documentation', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await resources.click();
  const triggerBounds = await resources.boundingBox();
  const panelBounds = await panel.boundingBox();
  if (triggerBounds && panelBounds) {
    expect(Math.abs(panelBounds.x - triggerBounds.x)).toBeLessThan(2);
    expect(panelBounds.y - triggerBounds.y - triggerBounds.height).toBeGreaterThanOrEqual(0);
    expect(panelBounds.y - triggerBounds.y - triggerBounds.height).toBeLessThan(12);
  }
  await panel.getByRole('button', { name: 'More resources', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Release notes', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Release notes', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(panel.getByRole('button', { name: 'More resources', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Release notes', exact: true })).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(resources).toBeFocused();
  await expect(panel).toHaveCount(0);
  await resources.click();
  await example.getByRole('button', { name: 'Company', exact: true }).click();
  await expect(resources).toHaveAttribute('aria-expanded', 'false');
  await page.locator('h1').click();
  await expect(example.getByRole('button', { name: 'Company', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('Navbar accommodates long branding and actions in RTL and at narrow widths without overflow', async ({
  page,
}, testInfo) => {
  await page.goto('/components/navbar');
  for (const dir of ['ltr', 'rtl']) {
    await page
      .locator('html')
      .evaluate((element, direction) => element.setAttribute('dir', direction), dir);
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      const example = page.locator('#navbar-custom');
      const toggle = example.locator('button[aerisNavbarToggle]');
      await expect(toggle).toBeVisible();
      const brandBounds = await example.locator('[aerisNavbarBrand]').boundingBox();
      expect(brandBounds?.width).toBeGreaterThanOrEqual(26);
      const bounds = await toggle.boundingBox();
      expect(bounds?.width).toBeGreaterThanOrEqual(32);
      expect(bounds?.height).toBeGreaterThanOrEqual(32);
      await toggle.click();
      await expect(example.getByRole('navigation')).toBeVisible();
      if (width === 320)
        await example.locator('aeris-navbar').screenshot({
          path: `.angular/navbar-review/${testInfo.project.name}-${dir}-mobile.png`,
          animations: 'disabled',
        });
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(width);
      const geometry = await example
        .locator('aeris-navbar')
        .evaluate((element) => ({ width: element.clientWidth, scroll: element.scrollWidth }));
      expect(geometry.scroll).toBeLessThanOrEqual(geometry.width + 1);
      await toggle.click();
      await expect(example.getByRole('navigation')).toBeHidden();
    }
  }
});

test('Navbar sticky navigation stays inside its own scrolling region and reduced motion removes entrance animation', async ({
  page,
}) => {
  await page.goto('/components/navbar');
  const example = page.locator('#navbar-sticky');
  const navbar = example.locator('aeris-navbar');
  await navbar.scrollIntoViewIfNeeded();
  const start = await navbar.boundingBox();
  await example.locator('.navbar-scroll-region').evaluate((element) => (element.scrollTop = 180));
  const end = await navbar.boundingBox();
  expect(start).not.toBeNull();
  expect(end).not.toBeNull();
  if (start && end) expect(Math.abs(start.y - end.y)).toBeLessThan(2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const controlled = page.locator('#navbar-controlled');
  await controlled.getByRole('button', { name: 'Expand', exact: true }).click();
  await expect(controlled.locator('nav')).toHaveCSS('animation-name', 'none');
});

test('Navbar has accessible collapsed, expanded and disclosure states', async ({ page }) => {
  await page.goto('/components/navbar');
  for (const expanded of [false, true]) {
    if (expanded) {
      await page
        .locator('#navbar-controlled')
        .getByRole('button', { name: 'Expand', exact: true })
        .click();
      const dropdown = page.locator('#navbar-disclosures');
      const toggle = dropdown.getByRole('button', { name: 'Open navigation', exact: true });
      if (await toggle.isVisible()) await toggle.click();
      await dropdown.getByRole('button', { name: 'Resources', exact: true }).click();
    }
    const scan = new AxeBuilder({ page })
      .include('#navbar-basic aeris-navbar')
      .include('#navbar-controlled aeris-navbar')
      .include('#navbar-disclosures aeris-navbar')
      .include('#navbar-custom aeris-navbar')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']);
    if (expanded) scan.include('.aeris-navbar__dropdown');
    const result = await scan.analyze();
    expect(result.violations).toEqual([]);
  }
});
