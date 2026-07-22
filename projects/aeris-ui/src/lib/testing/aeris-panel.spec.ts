import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisPanel, AerisPanelModule, type AerisPanelToggleEvent } from '../../../panel/aeris-panel';

@Component({
  imports: [AerisPanelModule],
  template: `
    <aeris-panel header="Order summary" role="region">
      <p>Wireless headphones</p>
      <div aerisPanelFooter>Total $99.99</div>
    </aeris-panel>
  `,
})
class BasicPanelHost {}

@Component({
  imports: [AerisPanelModule],
  template: `
    <aeris-panel
      header="Filters"
      toggleable
      [(collapsed)]="collapsed"
      (toggled)="events.push($event)"
      (panelCollapsed)="collapsedEvents.push($event)"
      (panelExpanded)="expandedEvents.push($event)"
    >
      <button type="button">Projected action</button>
    </aeris-panel>
  `,
})
class ToggleablePanelHost {
  collapsed = false;
  readonly events: AerisPanelToggleEvent[] = [];
  readonly collapsedEvents: AerisPanelToggleEvent[] = [];
  readonly expandedEvents: AerisPanelToggleEvent[] = [];
}

@Component({
  imports: [AerisPanelModule],
  template: `
    <aeris-panel header="Disabled" toggleable disabled>
      Disabled content
    </aeris-panel>
  `,
})
class DisabledPanelHost {}

@Component({
  imports: [AerisPanelModule],
  template: `
    <aeris-panel header="Status" toggleable [collapsed]="true" variant="filled" size="lg">
      <div aerisPanelHeaderActions>
        <button type="button">Refresh</button>
      </div>
      <ng-template aerisPanelHeader let-expanded="expanded">
        {{ expanded ? 'Open status' : 'Closed status' }}
      </ng-template>
      <ng-template aerisPanelToggleIcon let-collapsed="collapsed">
        <span class="custom-icon">{{ collapsed ? 'plus' : 'minus' }}</span>
      </ng-template>
      <p>Custom status content</p>
    </aeris-panel>
  `,
})
class TemplatePanelHost {}

@Component({
  imports: [AerisPanelModule],
  template: `
    <aeris-panel #panel header="Programmatic" toggleable>
      Programmatic content
    </aeris-panel>
  `,
})
class PublicMethodsPanelHost {
  readonly panel = viewChild.required<AerisPanel>('panel');
}

describe('AerisPanel', () => {
  it('renders a non-toggleable content panel with optional semantic role and footer slot', () => {
    const fixture = TestBed.createComponent(BasicPanelHost);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('aeris-panel') as HTMLElement;
    const title = fixture.nativeElement.querySelector('.aeris-panel__title') as HTMLElement;
    const footer = fixture.nativeElement.querySelector('.aeris-panel__footer') as HTMLElement;

    expect(panel.getAttribute('role')).toBe('region');
    expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
    expect(fixture.nativeElement.querySelector('button.aeris-panel__toggle')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Wireless headphones');
    expect(footer.textContent).toContain('Total $99.99');
  });

  it('toggles content with button semantics, model binding, and lifecycle events', () => {
    const fixture = TestBed.createComponent(ToggleablePanelHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.aeris-panel__toggle') as HTMLButtonElement;
    const content = fixture.nativeElement.querySelector('.aeris-panel__content-shell') as HTMLElement;

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe(content.id);
    expect(content.getAttribute('role')).toBe('region');
    expect(content.getAttribute('aria-hidden')).toBeNull();

    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.collapsed).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(content.getAttribute('aria-hidden')).toBe('true');
    expect(content.getAttribute('inert')).toBe('');
    expect(fixture.componentInstance.events.length).toBe(1);
    expect(fixture.componentInstance.collapsedEvents.length).toBe(1);

    button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.collapsed).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.expandedEvents.length).toBe(1);
  });

  it('does not toggle when disabled', () => {
    const fixture = TestBed.createComponent(DisabledPanelHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.aeris-panel__toggle') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('supports header, toggle icon, and header action templates', () => {
    const fixture = TestBed.createComponent(TemplatePanelHost);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('aeris-panel') as HTMLElement;
    const button = fixture.nativeElement.querySelector('button.aeris-panel__toggle') as HTMLButtonElement;
    const actions = fixture.nativeElement.querySelector('.aeris-panel__actions') as HTMLElement;

    expect(panel.getAttribute('data-variant')).toBe('filled');
    expect(panel.getAttribute('data-size')).toBe('lg');
    expect(panel.getAttribute('data-collapsed')).toBe('true');
    expect(button.textContent).toContain('Closed status');
    expect(fixture.nativeElement.querySelector('.custom-icon')?.textContent).toContain('plus');
    expect(actions.textContent).toContain('Refresh');
  });

  it('exposes public toggle, expand, and collapse methods', () => {
    const fixture = TestBed.createComponent(PublicMethodsPanelHost);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.aeris-panel__toggle') as HTMLButtonElement;

    fixture.componentInstance.panel().collapse();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fixture.componentInstance.panel().expand();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fixture.componentInstance.panel().toggle();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
