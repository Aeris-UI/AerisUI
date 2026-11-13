import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { HtmlParser } from '@angular/compiler';

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? htmlFiles(join(directory, entry.name))
          : entry.name.endsWith('.html')
            ? [join(directory, entry.name)]
            : [],
      ),
    )
  ).flat();
}

test('documentation uses Aeris tables, disclosures, selection controls, and form controls', async () => {
  const parser = new HtmlParser();
  const violations = [];
  for (const file of await htmlFiles('projects/docs/src/app')) {
    const source = await readFile(file, 'utf8');
    const { rootNodes, errors } = parser.parse(source, file, { tokenizeBlocks: false });
    assert.equal(errors.length, 0, `${file}: ${errors.join('\n')}`);
    function visit(nodes) {
      for (const node of nodes) {
        const attributes = new Map(node.attrs?.map(({ name, value }) => [name, value]));
        if (
          ['table', 'details', 'summary', 'dialog', 'progress', 'meter'].includes(node.name) ||
          ['table', 'tablist', 'listbox'].includes(attributes.get('role'))
        ) {
          violations.push(`${file}:${node.sourceSpan.start.line + 1}: ${node.name}`);
        }
        const nativeControl = ['button', 'input', 'select', 'textarea'].includes(node.name);
        const aeris = [...attributes.keys()].some((name) => name.startsWith('aeris'));
        const browserFileInput =
          node.name === 'input' && attributes.get('type') === 'file' && attributes.has('hidden');
        // This example intentionally demonstrates InputGroup's native-input integration.
        const nativeIntegration =
          file.endsWith('input-group.page.html') &&
          attributes.get('aria-label') === 'Native issue number';
        if (nativeControl && !aeris && !browserFileInput && !nativeIntegration) {
          violations.push(`${file}:${node.sourceSpan.start.line + 1}: native ${node.name}`);
        }
        visit(node.children ?? []);
      }
    }
    visit(rootNodes);
  }
  assert.deepEqual(violations, []);
});

test('converted surface examples also use Aeris in their copyable sources', async () => {
  const document = JSON.parse(await readFile('projects/docs/public/ai/22/aeris-docs.json', 'utf8'));
  for (const [slug, id, components] of [
    ['timeline', 'timeline-templates', ['aeris-card', 'aeris-badge']],
    ['organization-chart', 'organization-chart-template', ['aeris-avatar']],
    ['skeleton', 'skeleton-card', ['aeris-card']],
    ['skeleton', 'skeleton-table', ['aeris-table']],
    ['scroll-panel', 'scroll-panel-both', ['aeris-table']],
    ['carousel', 'carousel-basic', ['aeris-card']],
  ]) {
    const example = document.components
      .find((component) => component.slug === slug)
      ?.examples.find((example) => example.id === id);
    assert.ok(example, `Missing example ${id}`);
    const code = example.sources.map((source) => source.code).join('\n');
    for (const component of components)
      assert.ok(code.includes(`<${component}`), `${id} must copy the real ${component}`);
    assert.ok(!code.includes('app-reference-table'), `${id} must not require a docs-only adapter`);
  }
});
