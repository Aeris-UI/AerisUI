import { Component, input, model } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { DOC_ICONS } from './doc-icons';

@Component({
  selector: 'app-example-toolbar',
  imports: [AerisButton, LucideDynamicIcon],
  template: `
    <span class="preview-label">Preview</span>
    <button
      aerisButton
      variant="ghost"
      size="sm"
      [attr.aria-controls]="panelId()"
      [attr.aria-expanded]="codeVisible()"
      [attr.aria-label]="(codeVisible() ? 'Hide code for ' : 'Show code for ') + title()"
      (click)="codeVisible.set(!codeVisible())"
    >
      <svg [lucideIcon]="icons.Code" aria-hidden="true"></svg>
      {{ codeVisible() ? 'Hide code' : 'Show code' }}
    </button>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.5rem clamp(1rem, 3vw, 1.5rem) 0;
      min-inline-size: 0;
    }
    .preview-label {
      font-size: 0.8125rem;
      color: var(--text-2);
      font-weight: 500;
    }
  `,
})
export class ExampleToolbarComponent {
  readonly panelId = input.required<string>();
  readonly title = input.required<string>();
  readonly codeVisible = model(true);
  protected readonly icons = DOC_ICONS;
}
