import { type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type ControlValueAccessor } from '@angular/forms';
import { AerisAutoComplete } from '../../../auto-complete/aeris-auto-complete';
import { AerisCascadeSelect } from '../../../cascade-select/aeris-cascade-select';
import { AerisColorPicker } from '../../../color-picker/aeris-color-picker';
import { AerisDatePicker } from '../../../date-picker/aeris-date-picker';
import { AerisEditorComponent } from '../../../editor/aeris-editor';
import { AerisInputOtpComponent } from '../../../input-otp/aeris-input-otp';
import { AerisMultiSelectComponent } from '../../../multi-select/aeris-multi-select';
import { AerisRating } from '../../../rating/aeris-rating';
import { AerisSelectComponent } from '../../../select/aeris-select';
import { AerisSlider } from '../../../slider/aeris-slider';
import { AerisTreeSelectComponent } from '../../../tree-select/aeris-tree-select';

const options = [{ label: 'One', value: 'one' }];
const cases: readonly {
  name: string;
  component: Type<unknown>;
  inputs: Record<string, unknown>;
}[] = [
  { name: 'AutoComplete', component: AerisAutoComplete, inputs: { value: 'one' } },
  { name: 'CascadeSelect', component: AerisCascadeSelect, inputs: { value: 'one', options } },
  { name: 'ColorPicker', component: AerisColorPicker, inputs: { value: '#336699' } },
  {
    name: 'DatePicker',
    component: AerisDatePicker,
    inputs: { value: new Date(2026, 5, 11) },
  },
  { name: 'Editor', component: AerisEditorComponent, inputs: { value: '<p>One</p>' } },
  { name: 'InputOtp', component: AerisInputOtpComponent, inputs: { value: '1234' } },
  {
    name: 'MultiSelect',
    component: AerisMultiSelectComponent,
    inputs: { value: ['one'], options },
  },
  { name: 'Rating', component: AerisRating, inputs: { value: 3 } },
  { name: 'Select', component: AerisSelectComponent, inputs: { value: 'one', options } },
  { name: 'Slider', component: AerisSlider, inputs: { value: 25 } },
  {
    name: 'TreeSelect',
    component: AerisTreeSelectComponent,
    inputs: { value: 'one', nodes: options },
  },
];

describe('Aeris native form submission', () => {
  for (const source of ['input', 'forms'] as const) {
    it.each(cases)(
      `omits disabled $name values supplied through ${source} and restores them on enable`,
      async ({ component, inputs }) => {
        const fixture = TestBed.createComponent(component);
        fixture.componentRef.setInput('name', 'choice');
        for (const [name, value] of Object.entries(inputs))
          fixture.componentRef.setInput(name, value);
        await fixture.whenStable();
        const form = document.createElement('form');
        form.append(fixture.nativeElement);
        document.body.append(form);
        try {
          const enabled = new FormData(form).getAll('choice');
          expect(enabled.length).toBeGreaterThan(0);
          const control = fixture.componentInstance as ControlValueAccessor;
          for (const disabled of [true, false]) {
            if (source === 'input') fixture.componentRef.setInput('disabled', disabled);
            else control.setDisabledState?.(disabled);
            await fixture.whenStable();
            expect(new FormData(form).getAll('choice')).toEqual(disabled ? [] : enabled);
            const hidden = form.querySelector<HTMLInputElement>('input[type="hidden"]');
            expect(hidden?.disabled).toBe(disabled);
          }
        } finally {
          form.remove();
        }
      },
    );
  }
});
