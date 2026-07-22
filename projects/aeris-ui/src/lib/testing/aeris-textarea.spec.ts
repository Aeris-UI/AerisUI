import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  AerisTextarea,
  AerisTextareaComponent,
} from '../../../textarea/aeris-textarea';

@Component({
  imports: [AerisTextarea],
  template: `
    <textarea
      id="native"
      aerisTextarea
      size="lg"
      appearance="filled"
      resize="horizontal"
      invalid
      fluid
    ></textarea>

    <aeris-textarea
      inputId="wrapper"
      [(value)]="value"
      [maxLength]="20"
      [maxRows]="4"
      clearable
      showCount
      autoResize
      fluid
      (cleared)="handleClear()"
    />
  `,
})
class TextareaTestHost {
  value = 'Initial text';
  clearCount = 0;

  handleClear(): void {
    this.clearCount += 1;
  }
}

describe('AerisTextarea', () => {
  it('applies native directive variants and accessibility state', () => {
    const fixture = TestBed.createComponent(TextareaTestHost);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      '#native',
    ) as HTMLTextAreaElement;

    expect(textarea.classList).toContain('aeris-textarea');
    expect(textarea.classList).toContain('aeris-textarea--lg');
    expect(textarea.classList).toContain('aeris-textarea--filled');
    expect(textarea.classList).toContain('aeris-textarea--invalid');
    expect(textarea.classList).toContain('aeris-textarea--fluid');
    expect(textarea.dataset['resize']).toBe('horizontal');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('synchronizes the value model and character counter', () => {
    const fixture = TestBed.createComponent(TextareaTestHost);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      '#wrapper',
    ) as HTMLTextAreaElement;
    textarea.value = 'Updated';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('Updated');
    expect(
      fixture.nativeElement.querySelector(
        '.aeris-textarea-component__count',
      ).textContent,
    ).toContain('7 / 20');
  });

  it('clears the value, emits cleared, and restores focus', async () => {
    const fixture = TestBed.createComponent(TextareaTestHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      '.aeris-textarea-component__clear',
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector(
      '#wrapper',
    ) as HTMLTextAreaElement;
    expect(fixture.componentInstance.value).toBe('');
    expect(fixture.componentInstance.clearCount).toBe(1);
    expect(document.activeElement).toBe(textarea);
  });

  it('caps automatic height and enables scrolling at maxRows', () => {
    const fixture = TestBed.createComponent(TextareaTestHost);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      '#wrapper',
    ) as HTMLTextAreaElement;
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      value: 500,
    });
    textarea.style.setProperty('--aeris-textarea-row-height', '10px');
    textarea.style.setProperty('--aeris-textarea-vertical-padding', '4px');

    const component = fixture.debugElement.query(
      By.directive(AerisTextareaComponent),
    ).componentInstance as AerisTextareaComponent;
    component.resizeToContent();
    fixture.detectChanges();

    expect(Number.parseFloat(textarea.style.height)).toBe(44);
    expect(textarea.style.overflowY).toBe('auto');
  });
});
