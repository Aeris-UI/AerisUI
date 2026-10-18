import { expect, test } from './fixtures';

test('disabled and loading links keep their resting appearance while hovered and pressed', async ({
  page,
  hasTouch,
}) => {
  test.skip(hasTouch, 'Hover feedback requires a fine pointer.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const area = page.locator('[data-fixture="button-foundation"]');
  const names = ['solid', 'outline', 'ghost', 'link'].flatMap((variant) =>
    ['Disabled', 'Loading'].map((state) => `${state} ${variant} link`),
  );
  for (const name of [...names, 'Disabled attached link', 'Loading attached link']) {
    const link = area.getByRole('link', { name, exact: true });
    await page.mouse.move(0, 0);
    const resting = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        image: style.backgroundImage,
        color: style.color,
        transform: style.transform,
      };
    });
    await link.hover();
    await expect(link).toHaveCSS('background-color', resting.background);
    await expect(link).toHaveCSS('background-image', resting.image);
    await expect(link).toHaveCSS('color', resting.color);
    await expect(link).toHaveCSS('transform', resting.transform);
    await page.mouse.down();
    await expect(link).toHaveCSS('background-color', resting.background);
    await expect(link).toHaveCSS('background-image', resting.image);
    await expect(link).toHaveCSS('color', resting.color);
    await page.mouse.up();
    await expect(area.getByRole('status', { name: 'Foundation activations' })).toHaveText('0');
    expect(new URL(page.url()).hash).toBe('');
    await link.focus();
    await link.press('Enter');
    await expect(area.getByRole('status', { name: 'Foundation activations' })).toHaveText('0');
    expect(new URL(page.url()).hash).toBe('');
  }
});

test('reduced motion removes hover displacement without suppressing focus or activation', async ({
  page,
  hasTouch,
}) => {
  test.skip(hasTouch, 'Hover feedback requires a fine pointer.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const area = page.locator('[data-fixture="button-foundation"]');
  const save = area.getByRole('button', { name: 'Save', exact: true });
  const standalone = area.locator('[data-size="md"] button').first();
  await standalone.hover();
  await expect(standalone).toHaveCSS('transform', 'none');
  await save.focus();
  await save.press('Space');
  await expect(area.getByRole('status', { name: 'Foundation activations' })).toHaveText('1');
  await expect(save).toBeFocused();
  await expect(save).toHaveCSS('outline-style', 'solid');
});

test('press, release and cancellation preserve geometry and activate once through projected content', async ({
  page,
  hasTouch,
}) => {
  test.skip(hasTouch, 'Uses physical mouse press and release.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const area = page.locator('[data-fixture="button-foundation"]');
  const button = area.locator('[data-sample="icons"] button').first();
  const output = area.getByRole('status', { name: 'Foundation activations' });
  await button.hover();
  const geometry = () =>
    button.evaluate((element) => {
      const icon = element.querySelector('svg');
      if (!icon) throw new Error('The projected icon must be present.');
      const bounds = element.getBoundingClientRect();
      const iconBounds = icon.getBoundingClientRect();
      return {
        top: (element as HTMLElement).offsetTop,
        width: bounds.width,
        height: bounds.height,
        iconWidth: iconBounds.width,
        iconHeight: iconBounds.height,
      };
    });
  const before = await geometry();
  await page.mouse.down();
  expect(await geometry()).toEqual(before);
  await expect(output).toHaveText('0');
  await page.mouse.up();
  await expect(output).toHaveText('1');
  await button.hover();
  await page.mouse.down();
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await expect(output).toHaveText('1');
  await button.locator('svg').click();
  await expect(output).toHaveText('2');
  await button.focus();
  await page.keyboard.down('Space');
  await expect(output).toHaveText('2');
  await page.keyboard.up('Space');
  await expect(output).toHaveText('3');
});

test('touch activation does not leave a sticky hover or alter projected icon dimensions', async ({
  page,
  hasTouch,
}) => {
  test.skip(!hasTouch, 'Requires touch emulation.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const area = page.locator('[data-fixture="button-foundation"]');
  const button = area.locator('[data-sample="icons"] button').first();
  const resting = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, transform: style.transform };
  });
  const icon = button.locator('svg');
  const before = await icon.boundingBox();
  await icon.tap();
  await expect(area.getByRole('status', { name: 'Foundation activations' })).toHaveText('1');
  await expect(button).toHaveCSS('background-color', resting.background);
  await expect(button).toHaveCSS('transform', resting.transform);
  const after = await icon.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
});

test('breadcrumb ellipsis respects reduced motion during press', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4301/components/breadcrumb');
  const button = page.locator('#breadcrumb-ellipsis button.aeris-breadcrumb__item--ellipsis');
  await button.hover();
  await page.mouse.down();
  await expect(button).toHaveCSS('transform', 'none');
  await page.mouse.up();
});
