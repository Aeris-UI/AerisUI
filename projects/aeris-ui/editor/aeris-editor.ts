import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  TemplateRef,
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
import { ɵaerisDisplayInvalid } from '@aeris-ui/core';
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
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-editor"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-invalid]="displayInvalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-fluid]="fluid() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (showToolbar()) {
        <div class="aeris-editor__toolbar" role="toolbar" [attr.aria-label]="toolbarAriaLabel()">
          @if (availableFormats().has('undo')) {
            <button type="button" aria-label="Undo" [disabled]="toolbarDisabled()" (click)="undo()">
              @if (toolbarIcons()['undo']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              }
            </button>
          }
          @if (availableFormats().has('redo')) {
            <button type="button" aria-label="Redo" [disabled]="toolbarDisabled()" (click)="redo()">
              @if (toolbarIcons()['redo']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M21 7v6h-6" />
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
                </svg>
              }
            </button>
          }

          @if (toolbarSeparators().inline) {
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
              @if (toolbarIcons()['bold']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
                </svg>
              }
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
              @if (toolbarIcons()['italic']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <line x1="19" x2="10" y1="4" y2="4" />
                  <line x1="14" x2="5" y1="20" y2="20" />
                  <line x1="15" x2="9" y1="4" y2="20" />
                </svg>
              }
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
              @if (toolbarIcons()['underline']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M6 4v6a6 6 0 0 0 12 0V4" />
                  <line x1="4" x2="20" y1="20" y2="20" />
                </svg>
              }
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
              @if (toolbarIcons()['strikethrough']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M16 4H9a3 3 0 0 0-2.83 4" />
                  <path d="M14 12a4 4 0 0 1 0 8H6" />
                  <line x1="4" x2="20" y1="12" y2="12" />
                </svg>
              }
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
              @if (toolbarIcons()['code']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m16 18 6-6-6-6" />
                  <path d="m8 6-6 6 6 6" />
                </svg>
              }
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
              @if (toolbarIcons()['highlight']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m9 11-6 6v3h9l3-3" />
                  <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
                </svg>
              }
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
              @if (toolbarIcons()['subscript']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m4 5 8 8" />
                  <path d="m12 5-8 8" />
                  <path
                    d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"
                  />
                </svg>
              }
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
              @if (toolbarIcons()['superscript']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m4 19 8-8" />
                  <path d="m12 19-8-8" />
                  <path
                    d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06"
                  />
                </svg>
              }
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
              @if (toolbarIcons()['lowercase']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M10 9v7" />
                  <path d="M14 6v10" />
                  <circle cx="17.5" cy="12.5" r="3.5" />
                  <circle cx="6.5" cy="12.5" r="3.5" />
                </svg>
              }
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
              @if (toolbarIcons()['uppercase']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M15 11h4.5a1 1 0 0 1 0 5h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h3a1 1 0 0 1 0 5"
                  />
                  <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
                  <path d="M3.304 13h6.392" />
                </svg>
              }
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
              @if (toolbarIcons()['capitalize']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
                  <path d="M22 9v7" />
                  <path d="M3.304 13h6.392" />
                  <circle cx="18.5" cy="12.5" r="3.5" />
                </svg>
              }
            </button>
          }

          @if (toolbarSeparators().block) {
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
              @if (toolbarIcons()['paragraph']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M13 4v16" />
                  <path d="M17 4v16" />
                  <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" />
                </svg>
              }
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
              @if (toolbarIcons()['heading1']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <path d="m17 12 3-2v8" />
                </svg>
              }
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
              @if (toolbarIcons()['heading']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
                </svg>
              }
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
              @if (toolbarIcons()['heading2']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
                </svg>
              }
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
              @if (toolbarIcons()['heading3']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
                  <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
                </svg>
              }
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
              @if (toolbarIcons()['heading4']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12 18V6" />
                  <path d="M17 10v3a1 1 0 0 0 1 1h3" />
                  <path d="M21 10v8" />
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                </svg>
              }
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
              @if (toolbarIcons()['heading5']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <path d="M17 13v-3h4" />
                  <path d="M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17" />
                </svg>
              }
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
              @if (toolbarIcons()['heading6']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <circle cx="19" cy="16" r="2" />
                  <path d="M20 10c-2 2-3 3.5-3 6" />
                </svg>
              }
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
              @if (toolbarIcons()['quote']; as customIcon) {
                <span class="aeris-custom-icon" data-aeris-custom-icon aria-hidden="true"
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
                  />
                  <path
                    d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
                  />
                </svg>
              }
            </button>
          }

          @if (toolbarSeparators().list) {
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
              @if (toolbarIcons()['bulletList']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M3 5h.01" />
                  <path d="M3 12h.01" />
                  <path d="M3 19h.01" />
                  <path d="M8 5h13" />
                  <path d="M8 12h13" />
                  <path d="M8 19h13" />
                </svg>
              }
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
              @if (toolbarIcons()['numberedList']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M11 5h10" />
                  <path d="M11 12h10" />
                  <path d="M11 19h10" />
                  <path d="M4 4h1v5" />
                  <path d="M4 9h2" />
                  <path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
                </svg>
              }
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
              @if (toolbarIcons()['checkList']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M13 5h8" />
                  <path d="M13 12h8" />
                  <path d="M13 19h8" />
                  <path d="m3 17 2 2 4-4" />
                  <path d="m3 7 2 2 4-4" />
                </svg>
              }
            </button>
          }

          @if (toolbarSeparators().alignment) {
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
              @if (toolbarIcons()['alignLeft']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M21 5H3" />
                  <path d="M15 12H3" />
                  <path d="M17 19H3" />
                </svg>
              }
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
              @if (toolbarIcons()['alignStart']; as customIcon) {
                <span
                  class="aeris-custom-icon aeris-editor__logical-icon"
                  aria-hidden="true"
                  data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg class="aeris-editor__logical-icon" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M21 5H3" />
                  <path d="M15 12H3" />
                  <path d="M17 19H3" />
                </svg>
              }
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
              @if (toolbarIcons()['alignCenter']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M21 5H3" />
                  <path d="M17 12H7" />
                  <path d="M19 19H5" />
                </svg>
              }
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
              @if (toolbarIcons()['alignRight']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M21 5H3" />
                  <path d="M21 12H9" />
                  <path d="M21 19H7" />
                </svg>
              }
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
              @if (toolbarIcons()['alignEnd']; as customIcon) {
                <span
                  class="aeris-custom-icon aeris-editor__logical-icon"
                  aria-hidden="true"
                  data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg class="aeris-editor__logical-icon" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M21 5H3" />
                  <path d="M21 12H9" />
                  <path d="M21 19H7" />
                </svg>
              }
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
              @if (toolbarIcons()['alignJustify']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M3 5h18" />
                  <path d="M3 12h18" />
                  <path d="M3 19h18" />
                </svg>
              }
            </button>
          }

          @if (toolbarSeparators().document) {
            <span class="aeris-editor__separator" aria-hidden="true"></span>
          }
          @if (availableFormats().has('outdent')) {
            <button
              type="button"
              aria-label="Decrease indent"
              [disabled]="toolbarDisabled()"
              (click)="outdent()"
            >
              @if (toolbarIcons()['outdent']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg class="aeris-editor__logical-icon" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M21 5H11" />
                  <path d="M21 12H11" />
                  <path d="M21 19H11" />
                  <path d="m7 8-4 4 4 4" />
                </svg>
              }
            </button>
          }
          @if (availableFormats().has('indent')) {
            <button
              type="button"
              aria-label="Increase indent"
              [disabled]="toolbarDisabled()"
              (click)="indent()"
            >
              @if (toolbarIcons()['indent']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg class="aeris-editor__logical-icon" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M21 5H11" />
                  <path d="M21 12H11" />
                  <path d="M21 19H11" />
                  <path d="m3 8 4 4-4 4" />
                </svg>
              }
            </button>
          }
          @if (availableFormats().has('clear')) {
            <button
              type="button"
              aria-label="Clear formatting"
              [disabled]="toolbarDisabled()"
              (click)="clearFormatting()"
            >
              @if (toolbarIcons()['clear']; as customIcon) {
                <span class="aeris-custom-icon" aria-hidden="true" data-aeris-custom-icon
                  ><ng-container [ngTemplateOutlet]="customIcon"
                /></span>
              } @else {
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4 7V4h16v3" />
                  <path d="M5 20h6" />
                  <path d="M13 4 8 20" />
                  <path d="m15 15 5 5" />
                  <path d="m20 15-5 5" />
                </svg>
              }
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
          [attr.aria-labelledby]="ariaLabelledBy() || null"
          [attr.aria-describedby]="ariaDescribedBy() || null"
          [attr.aria-invalid]="displayInvalid() || null"
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
  readonly toolbarIcons = input<Readonly<Partial<Record<AerisEditorFormat, TemplateRef<void>>>>>(
    {},
  );
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  readonly value = model('');
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('Write something...');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
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
  readonly touched = input<boolean | null>(null);
  protected readonly displayInvalid = computed(() =>
    ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly showToolbar = input(true, { transform: booleanAttribute });

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
  protected readonly toolbarSeparators = computed(() => {
    let hasPreviousGroup =
      this.availableFormats().has('undo') || this.availableFormats().has('redo');
    const beforeGroup = (hasActions: boolean) => {
      const show = hasPreviousGroup && hasActions;
      hasPreviousGroup ||= hasActions;
      return show;
    };
    return {
      inline: beforeGroup(this.hasInlineActions()),
      block: beforeGroup(this.hasBlockActions()),
      list: beforeGroup(this.hasListActions()),
      alignment: beforeGroup(this.hasAlignmentActions()),
      document: beforeGroup(this.hasDocumentActions()),
    };
  });

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
