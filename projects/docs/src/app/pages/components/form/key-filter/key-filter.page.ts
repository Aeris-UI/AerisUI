import { Component, signal } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputText } from '@aeris-ui/core/input-text';
import {
  AerisKeyFilter,
  type AerisKeyFilterRejectEvent,
} from '@aeris-ui/core/key-filter';
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
  selector: 'app-key-filter-page',
  imports: [
    AerisTextarea,
    AerisInputText,
    AerisKeyFilter,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './key-filter.page.html',
  styleUrl: './key-filter.page.scss',
})
export class KeyFilterPage {
  protected readonly rejectedValue = signal('No rejected input yet.');
  protected validateOnlyValue = '';
  protected readonly reactiveCode = new FormControl('');
  protected templateCode = '';
  protected readonly uppercasePattern = /^[A-Z]*$/;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'key-filter-basic', label: 'Basic' },
    { id: 'key-filter-presets', label: 'Presets' },
    { id: 'key-filter-decimals', label: 'Numbers' },
    { id: 'key-filter-custom', label: 'Custom pattern' },
    { id: 'key-filter-validate-only', label: 'Validate only' },
    { id: 'key-filter-textarea', label: 'Textarea' },
    { id: 'key-filter-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'key-filter-api-inputs', label: 'Inputs' },
    { id: 'key-filter-api-outputs', label: 'Outputs' },
    { id: 'key-filter-api-presets', label: 'Presets' },
  ];

  protected readonly importCode =
    `import { AerisKeyFilter } from '@aeris-ui/core/key-filter';`;

  protected readonly customPatternCode = `protected readonly uppercasePattern = /^[A-Z]*$/;`;

  protected readonly validateOnlyCode = `protected validateOnlyValue = '';

protected recordRejected(event: AerisKeyFilterRejectEvent): void {
  this.rejectedValue.set(\`\${event.reason}: \${event.attemptedValue || 'empty'}\`);
}`;

  protected readonly formsCode = `protected readonly reactiveCode = new FormControl('');
protected templateCode = '';`;

  protected readonly interfacesCode = `type AerisKeyFilterPreset =
  | 'int'
  | 'pint'
  | 'num'
  | 'pnum'
  | 'hex'
  | 'alpha'
  | 'alphanum'
  | 'email';

type AerisKeyFilterPattern =
  | AerisKeyFilterPreset
  | RegExp
  | string;

type AerisKeyFilterRejectReason =
  | 'key'
  | 'paste'
  | 'input';

interface AerisKeyFilterRejectEvent {
  readonly originalEvent: KeyboardEvent | ClipboardEvent | InputEvent | CompositionEvent;
  readonly reason: AerisKeyFilterRejectReason;
  readonly value: string;
  readonly attemptedValue: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'aerisKeyFilter', type: 'AerisKeyFilterPattern', defaultValue: "'alphanum'", description: 'Preset name or developer-authored RegExp/string pattern used to evaluate the full attempted value. Malformed and overlong string patterns reject safely.' },
    { name: 'validateOnly', type: 'boolean', defaultValue: 'false', description: 'Emits rejected events for invalid input without blocking or restoring the value.' },
    { name: 'allowPaste', type: 'boolean', defaultValue: 'true', description: 'Allows paste attempts when the pasted result satisfies the filter. Set false to block paste entirely.' },
  ];

  protected recordRejected(event: AerisKeyFilterRejectEvent): void {
    this.rejectedValue.set(`${event.reason}: ${event.attemptedValue || 'empty'}`);
  }
}
