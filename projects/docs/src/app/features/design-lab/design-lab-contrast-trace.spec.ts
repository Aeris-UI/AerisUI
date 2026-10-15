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
    const details = root.querySelector('details');
    expect(details?.open).toBe(false);
    expect(root.querySelector('summary')?.textContent).toContain('for Primary text on page');
    expect(root.querySelector('button')).toBeNull();
    if (details) {
      details.open = true;
      details.dispatchEvent(new Event('toggle'));
    }
    await fixture.whenStable();
    expect(root.textContent).toContain('dark.text');
    expect(root.textContent).toContain('--aeris-text');
    expect(root.textContent).toContain('var(--app-text)');
    expect(root.textContent).toContain('Override');
    root.querySelector('button')?.click();
    expect(edit).toHaveBeenCalledExactlyOnceWith('text');
  });
});
