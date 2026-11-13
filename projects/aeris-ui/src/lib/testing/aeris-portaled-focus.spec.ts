import { type OutputEmitterRef, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AerisSelectComponent } from '../../../select/aeris-select';
import { AerisMultiSelectComponent } from '../../../multi-select/aeris-multi-select';
import { AerisTreeSelectComponent } from '../../../tree-select/aeris-tree-select';

interface ChoiceControl {
  openPanel(): void;
  registerOnTouched(callback: () => void): void;
  readonly touch: OutputEmitterRef<void>;
  readonly closed: OutputEmitterRef<void>;
}
const cases: readonly { name: string; component: Type<ChoiceControl>; dataInput: string }[] = [
  { name: 'Select', component: AerisSelectComponent, dataInput: 'options' },
  { name: 'MultiSelect', component: AerisMultiSelectComponent, dataInput: 'options' },
  { name: 'TreeSelect', component: AerisTreeSelectComponent, dataInput: 'nodes' },
];

describe('Aeris portaled field focus', () => {
  for (const placement of ['self', 'body', 'target'] as const) {
    it.each(cases)(
      `closes $name and reports touch once when focus leaves ${placement}`,
      async ({ component, dataInput }) => {
        const target = document.createElement('div');
        const outside = document.createElement('button');
        document.body.append(target, outside);
        const fixture = TestBed.createComponent(component);
        fixture.componentRef.setInput(dataInput, [{ label: 'One', value: 'one' }]);
        fixture.componentRef.setInput('filter', true);
        fixture.componentRef.setInput('appendTo', placement === 'target' ? target : placement);
        const touched = vi.fn();
        const touch = vi.fn();
        const closed = vi.fn();
        fixture.componentInstance.registerOnTouched(touched);
        fixture.componentInstance.touch.subscribe(touch);
        fixture.componentInstance.closed.subscribe(closed);
        try {
          await fixture.whenStable();
          fixture.componentInstance.openPanel();
          await fixture.whenStable();
          const trigger = fixture.nativeElement.querySelector(
            '[role="combobox"]',
          ) as HTMLButtonElement;
          const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
          const filter = panel?.querySelector<HTMLInputElement>('input[type="search"]');
          if (!filter) throw new Error('Expected the open filter');
          filter.focus();
          trigger.focus();
          await fixture.whenStable();
          expect(trigger.getAttribute('aria-expanded')).toBe('true');
          expect(touched).not.toHaveBeenCalled();
          filter.focus();
          outside.focus();
          await fixture.whenStable();
          expect(trigger.getAttribute('aria-expanded')).toBe('false');
          expect(touched).toHaveBeenCalledOnce();
          expect(touch).toHaveBeenCalledOnce();
          expect(closed).toHaveBeenCalledOnce();
        } finally {
          fixture.destroy();
          target.remove();
          outside.remove();
        }
      },
    );
  }
});
