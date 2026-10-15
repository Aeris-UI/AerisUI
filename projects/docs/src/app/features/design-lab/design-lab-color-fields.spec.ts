import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';
import { DesignLabColorFields } from './design-lab-color-fields';

describe('Design Lab color fields', () => {
  it('uses a labeled Aeris picker and forwards color and reset actions', () => {
    const fixture = TestBed.createComponent(DesignLabColorFields);
    fixture.componentRef.setInput('fields', [
      { key: 'page', label: 'page', id: 'lab-light-page', value: '#ffffff', state: 'Override' },
    ]);
    fixture.componentRef.setInput('allowAutomatic', true);
    const changes = vi.fn();
    const inherit = vi.fn();
    const automatic = vi.fn();
    fixture.componentInstance.valueChange.subscribe(changes);
    fixture.componentInstance.inherit.subscribe(inherit);
    fixture.componentInstance.automatic.subscribe(automatic);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('label')?.htmlFor).toBe('lab-light-page');
    expect(host.querySelector('#lab-light-page')?.getAttribute('aria-label')).toBe(
      'Choose page color',
    );
    const picker = fixture.debugElement.query(By.directive(AerisColorPicker))
      .componentInstance as AerisColorPicker;
    picker.value.set('#123456');
    expect(changes).toHaveBeenCalledWith({ key: 'page', value: '#123456' });
    host.querySelector<HTMLButtonElement>('[aria-label="Inherit page"]')?.click();
    host.querySelector<HTMLButtonElement>('[aria-label="Automatically derive page"]')?.click();
    expect(inherit).toHaveBeenCalledWith('page');
    expect(automatic).toHaveBeenCalledWith('page');
  });

  it('preserves unsupported imported expressions until the picker is used', () => {
    const fixture = TestBed.createComponent(DesignLabColorFields);
    fixture.componentRef.setInput('fields', [
      { key: 'page', label: 'page', id: 'lab-page', value: 'var(--brand-page)', state: 'Override' },
    ]);
    const changes = vi.fn();
    fixture.componentInstance.valueChange.subscribe(changes);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('var(--brand-page)');
    expect(changes).not.toHaveBeenCalled();
  });
});
