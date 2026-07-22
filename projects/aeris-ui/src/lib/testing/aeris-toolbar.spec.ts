import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisToolbarModule } from '../../../toolbar/aeris-toolbar';

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar ariaLabel="Editor actions">
      <div aerisToolbarStart>
        <button type="button">Cancel</button>
      </div>
      <div aerisToolbarCenter>
        <span>Draft</span>
      </div>
      <div aerisToolbarEnd>
        <button type="button">Save</button>
      </div>
    </aeris-toolbar>
  `,
})
class BasicToolbarHost {}

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar
      id="format-toolbar"
      variant="filled"
      size="lg"
      orientation="vertical"
      align="stretch"
      [wrap]="false"
      [fluid]="false"
      ariaLabelledBy="format-title"
      ariaDescribedBy="format-help"
    >
      <div aerisToolbarStart>
        <div aerisToolbarGroup aria-label="Text style">
          <button type="button">Bold</button>
          <button type="button">Italic</button>
        </div>
        <span aerisToolbarSpacer></span>
        <div aerisToolbarGroup aria-label="History">
          <button type="button">Undo</button>
        </div>
      </div>
    </aeris-toolbar>
  `,
})
class ConfiguredToolbarHost {}

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar [role]="null" disabled>
      <button type="button">Unavailable</button>
    </aeris-toolbar>
  `,
})
class DisabledNeutralToolbarHost {}

@Component({
  imports: [AerisToolbarModule],
  template: `
    <aeris-toolbar ariaLabel="Keyboard toolbar">
      <div aerisToolbarStart>
        <button type="button" (click)="clicked.set(true)">Run</button>
      </div>
    </aeris-toolbar>
  `,
})
class KeyboardToolbarHost {
  readonly clicked = signal(false);
}

describe('AerisToolbar', () => {
  it('renders a labelled toolbar with start, center, and end slots', () => {
    const fixture = TestBed.createComponent(BasicToolbarHost);
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('aeris-toolbar') as HTMLElement;
    const sections = fixture.nativeElement.querySelectorAll('.aeris-toolbar__section') as NodeListOf<HTMLElement>;

    expect(toolbar.getAttribute('role')).toBe('toolbar');
    expect(toolbar.getAttribute('aria-label')).toBe('Editor actions');
    expect(toolbar.getAttribute('aria-orientation')).toBe('horizontal');
    expect(toolbar.getAttribute('data-variant')).toBe('outlined');
    expect(toolbar.getAttribute('data-size')).toBe('md');
    expect(toolbar.getAttribute('data-wrap')).toBe('true');
    expect(toolbar.getAttribute('data-fluid')).toBe('true');
    expect(sections.length).toBe(3);
    expect(sections[0]?.classList.contains('aeris-toolbar__section--start')).toBe(true);
    expect(sections[1]?.classList.contains('aeris-toolbar__section--center')).toBe(true);
    expect(sections[2]?.classList.contains('aeris-toolbar__section--end')).toBe(true);
    expect(toolbar.textContent).toContain('Cancel');
    expect(toolbar.textContent).toContain('Draft');
    expect(toolbar.textContent).toContain('Save');
  });

  it('exposes variant, size, orientation, wrapping, alignment, groups, and spacer API', () => {
    const fixture = TestBed.createComponent(ConfiguredToolbarHost);
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('aeris-toolbar') as HTMLElement;
    const groups = fixture.nativeElement.querySelectorAll('.aeris-toolbar__group') as NodeListOf<HTMLElement>;
    const spacer = fixture.nativeElement.querySelector('.aeris-toolbar__spacer') as HTMLElement;

    expect(toolbar.id).toBe('format-toolbar');
    expect(toolbar.getAttribute('data-variant')).toBe('filled');
    expect(toolbar.getAttribute('data-size')).toBe('lg');
    expect(toolbar.getAttribute('data-orientation')).toBe('vertical');
    expect(toolbar.getAttribute('aria-orientation')).toBe('vertical');
    expect(toolbar.getAttribute('data-align')).toBe('stretch');
    expect(toolbar.getAttribute('data-wrap')).toBe('false');
    expect(toolbar.getAttribute('data-fluid')).toBeNull();
    expect(toolbar.getAttribute('aria-labelledby')).toBe('format-title');
    expect(toolbar.getAttribute('aria-describedby')).toBe('format-help');
    expect(groups.length).toBe(2);
    expect(groups[0]?.getAttribute('aria-label')).toBe('Text style');
    expect(spacer.getAttribute('aria-hidden')).toBe('true');
  });

  it('supports neutral role and disabled semantics', () => {
    const fixture = TestBed.createComponent(DisabledNeutralToolbarHost);
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('aeris-toolbar') as HTMLElement;

    expect(toolbar.getAttribute('role')).toBeNull();
    expect(toolbar.getAttribute('aria-orientation')).toBeNull();
    expect(toolbar.getAttribute('data-disabled')).toBe('true');
    expect(toolbar.getAttribute('aria-disabled')).toBe('true');
    expect(toolbar.getAttribute('inert')).toBe('');
  });

  it('does not intercept keyboard events from projected interactive controls', () => {
    const fixture = TestBed.createComponent(KeyboardToolbarHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });

    button.dispatchEvent(event);
    button.click();
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.clicked()).toBe(true);
  });
});
