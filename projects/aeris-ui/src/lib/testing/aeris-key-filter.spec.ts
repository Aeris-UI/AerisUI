import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisKeyFilter } from '../../../key-filter/aeris-key-filter';

@Component({
  imports: [AerisKeyFilter],
  template: `
    <input
      aerisKeyFilter="pint"
      [value]="value()"
      (rejected)="rejections.update((count) => count + 1)"
    />
  `,
})
class PositiveIntegerHost {
  readonly value = signal('');
  readonly rejections = signal(0);
}

@Component({
  imports: [AerisKeyFilter],
  template: `<input [aerisKeyFilter]="customPattern" />`,
})
class CustomPatternHost {
  readonly customPattern = /^[A-Z]*$/;
}

@Component({
  imports: [AerisKeyFilter],
  template: `<input aerisKeyFilter="alpha" validateOnly />`,
})
class ValidateOnlyHost {}

@Component({
  imports: [AerisKeyFilter],
  template: `<input [aerisKeyFilter]="invalidPattern" />`,
})
class InvalidPatternHost {
  readonly invalidPattern = '[unclosed';
}

describe('AerisKeyFilter', () => {
  it('prevents invalid printable keys', async () => {
    const fixture = TestBed.createComponent(PositiveIntegerHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '12';
    input.setSelectionRange(2, 2);

    const invalidEvent = new KeyboardEvent('keydown', {
      key: 'a',
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(invalidEvent);
    fixture.detectChanges();

    expect(invalidEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.rejections()).toBe(1);
  });

  it('allows accepted printable keys', async () => {
    const fixture = TestBed.createComponent(PositiveIntegerHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '12';
    input.setSelectionRange(2, 2);

    const validEvent = new KeyboardEvent('keydown', {
      key: '3',
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(validEvent);

    expect(validEvent.defaultPrevented).toBe(false);
  });

  it('supports custom regular expression filters', async () => {
    const fixture = TestBed.createComponent(CustomPatternHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'AB';
    input.setSelectionRange(2, 2);

    const invalidEvent = new KeyboardEvent('keydown', {
      key: 'c',
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(invalidEvent);

    expect(invalidEvent.defaultPrevented).toBe(true);
  });

  it('reports invalid input without preventing it in validate-only mode', async () => {
    const fixture = TestBed.createComponent(ValidateOnlyHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'abc1';

    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: '1' }));
    fixture.detectChanges();

    expect(input.value).toBe('abc1');
  });

  it('restores the last accepted value after an invalid input fallback', async () => {
    const fixture = TestBed.createComponent(PositiveIntegerHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '42';
    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    input.value = '42x';

    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: 'x' }));

    expect(input.value).toBe('42');
  });

  it('rejects input safely when a string pattern is malformed', async () => {
    const fixture = TestBed.createComponent(InvalidPatternHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    const event = new KeyboardEvent('keydown', {
      key: 'a',
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
