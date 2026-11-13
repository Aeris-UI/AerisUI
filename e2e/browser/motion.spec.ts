import { expect, test } from './fixtures';

test.describe('motion foundation', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('uses shared, placement-aware motion for anchored overlays', async ({ page }) => {
    await page.goto('/');
    const select = page.getByRole('combobox', { name: 'Role' });
    await select.click();

    const panel = page.locator('.aeris-select__panel');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCSS('animation-name', 'aeris-overlay-enter');
    await expect(panel).toHaveCSS('animation-duration', '0.15s');

    await select.press('Escape');
    await expect(panel).toHaveCount(0);

    for (let index = 0; index < 3; index += 1) {
      await select.click();
      await expect(panel).toBeVisible();
      await select.press('Escape');
      await expect(panel).toHaveCount(0);
    }
  });

  test('gives modal layers coordinated backdrop and surface motion', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open dialog' }).click();

    await expect(page.locator('.aeris-dialog__overlay')).toHaveCSS(
      'animation-name',
      'aeris-backdrop-enter',
    );
    await expect(page.getByRole('dialog', { name: 'Create project' })).toHaveCSS(
      'animation-name',
      /aeris-dialog-enter$/,
    );
  });

  test('modal dismissal can be interrupted by an application-driven reopen', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:01:00Z'));
    await page.goto('/');
    await page.clock.runFor(100);

    for (const [openLabel, dialogName, closeLabel, retainsSurfaceDuringExit] of [
      ['Open dialog', 'Create project', 'Close dialog', false],
      ['Open drawer', 'Filters', 'Close drawer', true],
    ] as const) {
      const trigger = page.getByRole('button', { name: openLabel, exact: true });
      const panel = page.getByRole('dialog', { name: dialogName });
      for (let cycle = 0; cycle < 3; cycle++) {
        await trigger.focus();
        await trigger.press('Enter');
        await page.clock.runFor(100);
        await expect(panel).toBeVisible();
        const originalPanel = await panel.evaluateHandle((el) => el);
        await panel
          .getByRole('button', { name: closeLabel, exact: true })
          .evaluate((el) => (el as HTMLButtonElement).click());
        // Render the closed model before changing its parent binding back to true.
        // The paused clock keeps the leave timer pending regardless of CI scheduling.
        await page.clock.runFor(100);
        if (retainsSurfaceDuringExit) {
          expect(await originalPanel.evaluate((el) => el.getAttribute('data-state'))).toBe(
            'closed',
          );
          expect(await originalPanel.evaluate((el) => el.isConnected)).toBe(true);
        } else {
          await expect(panel).toHaveCount(0);
        }
        await trigger.evaluate((el) => (el as HTMLButtonElement).click());
        await page.clock.runFor(100);
        await expect(panel).toBeVisible();
        expect(await originalPanel.evaluate((el) => el.isConnected)).toBe(retainsSurfaceDuringExit);
        await expect(page.getByRole('dialog')).toHaveCount(1);
        await expect
          .poll(() => panel.evaluate((el) => el.contains(document.activeElement)))
          .toBe(true);
        // A stale leave timer must not remove the reopened surface.
        await page.clock.runFor(1_000);
        await expect(panel).toBeVisible();
        expect(await originalPanel.evaluate((el) => el.isConnected)).toBe(retainsSurfaceDuringExit);
        await page.keyboard.press('Escape');
        await page.clock.runFor(1_000);
        await expect(panel).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await originalPanel.dispose();
      }
      expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
    }
  });
});

test('removes spatial overlay motion when reduced motion is requested', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Role' }).click();

  const panel = page.locator('.aeris-select__panel');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS('animation-duration', '0s');
});
