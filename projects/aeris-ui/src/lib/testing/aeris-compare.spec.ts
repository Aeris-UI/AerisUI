import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import {
  AerisCompare,
  AerisCompareModule,
  type AerisCompareInputEvent,
} from '@aeris-ui/core/compare';

@Component({
  imports: [AerisCompareModule],
  template: `
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car before restoration"
      afterAlt="Car after restoration"
      beforeLabel="Before"
      afterLabel="After"
      showLabels
      [(value)]="value"
      [orientation]="orientation()"
      [slideOnHover]="slideOnHover()"
      [readonly]="readonly()"
      (valueInput)="lastInput.set($event)"
      (changed)="lastChange.set($event)"
    />
  `,
})
class CompareHost {
  readonly value = signal(40);
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly slideOnHover = signal(false);
  readonly readonly = signal(false);
  readonly lastInput = signal<AerisCompareInputEvent | null>(null);
  readonly lastChange = signal<AerisCompareInputEvent | null>(null);
}

@Component({
  imports: [AerisCompareModule],
  template: `
    <aeris-compare [value]="35" ariaLabel="Custom comparison">
      <ng-template aerisCompareBefore let-value>
        <span class="custom-before">Before {{ value }}</span>
      </ng-template>
      <ng-template aerisCompareAfter let-percentage="percentage">
        <span class="custom-after">After {{ percentage }}</span>
      </ng-template>
      <ng-template aerisCompareHandle let-orientation="orientation">
        <span class="custom-handle">{{ orientation }}</span>
      </ng-template>
    </aeris-compare>
  `,
})
class TemplateCompareHost {}

@Component({
  imports: [AerisCompareModule, ReactiveFormsModule],
  template: `<aeris-compare [formControl]="control" />`,
})
class FormCompareHost {
  readonly control = new FormControl(25, { nonNullable: true });
}

describe('AerisCompare', () => {
  it('renders library-owned images, labels, and native slider semantics', () => {
    const fixture = TestBed.createComponent(CompareHost);
    fixture.detectChanges();
    const compare = fixture.nativeElement.querySelector('.aeris-compare') as HTMLElement;
    const images = fixture.nativeElement.querySelectorAll(
      '.aeris-compare__image',
    ) as NodeListOf<HTMLImageElement>;
    const input = fixture.nativeElement.querySelector('.aeris-compare__input') as HTMLInputElement;

    expect(images).toHaveLength(2);
    expect(images[0]?.src).toContain('car.jpg');
    expect(images[0]?.alt).toBe('Car after restoration');
    expect(images[1]?.src).toContain('car-bw.jpg');
    expect(images[1]?.alt).toBe('Car before restoration');
    expect(compare.style.getPropertyValue('--_aeris-compare-position')).toBe('40%');
    expect(compare.getAttribute('data-orientation')).toBe('horizontal');
    expect(input.type).toBe('range');
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
    expect(input.value).toBe('40');
    expect(input.getAttribute('aria-label')).toBe('Comparison position');
    expect(input.getAttribute('aria-valuetext')).toBe('40%');
    expect(fixture.nativeElement.querySelectorAll('.aeris-compare__label')).toHaveLength(2);
  });

  it('updates controlled state and emits input and committed change events', () => {
    const fixture = TestBed.createComponent(CompareHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.aeris-compare__input') as HTMLInputElement;

    input.value = '68';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(68);
    expect(fixture.componentInstance.lastInput()?.value).toBe(68);

    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.lastChange()?.value).toBe(68);
  });

  it('supports arrow, page, Home, and End keyboard commands', () => {
    const fixture = TestBed.createComponent(CompareHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.aeris-compare__input') as HTMLInputElement;

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(41);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(51);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(0);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(100);
    expect(fixture.componentInstance.lastChange()?.originalEvent).toBeInstanceOf(KeyboardEvent);
  });

  it('supports vertical structure and hover-controlled comparison', () => {
    const fixture = TestBed.createComponent(CompareHost);
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-compare') as HTMLElement;
    const compare = fixture.nativeElement.querySelector('.aeris-compare') as HTMLElement;
    fixture.componentInstance.slideOnHover.set(true);
    fixture.detectChanges();
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 400,
      bottom: 200,
      width: 400,
      height: 200,
      toJSON: () => ({}),
    });
    compare.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: 100,
        clientY: 150,
        pointerType: 'mouse',
      }),
    );
    fixture.detectChanges();

    expect(compare.getAttribute('data-orientation')).toBe('vertical');
    expect(fixture.componentInstance.value()).toBe(25);
  });

  it('follows RTL during hover and does not treat touch movement as hover', () => {
    const fixture = TestBed.createComponent(CompareHost);
    fixture.componentInstance.slideOnHover.set(true);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-compare') as HTMLElement;
    const compare = fixture.nativeElement.querySelector('.aeris-compare') as HTMLElement;
    host.style.direction = 'rtl';
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 400,
      bottom: 200,
      width: 400,
      height: 200,
      toJSON: () => ({}),
    });

    compare.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
        pointerType: 'mouse',
      }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(75);

    compare.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: 300,
        clientY: 100,
        pointerType: 'touch',
      }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(75);
  });

  it('renders before, after, and handle templates with live context', () => {
    const fixture = TestBed.createComponent(TemplateCompareHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.custom-before')?.textContent).toContain(
      'Before 35',
    );
    expect(fixture.nativeElement.querySelector('.custom-after')?.textContent).toContain('After 35');
    expect(fixture.nativeElement.querySelector('.custom-handle')?.textContent).toContain(
      'horizontal',
    );
  });

  it('supports public value and focus methods', () => {
    const fixture = TestBed.createComponent(CompareHost);
    fixture.detectChanges();
    const component = fixture.debugElement.query(
      (node) => node.componentInstance instanceof AerisCompare,
    ).componentInstance as AerisCompare;
    const input = fixture.nativeElement.querySelector('.aeris-compare__input') as HTMLInputElement;

    component.setValue(120);
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(100);
    expect(fixture.componentInstance.lastChange()?.value).toBe(100);

    component.focus();
    expect(document.activeElement).toBe(input);
  });

  it('integrates with Angular forms and disabled state', () => {
    const fixture = TestBed.createComponent(FormCompareHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.aeris-compare__input') as HTMLInputElement;

    expect(input.value).toBe('25');
    input.value = '60';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe(60);

    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
    expect(
      (fixture.nativeElement.querySelector('.aeris-compare') as HTMLElement).getAttribute(
        'data-disabled',
      ),
    ).toBe('true');
  });

  it('prevents readonly interaction while keeping the range focusable', () => {
    const fixture = TestBed.createComponent(CompareHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.aeris-compare__input') as HTMLInputElement;

    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();
    input.value = '90';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe(40);
    expect(input.value).toBe('40');
    expect(input.disabled).toBe(false);
    expect(input.getAttribute('aria-readonly')).toBe('true');
  });
});
