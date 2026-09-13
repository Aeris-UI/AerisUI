import { expect, test } from './fixtures';

const PRESETS = [
  ['earth', 'light', 'comfortable', 'rounded'],
  ['coastal', 'dark', 'compact', 'soft'],
  ['orchid', 'light', 'compact', 'pill'],
  ['monochrome', 'dark', 'comfortable', 'rounded'],
] as const;

for (const [palette, mode, density, radius] of PRESETS) {
  test(`${palette} ${mode} visual primitives remain aligned`, async ({ page }, testInfo) => {
    await page.goto(`/?palette=${palette}&mode=${mode}&density=${density}&radius=${radius}`);
    await expect(page.locator('html')).toHaveAttribute('data-aeris-theme', mode);
    const forms = page.locator('[data-fixture="forms"]');
    const surfaces = page.locator('[data-fixture="surfaces"]');

    await testInfo.attach(`${palette}-${mode}-forms`, {
      body: await forms.screenshot(),
      contentType: 'image/png',
    });
    await testInfo.attach(`${palette}-${mode}-surfaces`, {
      body: await surfaces.screenshot(),
      contentType: 'image/png',
    });

    const button = page.getByRole('button', { name: 'Make valid' });
    const input = page.getByRole('textbox', { name: 'Required name' });
    const checkbox = page.locator('.aeris-checkbox__control').first();
    for (const control of [button, input]) {
      const box = await control.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(24);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(24);
    }
    await expect(checkbox).toHaveCSS('width', '18px');
    await expect(checkbox).toHaveCSS('height', '18px');

    const controlRadius = await button.evaluate(
      (element) => getComputedStyle(element).borderRadius,
    );
    await expect(input).toHaveCSS('border-radius', controlRadius);

    const menuTrigger = page.getByRole('button', { name: 'Open popup menu' });
    await menuTrigger.click();
    const panel = page.locator('.aeris-menu__panel[data-popup]');
    const item = panel.getByRole('menuitem').first();
    await item.hover();
    await testInfo.attach(`${palette}-${mode}-menu`, {
      body: await panel.screenshot(),
      contentType: 'image/png',
    });
    const panelBox = await panel.boundingBox();
    expect(panelBox?.width ?? 0).toBeGreaterThan(0);
    expect(await item.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
      'rgba(0, 0, 0, 0)',
    );
  });
}
