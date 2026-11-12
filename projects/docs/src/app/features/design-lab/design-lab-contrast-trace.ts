import { Component, input, output, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisAccordionModule, type AerisAccordionValue } from '@aeris-ui/core/accordion';
import type { AerisContrastProperty } from '@aeris-ui/core/theming';
import type { LabContrastColor } from './design-lab-contrast';

@Component({
  selector: 'app-lab-contrast-trace',
  imports: [AerisButton, AerisAccordionModule],
  template: `
    <aeris-accordion size="sm" [(value)]="open" [headingLevel]="5">
      <aeris-accordion-panel value="trace" header="Trace colors">
        <ng-template aerisAccordionHeader>
          Trace colors<span class="visually-hidden"> for {{ label() }}</span>
        </ng-template>
        @if (open() === 'trace') {
          <div class="trace-content">
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
              >Override: your exact value. Starter value: inherited from the preset. Derived:
              calculated from related theme colors. Automatic: explicitly requested derivation. Edit
              opens this scheme's color control; Inherit restores the preset behavior.</small
            >
          </div>
        }
      </aeris-accordion-panel>
    </aeris-accordion>
  `,
  styles: `
    :host {
      display: block;
      margin-block-start: 0.5rem;
      font-weight: 400;
    }
    .color {
      display: grid;
      justify-items: start;
      gap: 0.25rem;
    }
    .trace-content {
      display: grid;
      gap: var(--aeris-surface-padding-sm, 0.875rem);
      padding-block-start: var(--aeris-density-gap, 0.5rem);
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
  protected readonly open = signal<AerisAccordionValue>('');
  readonly colors = input.required<readonly LabContrastColor[]>();
  readonly label = input.required<string>();
  readonly edit = output<AerisContrastProperty>();
}
