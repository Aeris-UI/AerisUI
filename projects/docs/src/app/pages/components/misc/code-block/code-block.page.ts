import { Component, signal } from '@angular/core';
import {
  AerisCodeBlockModule,
  type AerisCodeCopyEvent,
  type AerisCodeSource,
} from '@aeris-ui/core/code-block';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}
interface TokenRow {
  readonly name: string;
  readonly purpose: string;
  readonly fallback: string;
}

@Component({
  selector: 'app-code-block-page',
  imports: [
    AerisCodeBlockModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './code-block.page.html',
  styleUrl: './code-block.page.scss',
})
export class CodeBlockPage {
  protected readonly importCode = `import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';`;
  protected readonly exampleCode = `export interface Greeting {
  readonly message: string;
}

export function greet(name: string): Greeting {
  return { message: 'Hello, ' + name };
}`;
  protected readonly sourceFiles: readonly AerisCodeSource[] = [
    { label: 'greeting.html', language: 'html', code: '<h1>{{ greeting }}</h1>' },
    {
      label: 'greeting.ts',
      language: 'typescript',
      code: "export class Greeting {\n  readonly greeting = 'Hello, Aeris';\n}",
    },
    { label: 'greeting.scss', language: 'scss', code: 'h1 {\n  color: var(--aeris-text);\n}' },
  ];
  protected readonly longCode = Array.from(
    { length: 28 },
    (_, index) =>
      `const result${index + 1} = 'A long line of code can be read without forcing its parent layout to become wider.';`,
  ).join('\n');
  protected readonly copyMessage = signal('Copy the example to see its result.');
  protected onCopied(event: AerisCodeCopyEvent): void {
    this.copyMessage.set('Copied ' + event.language + ' source.');
  }
  protected onCopyError(): void {
    this.copyMessage.set('Clipboard access is unavailable. Select and copy the code manually.');
  }
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'code-block-import', label: 'Import' },
    { id: 'code-block-basic', label: 'Basic' },
    { id: 'code-block-sources', label: 'Source tabs' },
    { id: 'code-block-lines', label: 'Lines' },
    { id: 'code-block-wrap', label: 'Wrapping' },
    { id: 'code-block-scroll', label: 'Scrolling' },
    { id: 'code-block-copy', label: 'Copy events' },
    { id: 'code-block-plain', label: 'Plain text' },
    { id: 'code-block-custom', label: 'Customization' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'code-block-import', label: 'Import' },
    { id: 'code-block-inputs', label: 'Inputs' },
    { id: 'code-block-models', label: 'Models' },
    { id: 'code-block-outputs', label: 'Outputs' },
    { id: 'code-block-methods', label: 'Methods' },
  ];
  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'code',
      type: 'string',
      defaultValue: "''",
      description:
        'Source text for a single code block. Rendered as text, never executed or interpreted as HTML.',
    },
    {
      name: 'language',
      type: 'string',
      defaultValue: 'text',
      description:
        'Case-insensitive language: html, typescript, javascript, css, scss, json, shell, or text. Aliases: ts, js, angular, xml, bash, sh. Unknown languages use plain text.',
    },
    {
      name: 'label',
      type: 'string',
      defaultValue: "''",
      description: 'Single-source header label, such as a filename. Defaults to language.',
    },
    {
      name: 'sources',
      type: 'readonly AerisCodeSource[]',
      defaultValue: '[]',
      description:
        'Source files displayed as tabs. Non-empty sources take precedence over code, language, and label. Empty files are retained.',
    },
    {
      name: 'highlight',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Enable Shiki syntax highlighting with lazily loaded grammars and light/dark themes. Plain text appears immediately while highlighting loads. Inputs over 100,000 characters use plain text.',
    },
    {
      name: 'lineNumbers',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Display decorative line numbers. Clipboard output always excludes them.',
    },
    {
      name: 'highlightLines',
      type: 'readonly number[]',
      defaultValue: '[]',
      description:
        'One-based line numbers to emphasize. Invalid or out-of-range entries have no effect.',
    },
    {
      name: 'wrap',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Wrap long lines rather than horizontally scrolling.',
    },
    {
      name: 'maxHeight',
      type: 'string | null',
      defaultValue: 'null',
      description:
        'Explicit CSS maximum height on every screen size. Default desktop height comes from the token; mobile expands vertically to preserve page scrolling.',
    },
    {
      name: 'tabSize',
      type: 'number',
      defaultValue: '2',
      description: 'Displayed tab width, clamped to integers from 1 through 16.',
    },
    {
      name: 'copyable',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Show the copy action and enable the copy() method.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: 'Code example',
      description: 'Accessible name for a single-source scroll region.',
    },
    {
      name: 'copyLabel',
      type: 'string',
      defaultValue: 'Copy',
      description: 'Visible copy action text; automatically icon-only on narrow screens.',
    },
    {
      name: 'copiedLabel',
      type: 'string',
      defaultValue: 'Copied',
      description: 'Visible success text.',
    },
    {
      name: 'copyAriaLabel',
      type: 'string',
      defaultValue: 'Copy code',
      description: 'Accessible name for the copy button, retained in icon-only mode.',
    },
    {
      name: 'copiedMessage',
      type: 'string',
      defaultValue: 'Code copied to clipboard.',
      description: 'Polite live announcement after a successful copy.',
    },
    {
      name: 'copyErrorMessage',
      type: 'string',
      defaultValue: 'Unable to copy code. Select the code and copy it manually.',
      description: 'Live announcement when clipboard access fails.',
    },
    {
      name: 'sourceTabsLabel',
      type: 'string',
      defaultValue: 'Code source',
      description: 'Accessible name for the source tab list.',
    },
    {
      name: 'scrollHint',
      type: 'string',
      defaultValue: 'Swipe sideways for long lines',
      description: 'Non-interactive mobile hint for unwrapped content; empty text hides it.',
    },
    {
      name: 'scrollDescription',
      type: 'string',
      defaultValue: 'Scroll horizontally to view long lines.',
      description: 'Accessible scroll guidance when wrapping is disabled; can be localized.',
    },
  ];
  protected readonly models: readonly ApiRow[] = [
    {
      name: 'activeSource',
      type: 'number',
      defaultValue: '0',
      description:
        'Two-way active source index. Out-of-range values display the closest available source.',
    },
  ];
  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'highlightError',
      type: 'unknown',
      defaultValue: '-',
      description:
        'Emits a highlighting failure. The original source remains visible and copyable as plain text.',
    },
    {
      name: 'copied',
      type: 'AerisCodeCopyEvent',
      defaultValue: '-',
      description: 'Emits the exact source text, language, and index after clipboard success.',
    },
    {
      name: 'copyError',
      type: 'unknown',
      defaultValue: '-',
      description: 'Emits the clipboard error. Source code is not included in error messages.',
    },
  ];
  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'copy()',
      type: 'Promise<boolean>',
      defaultValue: '-',
      description:
        'Copy the currently displayed raw source. Resolves false when disabled, busy, unsupported, or unsuccessful.',
    },
    {
      name: 'selectSource(index)',
      type: '(index: number) => void',
      defaultValue: '-',
      description: 'Activate an existing source index; invalid indices are ignored.',
    },
  ];
  protected readonly interfacesCode = `type AerisCodeLanguage = 'html' | 'typescript' | 'javascript' | 'css' | 'scss' | 'json' | 'shell' | 'text';

interface AerisCodeSource {
  readonly code: string;
  readonly language: string;
  readonly label: string;
}

interface AerisCodeCopyEvent {
  readonly code: string;
  readonly language: string;
  readonly index: number;
}`;
  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-code-block-background',
      purpose: 'Code surface.',
      fallback: '--aeris-surface-2',
    },
    { name: '--aeris-code-block-color', purpose: 'Uncolored text.', fallback: '--aeris-text' },
    {
      name: '--aeris-code-block-border',
      purpose: 'Outer and header borders.',
      fallback: '--aeris-border',
    },
    {
      name: '--aeris-code-block-radius',
      purpose: 'Outer corners.',
      fallback: '--aeris-radius-surface',
    },
    {
      name: '--aeris-code-block-padding',
      purpose: 'Code area padding.',
      fallback: '--aeris-surface-padding',
    },
    {
      name: '--aeris-code-block-max-height',
      purpose: 'Default desktop scroll height; maxHeight input overrides it.',
      fallback: 'min(34rem, 68dvh)',
    },
    { name: '--aeris-code-block-font-size', purpose: 'Code font size.', fallback: '0.8125rem' },
    {
      name: '--aeris-code-block-font-family',
      purpose: 'Monospace stack.',
      fallback: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    },
    { name: '--aeris-code-block-line-height', purpose: 'Line height.', fallback: '1.75' },
    {
      name: '--aeris-code-block-line-highlight',
      purpose: 'Emphasized line background.',
      fallback: '--aeris-primary-soft',
    },
    {
      name: '--aeris-code-block-token-color',
      purpose: 'Override all Shiki token colors; omit to retain syntax themes.',
      fallback: 'Shiki GitHub light / dark token colors',
    },
  ];
}
