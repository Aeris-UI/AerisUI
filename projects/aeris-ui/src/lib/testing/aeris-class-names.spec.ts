import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisClassNamesDirective,
  AerisClassNamesModule,
  type AerisClassNamesValue,
} from '../../../class-names/aeris-class-names';

@Component({
  imports: [AerisClassNamesModule],
  template: `<div class="static-card shared" [aerisClassNames]="classes()">Content</div>`,
})
class ClassNamesHost {
  readonly classes = signal<AerisClassNamesValue>(null);
}

describe('AerisClassNames', () => {
  it('applies whitespace-separated string classes', () => {
    const fixture = TestBed.createComponent(ClassNamesHost);
    fixture.componentInstance.classes.set('surface raised  compact');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div') as HTMLElement;

    expect(element.classList.contains('surface')).toBe(true);
    expect(element.classList.contains('raised')).toBe(true);
    expect(element.classList.contains('compact')).toBe(true);
  });

  it('flattens nested arrays and conditional maps', () => {
    const fixture = TestBed.createComponent(ClassNamesHost);
    fixture.componentInstance.classes.set([
      'surface elevated',
      ['interactive', ['selected']],
      { 'tone-success emphasized': true, hidden: false, pending: null },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div') as HTMLElement;

    expect([...element.classList]).toEqual(
      expect.arrayContaining([
        'surface',
        'elevated',
        'interactive',
        'selected',
        'tone-success',
        'emphasized',
      ]),
    );
    expect(element.classList.contains('hidden')).toBe(false);
    expect(element.classList.contains('pending')).toBe(false);
  });

  it('removes stale owned classes when the input changes', () => {
    const fixture = TestBed.createComponent(ClassNamesHost);
    fixture.componentInstance.classes.set(['active', { selected: true }]);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div') as HTMLElement;

    fixture.componentInstance.classes.set(['idle', { selected: false }]);
    fixture.detectChanges();

    expect(element.classList.contains('active')).toBe(false);
    expect(element.classList.contains('selected')).toBe(false);
    expect(element.classList.contains('idle')).toBe(true);
  });

  it('preserves static classes even when they also appear in the binding', () => {
    const fixture = TestBed.createComponent(ClassNamesHost);
    fixture.componentInstance.classes.set('shared temporary');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div') as HTMLElement;

    fixture.componentInstance.classes.set(null);
    fixture.detectChanges();

    expect(element.classList.contains('static-card')).toBe(true);
    expect(element.classList.contains('shared')).toBe(true);
    expect(element.classList.contains('temporary')).toBe(false);
  });

  it('ignores false, null, undefined, and empty nested values', () => {
    const fixture = TestBed.createComponent(ClassNamesHost);
    fixture.componentInstance.classes.set([false, null, undefined, '', ['valid']]);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div') as HTMLElement;

    expect(element.className).toBe('static-card shared valid');
  });

  it('exports the directive through one module-array import', () => {
    expect(AerisClassNamesModule).toEqual([AerisClassNamesDirective]);
  });
});
