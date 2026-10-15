import { Component, computed, input, output } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import type { LabColorField } from './design-lab-theme';
import {
  LAB_DEFAULT_SHADOW,
  parseLabShadow,
  serializeLabShadow,
  type LabShadow,
} from './design-lab-shadow';

@Component({
  selector: 'app-lab-shadow-fields',
  imports: [AerisButton, AerisCheckbox, AerisColorPicker, AerisInputNumber],
  template: `
    @for (row of rows(); track row.key) {
      <fieldset>
        <legend>
          {{ row.label }} <small>{{ row.state }}</small>
        </legend>
        @if (row.shadow; as shadow) {
          <div class="parameters">
            @for (parameter of parameters; track parameter.key) {
              <div class="parameter">
                <label [for]="row.id + '-' + parameter.key">{{ parameter.label }}</label>
                <aeris-input-number
                  size="sm"
                  [inputId]="row.id + '-' + parameter.key"
                  [ariaLabel]="row.label + ' ' + parameter.label"
                  [value]="shadow[parameter.key]"
                  [min]="parameter.key === 'blur' ? 0 : undefined"
                  suffix="px"
                  [maxFractionDigits]="2"
                  [fluid]="true"
                  (valueChange)="setNumber(row.key, shadow, parameter.key, $event)"
                />
              </div>
            }
            <div class="parameter">
              <label [for]="row.id + '-opacity'">Opacity</label>
              <aeris-input-number
                size="sm"
                [inputId]="row.id + '-opacity'"
                [ariaLabel]="row.label + ' opacity'"
                [value]="row.opacityPercent"
                [min]="0"
                [max]="100"
                suffix="%"
                [maxFractionDigits]="2"
                [fluid]="true"
                (valueChange)="setOpacity(row.key, shadow, $event)"
              />
            </div>
            <div class="parameter">
              <label [for]="row.id + '-color'">Color</label>
              <aeris-color-picker
                size="sm"
                [inputId]="row.id + '-color'"
                [ariaLabel]="row.label + ' color'"
                [showInput]="false"
                [showFormat]="false"
                [value]="shadow.color"
                (valueChange)="setColor(row.key, shadow, $event)"
              />
            </div>
          </div>
          <aeris-checkbox
            label="Inset"
            [inputId]="row.id + '-inset'"
            [checked]="shadow.inset"
            (checkedChange)="setInset(row.key, shadow, $event)"
          />
        } @else {
          <p>This custom or disabled shadow stays unchanged until you replace it.</p>
          <code>{{ row.value }}</code>
          <button aerisButton type="button" size="sm" variant="outline" (click)="replace(row.key)">
            Use editable shadow
          </button>
        }
        <button
          aerisButton
          type="button"
          size="xs"
          variant="ghost"
          [disabled]="row.state === 'Inherited'"
          [attr.aria-label]="'Inherit ' + row.label"
          (click)="inherit.emit(row.key)"
        >
          Inherit
        </button>
      </fieldset>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: 1rem;
    }
    fieldset {
      min-width: 0;
      margin: 0;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: var(--aeris-radius-md);
    }
    legend {
      padding-inline: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
    }
    small {
      color: var(--text-2);
      font-weight: 400;
      margin-inline-start: 0.5rem;
    }
    .parameters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
      gap: 0.75rem;
      margin-block-end: 1rem;
    }
    .parameter {
      min-width: 0;
      display: grid;
      align-content: start;
      gap: 0.35rem;
      font-size: 0.875rem;
    }
    aeris-input-number,
    aeris-color-picker {
      min-width: 0;
      max-width: 100%;
    }
    code {
      display: block;
      overflow-wrap: anywhere;
      margin-block: 0.5rem;
    }
  `,
})
export class DesignLabShadowFields<T extends string> {
  readonly fields = input.required<readonly LabColorField<T>[]>();
  readonly valueChange = output<{ readonly key: T; readonly value: string }>();
  readonly inherit = output<T>();
  protected readonly rows = computed(() =>
    this.fields().map((field) => {
      const shadow = parseLabShadow(field.value);
      return {
        ...field,
        shadow,
        opacityPercent: shadow ? Number((shadow.opacity * 100).toFixed(2)) : 0,
      };
    }),
  );
  protected readonly parameters = [
    { key: 'x', label: 'Horizontal offset' },
    { key: 'y', label: 'Vertical offset' },
    { key: 'blur', label: 'Blur' },
    { key: 'spread', label: 'Spread' },
  ] as const;
  protected change(key: T, shadow: LabShadow): void {
    this.valueChange.emit({ key, value: serializeLabShadow(shadow) });
  }
  protected replace(key: T): void {
    this.change(key, LAB_DEFAULT_SHADOW);
  }
  protected setNumber(
    key: T,
    shadow: LabShadow,
    property: 'x' | 'y' | 'blur' | 'spread',
    value: number | null,
  ): void {
    if (value !== null && Number.isFinite(value))
      this.change(key, { ...shadow, [property]: property === 'blur' ? Math.max(0, value) : value });
  }
  protected setOpacity(key: T, shadow: LabShadow, value: number | null): void {
    if (value !== null && Number.isFinite(value))
      this.change(key, { ...shadow, opacity: Math.min(100, Math.max(0, value)) / 100 });
  }
  protected setColor(key: T, shadow: LabShadow, color: string): void {
    this.change(key, { ...shadow, color });
  }
  protected setInset(key: T, shadow: LabShadow, inset: boolean): void {
    this.change(key, { ...shadow, inset });
  }
}
