import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { COMPOSITION_BUFFER_MODE, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';

import { AerisInputText } from '../../../input-text/aeris-input-text';
import { AerisTextarea } from '../../../textarea/aeris-textarea';

@Component({
  imports: [AerisInputText, AerisTextarea, ReactiveFormsModule, FormField],
  template: `
    <aeris-input-text
      inputId="model-text"
      [(value)]="text"
      (valueChange)="textChanges.push($event)"
    />
    <aeris-textarea
      inputId="model-area"
      [(value)]="area"
      (valueChange)="areaChanges.push($event)"
    />
    <aeris-input-text inputId="reactive-text" [formControl]="reactiveText" />
    <aeris-textarea inputId="reactive-area" [formControl]="reactiveArea" />
    <aeris-input-text inputId="signal-text" [formField]="fields.text" />
    <aeris-textarea inputId="signal-area" [formField]="fields.area" />
    <input id="native-text" aerisInputText [formControl]="nativeText" />
    <textarea id="native-area" aerisTextarea [formControl]="nativeArea"></textarea>
  `,
})
class TextCompositionHost {
  readonly text = signal('');
  readonly area = signal('');
  readonly textChanges: string[] = [];
  readonly areaChanges: string[] = [];
  readonly reactiveText = new FormControl('', { nonNullable: true });
  readonly reactiveArea = new FormControl('', { nonNullable: true });
  readonly nativeText = new FormControl('', { nonNullable: true });
  readonly nativeArea = new FormControl('', { nonNullable: true });
  readonly data = signal({ text: '', area: '' });
  readonly fields = form(this.data);
}

function draft(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
}

describe('Aeris text composition', () => {
  for (const kind of ['text', 'area'] as const) {
    it(`preserves Angular's native ${kind} composition handling`, async () => {
      TestBed.configureTestingModule({
        providers: [{ provide: COMPOSITION_BUFFER_MODE, useValue: true }],
      });
      const fixture = TestBed.createComponent(TextCompositionHost);
      await fixture.whenStable();
      const element = fixture.nativeElement.querySelector(`#native-${kind}`) as
        HTMLInputElement | HTMLTextAreaElement;
      const control =
        kind === 'text'
          ? fixture.componentInstance.nativeText
          : fixture.componentInstance.nativeArea;
      element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
      draft(element, 'に');
      await fixture.whenStable();
      expect(control.value).toBe('');
      element.value = '日本語';
      element.dispatchEvent(
        new CompositionEvent('compositionend', { bubbles: true, data: '日本語' }),
      );
      await fixture.whenStable();
      expect(control.value).toBe('日本語');
    });
    it(`buffers ${kind} component model output until composition commits, without duplicates`, async () => {
      const fixture = TestBed.createComponent(TextCompositionHost);
      await fixture.whenStable();
      const element = fixture.nativeElement.querySelector(`#model-${kind}`) as
        HTMLInputElement | HTMLTextAreaElement;
      const value =
        kind === 'text' ? fixture.componentInstance.text : fixture.componentInstance.area;
      const changes =
        kind === 'text'
          ? fixture.componentInstance.textChanges
          : fixture.componentInstance.areaChanges;
      element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
      draft(element, 'に');
      await fixture.whenStable();
      expect(value()).toBe('');
      expect(element.value).toBe('に');
      expect(changes).toEqual([]);
      element.value = '日本語';
      element.dispatchEvent(
        new CompositionEvent('compositionend', { bubbles: true, data: '日本語' }),
      );
      element.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: false }));
      await fixture.whenStable();
      expect(value()).toBe('日本語');
      expect(changes).toEqual(['日本語']);
    });

    it(`buffers ${kind} Reactive and Signal Forms updates`, async () => {
      const fixture = TestBed.createComponent(TextCompositionHost);
      await fixture.whenStable();
      for (const integration of ['reactive', 'signal']) {
        const element = fixture.nativeElement.querySelector(`#${integration}-${kind}`) as
          HTMLInputElement | HTMLTextAreaElement;
        const value = () =>
          integration === 'signal'
            ? fixture.componentInstance.data()[kind]
            : kind === 'text'
              ? fixture.componentInstance.reactiveText.value
              : fixture.componentInstance.reactiveArea.value;
        element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        draft(element, 'に');
        await fixture.whenStable();
        expect(value()).toBe('');
        element.value = '日本語';
        element.dispatchEvent(
          new CompositionEvent('compositionend', { bubbles: true, data: '日本語' }),
        );
        await fixture.whenStable();
        expect(value()).toBe('日本語');
      }
    });

    it(`honors Angular's explicit buffering opt-out for ${kind}`, async () => {
      TestBed.configureTestingModule({
        providers: [{ provide: COMPOSITION_BUFFER_MODE, useValue: false }],
      });
      const fixture = TestBed.createComponent(TextCompositionHost);
      await fixture.whenStable();
      const element = fixture.nativeElement.querySelector(`#model-${kind}`) as
        HTMLInputElement | HTMLTextAreaElement;
      element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
      draft(element, 'に');
      await fixture.whenStable();
      expect(
        kind === 'text' ? fixture.componentInstance.text() : fixture.componentInstance.area(),
      ).toBe('に');
    });
  }
});
