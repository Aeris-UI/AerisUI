import { Component, computed, input, output } from '@angular/core';
import { parseAerisColor } from '@aeris-ui/core/theming';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';
import { AerisButton } from '@aeris-ui/core/button';
import type { LabColorField } from './design-lab-theme';

@Component({
  selector: 'app-lab-color-fields',
  imports: [AerisColorPicker, AerisButton],
  template: `
    @for (field of rows(); track field.key) {
      <div class="field">
        <label [for]="field.id"
          >{{ field.label }} <small>{{ field.state }}</small></label
        >
        <aeris-color-picker
          size="sm"
          [inputId]="field.id"
          [value]="field.pickerValue"
          [showInput]="false"
          [showFormat]="false"
          [ariaLabel]="'Choose ' + field.label + ' color'"
          [ariaDescribedBy]="error()?.id === field.id ? field.id + '-error' : ''"
          [invalid]="error()?.id === field.id"
          (valueChange)="valueChange.emit({ key: field.key, value: $event })"
        />
        @if (field.custom) {
          <small>Custom value preserved until you choose a color.</small>
          <code>{{ field.value }}</code>
        }
        <div class="actions">
          <button
            aerisButton
            type="button"
            variant="ghost"
            size="xs"
            [disabled]="field.state === 'Inherited' && error()?.id !== field.id"
            [attr.aria-label]="'Inherit ' + field.label"
            (click)="inherit.emit(field.key)"
          >
            Inherit
          </button>
          @if (allowAutomatic()) {
            <button
              aerisButton
              type="button"
              variant="ghost"
              size="xs"
              [disabled]="field.state === 'Automatic'"
              [attr.aria-label]="'Automatically derive ' + field.label"
              (click)="automatic.emit(field.key)"
            >
              Auto
            </button>
          }
        </div>
        @if (error()?.id === field.id) {
          <span [id]="field.id + '-error'" role="alert">{{ error()?.message }}</span>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
      gap: 1rem;
      padding-block: 1rem;
    }
    .field {
      display: grid;
      align-content: start;
      gap: 0.35rem;
      min-width: 0;
    }
    label {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.35rem;
      font-size: 0.875rem;
      color: var(--text);
    }
    small {
      color: var(--text-2);
      font-size: 0.8125rem;
    }
    code {
      overflow-wrap: anywhere;
      font-size: 0.8125rem;
    }
    aeris-color-picker {
      min-width: 0;
      max-width: 100%;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    [role='alert'] {
      color: var(--aeris-danger-text);
      font-size: 0.8125rem;
    }
  `,
})
export class DesignLabColorFields<T extends string> {
  readonly fields = input.required<readonly LabColorField<T>[]>();
  readonly allowAutomatic = input(false);
  readonly error = input<{ readonly id: string; readonly message: string } | null>(null);
  readonly valueChange = output<{ readonly key: T; readonly value: string }>();
  readonly inherit = output<T>();
  readonly automatic = output<T>();
  protected readonly rows = computed(() =>
    this.fields().map((field) => {
      const custom = parseAerisColor(field.value) === null;
      return { ...field, custom, pickerValue: custom ? '#000000' : field.value };
    }),
  );
}
