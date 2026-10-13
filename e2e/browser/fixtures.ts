import {
  expect,
  test as base,
  type BrowserContext,
  type BrowserContextOptions,
} from '@playwright/test';

interface BrowserFixtures {
  readonly runtimeErrors: string[];
  readonly createContext: (options?: BrowserContextOptions) => Promise<BrowserContext>;
}

async function observeContext(context: BrowserContext, errors: string[]): Promise<void> {
  // Every context, including custom device contexts, is independent of the font CDN.
  await context.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  context.on('page', (page) => {
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
  });
}

export const test = base.extend<BrowserFixtures>({
  runtimeErrors: [
    async ({ context }, use) => {
      const errors: string[] = [];
      await observeContext(context, errors);
      await use(errors);
      expect(errors, 'The browser emitted runtime errors').toEqual([]);
    },
    { auto: true },
  ],
  createContext: async ({ browser, runtimeErrors }, use) => {
    const contexts: BrowserContext[] = [];
    await use(async (options) => {
      const context = await browser.newContext(options);
      await observeContext(context, runtimeErrors);
      contexts.push(context);
      return context;
    });
    await Promise.all(contexts.map((context) => context.close()));
  },
});

export { expect } from '@playwright/test';
