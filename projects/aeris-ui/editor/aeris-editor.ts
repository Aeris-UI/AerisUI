import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  SecurityContext,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  createEditor,
  type EditorThemeClasses,
  type ElementFormatType,
  type HTMLConfig,
  type LexicalEditor,
  type LexicalNode,
  type LexicalNodeConfig,
  type TextFormatType,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
  registerRichText,
  type HeadingTagType,
} from '@lexical/rich-text';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
  registerCheckList,
  registerList,
} from '@lexical/list';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import { $setBlocksType } from '@lexical/selection';

export type AerisEditorSize = 'sm' | 'md' | 'lg';
export type AerisEditorAppearance = 'outline' | 'filled';
export type AerisEditorBlock = 'paragraph' | 'heading' | HeadingTagType | 'quote';
export type AerisEditorTextFormat = Extract<
  TextFormatType,
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
>;
export type AerisEditorAlignment = Extract<
  ElementFormatType,
  'left' | 'start' | 'center' | 'right' | 'end' | 'justify'
>;
export type AerisEditorFormat =
  | AerisEditorTextFormat
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

/**
 * Registers additional Lexical nodes and behavior while keeping the Aeris shell,
 * forms integration, serialization, and accessibility contract.
 */
export interface AerisEditorExtension {
  readonly nodes?: readonly LexicalNodeConfig[];
  readonly setup?: (editor: LexicalEditor) => void | (() => void);
}

export const AERIS_EDITOR_DEFAULT_FORMATS = [
  'undo',
  'redo',
  'bold',
  'italic',
  'underline',
  'heading',
  'quote',
  'bulletList',
  'numberedList',
] as const satisfies readonly AerisEditorFormat[];

export const AERIS_EDITOR_ALL_FORMATS = [
  'undo',
  'redo',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'highlight',
  'subscript',
  'superscript',
  'lowercase',
  'uppercase',
  'capitalize',
  'paragraph',
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'quote',
  'bulletList',
  'numberedList',
  'checkList',
  'alignLeft',
  'alignStart',
  'alignCenter',
  'alignRight',
  'alignEnd',
  'alignJustify',
  'outdent',
  'indent',
  'clear',
] as const satisfies readonly AerisEditorFormat[];

export interface AerisEditorChangeEvent {
  readonly value: string;
  readonly textContent: string;
}

let editorId = 0;

@Component({
  selector: 'aeris-editor',
  template: `
    <div
      class="aeris-editor"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-invalid]="invalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-fluid]="fluid() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (showToolbar()) {
        <div class="aeris-editor__toolbar" role="toolbar" [attr.aria-label]="toolbarAriaLabel()">
          @if (availableFormats().has('undo')) {
            <button type="button" aria-label="Undo" [disabled]="toolbarDisabled()" (click)="undo()">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M9 8H4V3" />
                <path d="M4 8c2.1-2.7 5-4 8.1-4A8 8 0 1 1 6 17.1" />
              </svg>
            </button>
          }
          @if (availableFormats().has('redo')) {
            <button type="button" aria-label="Redo" [disabled]="toolbarDisabled()" (click)="redo()">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M15 8h5V3" />
                <path d="M20 8c-2.1-2.7-5-4-8.1-4A8 8 0 1 0 18 17.1" />
              </svg>
            </button>
          }

          @if (hasInlineActions()) {
            <span class="aeris-editor__separator" aria-hidden="true"></span>
          }
          @if (availableFormats().has('bold')) {
            <button
              type="button"
              aria-label="Bold"
              [attr.aria-pressed]="activeBold()"
              [disabled]="toolbarDisabled()"
              (click)="format('bold')"
            >
              <strong>B</strong>
            </button>
          }
          @if (availableFormats().has('italic')) {
            <button
              type="button"
              aria-label="Italic"
              [attr.aria-pressed]="activeItalic()"
              [disabled]="toolbarDisabled()"
              (click)="format('italic')"
            >
              <em>I</em>
            </button>
          }
          @if (availableFormats().has('underline')) {
            <button
              type="button"
              aria-label="Underline"
              [attr.aria-pressed]="activeUnderline()"
              [disabled]="toolbarDisabled()"
              (click)="format('underline')"
            >
              <span class="aeris-editor__underline">U</span>
            </button>
          }
          @if (availableFormats().has('strikethrough')) {
            <button
              type="button"
              aria-label="Strikethrough"
              [attr.aria-pressed]="activeStrikethrough()"
              [disabled]="toolbarDisabled()"
              (click)="format('strikethrough')"
            >
              <span class="aeris-editor__strikethrough">S</span>
            </button>
          }
          @if (availableFormats().has('code')) {
            <button
              type="button"
              aria-label="Inline code"
              [attr.aria-pressed]="activeCode()"
              [disabled]="toolbarDisabled()"
              (click)="format('code')"
            >
              <span aria-hidden="true">&lt;/&gt;</span>
            </button>
          }
          @if (availableFormats().has('highlight')) {
            <button
              type="button"
              aria-label="Highlight"
              [attr.aria-pressed]="activeHighlight()"
              [disabled]="toolbarDisabled()"
              (click)="format('highlight')"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m9 11 4 4" />
                <path d="m14.5 4.5 5 5L10 19H5v-5Z" />
                <path d="M4 21h16" />
              </svg>
            </button>
          }
          @if (availableFormats().has('subscript')) {
            <button
              type="button"
              aria-label="Subscript"
              [attr.aria-pressed]="activeSubscript()"
              [disabled]="toolbarDisabled()"
              (click)="format('subscript')"
            >
              <span aria-hidden="true">X<sub>2</sub></span>
            </button>
          }
          @if (availableFormats().has('superscript')) {
            <button
              type="button"
              aria-label="Superscript"
              [attr.aria-pressed]="activeSuperscript()"
              [disabled]="toolbarDisabled()"
              (click)="format('superscript')"
            >
              <span aria-hidden="true">X<sup>2</sup></span>
            </button>
          }
          @if (availableFormats().has('lowercase')) {
            <button
              type="button"
              aria-label="Lowercase"
              [attr.aria-pressed]="activeLowercase()"
              [disabled]="toolbarDisabled()"
              (click)="format('lowercase')"
            >
              aa
            </button>
          }
          @if (availableFormats().has('uppercase')) {
            <button
              type="button"
              aria-label="Uppercase"
              [attr.aria-pressed]="activeUppercase()"
              [disabled]="toolbarDisabled()"
              (click)="format('uppercase')"
            >
              AA
            </button>
          }
          @if (availableFormats().has('capitalize')) {
            <button
              type="button"
              aria-label="Capitalize"
              [attr.aria-pressed]="activeCapitalize()"
              [disabled]="toolbarDisabled()"
              (click)="format('capitalize')"
            >
              Aa
            </button>
          }

          @if (hasBlockActions()) {
            <span class="aeris-editor__separator" aria-hidden="true"></span>
          }
          @if (availableFormats().has('paragraph')) {
            <button
              type="button"
              aria-label="Paragraph"
              [attr.aria-pressed]="activeBlock() === 'paragraph'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('paragraph')"
            >
              P
            </button>
          }
          @if (availableFormats().has('heading1')) {
            <button
              type="button"
              aria-label="Heading 1"
              [attr.aria-pressed]="activeBlock() === 'h1'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('h1')"
            >
              H1
            </button>
          }
          @if (availableFormats().has('heading')) {
            <button
              type="button"
              aria-label="Heading"
              [attr.aria-pressed]="activeBlock() === 'h2'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('heading')"
            >
              H2
            </button>
          }
          @if (availableFormats().has('heading2')) {
            <button
              type="button"
              aria-label="Heading 2"
              [attr.aria-pressed]="activeBlock() === 'h2'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('h2')"
            >
              H2
            </button>
          }
          @if (availableFormats().has('heading3')) {
            <button
              type="button"
              aria-label="Heading 3"
              [attr.aria-pressed]="activeBlock() === 'h3'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('h3')"
            >
              H3
            </button>
          }
          @if (availableFormats().has('heading4')) {
            <button
              type="button"
              aria-label="Heading 4"
              [attr.aria-pressed]="activeBlock() === 'h4'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('h4')"
            >
              H4
            </button>
          }
          @if (availableFormats().has('heading5')) {
            <button
              type="button"
              aria-label="Heading 5"
              [attr.aria-pressed]="activeBlock() === 'h5'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('h5')"
            >
              H5
            </button>
          }
          @if (availableFormats().has('heading6')) {
            <button
              type="button"
              aria-label="Heading 6"
              [attr.aria-pressed]="activeBlock() === 'h6'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('h6')"
            >
              H6
            </button>
          }
          @if (availableFormats().has('quote')) {
            <button
              type="button"
              aria-label="Quote"
              [attr.aria-pressed]="activeBlock() === 'quote'"
              [disabled]="toolbarDisabled()"
              (click)="setBlock('quote')"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M8 6H5.8C4.8 7.7 4.3 9.3 4.3 11c0 2.1 1.1 3.6 3 3.6 1.5 0 2.7-1.1 2.7-2.7 0-1.4-1-2.5-2.4-2.7.1-.9.5-1.9 1.1-3.2Z"
                />
                <path
                  d="M18 6h-2.2c-1 1.7-1.5 3.3-1.5 5 0 2.1 1.1 3.6 3 3.6 1.5 0 2.7-1.1 2.7-2.7 0-1.4-1-2.5-2.4-2.7.1-.9.5-1.9 1.1-3.2Z"
                />
              </svg>
            </button>
          }

          @if (hasListActions()) {
            <span class="aeris-editor__separator" aria-hidden="true"></span>
          }
          @if (availableFormats().has('bulletList')) {
            <button
              type="button"
              aria-label="Bulleted list"
              [attr.aria-pressed]="activeList() === 'bullet'"
              [disabled]="toolbarDisabled()"
              (click)="toggleBulletList()"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M8 6h12" />
                <path d="M8 12h12" />
                <path d="M8 18h12" />
                <circle cx="4" cy="6" r="1" />
                <circle cx="4" cy="12" r="1" />
                <circle cx="4" cy="18" r="1" />
              </svg>
            </button>
          }
          @if (availableFormats().has('numberedList')) {
            <button
              type="button"
              aria-label="Numbered list"
              [attr.aria-pressed]="activeList() === 'number'"
              [disabled]="toolbarDisabled()"
              (click)="toggleNumberedList()"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M10 6h10" />
                <path d="M10 12h10" />
                <path d="M10 18h10" />
                <path d="M4 5h1v3" />
                <path d="M3.7 8h2.6" />
                <path
                  d="M3.6 11.4c.3-.4.8-.6 1.4-.6.8 0 1.4.5 1.4 1.2 0 .5-.3.9-.8 1.2L4 14.5h2.5"
                />
                <path
                  d="M3.7 17h2.1l-1 1h.3c.8 0 1.4.4 1.4 1.1 0 .7-.6 1.2-1.5 1.2-.6 0-1.1-.2-1.5-.6"
                />
              </svg>
            </button>
          }
          @if (availableFormats().has('checkList')) {
            <button
              type="button"
              aria-label="Checklist"
              [attr.aria-pressed]="activeList() === 'check'"
              [disabled]="toolbarDisabled()"
              (click)="toggleCheckList()"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="3" y="4" width="5" height="5" rx="1" />
                <path d="m4.5 6.5 1.2 1.2L8.3 5" />
                <path d="M11 6.5h10" />
                <rect x="3" y="15" width="5" height="5" rx="1" />
                <path d="M11 17.5h10" />
              </svg>
            </button>
          }

          @if (hasAlignmentActions()) {
            <span class="aeris-editor__separator" aria-hidden="true"></span>
          }
          @if (availableFormats().has('alignLeft')) {
            <button
              type="button"
              aria-label="Align left"
              [attr.aria-pressed]="activeAlignment() === 'left'"
              [disabled]="toolbarDisabled()"
              (click)="align('left')"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6h16M4 10h11M4 14h16M4 18h11" />
              </svg>
            </button>
          }
          @if (availableFormats().has('alignStart')) {
            <button
              type="button"
              aria-label="Align start"
              [attr.aria-pressed]="activeAlignment() === 'start'"
              [disabled]="toolbarDisabled()"
              (click)="align('start')"
            >
              <svg class="aeris-editor__logical-icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6h16M4 10h11M4 14h16M4 18h11" />
              </svg>
            </button>
          }
          @if (availableFormats().has('alignCenter')) {
            <button
              type="button"
              aria-label="Align center"
              [attr.aria-pressed]="activeAlignment() === 'center'"
              [disabled]="toolbarDisabled()"
              (click)="align('center')"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6h16M6.5 10h11M4 14h16M6.5 18h11" />
              </svg>
            </button>
          }
          @if (availableFormats().has('alignRight')) {
            <button
              type="button"
              aria-label="Align right"
              [attr.aria-pressed]="activeAlignment() === 'right'"
              [disabled]="toolbarDisabled()"
              (click)="align('right')"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6h16M9 10h11M4 14h16M9 18h11" />
              </svg>
            </button>
          }
          @if (availableFormats().has('alignEnd')) {
            <button
              type="button"
              aria-label="Align end"
              [attr.aria-pressed]="activeAlignment() === 'end'"
              [disabled]="toolbarDisabled()"
              (click)="align('end')"
            >
              <svg class="aeris-editor__logical-icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6h16M9 10h11M4 14h16M9 18h11" />
              </svg>
            </button>
          }
          @if (availableFormats().has('alignJustify')) {
            <button
              type="button"
              aria-label="Justify"
              [attr.aria-pressed]="activeAlignment() === 'justify'"
              [disabled]="toolbarDisabled()"
              (click)="align('justify')"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          }

          @if (hasDocumentActions()) {
            <span class="aeris-editor__separator" aria-hidden="true"></span>
          }
          @if (availableFormats().has('outdent')) {
            <button
              type="button"
              aria-label="Decrease indent"
              [disabled]="toolbarDisabled()"
              (click)="outdent()"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M11 6h9M11 10h9M11 14h9M11 18h9" />
                <path d="m8 9-4 3 4 3" />
              </svg>
            </button>
          }
          @if (availableFormats().has('indent')) {
            <button
              type="button"
              aria-label="Increase indent"
              [disabled]="toolbarDisabled()"
              (click)="indent()"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M11 6h9M11 10h9M11 14h9M11 18h9" />
                <path d="m4 9 4 3-4 3" />
              </svg>
            </button>
          }
          @if (availableFormats().has('clear')) {
            <button
              type="button"
              aria-label="Clear formatting"
              [disabled]="toolbarDisabled()"
              (click)="clearFormatting()"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m4 20 16-16" />
                <path d="M6.5 4h9l-1.5 5" />
                <path d="m9.5 15-.5 2H5" />
              </svg>
            </button>
          }
        </div>
      }

      <div class="aeris-editor__content-shell" [style.min-height]="minHeight()">
        <div
          #editorRoot
          class="aeris-editor__content"
          role="textbox"
          aria-multiline="true"
          [id]="resolvedInputId()"
          [attr.contenteditable]="editable()"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="ariaLabelledby() || null"
          [attr.aria-describedby]="ariaDescribedby() || null"
          [attr.aria-invalid]="invalid() || null"
          [attr.aria-required]="required() || null"
          [attr.aria-placeholder]="placeholder() || null"
          [attr.tabindex]="effectiveDisabled() ? -1 : 0"
          (focus)="handleFocus($event)"
          (blur)="handleBlur($event)"
        ></div>

        @if (placeholderVisible()) {
          <span class="aeris-editor__placeholder">{{ placeholder() }}</span>
        }
      </div>

      @if (name()) {
        <input type="hidden" [name]="name()" [value]="value()" />
      }
    </div>
  `,
  styleUrl: './aeris-editor.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisEditorComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisEditorComponent implements ControlValueAccessor {
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  readonly value = model('');
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('Write something...');
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly toolbarAriaLabel = input('Formatting tools');
  readonly size = input<AerisEditorSize>('md');
  readonly appearance = input<AerisEditorAppearance>('outline');
  readonly minHeight = input('12rem');
  readonly formats = input<readonly AerisEditorFormat[]>(AERIS_EDITOR_DEFAULT_FORMATS);
  readonly namespace = input('AerisEditor');
  readonly lexicalTheme = input<EditorThemeClasses>({});
  readonly htmlConfig = input<HTMLConfig>({});
  readonly extensions = input<readonly AerisEditorExtension[]>([]);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly showToolbar = input(true, { transform: booleanAttribute });

  readonly valueInput = output<string>();
  readonly changed = output<AerisEditorChangeEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();
  readonly ready = output<LexicalEditor>();

  private readonly editorRoot = viewChild<ElementRef<HTMLDivElement>>('editorRoot');
  private readonly generatedId = `aeris-editor-${++editorId}`;
  private readonly formDisabled = signal(false);
  private readonly isEditorReady = signal(false);
  private readonly hasFocus = signal(false);
  protected readonly textContent = signal('');
  protected readonly activeBold = signal(false);
  protected readonly activeItalic = signal(false);
  protected readonly activeUnderline = signal(false);
  protected readonly activeStrikethrough = signal(false);
  protected readonly activeCode = signal(false);
  protected readonly activeHighlight = signal(false);
  protected readonly activeSubscript = signal(false);
  protected readonly activeSuperscript = signal(false);
  protected readonly activeLowercase = signal(false);
  protected readonly activeUppercase = signal(false);
  protected readonly activeCapitalize = signal(false);
  protected readonly activeBlock = signal<AerisEditorBlock>('paragraph');
  protected readonly activeList = signal<'bullet' | 'number' | 'check' | null>(null);
  protected readonly activeAlignment = signal<AerisEditorAlignment>('left');
  protected readonly availableFormats = computed(() => new Set(this.formats()));

  protected readonly hasInlineActions = computed(() =>
    this.formats().some((format) =>
      [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'code',
        'highlight',
        'subscript',
        'superscript',
        'lowercase',
        'uppercase',
        'capitalize',
      ].includes(format),
    ),
  );
  protected readonly hasBlockActions = computed(() =>
    this.formats().some((format) =>
      [
        'paragraph',
        'heading',
        'heading1',
        'heading2',
        'heading3',
        'heading4',
        'heading5',
        'heading6',
        'quote',
      ].includes(format),
    ),
  );
  protected readonly hasListActions = computed(() =>
    this.formats().some((format) => ['bulletList', 'numberedList', 'checkList'].includes(format)),
  );
  protected readonly hasAlignmentActions = computed(() =>
    this.formats().some((format) =>
      ['alignLeft', 'alignStart', 'alignCenter', 'alignRight', 'alignEnd', 'alignJustify'].includes(
        format,
      ),
    ),
  );
  protected readonly hasDocumentActions = computed(() =>
    this.formats().some((format) => ['outdent', 'indent', 'clear'].includes(format)),
  );

  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly editable = computed(() => !this.effectiveDisabled() && !this.readonly());
  protected readonly toolbarDisabled = computed(() => !this.editable() || !this.isEditorReady());
  protected readonly placeholderVisible = computed(
    () => !this.hasFocus() && !this.textContent().trim() && !!this.placeholder(),
  );

  private editor: LexicalEditor | null = null;
  private unregisterEditor: (() => void) | null = null;
  private lastSyncedValue = '';
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    effect(() => {
      const editable = this.editable();
      this.editor?.setEditable(editable);
    });

    effect(() => {
      const nextValue = this.value();
      if (!this.editor || nextValue === this.lastSyncedValue) return;
      this.writeEditorValue(nextValue);
    });
  }

  ngAfterViewInit(): void {
    this.createEditor();
  }

  ngOnDestroy(): void {
    this.unregisterEditor?.();
    this.unregisterEditor = null;
    this.editor?.setRootElement(null);
    this.editor = null;
    this.isEditorReady.set(false);
  }

  writeValue(value: unknown): void {
    const nextValue = value == null ? '' : String(value);
    this.value.set(nextValue);
    this.writeEditorValue(nextValue);
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  focus(): void {
    this.editor?.focus();
  }

  clear(): void {
    if (!this.editable()) return;
    this.writeEditorValue('');
    this.focus();
  }

  reset(): void {
    this.clear();
  }

  format(format: AerisEditorTextFormat): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  }

  setBlock(block: AerisEditorBlock): void {
    if (!this.editable()) return;
    this.editor?.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (block === 'heading') {
        block = 'h2';
      }

      if (block.startsWith('h') && this.activeBlock() !== block) {
        $setBlocksType(selection, () => $createHeadingNode(block as HeadingTagType));
        return;
      }

      if (block === 'quote' && this.activeBlock() !== 'quote') {
        $setBlocksType(selection, () => $createQuoteNode());
        return;
      }

      $setBlocksType(selection, () => $createParagraphNode());
    });
  }

  toggleBulletList(): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }

  toggleNumberedList(): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }

  toggleCheckList(): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  }

  removeList(): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }

  undo(): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(UNDO_COMMAND, undefined);
  }

  redo(): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(REDO_COMMAND, undefined);
  }

  align(alignment: AerisEditorAlignment): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  }

  indent(): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
  }

  outdent(): void {
    if (!this.editable()) return;
    this.editor?.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
  }

  clearFormatting(): void {
    if (!this.editable()) return;
    this.editor?.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      selection.setFormat(0);
      for (const node of selection.getNodes()) {
        if ($isTextNode(node)) {
          node.setFormat(0);
          node.setStyle('');
        }
      }
    });
  }

  getLexicalEditor(): LexicalEditor | null {
    return this.editor;
  }

  protected handleFocus(event: FocusEvent): void {
    this.hasFocus.set(true);
    this.focused.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }

  protected handleFocusOut(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget;
    const root = this.editorRoot()?.nativeElement;
    if (relatedTarget instanceof Node && root?.parentElement?.contains(relatedTarget)) return;
    this.hasFocus.set(false);
    this.touch.emit();
    this.onTouched();
  }

  private createEditor(): void {
    const rootElement = this.editorRoot()?.nativeElement;
    if (!rootElement) return;

    const extensions = this.extensions();
    const editor = createEditor({
      namespace: this.namespace(),
      html: this.htmlConfig(),
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        ...extensions.flatMap((extension) => extension.nodes ?? []),
      ],
      onError(error) {
        throw error;
      },
      theme: this.resolveTheme(),
    });

    this.editor = editor;
    editor.setRootElement(rootElement);
    editor.setEditable(this.editable());
    this.isEditorReady.set(true);

    const historyState = createEmptyHistoryState();
    const cleanups = [
      registerRichText(editor),
      registerList(editor),
      registerCheckList(editor),
      registerHistory(editor, historyState, 250),
      ...extensions.flatMap((extension) => {
        const cleanup = extension.setup?.(editor);
        return cleanup ? [cleanup] : [];
      }),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            const root = $getRoot();
            const textContent = root.getTextContent();
            const hasStructuredContent = root
              .getChildren()
              .some((node) => !['paragraph', 'heading', 'quote'].includes(node.getType()));
            const html =
              textContent.trim() || hasStructuredContent
                ? $generateHtmlFromNodes(editor, null)
                : '';
            this.syncSelectionState();
            this.emitValue(html, textContent);
          },
          { editor },
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          this.syncSelectionState();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    ];

    this.unregisterEditor = () => {
      for (const cleanup of cleanups) cleanup();
    };

    this.writeEditorValue(this.value());
    this.ready.emit(editor);
  }

  private resolveTheme(): EditorThemeClasses {
    const customTheme = this.lexicalTheme();
    return {
      ...customTheme,
      heading: {
        h1: 'aeris-editor-content__heading aeris-editor-content__heading--h1',
        h2: 'aeris-editor-content__heading aeris-editor-content__heading--h2',
        h3: 'aeris-editor-content__heading aeris-editor-content__heading--h3',
        h4: 'aeris-editor-content__heading aeris-editor-content__heading--h4',
        h5: 'aeris-editor-content__heading aeris-editor-content__heading--h5',
        h6: 'aeris-editor-content__heading aeris-editor-content__heading--h6',
        ...customTheme.heading,
      },
      list: {
        checklist: 'aeris-editor-content__check-list',
        listitem: 'aeris-editor-content__list-item',
        listitemChecked: 'aeris-editor-content__list-item--checked',
        listitemUnchecked: 'aeris-editor-content__list-item--unchecked',
        ol: 'aeris-editor-content__ordered-list',
        ul: 'aeris-editor-content__unordered-list',
        ...customTheme.list,
        nested: {
          listitem: 'aeris-editor-content__nested-list-item',
          ...customTheme.list?.nested,
        },
      },
      paragraph: customTheme.paragraph ?? 'aeris-editor-content__paragraph',
      quote: customTheme.quote ?? 'aeris-editor-content__quote',
      text: {
        bold: 'aeris-editor-content__bold',
        capitalize: 'aeris-editor-content__capitalize',
        code: 'aeris-editor-content__code',
        highlight: 'aeris-editor-content__highlight',
        italic: 'aeris-editor-content__italic',
        lowercase: 'aeris-editor-content__lowercase',
        strikethrough: 'aeris-editor-content__strikethrough',
        subscript: 'aeris-editor-content__subscript',
        superscript: 'aeris-editor-content__superscript',
        underline: 'aeris-editor-content__underline',
        underlineStrikethrough:
          'aeris-editor-content__underline aeris-editor-content__strikethrough',
        uppercase: 'aeris-editor-content__uppercase',
        ...customTheme.text,
      },
    };
  }

  private writeEditorValue(value: string): void {
    if (!this.editor) return;
    this.lastSyncedValue = value;
    this.editor.update(() => {
      const root = $getRoot();
      root.clear();
      const sanitizedValue = this.sanitizer.sanitize(SecurityContext.HTML, value) ?? '';

      if (!sanitizedValue.trim()) {
        root.append($createParagraphNode());
        this.textContent.set('');
        return;
      }

      const Parser = this.document.defaultView?.DOMParser;
      if (!Parser) {
        root.append($createParagraphNode());
        this.textContent.set('');
        return;
      }

      const parser = new Parser();
      const dom = parser.parseFromString(sanitizedValue, 'text/html');
      const nodes = $generateNodesFromDOM(this.editor as LexicalEditor, dom);
      root.append(...(nodes.length ? nodes : [$createParagraphNode()]));
      this.textContent.set(root.getTextContent());
    });
  }

  private emitValue(value: string, textContent: string): void {
    this.textContent.set(textContent);
    this.syncSelectionState();
    if (value === this.lastSyncedValue && value === this.value()) return;

    this.lastSyncedValue = value;
    this.value.set(value);
    this.valueInput.emit(value);
    this.changed.emit({ value, textContent });
    this.onChange(value);
  }

  private syncSelectionState(): void {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      this.activeBold.set(false);
      this.activeItalic.set(false);
      this.activeUnderline.set(false);
      this.activeStrikethrough.set(false);
      this.activeCode.set(false);
      this.activeHighlight.set(false);
      this.activeSubscript.set(false);
      this.activeSuperscript.set(false);
      this.activeLowercase.set(false);
      this.activeUppercase.set(false);
      this.activeCapitalize.set(false);
      this.activeBlock.set('paragraph');
      this.activeList.set(null);
      this.activeAlignment.set('left');
      return;
    }

    this.activeBold.set(selection.hasFormat('bold'));
    this.activeItalic.set(selection.hasFormat('italic'));
    this.activeUnderline.set(selection.hasFormat('underline'));
    this.activeStrikethrough.set(selection.hasFormat('strikethrough'));
    this.activeCode.set(selection.hasFormat('code'));
    this.activeHighlight.set(selection.hasFormat('highlight'));
    this.activeSubscript.set(selection.hasFormat('subscript'));
    this.activeSuperscript.set(selection.hasFormat('superscript'));
    this.activeLowercase.set(selection.hasFormat('lowercase'));
    this.activeUppercase.set(selection.hasFormat('uppercase'));
    this.activeCapitalize.set(selection.hasFormat('capitalize'));

    const nodes = selection.getNodes();
    const topLevel = nodes[0]?.getTopLevelElementOrThrow();
    if (topLevel instanceof HeadingNode) {
      this.activeBlock.set(topLevel.getTag());
    } else if (topLevel instanceof QuoteNode) {
      this.activeBlock.set('quote');
    } else {
      this.activeBlock.set('paragraph');
    }

    const elementAlignment = $isElementNode(topLevel) ? topLevel.getFormatType() : '';
    this.activeAlignment.set(
      elementAlignment === 'center' ||
        elementAlignment === 'start' ||
        elementAlignment === 'right' ||
        elementAlignment === 'end' ||
        elementAlignment === 'justify'
        ? elementAlignment
        : 'left',
    );

    let currentNode: LexicalNode | null = nodes[0] ?? null;
    while (currentNode && !(currentNode instanceof ListNode)) {
      currentNode = currentNode.getParent();
    }
    this.activeList.set(currentNode instanceof ListNode ? currentNode.getListType() : null);
  }
}

export const AerisEditor = [AerisEditorComponent] as const;
