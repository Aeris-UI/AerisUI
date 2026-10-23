import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const chartPage = 'http://127.0.0.1:4301/components/chart';

test('overlapping area fills leave the other series stroke untinted', async ({ page }) => {
  await page.goto(chartPage);
  const chart = page.locator('#chart-comparison [preview] aeris-chart');
  await chart.scrollIntoViewIfNeeded();
  const canvas = chart.locator('canvas');
  // Renewals stays below subscriptions, inside its blue area. Count full orange stroke pixels
  // in the upper plot, away from the legend, rather than relying on a screenshot baseline.
  await expect
    .poll(() =>
      canvas.evaluate((element: HTMLCanvasElement) => {
        const context = element.getContext('2d');
        if (!context) return 0;
        const width = element.width;
        const height = Math.floor(element.height * 0.6);
        if (!width || !height) return 0;
        const pixels = context.getImageData(0, 0, width, height).data;
        let orange = 0;
        for (let index = 0; index < pixels.length; index += 4) {
          if (
            Math.abs(pixels[index] - 217) <= 1 &&
            Math.abs(pixels[index + 1] - 119) <= 1 &&
            Math.abs(pixels[index + 2] - 6) <= 1 &&
            pixels[index + 3] === 255
          )
            orange++;
        }
        return orange;
      }),
    )
    .toBeGreaterThan(20);
});

test('chart recipes render real canvas data, compact geometry and associated text alternatives', async ({
  page,
}) => {
  await page.goto(chartPage);
  for (const id of [
    'chart-basic',
    'chart-compact',
    'chart-mixed',
    'chart-stacked',
    'chart-area',
    'chart-comparison',
  ]) {
    const chart = page.locator(`#${id} [preview] aeris-chart`);
    await chart.scrollIntoViewIfNeeded();
    const canvas = chart.locator('canvas');
    await expect(canvas).toBeVisible();
    const resolution = await canvas.evaluate((element: HTMLCanvasElement) => ({
      actual: element.width / element.getBoundingClientRect().width,
      expected: Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    }));
    expect(resolution.actual).toBeCloseTo(resolution.expected, 1);
    await expect
      .poll(() =>
        canvas.evaluate((element: HTMLCanvasElement) => {
          const pixels = element
            .getContext('2d')
            ?.getImageData(0, 0, element.width, element.height).data;
          return pixels?.some((value, index) => index % 4 === 3 && value > 0) ?? false;
        }),
      )
      .toBe(true);
    const summary = chart.locator('.aeris-chart__summary');
    expect((await canvas.getAttribute('aria-describedby'))?.split(' ')).toContain(
      await summary.getAttribute('id'),
    );
    const bounds = await chart.boundingBox();
    if (!bounds) throw new Error('Expected visible chart geometry');
    expect(bounds.width).toBeLessThanOrEqual(page.viewportSize()?.width ?? 1280);
    if (id === 'chart-compact') expect(bounds.height).toBeLessThan(120);
  }
  await expect(page.locator('#chart-mixed [preview]')).toContainText('$16,300');
  const results = await new AxeBuilder({ page })
    .include('#chart-mixed [preview]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('area fills are optional and radial configurations render without overflow', async ({
  page,
}) => {
  await page.goto(chartPage);
  const area = page.locator('#chart-area [preview]');
  await area.scrollIntoViewIfNeeded();
  const canvas = area.locator('canvas');
  const filled = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
  await area.getByRole('button', { name: 'Hide area fill' }).click();
  await expect(area.getByRole('button', { name: 'Show area fill' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect
    .poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()))
    .not.toBe(filled);
  await area.getByRole('button', { name: 'Show area fill' }).click();
  await expect(area.getByRole('button', { name: 'Hide area fill' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const radial = page.locator('#chart-radial [preview]');
  await radial.scrollIntoViewIfNeeded();
  await expect(radial.locator('canvas')).toHaveCount(3);
  const ring = radial.getByRole('region', { name: 'Progress ring', exact: true }).locator('canvas');
  const resolution = await ring.evaluate((canvas: HTMLCanvasElement) => ({
    actual: canvas.width / canvas.getBoundingClientRect().width,
    expected: Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
  }));
  expect(resolution.actual).toBeCloseTo(resolution.expected, 1);
  // The completed segment and remaining track meet at twelve o'clock without cap gaps.
  await expect
    .poll(() =>
      ring.evaluate((canvas: HTMLCanvasElement) => {
        const pixels = canvas
          .getContext('2d')
          ?.getImageData(0, 0, canvas.width, canvas.height).data;
        if (!pixels) return 0;
        const y = Math.round(canvas.height / 2 - Math.min(canvas.width, canvas.height) * 0.47);
        const left = Math.round(canvas.width / 2 - 2);
        const right = Math.round(canvas.width / 2 + 2);
        return Math.min(
          pixels[(y * canvas.width + left) * 4 + 3] ?? 0,
          pixels[(y * canvas.width + right) * 4 + 3] ?? 0,
        );
      }),
    )
    .toBeGreaterThan(20);
  const goals = radial.getByRole('region', { name: 'Concentric goal rings' }).locator('canvas');
  // A radial scan crosses three distinct bands, not one merged band.
  await expect
    .poll(() =>
      goals.evaluate((canvas: HTMLCanvasElement) => {
        const pixels = canvas
          .getContext('2d')
          ?.getImageData(0, 0, canvas.width, canvas.height).data;
        if (!pixels) return 0;
        const y = Math.floor(canvas.height / 2);
        let bands = 0;
        let inside = false;
        for (let x = Math.ceil(canvas.width / 2); x < canvas.width; x++) {
          const filled = (pixels[(y * canvas.width + x) * 4 + 3] ?? 0) > 20;
          if (filled && !inside) bands++;
          inside = filled;
        }
        return bands;
      }),
    )
    .toBe(3);
  for (const chart of await radial.locator('aeris-chart').all()) {
    const bounds = await chart.boundingBox();
    if (!bounds) throw new Error('Expected visible radial chart');
    expect(bounds.width).toBeLessThanOrEqual(page.viewportSize()?.width ?? 1280);
    await expect(chart.locator('canvas')).toBeVisible();
  }
  await expect(radial.getByRole('region', { name: 'Concentric goal rings' })).toContainText(
    'Testing',
  );
  const results = await new AxeBuilder({ page })
    .include('#chart-radial [preview]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('comparison hover or touch draws a dotted guide and both values in the shared tooltip', async ({
  page,
  hasTouch,
}) => {
  await page.addInitScript(() => {
    const drawing = { labels: [] as string[], guides: 0 };
    (window as unknown as { chartDrawing: typeof drawing }).chartDrawing = drawing;
    const stroke = CanvasRenderingContext2D.prototype.stroke;
    CanvasRenderingContext2D.prototype.stroke = function (path?: Path2D) {
      if (this.getLineDash().join(',') === '3,4') drawing.guides++;
      return path === undefined ? stroke.call(this) : stroke.call(this, path);
    };
    const fillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (
      text: string,
      x: number,
      y: number,
      maxWidth?: number,
    ) {
      drawing.labels.push(text);
      if (drawing.labels.length > 100) drawing.labels.shift();
      return maxWidth === undefined
        ? fillText.call(this, text, x, y)
        : fillText.call(this, text, x, y, maxWidth);
    };
  });
  await page.goto(chartPage);
  const canvas = page.locator('#chart-comparison [preview] canvas');
  await canvas.scrollIntoViewIfNeeded();
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error('Expected visible comparison chart');
  await page.evaluate(() => {
    const drawing = (window as unknown as { chartDrawing: { labels: string[]; guides: number } })
      .chartDrawing;
    drawing.labels = [];
    drawing.guides = 0;
  });
  const position = { x: bounds.width * 0.55, y: bounds.height * 0.4 };
  if (hasTouch) await canvas.tap({ position });
  else await canvas.hover({ position });
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { chartDrawing: { guides: number } }).chartDrawing.guides,
      ),
    )
    .toBeGreaterThan(0);
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as { chartDrawing: { labels: string[] } }).chartDrawing.labels.join(
          '\n',
        ),
      ),
    )
    .toMatch(/New subscriptions: \d+/);
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as { chartDrawing: { labels: string[] } }).chartDrawing.labels.join(
          '\n',
        ),
      ),
    )
    .toMatch(/Renewals: \d+/);
});

test('dynamic data, hidden containers, resizing and loading composition remain usable', async ({
  page,
}) => {
  await page.goto(chartPage);
  const dynamic = page.locator('#chart-dynamic [preview]');
  await dynamic.getByRole('button', { name: 'Add week' }).click();
  await expect(dynamic.locator('.aeris-chart__summary')).toContainText('Week 5');
  await dynamic.getByRole('button', { name: 'Add week' }).click();
  await expect(dynamic.locator('.aeris-chart__summary')).toContainText('Week 6');
  const chart = dynamic.locator('aeris-chart');
  await chart.evaluate((element: HTMLElement) => {
    element.style.display = 'none';
  });
  await expect(chart).toBeHidden();
  await chart.evaluate((element: HTMLElement) => {
    element.style.display = '';
    element.style.maxWidth = '260px';
  });
  await expect(chart.locator('canvas')).toBeVisible();
  await expect
    .poll(() =>
      chart
        .locator('canvas')
        .evaluate((canvas: HTMLCanvasElement) => canvas.getBoundingClientRect().width),
    )
    .toBeLessThan(261);
  await expect
    .poll(() => chart.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.width))
    .toBeGreaterThan(0);
  const loading = page.locator('#chart-loading [preview]');
  await expect(loading.locator('aeris-skeleton')).toBeVisible();
  await loading.getByRole('button', { name: 'Show report', exact: true }).click();
  await expect(loading.locator('canvas')).toBeVisible();
  await expect(loading.getByRole('status')).toHaveText('Report loaded.');
  await loading.getByRole('button', { name: 'Show loading state', exact: true }).click();
  await expect(loading.locator('canvas')).toHaveCount(0);
  await expect(loading.locator('aeris-skeleton')).toBeVisible();
});
