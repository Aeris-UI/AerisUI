import { Component, computed, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisTextarea } from '@aeris-ui/core/textarea';
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

@Component({
  selector: 'app-textarea-page',
  imports: [
    AerisTextarea,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './textarea.page.html',
  styleUrl: './textarea.page.scss',
})
export class TextareaPage {
  protected readonly notes = signal(
    'Aeris keeps multiline content comfortable to read and edit.',
  );
  protected readonly summary = signal('A concise project summary.');
  protected readonly feedback = signal('');
  protected readonly feedbackTouched = signal(false);
  protected readonly feedbackInvalid = computed(
    () => this.feedbackTouched() && this.feedback().trim().length < 10,
  );
  protected readonly reactiveText = new FormControl('Reactive form value');
  protected templateText = 'Template-driven value';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'textarea-basic', label: 'Basic' },
    { id: 'textarea-signal', label: 'Signal value' },
    { id: 'textarea-auto-resize', label: 'Auto resize' },
    { id: 'textarea-auto-resize-bounds', label: 'Resize bounds' },
    { id: 'textarea-counter', label: 'Character counter' },
    { id: 'textarea-sizes', label: 'Sizes' },
    { id: 'textarea-appearances', label: 'Appearances' },
    { id: 'textarea-resize', label: 'Resize directions' },
    { id: 'textarea-states', label: 'States' },
    { id: 'textarea-validation', label: 'Validation' },
    { id: 'textarea-fluid', label: 'Fluid layout' },
    { id: 'textarea-clear', label: 'Clear button' },
    { id: 'textarea-angular-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'textarea-api-directive', label: 'Directive inputs' },
    { id: 'textarea-api-native', label: 'Native API' },
    { id: 'textarea-api-wrapper', label: 'Wrapper inputs' },
    { id: 'textarea-api-outputs', label: 'Outputs' },
    { id: 'textarea-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisTextarea } from '@aeris-ui/core/textarea';`;

  protected readonly signalCode = `protected readonly notes = signal(
  'Aeris keeps multiline content comfortable to read and edit.',
);`;

  protected readonly validationCode = `protected readonly feedback = signal('');
protected readonly feedbackTouched = signal(false);
protected readonly feedbackInvalid = computed(
  () =>
    this.feedbackTouched() &&
    this.feedback().trim().length < 10,
);`;

  protected readonly formsCode = `protected readonly reactiveText =
  new FormControl('Reactive form value');

protected templateText = 'Template-driven value';`;

  protected readonly interfacesCode = `type AerisTextareaSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg';

type AerisTextareaAppearance =
  | 'outline'
  | 'filled';

type AerisTextareaResize =
  | 'none'
  | 'vertical'
  | 'horizontal'
  | 'both';`;

  protected readonly directiveInputs: readonly ApiRow[] = [
    {
      name: 'size',
      type: 'AerisTextareaSize',
      defaultValue: "'md'",
      description: 'Sets the padding, font size, and minimum height.',
    },
    {
      name: 'appearance',
      type: 'AerisTextareaAppearance',
      defaultValue: "'outline'",
      description: 'Selects the outlined or filled surface treatment.',
    },
    {
      name: 'resize',
      type: 'AerisTextareaResize',
      defaultValue: "'vertical'",
      description: 'Controls the native browser resize handle.',
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
      description: 'Expands the textarea to its container width.',
    },
  ];

  protected readonly wrapperInputs: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'string (model)',
      defaultValue: "''",
      description: 'Current value with two-way binding support.',
    },
    {
      name: 'inputId',
      type: 'string',
      defaultValue: 'generated',
      description: 'ID assigned to the internal native textarea.',
    },
    {
      name: 'name',
      type: 'string',
      defaultValue: "''",
      description: 'Native form control name.',
    },
    {
      name: 'placeholder',
      type: 'string',
      defaultValue: "''",
      description: 'Native placeholder text.',
    },
    {
      name: 'autocomplete',
      type: 'string',
      defaultValue: "'off'",
      description: 'Native autocomplete hint.',
    },
    {
      name: 'rows',
      type: 'number',
      defaultValue: '3',
      description: 'Initial visible row count.',
    },
    {
      name: 'cols',
      type: 'number | undefined',
      defaultValue: 'undefined',
      description: 'Native suggested column count.',
    },
    {
      name: 'wrap',
      type: "'soft' | 'hard' | 'off'",
      defaultValue: "'soft'",
      description: 'Controls native line wrapping and submitted values.',
    },
    {
      name: 'minLength',
      type: 'number | undefined',
      defaultValue: 'undefined',
      description: 'Native minimum character constraint.',
    },
    {
      name: 'maxLength',
      type: 'number | undefined',
      defaultValue: 'undefined',
      description: 'Native maximum character constraint.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name when no visible label is available.',
    },
    {
      name: 'ariaLabelledby',
      type: 'string',
      defaultValue: "''",
      description: 'IDs of elements that label the textarea.',
    },
    {
      name: 'ariaDescribedby',
      type: 'string',
      defaultValue: "''",
      description: 'IDs of help or validation messages.',
    },
    ...this.directiveInputs,
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables editing and the clear action.',
    },
    {
      name: 'readonly',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Allows focus and selection without editing.',
    },
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Exposes native required semantics.',
    },
    {
      name: 'autoResize',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Grows the control vertically with its content.',
    },
    {
      name: 'minRows',
      type: 'number',
      defaultValue: '3',
      description: 'Minimum rows used by automatic resizing.',
    },
    {
      name: 'maxRows',
      type: 'number | undefined',
      defaultValue: 'undefined',
      description: 'Maximum rows before vertical scrolling begins.',
    },
    {
      name: 'showCount',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Displays the current character count.',
    },
    {
      name: 'countLive',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Announces counter changes through a polite live region.',
    },
    {
      name: 'clearable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows an accessible clear button while a value exists.',
    },
    {
      name: 'clearButtonAriaLabel',
      type: 'string',
      defaultValue: "'Clear text'",
      description: 'Accessible name for the clear button.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'string', defaultValue: '-', description: 'Emits for two-way value model changes.' },
    { name: 'valueInput', type: 'string', defaultValue: '-', description: 'Emits whenever user input changes the value.' },
    { name: 'focused', type: 'FocusEvent', defaultValue: '-', description: 'Emits when the internal textarea receives focus.' },
    { name: 'blurred', type: 'FocusEvent', defaultValue: '-', description: 'Emits when the internal textarea loses focus.' },
    { name: 'scrolled', type: 'Event', defaultValue: '-', description: 'Emits when textarea content scrolls.' },
    { name: 'touch', type: 'void', defaultValue: '-', description: 'Emits when blur marks the control as touched.' },
    { name: 'cleared', type: 'void', defaultValue: '-', description: 'Emits after the clear action succeeds.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus(options?)', type: 'void', defaultValue: '-', description: 'Moves focus to the native textarea.' },
    { name: 'clear()', type: 'void', defaultValue: '-', description: 'Clears an editable value and restores focus.' },
    { name: 'reset()', type: 'void', defaultValue: '-', description: 'Sets the value to an empty string.' },
    { name: 'resizeToContent()', type: 'void', defaultValue: '-', description: 'Recalculates height when autoResize is enabled.' },
  ];

  protected updateFeedback(event: Event): void {
    this.feedback.set((event.target as HTMLTextAreaElement).value);
  }
}
