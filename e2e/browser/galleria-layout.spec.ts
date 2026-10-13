import { expect, test } from './fixtures';

test('carousel touch gestures preserve taps, page scrolling, and the active pointer', async ({
  page,
}) => {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/components/carousel');
  const carousel = page.locator('#carousel-basic aeris-carousel');
  const viewport = carousel.locator('.aeris-carousel__viewport');
  const current = carousel.locator('.aeris-carousel__indicators [aria-current="page"]');
  await viewport.scrollIntoViewIfNeeded();
  await expect(current).toHaveCount(1);
  const initialPageLabel = (await current.getAttribute('aria-label')) ?? '';
  for (const type of ['pointerdown', 'pointerup'])
    await viewport.dispatchEvent(type, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 180,
      clientY: 100,
    });
  await expect(current).toHaveAttribute('aria-label', initialPageLabel);
  await viewport.dispatchEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 180,
    clientY: 100,
  });
  await viewport.dispatchEvent('pointermove', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 175,
    clientY: 180,
  });
  await viewport.dispatchEvent('pointerup', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 100,
    clientY: 180,
  });
  await expect(current).toHaveAttribute('aria-label', initialPageLabel);
  await viewport.dispatchEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 240,
    clientY: 100,
  });
  await viewport.dispatchEvent('pointerdown', {
    pointerId: 2,
    pointerType: 'touch',
    clientX: 180,
    clientY: 100,
  });
  await viewport.dispatchEvent('pointercancel', { pointerId: 2, pointerType: 'touch' });
  await viewport.dispatchEvent('pointermove', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 80,
    clientY: 100,
  });
  await viewport.dispatchEvent('pointerup', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 80,
    clientY: 100,
  });
  await expect(current).not.toHaveAttribute('aria-label', initialPageLabel);
  await expect
    .poll(() => carousel.evaluate((el) => el.scrollWidth <= el.clientWidth + 1))
    .toBe(true);
});

test('image taps are stable, zoomed drags pan, and thumbnail rails scroll without selecting', async ({
  page,
  browserName,
}) => {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/components/galleria');
  const gallery = page.locator('#galleria-toolbar aeris-galleria');
  const viewport = gallery.locator('.aeris-galleria__viewport');
  await viewport.scrollIntoViewIfNeeded();
  await expect(gallery.locator('.aeris-galleria__image')).toBeVisible();
  await viewport.dispatchEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 100,
    clientY: 100,
  });
  await expect(gallery.locator('.aeris-galleria__item')).not.toHaveAttribute(
    'data-dragging',
    'true',
  );
  await viewport.dispatchEvent('pointerup', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 100,
    clientY: 100,
  });
  const imageSrc = await gallery.locator('.aeris-galleria__image').getAttribute('src');
  for (let i = 0; i < 4; i++)
    await gallery.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(viewport).toHaveAttribute('data-zoomed', 'true');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await viewport.dispatchEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 100,
    clientY: 100,
  });
  await viewport.dispatchEvent('pointermove', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 160,
    clientY: 160,
  });
  await viewport.dispatchEvent('pointerup', {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 160,
    clientY: 160,
  });
  await expect(gallery.locator('.aeris-galleria__image')).toHaveAttribute('src', imageSrc ?? '');
  await expect
    .poll(() =>
      gallery.locator('.aeris-galleria__media').evaluate((el) => {
        const matrix = new DOMMatrix(getComputedStyle(el).transform);
        return Math.abs(matrix.m41) + Math.abs(matrix.m42);
      }),
    )
    .toBeGreaterThan(0);
  await gallery.getByRole('button', { name: 'Reset image', exact: true }).click();
  const rail = gallery.locator('.aeris-galleria__thumbnail-viewport');
  await rail.scrollIntoViewIfNeeded();
  await expect.poll(() => rail.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  if (browserName === 'chromium') {
    const box = await rail.boundingBox();
    if (!box) throw new Error('Thumbnail rail is not visible');
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: box.x + box.width * 0.8, y: box.y + box.height / 2 }],
    });
    for (let i = 1; i <= 8; i++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: box.x + box.width * (0.8 - i * 0.07), y: box.y + box.height / 2 }],
      });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await session.detach();
  } else
    await rail.evaluate((el) => {
      el.scrollLeft = 180;
    });
  await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await expect(gallery.locator('.aeris-galleria__image')).toHaveAttribute('src', imageSrc ?? '');
  await gallery.locator('.aeris-galleria__thumbnail').nth(8).click();
  await expect(gallery.locator('.aeris-galleria__thumbnail').nth(8)).toHaveAttribute(
    'aria-current',
    'true',
  );
});

test('thumbnail rails stay bounded and arrows follow native scrolling in every placement', async ({
  page,
}) => {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/components/galleria');
  const example = page.locator('#galleria-positions');
  const gallery = example.locator('aeris-galleria');
  for (const direction of ['ltr', 'rtl']) {
    await gallery.evaluate((el, dir) => el.setAttribute('dir', dir), direction);
    for (const position of ['Top', 'Bottom', 'Start', 'End']) {
      await example.getByRole('button', { name: position, exact: true }).click();
      const rail = gallery.locator('.aeris-galleria__thumbnail-viewport');
      const vertical = position === 'Start' || position === 'End';
      await expect
        .poll(() =>
          rail.evaluate(
            (el, vertical) =>
              vertical ? el.scrollHeight > el.clientHeight : el.scrollWidth > el.clientWidth,
            vertical,
          ),
        )
        .toBe(true);
      await expect
        .poll(() => gallery.evaluate((el) => el.getBoundingClientRect().height))
        .toBeLessThan(1000);
      await gallery.getByRole('button', { name: 'Next thumbnails', exact: true }).click();
      await expect
        .poll(() =>
          rail.evaluate(
            (el, vertical) => (vertical ? el.scrollTop : Math.abs(el.scrollLeft)),
            vertical,
          ),
        )
        .toBeGreaterThan(0);
      await gallery.getByRole('button', { name: 'Previous thumbnails', exact: true }).click();
      await expect
        .poll(() =>
          rail.evaluate(
            (el, vertical) => (vertical ? el.scrollTop : Math.abs(el.scrollLeft)),
            vertical,
          ),
        )
        .toBeLessThan(2);
    }
  }
});

test('toolbar fades track hidden controls on either side, including RTL', async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/components/galleria');
  const gallery = page.locator('#galleria-toolbar aeris-galleria');
  const frame = gallery.locator('.aeris-galleria__toolbar-frame');
  const toolbar = frame.getByRole('toolbar');
  for (const direction of ['ltr', 'rtl']) {
    await gallery.evaluate(
      (element, direction) => element.setAttribute('dir', direction),
      direction,
    );
    await toolbar.evaluate((element) => {
      element.scrollLeft = 0;
      element.dispatchEvent(new Event('scroll'));
    });
    const startFade = direction === 'ltr' ? 'right' : 'left';
    const endFade = direction === 'ltr' ? 'left' : 'right';
    await expect(frame).toHaveAttribute(`data-fade-${startFade}`, 'true');
    await expect(frame).not.toHaveAttribute(`data-fade-${endFade}`, 'true');
    await toolbar.evaluate((element, direction) => {
      element.scrollLeft =
        ((element.scrollWidth - element.clientWidth) / 2) * (direction === 'rtl' ? -1 : 1);
    }, direction);
    await expect(frame).toHaveAttribute('data-fade-left', 'true');
    await expect(frame).toHaveAttribute('data-fade-right', 'true');
    await toolbar.evaluate((element, direction) => {
      element.scrollLeft = direction === 'rtl' ? -10000 : 10000;
    }, direction);
    await expect(frame).not.toHaveAttribute(`data-fade-${startFade}`, 'true');
    await expect(frame).toHaveAttribute(`data-fade-${endFade}`, 'true');
  }
  await gallery.evaluate((element) => element.setAttribute('dir', 'ltr'));
  await page.setViewportSize({ width: 1800, height: 1000 });
  // The docs example caps its width; expand the component itself to test no overflow.
  await gallery.evaluate((element) => {
    (element as HTMLElement).style.inlineSize = '1000px';
    (element as HTMLElement).style.maxInlineSize = 'none';
  });
  await expect
    .poll(() => toolbar.evaluate((el) => el.scrollWidth <= el.clientWidth + 1))
    .toBe(true);
  await expect(frame).not.toHaveAttribute('data-fade-left', 'true');
  await expect(frame).not.toHaveAttribute('data-fade-right', 'true');
});

test('grid fullscreen shows complete photos without indicator navigation', async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/components/galleria');
    const gallery = page.locator('#galleria-grid aeris-galleria');
    await gallery.locator('.aeris-galleria__grid-item').first().click();
    const viewer = gallery.getByRole('dialog');
    await expect(viewer).toBeVisible();
    await expect(viewer.locator('.aeris-galleria__stage')).toHaveAttribute('data-fit', 'contain');
    const image = viewer.locator('.aeris-galleria__image');
    await expect(image).toHaveCSS('object-fit', 'contain');
    await expect
      .poll(() =>
        image.evaluate((element) => {
          const image = element as HTMLImageElement;
          return image.complete && image.naturalWidth > 0;
        }),
      )
      .toBe(true);
    await expect
      .poll(() =>
        viewer
          .locator('.aeris-galleria__media')
          .evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).isIdentity),
      )
      .toBe(true);
    await expect(viewer.locator('.aeris-galleria__indicators')).toHaveCount(0);
    await viewer.getByRole('button', { name: 'Exit fullscreen' }).click();
    await expect(gallery.locator('.aeris-galleria__grid')).toBeVisible();
  }
});
