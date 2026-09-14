import { expect, test as base } from '@playwright/test';

interface BrowserFixtures {
  readonly runtimeErrors: readonly string[];
}

export const test = base.extend<BrowserFixtures>({
  runtimeErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });

      await use(errors);
      expect(errors, 'The browser emitted runtime errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
