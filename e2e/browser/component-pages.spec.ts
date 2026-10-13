import { expect, test } from './fixtures';
import { COMPONENT_CATALOG } from '../../projects/docs/src/app/data/component-catalog';

test('catalog editor formats its phrase and toolbar only while hovered', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  const search = page.getByRole('searchbox', { name: 'Filter components' });
  await search.fill('editor');
  const card = page.locator('.catalog-preview-card').filter({
    has: page.locator('a[href="/components/editor"]'),
  });
  const textbox = card.locator('[role="textbox"]');
  const bold = card.locator('[aria-label="Bold"]');
  await expect(textbox).toHaveText('Make room for better ideas.');
  await expect(textbox.locator('strong')).toHaveCount(0);
  await expect(bold).toHaveAttribute('aria-pressed', 'false');
  await expect(card.locator('.aeris-editor__separator')).toHaveCount(0);
  for (let repeat = 0; repeat < 2; repeat++) {
    await card.hover();
    await expect(textbox.locator('strong')).toHaveText('better ideas');
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await expect(search).toBeFocused();
    await page.mouse.move(0, 0);
    await expect(textbox.locator('strong')).toHaveCount(0);
    await expect(bold).toHaveAttribute('aria-pressed', 'false');
    await expect(textbox).toHaveText('Make room for better ideas.');
  }
});

test('catalog CascadeSelect stays inside its card with aligned chevrons', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components');
    await page.getByRole('searchbox', { name: 'Filter components' }).fill('cascade');
    const card = page.locator('.catalog-preview-card').filter({
      has: page.locator('a[href="/components/cascade-select"]'),
    });
    await card.locator('.aeris-cascade-select__trigger').waitFor();
    await card.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await card.hover();
    const option = card.locator('.aeris-cascade-select__option').first();
    await option.waitFor();
    await expect(card.locator('.aeris-cascade-select__submenu')).toHaveCount(0);
    await expect
      .poll(async () => {
        const scene = await card.locator('.catalog-preview-scene').boundingBox();
        const panel = await card.locator('.aeris-cascade-select__panel').boundingBox();
        return (
          !!scene &&
          !!panel &&
          panel.x >= scene.x &&
          panel.y >= scene.y &&
          panel.x + panel.width <= scene.x + scene.width + 1 &&
          panel.y + panel.height <= scene.y + scene.height + 1
        );
      })
      .toBe(true);
    const geometry = await option.evaluate((element) => {
      const panel = element.closest('.aeris-cascade-select__panel');
      const column = element.parentElement;
      const arrow = element.querySelector('.aeris-cascade-select__option-chevron');
      const p = panel?.getBoundingClientRect(),
        c = column?.getBoundingClientRect(),
        a = arrow?.getBoundingClientRect(),
        r = element.getBoundingClientRect();
      return {
        columnGap: p && c ? p.right - c.right : Infinity,
        arrowGap: a ? r.right - a.right : Infinity,
      };
    });
    expect(geometry.columnGap).toBeLessThan(10);
    expect(geometry.arrowGap).toBeLessThan(15);
  }
});

test('catalog OrderList viewport reaches the right edge with controls hidden', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components');
    await page.getByRole('searchbox', { name: 'Filter components' }).fill('order');
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator('a[href="/components/order-list"]') });
    const viewport = card.locator('.aeris-order-list__viewport');
    await viewport.waitFor();
    const geometry = await viewport.evaluate((element) => {
      const body = element.parentElement?.getBoundingClientRect();
      const view = element.getBoundingClientRect();
      return {
        rightGap: body ? body.right - view.right : Infinity,
        widthGap: body ? body.width - view.width : Infinity,
      };
    });
    expect(geometry.rightGap).toBeLessThan(1);
    expect(geometry.widthGap).toBeLessThan(1);
  }
});

test('catalog layout refinements preserve complete step labels and bounded splitter motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  await page.getByRole('searchbox', { name: 'Filter components' }).fill('stepper');
  const stepper = page
    .locator('.catalog-preview-card')
    .filter({ has: page.locator('a[href="/components/stepper"]') });
  const labels = stepper.locator('.aeris-stepper__label');
  await expect(labels).toHaveText(['Details', 'Review']);
  expect(
    await labels.evaluateAll((elements) => elements.every((e) => e.scrollWidth <= e.clientWidth)),
  ).toBe(true);

  await page.getByRole('searchbox', { name: 'Filter components' }).fill('splitter');
  const card = page
    .locator('.catalog-preview-card')
    .filter({ has: page.locator('a[href="/components/splitter"]') });
  const panels = card.locator('.aeris-splitter__panel');
  await panels.first().waitFor();
  await card.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.mouse.move(0, 0);
  await expect(panels.first()).toHaveCSS('flex-grow', '40');
  await card.hover();
  await expect(panels.first()).toHaveCSS('flex-grow', '60');
  expect(await panels.first().textContent()).toContain('Files');
  expect(await panels.nth(1).textContent()).toContain('Preview');
  await page.mouse.move(0, 0);
  await expect(panels.first()).toHaveCSS('flex-grow', '40');
});

test('catalog surface previews show masks only on hover and keep tooltip arrows centered', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  for (const slug of ['dialog', 'drawer', 'confirm-dialog', 'dynamic-dialog', 'tooltip']) {
    await page.getByRole('searchbox', { name: 'Filter components' }).fill(slug.split('-')[0]);
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator(`a[href="/components/${slug}"]`) });
    await card.locator('app-catalog-overlay-preview').waitFor();
    await card.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.mouse.move(0, 0);
    const scene = card.locator('app-catalog-overlay-preview');
    await expect(scene).toHaveAttribute('data-active', 'false');
    if (slug !== 'tooltip') {
      const mask = card.locator('.aeris-dialog__overlay,.aeris-drawer__overlay');
      await expect(mask).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await card.hover();
      await expect(mask).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    } else {
      const arrow = card.locator('.aeris-tooltip__arrow');
      const panel = card.locator('.aeris-tooltip__panel');
      for (const active of [false, true]) {
        if (active) await card.hover();
        const a = await arrow.boundingBox(),
          p = await panel.boundingBox();
        expect(a && p && Math.abs(a.x + a.width / 2 - p.x - p.width / 2) < 1).toBe(true);
      }
    }
  }
});

test('catalog ColorPicker centers its closed field and displays the complete hex value', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components');
    await page.getByRole('searchbox', { name: 'Filter components' }).fill('color');
    const card = page.locator('.catalog-preview-card').filter({
      has: page.locator('a[href="/components/color-picker"]'),
    });
    const trigger = card.locator('.aeris-color-picker__trigger');
    await trigger.waitFor();
    await card.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' }),
    );
    await page.mouse.move(0, 0);
    await expect(card.locator('.aeris-color-picker__panel')).toHaveCount(0);
    const geometry = await trigger.evaluate((element) => {
      const field = element.getBoundingClientRect();
      const scene = element.closest('app-catalog-form-preview')?.getBoundingClientRect();
      const value = element.querySelector('.aeris-color-picker__value');
      return {
        centerOffset: scene
          ? Math.abs(field.x + field.width / 2 - scene.x - scene.width / 2)
          : Infinity,
        text: value?.textContent?.trim(),
        fits: value instanceof HTMLElement && value.scrollWidth <= value.clientWidth,
      };
    });
    expect(geometry.centerOffset).toBeLessThan(1);
    expect(geometry.text?.toLowerCase()).toBe('#6366f1');
    expect(geometry.fits).toBe(true);
  }
});

test('catalog refinements replay scroll entrances and meters smoothly on hover', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  for (const [slug, selector, name] of [
    ['animate-on-scroll', '.entrance-preview .aeris-animate-on-scroll', 'catalog-scroll-entrance'],
    ['meter-group', '.aeris-meter-group__segments', 'aeris-meter-group-reveal-inline'],
  ]) {
    await page.getByRole('searchbox', { name: 'Filter components' }).fill(slug.split('-')[0]);
    const card = page.locator('.catalog-preview-card').filter({
      has: page.locator(`a[href="/components/${slug}"]`),
    });
    const animated = card.locator(selector).first();
    await animated.waitFor({ state: 'attached' });
    for (let repeat = 0; repeat < 2; repeat++) {
      await page.locator('h1').hover();
      await card.hover();
      await expect
        .poll(() =>
          animated.evaluate(
            (element, name) =>
              element
                .getAnimations()
                .some(
                  (animation) =>
                    animation instanceof CSSAnimation &&
                    animation.animationName.includes(name) &&
                    animation.playState === 'running',
                ),
            name,
          ),
        )
        .toBe(true);
      if (slug === 'meter-group') await expect(animated).toHaveCSS('animation-duration', '0.9s');
    }
  }
});

test('catalog refinements show menu tiers and distinct grouped navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  for (const slug of ['tiered-menu', 'mega-menu']) {
    await page.getByRole('searchbox', { name: 'Filter components' }).fill(slug.split('-')[0]);
    const card = page.locator('.catalog-preview-card').filter({
      has: page.locator(`a[href="/components/${slug}"]`),
    });
    await card.locator('app-catalog-menu-preview').waitFor();
    await card.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' }),
    );
    await card.hover();
    if (slug === 'tiered-menu') {
      await expect(card.locator('.aeris-tiered-menu__submenu')).toBeVisible();
    } else {
      const groups = card.locator('.aeris-mega-menu__group');
      await expect(groups).toHaveCount(2);
      await expect
        .poll(() =>
          groups.evaluateAll((elements) => {
            const [first, second] = elements.map((element) => element.getBoundingClientRect());
            return first && second ? Math.abs(first.y - second.y) : Number.POSITIVE_INFINITY;
          }),
        )
        .toBeLessThan(1);
    }
  }
});

test('catalog refinements scroll ScrollPanel on hover and reset on exit', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  await page.getByRole('searchbox', { name: 'Filter components' }).fill('scroll');
  const card = page.locator('.catalog-preview-card').filter({
    has: page.locator('a[href="/components/scroll-panel"]'),
  });
  const viewport = card.locator('.aeris-scroll-panel__viewport');
  await viewport.waitFor();
  await card.hover();
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await page.locator('h1').hover();
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBe(0);
});

for (const palette of ['monochrome', 'earth', 'coastal', 'orchid']) {
  for (const mode of ['light', 'dark']) {
    test(`${palette} ${mode} skeleton stays visible and accepts custom colors`, async ({
      page,
    }) => {
      await page.addInitScript(
        ({ palette, mode }) => {
          localStorage.setItem('aeris-docs-palette', palette);
          localStorage.setItem('aeris-ui-theme-mode', mode);
        },
        { palette, mode },
      );
      await page.goto('/components/skeleton');
      await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
      const skeleton = page.locator('aeris-skeleton').first();
      await expect(skeleton).toBeVisible();
      const contrast = await skeleton.evaluate((element) => {
        const style = getComputedStyle(element);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context unavailable');
        const luminance = (color: string) => {
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map((value) => {
            const channel = value / 255;
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
          });
          return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        };
        const base = luminance(style.backgroundColor);
        const surface = luminance(style.getPropertyValue('--aeris-surface-2').trim());
        return (Math.max(base, surface) + 0.05) / (Math.min(base, surface) + 0.05);
      });
      expect(contrast, `${palette} ${mode} skeleton contrast`).toBeGreaterThan(1.3);
      await skeleton.evaluate((element) =>
        (element as HTMLElement).style.setProperty('--aeris-skeleton-background', '#ff00ff'),
      );
      await expect(skeleton).toHaveCSS('background-color', 'rgb(255, 0, 255)');
    });
  }
}

test('catalog rating preview keeps the component colors on a distinct surface', async ({
  page,
}) => {
  for (const mode of ['light', 'dark']) {
    await page.addInitScript((themeMode) => {
      localStorage.setItem('aeris-ui-theme-mode', themeMode);
    }, mode);
    await page.goto('/components');
    await page.getByRole('searchbox', { name: 'Filter components' }).fill('Rating');
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator('a[href="/components/rating"]') });
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('aeris-rating')).toBeVisible();
    const colors = await card.evaluate((element) => {
      const scene = element.querySelector('.catalog-preview-scene');
      const stars = element.querySelector('.aeris-rating__stars');
      if (!scene || !stars) throw new Error('Rating preview is missing');
      return {
        background: getComputedStyle(scene).backgroundColor,
        empty: getComputedStyle(stars).color,
        customEmpty: getComputedStyle(stars).getPropertyValue('--aeris-rating-empty').trim(),
      };
    });
    expect(colors.empty).not.toBe(colors.background);
    expect(colors.customEmpty).toBe('');
    await expect(card.getByRole('slider', { includeHidden: true })).toHaveAttribute(
      'aria-valuenow',
      '3',
    );
    for (const active of [false, true]) {
      if (active) {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await card.hover();
      }
      await expect
        .poll(() =>
          card.evaluate((element) => {
            const stars = element.querySelector('.aeris-rating__stars');
            const fill = element.querySelector('.aeris-rating__layer--active');
            if (!stars || !fill) return 1;
            return fill.getBoundingClientRect().width / stars.getBoundingClientRect().width;
          }),
        )
        .toBeLessThan(0.9);
    }
  }
});

test('catalog static overlay previews do not flash and entrances use the correct direction', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  const search = page.getByRole('searchbox', { name: 'Filter components' });
  for (const slug of [
    'menu',
    'context-menu',
    'tooltip',
    'dialog',
    'confirm-popup',
    'drawer',
    'toast',
    'scroll-top',
    'chart',
  ]) {
    await search.fill(slug.split('-')[0]);
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator(`a[href="/components/${slug}"]`) });
    await card.hover();
    const selector =
      slug === 'drawer'
        ? '.aeris-drawer__panel'
        : slug === 'toast'
          ? '.aeris-toast__message'
          : '.aeris-menu__panel,.aeris-context-menu__panel,.aeris-tooltip__panel,.aeris-dialog__panel,.aeris-confirm-popup__panel';
    if (slug === 'drawer' || slug === 'toast') {
      await expect
        .poll(() =>
          card.locator(selector).evaluate((element) => getComputedStyle(element).animationName),
        )
        .toBe(slug === 'drawer' ? 'catalog-drawer-enter' : 'catalog-toast-enter');
      await expect
        .poll(() =>
          card
            .locator(selector)
            .evaluate(
              (element) => element.getAnimations()[0]?.effect?.getKeyframes()[0]?.['translate'],
            ),
        )
        .toMatch(slug === 'drawer' ? /^100%(?: 0px)?$/ : /^0px 100%$/);
    } else if (slug === 'scroll-top') {
      await expect(card.locator('.aeris-scroll-top')).toBeVisible();
      await expect(card.locator('.scroll-scene')).toHaveText('');
    } else if (slug === 'chart') {
      await expect(card.locator('canvas')).toBeVisible();
      const box = await card.locator('canvas').boundingBox();
      expect(box?.height).toBeGreaterThan(140);
    } else {
      await expect(card.locator(selector).first()).toBeVisible();
      expect(
        await card
          .locator(selector)
          .first()
          .evaluate((element) => getComputedStyle(element).animationName),
      ).toBe('none');
      if (slug === 'confirm-popup') await expect(card.locator('.anchor button')).toHaveCount(0);
    }
    await search.hover();
  }
});

test('catalog tree select shows an expanded multi-level tree', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  await page.getByRole('searchbox', { name: 'Filter components' }).fill('TreeSelect');
  const card = page
    .locator('.catalog-preview-card')
    .filter({ has: page.locator('a[href="/components/tree-select"]') });
  await card.hover();
  await expect(card.locator('.aeris-tree-select__panel')).toBeVisible();
  await expect(card.locator('[aria-level="1"]')).toHaveCount(1);
  await expect(card.locator('[aria-level="2"]')).toHaveCount(2);
  await expect(card.locator('[aria-level="3"]')).toHaveCount(2);
});

test('mobile multiselect preview dropdown fits the card at narrow widths', async ({
  createContext,
  baseURL,
}) => {
  for (const width of [320, 390]) {
    const context = await createContext({
      baseURL,
      viewport: { width, height: 844 },
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'no-preference',
    });
    try {
      const page = await context.newPage();
      await page.goto('/components');
      await page.getByRole('searchbox', { name: 'Filter components' }).fill('MultiSelect');
      await expect(page.locator('.catalog-preview-card')).toHaveCount(1);
      const card = page.locator('.catalog-preview-card[data-preview-kind="multi-select"]');
      await card.scrollIntoViewIfNeeded();
      const panel = card.locator('.aeris-multi-select__panel');
      await expect(panel).toBeVisible();
      const scene = await card.locator('.catalog-preview-scene').boundingBox();
      const box = await panel.boundingBox();
      expect(scene).not.toBeNull();
      expect(box).not.toBeNull();
      if (scene && box) {
        expect(box.x).toBeGreaterThanOrEqual(scene.x);
        expect(box.x + box.width).toBeLessThanOrEqual(scene.x + scene.width + 1);
        expect(box.y + box.height).toBeLessThanOrEqual(scene.y + scene.height + 1);
      }
    } finally {
      await context.close();
    }
  }
});

test('mobile catalog previews wait for the whole card and replay only after leaving the viewport', async ({
  createContext,
  baseURL,
}) => {
  const context = await createContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
  });
  try {
    const page = await context.newPage();
    await page.goto('/components');
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator('a[href="/components/rating"]') });
    const top = await card.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
    const partiallyReveal = () =>
      page.evaluate((top) => window.scrollTo({ top: top - 700, behavior: 'instant' }), top);
    const fullyReveal = () =>
      page.evaluate((top) => window.scrollTo({ top: top - 100, behavior: 'instant' }), top);
    await partiallyReveal();
    const preview = card.locator('app-catalog-preview');
    await expect(preview).toHaveAttribute('data-active', 'false');
    await expect(card.locator('[role="slider"]')).toHaveAttribute('aria-valuenow', '3');
    await fullyReveal();
    await expect(preview).toHaveAttribute('data-mobile-playback', 'true');
    await expect(card.locator('[role="slider"]')).toHaveAttribute('aria-valuenow', '4');
    await partiallyReveal();
    await expect(preview).toHaveAttribute('data-active', 'true');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(preview).toHaveAttribute('data-active', 'false');
    await page.evaluate((top) => window.scrollTo({ top: top - 40, behavior: 'instant' }), top);
    await expect(preview).toHaveAttribute('data-active', 'false');
    await fullyReveal();
    await expect(preview).toHaveAttribute('data-active', 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(preview).toHaveAttribute('data-active', 'false');
    await expect(card.locator('[role="slider"]')).toHaveAttribute('aria-valuenow', '3');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(preview).toHaveAttribute('data-active', 'true');
    await page.getByRole('searchbox', { name: 'Filter components' }).fill('Skeleton');
    const skeleton = page.locator('.catalog-preview-card aeris-skeleton').first();
    await expect(page.locator('app-catalog-preview')).toHaveAttribute(
      'data-mobile-playback',
      'true',
    );
    await expect
      .poll(() =>
        skeleton.evaluate(
          (element) => getComputedStyle(element, '::before').animationIterationCount,
        ),
      )
      .toBe('1');
    await expect(skeleton).toHaveCSS('animation-iteration-count', '1');
    // Await real animation completion rather than a wall-clock polling deadline.
    // Parallel browser work can delay rendering without changing one-shot playback.
    await skeleton.evaluate(async (element) => {
      await Promise.all(
        element.getAnimations({ subtree: true }).map((animation) => animation.finished),
      );
    });
    expect(
      await skeleton.evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === 'running').length,
      ),
    ).toBe(0);
    await page.getByRole('searchbox', { name: 'Filter components' }).fill('Rating');
    await card.locator('a').tap();
    await expect(page).toHaveURL(/\/components\/rating$/);
  } finally {
    await context.close();
  }
});

test('catalog previews navigate directly by touch while viewport previews play', async ({
  createContext,
  baseURL,
}) => {
  const context = await createContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
  });
  try {
    const page = await context.newPage();
    await page.goto('/components');
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator('a[href="/components/accordion"]') });
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('aeris-accordion')).toBeVisible();
    await expect(card.locator('[aria-expanded="true"]')).toHaveCount(1);
    const box = await card.locator('.catalog-preview-scene').boundingBox();
    expect(box).not.toBeNull();
    if (box) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page).toHaveURL(/\/components\/accordion$/);
  } finally {
    await context.close();
  }
});

test('catalog previews navigate as cards and animate only on hover or focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  const accordion = page
    .locator('.catalog-preview-card')
    .filter({ has: page.locator('a[href="/components/accordion"]') });
  await accordion.scrollIntoViewIfNeeded();
  await expect(accordion.locator('aeris-accordion')).toBeVisible();
  await expect(accordion.locator('[aria-expanded="true"]')).toHaveCount(0);
  await accordion.hover();
  await expect(accordion.locator('.aeris-card')).toHaveAttribute('data-variant', 'elevated');
  await expect
    .poll(() =>
      accordion.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a),
    )
    .toBeCloseTo(1.015, 3);
  const overlapsNeighbor = await accordion.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return Array.from(element.parentElement?.children ?? []).some((neighbor) => {
      if (neighbor === element) return false;
      const other = neighbor.getBoundingClientRect();
      return (
        bounds.left < other.right &&
        bounds.right > other.left &&
        bounds.top < other.bottom &&
        bounds.bottom > other.top
      );
    });
  });
  expect(overlapsNeighbor).toBe(false);
  await expect(accordion.locator('[aria-expanded="true"]')).toHaveCount(1);
  await page.locator('h1').hover();
  await expect(accordion.locator('.aeris-card')).toHaveAttribute('data-variant', 'filled');
  await expect(accordion.locator('[aria-expanded="true"]')).toHaveCount(0);
  await accordion.locator('a').focus();
  await expect(accordion.locator('[aria-expanded="true"]')).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('input[type="search"]').focus();
  await accordion.hover();
  await expect(accordion.locator('[aria-expanded="true"]')).toHaveCount(0);
  await expect
    .poll(() => accordion.evaluate((element) => getComputedStyle(element).transform))
    .toBe('none');
  const previewBox = await accordion.locator('.catalog-preview-scene').boundingBox();
  expect(previewBox).not.toBeNull();
  if (previewBox) {
    await page.mouse.click(
      previewBox.x + previewBox.width / 2,
      previewBox.y + previewBox.height / 2,
    );
  }
  await expect(page).toHaveURL(/\/components\/accordion$/);
});

test('catalog overlay previews stay in their cards without taking page focus or scroll', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  const search = page.getByRole('searchbox', { name: 'Filter components' });
  await search.focus();
  for (const slug of [
    'dialog',
    'drawer',
    'dynamic-dialog',
    'confirm-dialog',
    'confirm-popup',
    'popover',
    'tooltip',
    'context-menu',
    'toast',
  ]) {
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator(`a[href="/components/${slug}"]`) });
    await card.scrollIntoViewIfNeeded();
    const panel = card
      .locator(
        '.aeris-dialog__panel,.aeris-drawer__panel,.aeris-confirm-popup__panel,.aeris-popover__panel,.aeris-tooltip__panel,.aeris-context-menu__panel,.aeris-toast__message',
      )
      .first();
    await expect(panel).toBeVisible();
    await card.hover();
    await expect(panel).toBeVisible();
    if (slug === 'tooltip') {
      await expect
        .poll(async () => {
          const tooltip = await panel.boundingBox();
          const button = await card.locator('button[aerisTooltip]').boundingBox();
          return !!tooltip && !!button && tooltip.y + tooltip.height <= button.y - 4;
        })
        .toBe(true);
    }
    if (slug === 'drawer') {
      await expect(panel.locator('.drawer-items button')).toHaveCount(4);
    }
    if (slug === 'popover') {
      const scene = await card.locator('.catalog-preview-scene').boundingBox();
      const box = await panel.boundingBox();
      expect(scene).not.toBeNull();
      expect(box).not.toBeNull();
      if (scene && box) {
        const trigger = await card.locator('button').first().boundingBox();
        expect(trigger).not.toBeNull();
        if (trigger) expect(box.y + box.height).toBeLessThan(trigger.y);
        expect(Math.abs(box.x + box.width / 2 - scene.x - scene.width / 2)).toBeLessThan(1);
      }
    }
    await expect(search).toBeFocused();
    await expect
      .poll(
        () =>
          card.evaluate((element) => {
            const scene = element.querySelector('.catalog-preview-scene');
            const panel = element.querySelector(
              '.aeris-dialog__panel,.aeris-drawer__panel,.aeris-confirm-popup__panel,.aeris-popover__panel,.aeris-tooltip__panel,.aeris-context-menu__panel,.aeris-toast__message',
            );
            if (!scene || !panel) return false;
            const bounds = scene.getBoundingClientRect(),
              box = panel.getBoundingClientRect();
            return (
              box.left >= bounds.left - 1 &&
              box.right <= bounds.right + 1 &&
              box.top >= bounds.top - 1 &&
              box.bottom <= bounds.bottom + 1
            );
          }),
        { message: `${slug} stays inside its preview` },
      )
      .toBe(true);
  }
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  await search.fill('InputText');
  await expect(page.locator('.catalog-preview-card')).toHaveCount(1);
  await expect(
    page.locator('.aeris-dialog__panel,.aeris-context-menu__panel,.aeris-tooltip__panel'),
  ).toHaveCount(0);
});

for (const slug of ['skeleton', 'meter-group', 'progress-spinner']) {
  test(`${slug} catalog animation replays on hover and stops on exit`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/components');
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator(`a[href="/components/${slug}"]`) });
    await card.scrollIntoViewIfNeeded();
    const scene = card.locator('app-catalog-preview');
    await expect(scene).toBeVisible();
    await expect(
      card.locator('aeris-skeleton,aeris-meter-group,aeris-progress-spinner').first(),
    ).toBeAttached();
    for (let repeat = 0; repeat < 2; repeat++) {
      await expect
        .poll(() => scene.evaluate((e) => e.getAnimations({ subtree: true }).length))
        .toBe(0);
      // Observe the start before hovering: short animations may finish before a
      // cross-process getAnimations() sample arrives on a busy CI runner.
      await scene.evaluate((element) => {
        element.removeAttribute('data-test-motion-started');
        const started = () => {
          element.setAttribute('data-test-motion-started', 'true');
          element.removeEventListener('animationstart', started);
          element.removeEventListener('transitionrun', started);
        };
        element.addEventListener('animationstart', started);
        element.addEventListener('transitionrun', started);
      });
      await card.hover();
      await expect(scene).toHaveAttribute('data-active', 'true');
      await expect(scene).toHaveAttribute('data-test-motion-started', 'true');
      await page.mouse.move(0, 0);
      await expect(scene).toHaveAttribute('data-active', 'false');
      await expect
        .poll(() => scene.evaluate((e) => e.getAnimations({ subtree: true }).length))
        .toBe(0);
    }
  });
}

test('catalog pickers, blockers and action menus open only while their card is active', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/components');
  for (const [slug, selector] of [
    ['date-picker', '.aeris-date-picker__panel'],
    ['color-picker', '.aeris-color-picker__panel'],
    ['select', '.aeris-select__panel'],
    ['multi-select', '.aeris-multi-select__panel'],
    ['auto-complete', '.aeris-auto-complete__panel'],
    ['cascade-select', '.aeris-cascade-select__panel'],
    ['tree-select', '.aeris-tree-select__panel'],
    ['split-button', '.aeris-split-button__menu'],
    ['speed-dial', 'aeris-speed-dial[data-open]'],
    ['block-ui', '.aeris-block-ui__overlay'],
  ]) {
    const card = page
      .locator('.catalog-preview-card')
      .filter({ has: page.locator(`a[href="/components/${slug}"]`) });
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('app-catalog-preview')).toBeVisible();
    await expect(card.locator(selector)).toHaveCount(0);
    const field = card.locator('[role="combobox"]').first();
    const fieldBefore =
      slug !== 'date-picker' && (await field.count()) ? await field.boundingBox() : null;
    const cardBefore = await card.boundingBox();
    await card.hover();
    const panel = card.locator(selector);
    await expect(panel).toBeVisible();
    if (fieldBefore && cardBefore) {
      const fieldAfter = await field.boundingBox();
      const cardAfter = await card.boundingBox();
      expect(fieldAfter).not.toBeNull();
      expect(cardAfter).not.toBeNull();
      if (fieldAfter && cardAfter) {
        expect(Math.abs(fieldAfter.y - cardAfter.y - (fieldBefore.y - cardBefore.y))).toBeLessThan(
          2,
        );
        const panelBounds = await panel.boundingBox();
        expect(panelBounds).not.toBeNull();
        if (panelBounds)
          expect(panelBounds.y).toBeGreaterThanOrEqual(fieldAfter.y + fieldAfter.height + 4);
      }
    }
    await expect
      .poll(
        async () => {
          const bounds = await card.locator('.catalog-preview-scene').boundingBox();
          const box = await panel.boundingBox();
          return (
            !!bounds &&
            !!box &&
            box.x >= bounds.x - 1 &&
            box.y >= bounds.y - 1 &&
            box.x + box.width <= bounds.x + bounds.width + 1 &&
            box.y + box.height <= bounds.y + bounds.height + 1
          );
        },
        { message: `${slug} panel fits the card` },
      )
      .toBe(true);
    await page.mouse.move(0, 0);
    await expect(card.locator(selector)).toHaveCount(0);
  }
});

for (const width of [390, 768, 1440]) {
  test(`catalog previews fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/components');
    test.setTimeout(120_000);
    await expect(page.locator('.catalog-preview-card')).toHaveCount(COMPONENT_CATALOG.length);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
    for (const card of await page.locator('.catalog-preview-card').all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card.locator('app-catalog-preview')).toBeVisible();
      await expect(
        card
          .locator(
            'app-catalog-preview [class*="aeris-"], app-catalog-preview [aerisAnimateOnScroll]',
          )
          .first(),
      ).toBeAttached();
      await expect
        .poll(
          () =>
            card
              .locator('.catalog-preview-scene')
              .evaluate((element) => element.scrollWidth - element.clientWidth),
          { message: (await card.locator('a').textContent()) ?? 'Preview fits its card' },
        )
        .toBeLessThanOrEqual(1);
    }
  });
}

for (const width of [390, 768, 1440]) {
  test(`landing showcase fits a ${width}px viewport and names its navigation`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('.home-live-showcase').scrollIntoViewIfNeeded();
    const gallery = page.locator('app-aeris-showcase-gallery');
    await expect(gallery.locator('.components-preview')).toBeVisible();
    for (const name of ['Components', 'Dashboard', 'Chat', 'CRM', 'Mail', 'Finances']) {
      const tab = gallery.getByRole('tab', { name, exact: true });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      const toolbar = gallery.locator('.product-toolbar').first();
      if (await toolbar.count()) {
        const title = toolbar.locator('[aerisToolbarStart] strong');
        await expect(title).toBeVisible();
        expect(
          await title.evaluate((element) => element.getBoundingClientRect().height),
        ).toBeLessThan(60);
        const contentOverflow = await toolbar
          .locator('.aeris-toolbar__content')
          .evaluate((element) => element.scrollWidth - element.clientWidth);
        expect(contentOverflow).toBeLessThanOrEqual(1);
      }
      await expect
        .poll(() =>
          gallery.evaluate((element) => {
            const panel = element.querySelector<HTMLElement>('[role="tabpanel"]');
            return Math.max(
              document.documentElement.scrollWidth - document.documentElement.clientWidth,
              element.scrollWidth - element.clientWidth,
              panel ? panel.scrollWidth - panel.clientWidth : 0,
            );
          }),
        )
        .toBeLessThanOrEqual(1);
    }
  });
}

test('landing showcase exports real data and allows scrolling back into the page', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.home-live-showcase').scrollIntoViewIfNeeded();
  const gallery = page.locator('app-aeris-showcase-gallery');
  await gallery.getByRole('tab', { name: 'Dashboard', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await gallery.getByRole('button', { name: 'Export', exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('workspace-tasks.csv');
  await gallery.getByRole('tab', { name: 'CRM', exact: true }).click();
  await gallery.getByRole('button', { name: 'Add lead', exact: true }).click();
  await gallery.locator('[name="company"]').fill('Acme Workshop');
  await gallery.locator('[name="contact"]').fill('Jamie Smith');
  await gallery.getByRole('button', { name: 'Save lead', exact: true }).click();
  await expect(gallery.locator('.crm-preview__contact')).toContainText('Jamie Smith');
  const panel = gallery.getByRole('tabpanel').first();
  await panel.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const pageTop = await page.evaluate(() => window.scrollY);
  await panel.hover();
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(pageTop);
});

test('documentation search loads on demand and focuses its search field', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Search documentation', exact: true });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('searchbox');
  await expect(input).toBeFocused();
  await input.fill('select');
  await expect(dialog.getByRole('link', { name: /^Select / })).toBeVisible();
  await input.press('Escape');
  await expect(dialog).not.toBeVisible();
});

const COMPONENT_ROUTES = [
  'button',
  'button-group',
  'speed-dial',
  'split-button',
  'auto-complete',
  'cascade-select',
  'input-text',
  'input-number',
  'input-mask',
  'key-filter',
  'input-otp',
  'checkbox',
  'color-picker',
  'editor',
  'form-field',
  'icon-field',
  'input-group',
  'radio-button',
  'rating',
  'select',
  'textarea',
  'toggle-switch',
  'tree-select',
  'date-picker',
  'slider',
  'multi-select',
  'password',
  'accordion',
  'card',
  'divider',
  'panel',
  'scroll-panel',
  'splitter',
  'stepper',
  'tabs',
  'toolbar',
  'breadcrumb',
  'context-menu',
  'menu',
  'mega-menu',
  'menubar',
  'tiered-menu',
  'confirm-dialog',
  'confirm-popup',
  'dialog',
  'drawer',
  'dynamic-dialog',
  'popover',
  'tooltip',
  'file-upload',
  'carousel',
  'galleria',
  'compare',
  'chart',
  'progress-bar',
  'toast',
  'message',
  'table',
  'pick-list',
  'order-list',
  'organization-chart',
  'timeline',
  'tree',
  'tree-table',
  'paginator',
  'scroll-top',
  'animate-on-scroll',
  'auto-focus',
  'class-names',
  'filter-service',
  'focus-trap',
  'glass',
  'style-class',
  'chip',
  'fluid',
  'inplace',
  'meter-group',
  'progress-spinner',
  'skeleton',
  'block-ui',
  'avatar',
  'badge',
] as const;

for (const route of COMPONENT_ROUTES) {
  test(`${route} page renders without browser errors`, async ({ page }) => {
    const response = await page.goto(`/components/${route}`);
    expect(response?.ok()).toBe(true);
    await expect(page.locator('h1').first()).toBeVisible();
  });
}

test('IconField search clear uses the Aeris button hover and clears the value', async ({
  page,
}) => {
  await page.goto('/components/icon-field');
  const search = page.locator('#site-search');
  await search.fill('button');

  const clear = page.locator('#icon-field-basic').getByRole('button', { name: 'Clear value' });
  await expect(clear).toBeVisible();
  await expect(clear).toHaveCSS('width', '24px');
  await expect(clear).toHaveCSS('height', '24px');
  await expect(clear).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await clear.hover();
  await expect(clear).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const iconMask = await clear.locator('span').evaluate((element) => {
    const style = getComputedStyle(element);
    return style.maskImage || style.webkitMaskImage;
  });
  expect(iconMask).toContain('M6');
  await clear.click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(clear).toHaveCount(0);
});
