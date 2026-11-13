import { TestBed } from '@angular/core/testing';
import { DesignLabContrastTrace } from './design-lab-contrast-trace';

describe('Design Lab contrast trace', () => {
  it('reveals exact unresolved values without HTML interpretation and emits only an edit request', async () => {
    const fixture = TestBed.createComponent(DesignLabContrastTrace);
    fixture.componentRef.setInput('label', 'Primary text on page');
    fixture.componentRef.setInput('colors', [
      {
        role: 'Foreground',
        property: 'text',
        path: 'dark.text',
        token: '--aeris-text',
        value: 'var(--app-text)',
        source: 'Override',
      },
    ]);
    const edit = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const trigger = root.querySelector<HTMLButtonElement>('.aeris-accordion__trigger');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.textContent).toContain('for Primary text on page');
    expect(root.querySelector('button[aria-label="Edit dark.text"]')).toBeNull();
    trigger?.click();
    await fixture.whenStable();
    expect(root.textContent).toContain('dark.text');
    expect(root.textContent).toContain('--aeris-text');
    expect(root.textContent).toContain('var(--app-text)');
    expect(root.textContent).toContain('Override');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    root.querySelector<HTMLButtonElement>('button[aria-label="Edit dark.text"]')?.click();
    expect(edit).toHaveBeenCalledExactlyOnceWith('text');
    trigger?.click();
    await fixture.whenStable();
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('button[aria-label="Edit dark.text"]')).toBeNull();
  });
});
