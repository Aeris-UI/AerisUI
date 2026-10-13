import { TestBed } from '@angular/core/testing';
import { ExampleToolbarComponent } from './example-toolbar.component';

describe('ExampleToolbarComponent', () => {
  it('uses an accessible disclosure without changing the preview', () => {
    const fixture = TestBed.createComponent(ExampleToolbarComponent);
    fixture.componentRef.setInput('title', 'Basic');
    fixture.componentRef.setInput('panelId', 'basic-code');
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(button?.getAttribute('aria-controls')).toBe('basic-code');
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(button?.getAttribute('aria-label')).toBe('Hide code for Basic');
    button?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.codeVisible()).toBe(false);
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(button?.textContent).toContain('Show code');
    button?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.codeVisible()).toBe(true);
  });
});
