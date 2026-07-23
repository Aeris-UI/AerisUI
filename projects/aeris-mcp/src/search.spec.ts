import { describe, expect, it } from 'vitest';

import type { AerisDocumentation } from './documentation.types.js';
import { AerisDocumentationIndex } from './search.js';

const documentation = {
  schemaVersion: 1,
  library: {
    name: '@aeris-ui/core',
    version: '22.0.0-alpha.1',
    status: 'alpha',
    angularPeerRange: '>=22 <23',
    documentationUrl: 'https://aeris-ui.dev',
    repositoryUrl: 'https://github.com/Aeris-UI/AerisUI',
    license: 'MIT',
    styleImports: [],
    principles: [],
  },
  categories: ['Overlay'],
  guides: [
    {
      id: 'overlays',
      path: '/guides/overlays',
      group: 'Integration and quality',
      title: 'Overlay integration',
      description: 'Position overlays safely.',
      summary: 'Dialog and popover guidance.',
      sections: [{ id: 'focus', title: 'Focus', bullets: ['Restore focus after closing.'] }],
      related: [],
    },
  ],
  components: [
    {
      name: 'Dialog',
      slug: 'dialog',
      category: 'Overlay',
      description: 'Accessible modal and non-modal dialog.',
      entryPoint: '@aeris-ui/core/dialog',
      documentationUrl: 'https://aeris-ui.dev/components/dialog',
      imports: ['AerisDialogModule'],
      importCode: "import { AerisDialogModule } from '@aeris-ui/core/dialog';",
      api: [
        {
          name: 'Inputs',
          kind: 'input',
          entries: [
            { name: 'dismissableMask', type: 'boolean', description: 'Close from the mask.' },
          ],
        },
      ],
      referenceTables: [],
      interfaces: [],
      designTokens: [],
      examples: [
        {
          id: 'dialog-basic',
          title: 'Basic',
          description: 'Open a modal dialog.',
          sources: [{ language: 'HTML', label: 'Template', code: '<aeris-dialog />' }],
        },
      ],
      accessibility: {
        guidance: ['Focus is trapped while modal.'],
        keyboard: [{ keys: 'Escape', behavior: 'Closes the dialog.' }],
      },
    },
  ],
} satisfies AerisDocumentation;

describe('AerisDocumentationIndex', () => {
  const index = new AerisDocumentationIndex(documentation);

  it('ranks an exact component match before related records', () => {
    const results = index.search('dialog');

    expect(results[0]).toMatchObject({ kind: 'component', id: 'dialog' });
  });

  it('searches API and accessibility content', () => {
    expect(index.search('dismissable mask')[0]).toMatchObject({ id: 'dialog' });
    expect(index.search('restore focus')[0]).toMatchObject({ kind: 'guide', id: 'overlays' });
  });

  it('filters by kind and category', () => {
    const results = index.search('dialog', { kinds: ['example'], category: 'Overlay' });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ kind: 'example', component: 'dialog' });
  });

  it('resolves component names and slugs case-insensitively', () => {
    expect(index.component('DIALOG')?.slug).toBe('dialog');
    expect(index.component('Dialog')?.slug).toBe('dialog');
  });

  it('returns complete matching examples', () => {
    const results = index.examples('modal', undefined, 5);

    expect(results[0]?.example.sources[0]?.code).toBe('<aeris-dialog />');
  });
});
