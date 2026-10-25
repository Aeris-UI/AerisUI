import { Component, input, output, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import type { AerisContrastProperty } from '@aeris-ui/core/theming';
import type { LabContrastColor } from './design-lab-contrast';

@Component({
  selector: 'app-lab-contrast-trace',
  imports: [AerisButton],
  template: `
    <details #trace (toggle)="open.set(trace.open)">
      <summary>
        Trace colors<span class="visually-hidden"> for {{ label() }}</span>
      </summary>
      @if (open()) {
        @for (color of colors(); track color.role) {
          <div class="color">
            <strong>{{ color.role }} · {{ color.source }}</strong>
            <code>{{ color.path }}</code>
            <code>{{ color.token }}</code>
            <code>{{ color.value }}</code>
            <button
              aerisButton
              type="button"
              variant="ghost"
              size="xs"
              [attr.aria-label]="'Edit ' + color.path"
              (click)="edit.emit(color.property)"
            >
              Edit {{ color.role === 'Foreground' ? 'foreground' : 'background' }}
            </button>
          </div>
        }
        <small
          >Override: your exact value. Starter value: inherited from the preset. Derived: calculated
          from related theme colors. Automatic: explicitly requested derivation. Edit opens this
          scheme's color control; Inherit restores the preset behavior.</small
        >
      }
    </details>
  `,
  styles: `
    :host {
      display: block;
      margin-block-start: 0.5rem;
      font-weight: 400;
    }
    summary {
      cursor: pointer;
      color: var(--text);
      padding-block: 0.35rem;
    }
    .color {
      display: grid;
      justify-items: start;
      gap: 0.25rem;
      margin-block: 0.75rem;
    }
    code {
      overflow-wrap: anywhere;
      font-size: 0.8125rem;
    }
    small {
      display: block;
      color: var(--text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
  `,
})
export class DesignLabContrastTrace {
  protected readonly open = signal(false);
  readonly colors = input.required<readonly LabContrastColor[]>();
  readonly label = input.required<string>();
  readonly edit = output<AerisContrastProperty>();
}
