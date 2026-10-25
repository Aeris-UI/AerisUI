import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.use({ baseURL: 'http://127.0.0.1:4301' });

for (const direction of ['ltr', 'rtl']) {
  test(`progress layers crossfade without resetting measured fill and rings stay centered in ${direction}`, async ({
    page,
  }) => {
    await page.addInitScript((dir) => localStorage.setItem('aeris-docs-direction', dir), direction);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/components/progress-bar');
    const demo = page.locator('#progress-bar-processing [preview]');
    const bar = demo.getByRole('progressbar');
    const fill = demo.locator('.aeris-progress-bar__fill');
    const sweep = demo.locator('.aeris-progress-bar__sweep');
    const activity = demo.locator('.aeris-progress-bar__activity');
    await expect(activity).toHaveCSS('opacity', '1');
    await expect(sweep).toHaveCSS('animation-play-state', 'running');
    await expect(sweep).toHaveCSS(
      'animation-name',
      direction === 'rtl' ? /indeterminate-rtl$/ : /indeterminate$/,
    );
    const samples = await sweep.evaluate((element) => {
      const animation = element.getAnimations()[0];
      if (!animation?.effect) throw new Error('The loading sweep must animate.');
      animation.pause();
      const duration = Number(animation.effect.getTiming().duration);
      const samples = [0.35, 0.55].map((phase) => {
        animation.currentTime = duration * phase;
        const bounds = element.getBoundingClientRect();
        return { width: bounds.width, left: bounds.left, clip: getComputedStyle(element).clipPath };
      });
      animation.play();
      return samples;
    });
    expect(samples[0].width).toBeGreaterThan(0);
    expect(samples[1].width).toBeCloseTo(samples[0].width, 1);
    expect(samples[1].left).not.toBe(samples[0].left);
    expect(samples.every((sample) => sample.clip === 'none')).toBe(true);
    await demo.getByRole('button', { name: 'Finish preparation' }).click();
    await expect(fill).toHaveCSS('opacity', '1');
    await expect(activity).toHaveCSS('opacity', '0');
    await expect(activity).toHaveCSS('visibility', 'hidden');
    await expect(sweep).toHaveCSS('animation-play-state', 'paused');
    expect(
      await fill.evaluate((element) => getComputedStyle(element).transitionProperty),
    ).toContain('inline-size');
    for (let i = 0; i < 3; i++)
      await demo.getByRole('button', { name: 'Process next file' }).click();
    await expect(bar).toHaveAttribute('aria-valuenow', '3');
    await expect
      .poll(() =>
        fill.evaluate((element) => {
          const track = element.parentElement;
          if (!track) throw new Error('Progress fill needs its track.');
          return Math.round(
            (element.getBoundingClientRect().width / track.getBoundingClientRect().width) * 1000,
          );
        }),
      )
      .toBe(375);
    for (const size of ['12px', '20px']) {
      await bar.evaluate(
        (element, size) =>
          (element as HTMLElement).style.setProperty('--aeris-progress-bar-step-marker-size', size),
        size,
      );
      const centers = await demo
        .locator('.aeris-progress-bar__step-marker')
        .evaluateAll((markers) =>
          markers.map((marker) => {
            const markerBounds = marker.getBoundingClientRect();
            const barBounds = marker.closest('aeris-progress-bar')?.getBoundingClientRect();
            if (!barBounds) throw new Error('The marker must belong to its progress bar.');
            const shape = marker.querySelector('path,circle');
            if (!shape) throw new Error('Every marker needs a visible shape.');
            const bounds = shape.getBoundingClientRect();
            const subpathErrors =
              shape.tagName === 'path'
                ? (shape.getAttribute('d')?.match(/M[^M]+/g) ?? []).map((data) => {
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', data);
                    const length = path.getTotalLength();
                    const points = [0, 0.25, 0.5, 0.75].map((part) =>
                      path.getPointAtLength(length * part),
                    );
                    const x =
                      (Math.min(...points.map((point) => point.x)) +
                        Math.max(...points.map((point) => point.x))) /
                      2;
                    const y =
                      (Math.min(...points.map((point) => point.y)) +
                        Math.max(...points.map((point) => point.y))) /
                      2;
                    return Math.max(Math.abs(x - 10), Math.abs(y - 10));
                  })
                : [];
            return {
              x: Math.abs(bounds.x + bounds.width / 2 - markerBounds.x - markerBounds.width / 2),
              y: Math.abs(bounds.y + bounds.height / 2 - markerBounds.y - markerBounds.height / 2),
              subpathErrors,
              insetStart: markerBounds.left - barBounds.left,
              insetEnd: barBounds.right - markerBounds.right,
            };
          }),
        );
      expect(centers).toHaveLength(3);
      for (const center of centers) {
        expect(center.x).toBeLessThan(0.05);
        expect(center.y).toBeLessThan(0.05);
        expect(center.insetStart).toBeGreaterThanOrEqual(-0.05);
        expect(center.insetEnd).toBeGreaterThanOrEqual(-0.05);
        for (const error of center.subpathErrors) expect(error).toBeLessThan(0.05);
      }
      expect(centers.flatMap((center) => center.subpathErrors)).toHaveLength(3);
    }
    await demo.getByRole('button', { name: 'Restart' }).click();
    await expect(activity).toHaveCSS('opacity', '1');
    await expect(fill).toHaveCSS('opacity', '0');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(sweep).toHaveCSS('animation-name', 'none');
  });

  test(`file processing has associated text and milestone-only status in ${direction}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript((dir) => localStorage.setItem('aeris-docs-direction', dir), direction);
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/components/progress-bar');
    const demo = page.locator('#progress-bar-processing [preview]');
    const bar = demo.getByRole('progressbar', { name: 'Prepare and process files' });
    await expect(bar).toBeVisible();
    await expect(bar).toHaveAccessibleDescription(
      'Keep this page open until all eight files are processed.',
    );
    await expect(bar).not.toHaveAttribute('aria-valuenow');
    await expect(demo.locator('.progress-stack')).toHaveAttribute('aria-busy', 'true');
    const status = demo.getByRole('status');
    await expect(status).toHaveText('Preparing files. Continue when preparation finishes.');
    await demo.getByRole('button', { name: 'Finish preparation' }).click();
    await expect(bar).toHaveAttribute('aria-valuenow', '0');
    const next = demo.getByRole('button', { name: 'Process next file' });
    for (let value = 1; value <= 8; value++) {
      await next.click();
      await expect(bar).toHaveAttribute('aria-valuenow', `${value}`);
      await expect(bar).toHaveAttribute('aria-valuetext', `${value} of 8 files processed`);
      await expect(status).toHaveText(value === 8 ? 'All files processed.' : 'Processing files.');
    }
    await expect(next).toBeDisabled();
    await expect(demo.locator('.progress-stack')).toHaveAttribute('aria-busy', 'false');
    await expect(demo.locator('[role="status"]')).toHaveCount(1);
    await expect(demo.locator('[aria-busy] [role="status"]')).toHaveCount(0);
    await expect(demo.locator('.aeris-progress-bar__step-label').last()).toHaveText('Complete');
    await expect(demo.locator('.aeris-progress-bar__fill')).toHaveCSS('animation-name', 'none');
    expect(await demo.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
    const results = await new AxeBuilder({ page })
      .include('#progress-bar-processing [preview]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await testInfo.attach('file-processing', {
      body: await demo.screenshot(),
      contentType: 'image/png',
    });
    await demo.getByRole('button', { name: 'Restart' }).click();
    await expect(bar).not.toHaveAttribute('aria-valuenow');
    await expect(demo.getByRole('button', { name: 'Finish preparation' })).toBeEnabled();
  });

  test(`capacity keeps its inner meter associations and whole-line motion in ${direction}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript((dir) => localStorage.setItem('aeris-docs-direction', dir), direction);
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/components/meter-group');
    const demo = page.locator('#meter-group-capacity [preview]');
    const meter = demo.getByRole('meter', { name: 'Workspace storage' });
    await expect(meter).toHaveAccessibleDescription('32 GB available out of 128 GB.');
    await expect(meter).toHaveAttribute('aria-valuenow', '96');
    await expect(meter).toHaveAttribute('aria-valuemax', '128');
    await demo.getByRole('button', { name: 'Clear sample cache' }).click();
    await expect(meter).toHaveAttribute('aria-valuenow', '80');
    await expect(meter).toHaveAccessibleDescription('48 GB available out of 128 GB.');
    await expect(meter).toHaveAttribute('aria-valuetext', /Total 80 GB of 128 GB/);
    const segments = demo.locator('.aeris-meter-group__segments');
    // The docs' global reduced-motion reset uses a 0.01ms duration.
    expect(
      await segments.evaluate(
        (element) => parseFloat(getComputedStyle(element).animationDuration) * 1000,
      ),
    ).toBeLessThanOrEqual(0.01);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(segments).toHaveCSS(
      'animation-name',
      direction === 'rtl'
        ? /aeris-meter-group-reveal-inline-rtl$/
        : /aeris-meter-group-reveal-inline$/,
    );
    for (const segment of await demo.locator('.aeris-meter-group__segment').all()) {
      await expect(segment).toHaveCSS('animation-name', 'none');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await demo.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(
      true,
    );
    const results = await new AxeBuilder({ page })
      .include('#meter-group-capacity [preview]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await testInfo.attach('capacity', { body: await demo.screenshot(), contentType: 'image/png' });
    await demo.getByRole('button', { name: 'Restore sample cache' }).click();
    await expect(meter).toHaveAttribute('aria-valuenow', '96');
  });
}
