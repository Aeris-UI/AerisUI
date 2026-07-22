import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { $getRoot } from 'lexical';
import {
  AERIS_EDITOR_ALL_FORMATS,
  AerisEditor,
  type AerisEditorExtension,
  type AerisEditorFormat,
} from '@aeris-ui/core/editor';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

interface ToolbarActionRow {
  readonly group: string;
  readonly format: AerisEditorFormat;
  readonly action: string;
}

@Component({
  selector: 'app-editor-page',
  imports: [
    AerisEditor,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './editor.page.html',
  styleUrl: './editor.page.scss',
})
export class EditorPage {
  protected readonly content = signal('<p>Write clear product notes with Aeris.</p>');
  protected readonly compactContent = signal('<p>Only inline formatting is available here.</p>');
  protected readonly comprehensiveContent = signal(
    '<h1>Quarterly product brief</h1><p><strong>Use the complete toolbar</strong> to structure, emphasize, align, transform, and organize this document.</p><blockquote>Every visible action is backed by Lexical state and HTML serialization.</blockquote><ul><li>Shape the narrative</li><li>Review the checklist</li><li>Publish the update</li></ul>',
  );
  protected readonly extensionContent = signal(
    '<p>This example reads the immutable Lexical editor state through an Aeris extension.</p>',
  );
  protected readonly extensionWordCount = signal(0);
  protected readonly validationContent = signal('');
  protected readonly validationTouched = signal(false);
  protected readonly validationInvalid = computed(
    () => this.validationTouched() && !this.validationContent().trim(),
  );
  protected readonly reactiveContent = new FormControl('<p>Reactive form content.</p>');
  protected templateContent = '<p>Template-driven form content.</p>';
  protected readonly inlineFormats: readonly AerisEditorFormat[] = [
    'undo',
    'redo',
    'bold',
    'italic',
    'underline',
  ];
  protected readonly allFormats = AERIS_EDITOR_ALL_FORMATS;
  protected readonly wordCountExtension: readonly AerisEditorExtension[] = [
    {
      setup: (editor) =>
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            const text = $getRoot().getTextContent().trim();
            this.extensionWordCount.set(text ? text.split(/\s+/).length : 0);
          });
        }),
    },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'editor-basic', label: 'Basic' },
    { id: 'editor-toolbar', label: 'Toolbar formats' },
    { id: 'editor-comprehensive', label: 'Complete toolbar' },
    { id: 'editor-actions', label: 'Toolbar action reference' },
    { id: 'editor-extensions', label: 'Lexical extensions' },
    { id: 'editor-custom-toolbar', label: 'Custom toolbar' },
    { id: 'editor-states', label: 'States' },
    { id: 'editor-validation', label: 'Validation' },
    { id: 'editor-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'editor-api-inputs', label: 'Inputs' },
    { id: 'editor-api-outputs', label: 'Outputs' },
    { id: 'editor-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `npm install lexical @lexical/history @lexical/html @lexical/list @lexical/rich-text @lexical/selection

import { AerisEditor } from '@aeris-ui/core/editor';`;

  protected readonly modelCode = `protected readonly content = signal(
  '<p>Write clear product notes with Aeris.</p>',
);`;

  protected readonly toolbarCode = `import { type AerisEditorFormat } from '@aeris-ui/core/editor';

protected readonly inlineFormats: readonly AerisEditorFormat[] = [
  'undo',
  'redo',
  'bold',
  'italic',
  'underline',
];`;

  protected readonly comprehensiveCode = `import {
  AERIS_EDITOR_ALL_FORMATS,
  AerisEditor,
} from '@aeris-ui/core/editor';

protected readonly allFormats = AERIS_EDITOR_ALL_FORMATS;
protected readonly comprehensiveContent = signal(
  '<h1>Quarterly product brief</h1><p><strong>Use the complete toolbar</strong> to structure, emphasize, align, transform, and organize this document.</p><blockquote>Every visible action is backed by Lexical state and HTML serialization.</blockquote><ul><li>Shape the narrative</li><li>Review the checklist</li><li>Publish the update</li></ul>',
);`;

  protected readonly extensionCode = `import { $getRoot } from 'lexical';
import {
  AerisEditor,
  type AerisEditorExtension,
} from '@aeris-ui/core/editor';

protected readonly extensionContent = signal(
  '<p>This example reads the immutable Lexical editor state through an Aeris extension.</p>',
);
protected readonly extensionWordCount = signal(0);

protected readonly wordCountExtension: readonly AerisEditorExtension[] = [
  {
    setup: (editor) =>
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const text = $getRoot().getTextContent().trim();
          this.extensionWordCount.set(
            text ? text.split(/\\s+/).length : 0,
          );
        });
      }),
  },
];`;

  protected readonly validationCode = `protected readonly validationContent = signal('');
protected readonly validationTouched = signal(false);
protected readonly validationInvalid = computed(
  () =>
    this.validationTouched() &&
    !this.validationContent().trim(),
);`;

  protected readonly formsCode = `protected readonly reactiveContent =
  new FormControl('<p>Reactive form content.</p>');

protected templateContent = '<p>Template-driven form content.</p>';`;

  protected readonly interfacesCode = `import type {
  LexicalEditor,
  LexicalNodeConfig,
} from 'lexical';

type AerisEditorSize = 'sm' | 'md' | 'lg';
type AerisEditorAppearance = 'outline' | 'filled';
type AerisEditorBlock =
  | 'paragraph'
  | 'heading'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'quote';

type AerisEditorAlignment =
  | 'left'
  | 'start'
  | 'center'
  | 'right'
  | 'end'
  | 'justify';

type AerisEditorFormat =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'highlight'
  | 'subscript'
  | 'superscript'
  | 'lowercase'
  | 'uppercase'
  | 'capitalize'
  | 'paragraph'
  | 'heading'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'quote'
  | 'bulletList'
  | 'numberedList'
  | 'checkList'
  | 'alignLeft'
  | 'alignStart'
  | 'alignCenter'
  | 'alignRight'
  | 'alignEnd'
  | 'alignJustify'
  | 'outdent'
  | 'indent'
  | 'clear'
  | 'undo'
  | 'redo';

interface AerisEditorExtension {
  readonly nodes?: readonly LexicalNodeConfig[];
  readonly setup?: (editor: LexicalEditor) => void | (() => void);
}

interface AerisEditorChangeEvent {
  readonly value: string;
  readonly textContent: string;
}`;

  protected readonly toolbarActions: readonly ToolbarActionRow[] = [
    { group: 'History', format: 'undo', action: 'Undo the last editor change.' },
    { group: 'History', format: 'redo', action: 'Redo the last undone change.' },
    { group: 'Text', format: 'bold', action: 'Toggle bold.' },
    { group: 'Text', format: 'italic', action: 'Toggle italic.' },
    { group: 'Text', format: 'underline', action: 'Toggle underline.' },
    { group: 'Text', format: 'strikethrough', action: 'Toggle strikethrough.' },
    { group: 'Text', format: 'code', action: 'Toggle inline code.' },
    { group: 'Text', format: 'highlight', action: 'Toggle highlighted text.' },
    { group: 'Text', format: 'subscript', action: 'Toggle subscript.' },
    { group: 'Text', format: 'superscript', action: 'Toggle superscript.' },
    { group: 'Text transform', format: 'lowercase', action: 'Display selected text in lowercase.' },
    { group: 'Text transform', format: 'uppercase', action: 'Display selected text in uppercase.' },
    { group: 'Text transform', format: 'capitalize', action: 'Capitalize selected text.' },
    { group: 'Blocks', format: 'paragraph', action: 'Convert the current block to a paragraph.' },
    { group: 'Blocks', format: 'heading', action: 'Toggle the backward-compatible H2 action.' },
    { group: 'Blocks', format: 'heading1', action: 'Convert the current block to H1.' },
    { group: 'Blocks', format: 'heading2', action: 'Convert the current block to H2.' },
    { group: 'Blocks', format: 'heading3', action: 'Convert the current block to H3.' },
    { group: 'Blocks', format: 'heading4', action: 'Convert the current block to H4.' },
    { group: 'Blocks', format: 'heading5', action: 'Convert the current block to H5.' },
    { group: 'Blocks', format: 'heading6', action: 'Convert the current block to H6.' },
    { group: 'Blocks', format: 'quote', action: 'Toggle a block quotation.' },
    { group: 'Lists', format: 'bulletList', action: 'Toggle a bulleted list.' },
    { group: 'Lists', format: 'numberedList', action: 'Toggle a numbered list.' },
    { group: 'Lists', format: 'checkList', action: 'Toggle an interactive checklist.' },
    { group: 'Alignment', format: 'alignLeft', action: 'Align the current block left.' },
    {
      group: 'Alignment',
      format: 'alignStart',
      action: 'Align the current block to the logical inline start.',
    },
    { group: 'Alignment', format: 'alignCenter', action: 'Center the current block.' },
    { group: 'Alignment', format: 'alignRight', action: 'Align the current block right.' },
    {
      group: 'Alignment',
      format: 'alignEnd',
      action: 'Align the current block to the logical inline end.',
    },
    { group: 'Alignment', format: 'alignJustify', action: 'Justify the current block.' },
    { group: 'Structure', format: 'outdent', action: 'Decrease block or list indentation.' },
    { group: 'Structure', format: 'indent', action: 'Increase block or list indentation.' },
    { group: 'Structure', format: 'clear', action: 'Remove inline formatting from the selection.' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'string (model)',
      defaultValue: "''",
      description:
        'HTML content value with two-way binding and Forms support. Incoming HTML is sanitized before Lexical imports supported nodes.',
    },
    {
      name: 'inputId',
      type: 'string',
      defaultValue: "''",
      description: 'ID applied to the editable textbox.',
    },
    {
      name: 'name',
      type: 'string',
      defaultValue: "''",
      description: 'Adds a hidden input for native form submission of the HTML value.',
    },
    {
      name: 'placeholder',
      type: 'string',
      defaultValue: "'Write something...'",
      description: 'Placeholder text shown while the editor is empty and not focused.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name when no visible label exists.',
    },
    {
      name: 'ariaLabelledby',
      type: 'string',
      defaultValue: "''",
      description: 'IDs of visible elements that label the editor.',
    },
    {
      name: 'ariaDescribedby',
      type: 'string',
      defaultValue: "''",
      description: 'IDs of help and validation messages.',
    },
    {
      name: 'toolbarAriaLabel',
      type: 'string',
      defaultValue: "'Formatting tools'",
      description: 'Accessible name for the toolbar.',
    },
    {
      name: 'size',
      type: 'AerisEditorSize',
      defaultValue: "'md'",
      description: 'Controls editor typography and padding.',
    },
    {
      name: 'appearance',
      type: 'AerisEditorAppearance',
      defaultValue: "'outline'",
      description: 'Outlined or filled surface treatment.',
    },
    {
      name: 'minHeight',
      type: 'string',
      defaultValue: "'12rem'",
      description: 'Minimum content area height.',
    },
    {
      name: 'formats',
      type: 'readonly AerisEditorFormat[]',
      defaultValue: 'AERIS_EDITOR_DEFAULT_FORMATS',
      description:
        'Controls which toolbar actions are rendered. Use AERIS_EDITOR_ALL_FORMATS for every built-in action.',
    },
    {
      name: 'namespace',
      type: 'string',
      defaultValue: "'AerisEditor'",
      description: 'Lexical namespace used when creating the editor instance.',
    },
    {
      name: 'lexicalTheme',
      type: 'EditorThemeClasses',
      defaultValue: '{}',
      description: 'Merges consumer Lexical theme classes over the Aeris editor theme.',
    },
    {
      name: 'htmlConfig',
      type: 'HTMLConfig',
      defaultValue: '{}',
      description:
        'Adds Lexical HTML import and export conversions for custom or third-party nodes.',
    },
    {
      name: 'extensions',
      type: 'readonly AerisEditorExtension[]',
      defaultValue: '[]',
      description:
        'Registers additional Lexical nodes, commands, transforms, listeners, and feature packages when the editor is created.',
    },
    {
      name: 'showToolbar',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows or hides the formatting toolbar.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables editing, focus, and toolbar actions.',
    },
    {
      name: 'readonly',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Prevents editing while keeping the content readable.',
    },
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Adds required semantics for assistive technology.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Applies invalid styling and synchronizes aria-invalid.',
    },
    {
      name: 'fluid',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Fills the available inline space.',
    },
  ];
}
