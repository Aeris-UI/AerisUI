import AxeBuilder from '@axe-core/playwright';
import { type Locator } from '@playwright/test';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

async function bounds(locator: Locator) {
  return locator.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width };
  });
}

for (const component of ['table', 'tree-table']) {
  test(`${component} measures sticky header and filter offsets`, async ({ page }) => {
    await page.setViewportSize({ width: 1160, height: 900 });
    await page.goto(`/components/${component}`);
    const example = page.locator(`#${component}-sticky-headers`);
    const viewport = example.locator('[data-sticky-header]');
    const header = viewport.locator('thead tr').first().locator('th').first();
    const filter = viewport.locator('thead tr').nth(1).locator('th').first();
    await viewport.scrollIntoViewIfNeeded();
    expect((await bounds(viewport.locator('tbody tr').first())).top).toBeGreaterThanOrEqual(
      (await bounds(filter)).bottom - 1,
    );
    await viewport.evaluate((element) => {
      element.scrollTop = 200;
    });
    await expect
      .poll(async () => Math.abs((await bounds(header)).top - (await bounds(viewport)).top))
      .toBeLessThan(2);
    await expect
      .poll(async () => Math.abs((await bounds(filter)).top - (await bounds(header)).bottom))
      .toBeLessThan(2);
    await header.evaluate((element) => {
      element.style.height = '90px';
    });
    await expect
      .poll(async () => (await bounds(header)).bottom - (await bounds(header)).top)
      .toBeGreaterThan(85);
    await expect
      .poll(async () => Math.abs((await bounds(filter)).top - (await bounds(header)).bottom))
      .toBeLessThan(2);
    await example.getByRole('button', { name: 'Sticky headers: on', exact: true }).click();
    await expect(viewport).toHaveAttribute('data-sticky-header', 'false');
    expect((await bounds(header)).top).toBeLessThan((await bounds(viewport)).top - 30);
    await example.getByRole('button', { name: 'Sticky headers: off', exact: true }).click();
    await expect
      .poll(async () => Math.abs((await bounds(header)).top - (await bounds(viewport)).top))
      .toBeLessThan(2);
    expect(
      (await new AxeBuilder({ page }).include(`#${component}-sticky-headers`).analyze()).violations,
    ).toEqual([]);
    await viewport.evaluate((element) => {
      element.style.maxHeight = '100px';
    });
    await expect(viewport).toHaveAttribute('data-pin-header-disabled', '');
    await expect
      .poll(async () => (await bounds(header)).top - (await bounds(viewport)).top)
      .toBeLessThan(-30);
  });

  test(`${component} combines row and column pins with editing, resizing and RTL`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1160, height: 900 });
    await page.goto(`/components/${component}`);
    const example = page.locator(`#${component}-combined-pinning`);
    const viewport = example.locator('[data-sticky-header]');
    const row = viewport.locator('tr[data-row-key="pin-3"]');
    const name = row.locator('td[data-field="name"]');
    const status = row.locator('td[data-field="status"]');
    const bottom = viewport.locator('tr[data-row-key="pin-18"] td[data-field="name"]');
    const filter = viewport.locator('thead tr').nth(1).locator('th').first();
    const nameHeader = viewport.locator('thead tr').first().locator('th[data-field="name"]');
    const unpinnedHeader = viewport.locator('thead tr').first().locator('th[data-field="details"]');
    await viewport.scrollIntoViewIfNeeded();
    expect(await viewport.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
      true,
    );
    await expect(viewport).not.toHaveAttribute('data-pin-block-disabled');
    await expect(viewport).not.toHaveAttribute('data-pin-inline-disabled');
    await viewport.evaluate((element) => {
      element.scrollTop = 220;
      element.scrollLeft = 260;
    });
    expect(
      await nameHeader.evaluate((element) => Number(getComputedStyle(element).zIndex)),
    ).toBeGreaterThan(
      await unpinnedHeader.evaluate((element) => Number(getComputedStyle(element).zIndex)),
    );
    await expect
      .poll(async () => Math.abs((await bounds(name)).left - (await bounds(viewport)).left))
      .toBeLessThan(2);
    await expect
      .poll(async () => Math.abs((await bounds(name)).top - (await bounds(filter)).bottom))
      .toBeLessThan(2);
    await expect
      .poll(async () =>
        Math.abs(
          (await bounds(status)).right -
            (await viewport.evaluate(
              (element) => element.getBoundingClientRect().left + element.clientWidth,
            )),
        ),
      )
      .toBeLessThan(2);
    await expect
      .poll(async () =>
        Math.abs(
          (await bounds(bottom)).bottom -
            (await viewport.evaluate(
              (element) => element.getBoundingClientRect().top + element.clientHeight,
            )),
        ),
      )
      .toBeLessThan(2);
    expect(await name.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
      'rgba(0, 0, 0, 0)',
    );
    expect(
      await name.evaluate((element) => {
        const context = document.createElement('canvas').getContext('2d');
        if (!context) return 0;
        context.fillStyle = getComputedStyle(element).backgroundColor;
        context.fillRect(0, 0, 1, 1);
        return context.getImageData(0, 0, 1, 1).data[3];
      }),
    ).toBe(255);
    await name.dblclick();
    const editor = example.getByRole('textbox', { name: 'Edit Name', exact: true });
    await expect(editor).toBeFocused();
    await editor.fill('Pinned edit');
    await editor.press('Enter');
    await expect(name).toHaveText('Pinned edit');
    const before = (await bounds(nameHeader)).width;
    await nameHeader.getByRole('separator').press('ArrowRight');
    await expect.poll(async () => (await bounds(nameHeader)).width).toBeGreaterThan(before + 5);
    await expect
      .poll(async () => Math.abs((await bounds(name)).left - (await bounds(viewport)).left))
      .toBeLessThan(2);
    if (component === 'tree-table') {
      await expect(viewport.locator('tr[data-pinned-row="top"]')).toHaveCount(3);
      await name.locator('button[aria-expanded]').click();
      await expect(viewport.locator('tr[data-pinned-row="top"]')).toHaveCount(1);
      await name.locator('button[aria-expanded]').click();
      await expect(viewport.locator('tr[data-pinned-row="top"]')).toHaveCount(3);
    }
    await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
    await viewport.evaluate((element) => {
      element.scrollLeft = -260;
    });
    await expect
      .poll(async () =>
        Math.abs(
          (await bounds(name)).right -
            (await viewport.evaluate(
              (element) =>
                element.getBoundingClientRect().left + element.clientLeft + element.clientWidth,
            )),
        ),
      )
      .toBeLessThan(2);
    await expect
      .poll(async () =>
        Math.abs(
          (await bounds(status)).left -
            (await viewport.evaluate(
              (element) => element.getBoundingClientRect().left + element.clientLeft,
            )),
        ),
      )
      .toBeLessThan(2);
    expect(
      (await new AxeBuilder({ page }).include(`#${component}-combined-pinning`).analyze())
        .violations,
    ).toEqual([]);
  });

  test(`${component} adapts pinning to themes and constrained viewports`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1160, height: 900 });
    await page.goto(`/components/${component}`);
    const example = page.locator(`#${component}-combined-pinning`);
    const viewport = example.locator('[data-sticky-header]');
    const name = viewport
      .locator('tbody tr[data-pinned-row="top"]')
      .first()
      .locator('td[data-field="name"]');
    const filter = viewport.locator('thead tr').nth(1).locator('th').first();
    await viewport.scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', 'dark');
    await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
    await viewport.evaluate((element) => {
      element.scrollTop = 220;
      element.scrollLeft = -260;
    });
    for (const [density, radius] of [
      ['compact', 'soft'],
      ['comfortable', 'pill'],
    ] as const) {
      await example.evaluate(
        (element, preset) => {
          element.setAttribute('data-aeris-density', preset[0]);
          element.setAttribute('data-aeris-radius', preset[1]);
        },
        [density, radius],
      );
      await expect
        .poll(async () => Math.abs((await bounds(name)).top - (await bounds(filter)).bottom))
        .toBeLessThan(2);
    }
    await viewport.screenshot({ path: testInfo.outputPath('pinning-dark-rtl.png') });
    expect(
      (await new AxeBuilder({ page }).include(`#${component}-combined-pinning`).analyze())
        .violations,
    ).toEqual([]);
    await viewport.evaluate((element) => {
      element.style.maxHeight = '130px';
    });
    await expect(viewport).toHaveAttribute('data-pin-block-disabled', '');
    await expect.poll(() => name.evaluate((element) => getComputedStyle(element).top)).toBe('auto');
    await page.setViewportSize({ width: 320, height: 740 });
    await expect(viewport).toHaveAttribute('data-pin-inline-disabled', '');
    expect(await viewport.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  });
}
