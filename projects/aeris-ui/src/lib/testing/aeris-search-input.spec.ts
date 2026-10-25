import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AerisInputText } from '../../../input-text/aeris-input-text';

@Component({
  imports: [AerisInputText, ReactiveFormsModule],
  template: `<form role="search" (submit)="submitted($event)">
    <label for="native-search">Native search</label
    ><input id="native-search" aerisInputText type="search" name="query" [formControl]="native" />
    <label for="component-search">Clearable search</label
    ><aeris-input-text inputId="component-search" type="search" clearable [formControl]="wrapped" />
    <button type="submit">Search</button>
  </form>`,
})
class SearchHost {
  readonly native = new FormControl('', { nonNullable: true });
  readonly wrapped = new FormControl('', { nonNullable: true });
  count = 0;
  submitted(event: Event): void {
    event.preventDefault();
    this.count++;
  }
}

describe('Aeris search composition', () => {
  it('leaves native search input, Angular IME buffering and form submission intact', async () => {
    const fixture = TestBed.createComponent(SearchHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('#native-search') as HTMLInputElement;
    input.dispatchEvent(new CompositionEvent('compositionstart'));
    input.value = '検索';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
    expect(fixture.componentInstance.native.value).toBe('');
    input.dispatchEvent(new CompositionEvent('compositionend'));
    expect(fixture.componentInstance.native.value).toBe('検索');
    expect(new FormData(root.querySelector('form') as HTMLFormElement).get('query')).toBe('検索');
    const submit = new Event('submit', { bubbles: true, cancelable: true });
    root.querySelector('form')?.dispatchEvent(submit);
    expect(fixture.componentInstance.count).toBe(1);
    expect(submit.defaultPrevented).toBe(true);
  });
  it('buffers composed wrapper values and clears through the real public clear action', async () => {
    const fixture = TestBed.createComponent(SearchHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('#component-search') as HTMLInputElement;
    input.dispatchEvent(new CompositionEvent('compositionstart'));
    input.value = '検索';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
    expect(fixture.componentInstance.wrapped.value).toBe('');
    input.dispatchEvent(new CompositionEvent('compositionend'));
    await fixture.whenStable();
    expect(fixture.componentInstance.wrapped.value).toBe('検索');
    root.querySelector<HTMLButtonElement>('.aeris-input-text-component__clear')?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.wrapped.value).toBe('');
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
    expect(root.querySelector('.aeris-input-text-component__clear')).toBeNull();
    expect(fixture.componentInstance.count).toBe(0);
  });
});
