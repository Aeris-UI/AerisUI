import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisSplitter,
  AerisSplitterModule,
  type AerisSplitterResizeEvent,
} from '../../../splitter/aeris-splitter';

@Component({
  imports: [AerisSplitterModule],
  template: `
    <aeris-splitter ariaLabel="Workspace layout" height="20rem">
      <aeris-splitter-panel ariaLabel="Navigation" [size]="25" [minSize]="15">
        Navigation
      </aeris-splitter-panel>
      <aeris-splitter-panel ariaLabel="Content" [size]="75" [minSize]="25">
        Content
      </aeris-splitter-panel>
    </aeris-splitter>
  `,
})
class BasicSplitterHost {}

@Component({
  imports: [AerisSplitterModule],
  template: `
    <aeris-splitter
      #splitter
      orientation="vertical"
      variant="filled"
      size="lg"
      [sizes]="sizes()"
      [step]="10"
      height="30rem"
      (resized)="events.push($event)"
      (resizeStart)="startEvents.push($event)"
      (resizeEnd)="endEvents.push($event)"
    >
      <aeris-splitter-panel ariaLabel="Preview" [minSize]="20" [maxSize]="80">
        Preview
      </aeris-splitter-panel>
      <aeris-splitter-panel ariaLabel="Details" [minSize]="20" [maxSize]="80">
        Details
      </aeris-splitter-panel>
    </aeris-splitter>
  `,
})
class ControlledSplitterHost {
  readonly splitter = viewChild.required<AerisSplitter>('splitter');
  readonly sizes = signal<readonly number[]>([40, 60]);
  readonly events: AerisSplitterResizeEvent[] = [];
  readonly startEvents: AerisSplitterResizeEvent[] = [];
  readonly endEvents: AerisSplitterResizeEvent[] = [];
}

@Component({
  imports: [AerisSplitterModule],
  template: `
    <aeris-splitter disabled>
      <aeris-splitter-panel>Locked</aeris-splitter-panel>
      <aeris-splitter-panel>Also locked</aeris-splitter-panel>
    </aeris-splitter>
  `,
})
class DisabledSplitterHost {}

@Component({
  imports: [AerisSplitterModule],
  template: `
    <aeris-splitter #splitter divider="line">
      <aeris-splitter-panel>Can collapse</aeris-splitter-panel>
      <aeris-splitter-panel>Remaining panel</aeris-splitter-panel>
    </aeris-splitter>
  `,
})
class CollapsibleSplitterHost {
  readonly splitter = viewChild.required<AerisSplitter>('splitter');
}

@Component({
  imports: [AerisSplitterModule],
  template: `
    <aeris-splitter #splitter>
      <aeris-splitter-panel>Start</aeris-splitter-panel>
      <aeris-splitter-panel>Middle</aeris-splitter-panel>
      <aeris-splitter-panel>End</aeris-splitter-panel>
    </aeris-splitter>
  `,
})
class MultiHandleSplitterHost {
  readonly splitter = viewChild.required<AerisSplitter>('splitter');
}

@Component({
  imports: [AerisSplitterModule],
  template: `
    <aeris-splitter ariaLabel="Nested workspace">
      <aeris-splitter-panel>
        Left
      </aeris-splitter-panel>
      <aeris-splitter-panel>
        <aeris-splitter orientation="vertical" ariaLabel="Nested detail">
          <aeris-splitter-panel>Top</aeris-splitter-panel>
          <aeris-splitter-panel>Bottom</aeris-splitter-panel>
        </aeris-splitter>
      </aeris-splitter-panel>
    </aeris-splitter>
  `,
})
class NestedSplitterHost {}

describe('AerisSplitter', () => {
  it('renders accessible panels and separator with configured sizes', () => {
    const fixture = TestBed.createComponent(BasicSplitterHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-splitter') as HTMLElement;
    const root = fixture.nativeElement.querySelector('.aeris-splitter__root') as HTMLElement;
    const panels = fixture.nativeElement.querySelectorAll('.aeris-splitter__panel') as NodeListOf<HTMLElement>;
    const gutter = fixture.nativeElement.querySelector('.aeris-splitter__gutter') as HTMLElement;

    expect(host.getAttribute('data-orientation')).toBe('horizontal');
    expect(host.getAttribute('data-divider')).toBe('handle');
    expect(root.getAttribute('role')).toBe('group');
    expect(root.getAttribute('aria-label')).toBe('Workspace layout');
    expect(root.style.blockSize).toBe('20rem');
    expect(panels.length).toBe(2);
    expect(panels[0]?.getAttribute('aria-label')).toBe('Navigation');
    expect(panels[0]?.style.flexGrow).toBe('25');
    expect(panels[0]?.style.flexBasis).toBe('0%');
    expect(panels[1]?.style.flexGrow).toBe('75');
    expect(panels[1]?.style.flexBasis).toBe('0%');
    expect(panels[0]?.querySelector('.aeris-splitter__panel-content')?.textContent).toContain('Navigation');
    expect(gutter.getAttribute('role')).toBe('separator');
    expect(gutter.getAttribute('aria-orientation')).toBe('horizontal');
    expect(gutter.getAttribute('aria-valuenow')).toBe('25');
  });

  it('resizes adjacent panels with the keyboard and emits resize events', () => {
    const fixture = TestBed.createComponent(ControlledSplitterHost);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const gutter = fixture.nativeElement.querySelector('.aeris-splitter__gutter') as HTMLElement;
    gutter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const panels = fixture.nativeElement.querySelectorAll('.aeris-splitter__panel') as NodeListOf<HTMLElement>;
    expect(host.events.length).toBe(1);
    expect(host.events[0]?.sizes).toEqual([50, 50]);
    expect(host.events[0]?.index).toBe(0);
    expect(panels[0]?.style.flexGrow).toBe('50');
    expect(panels[1]?.style.flexGrow).toBe('50');
  });

  it('resizes adjacent panels with pointer drag and emits lifecycle events', () => {
    const fixture = TestBed.createComponent(ControlledSplitterHost);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.aeris-splitter__root') as HTMLElement;
    Object.defineProperty(root, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ width: 400, height: 500, top: 0, left: 0, right: 400, bottom: 500 }),
    });

    const gutter = fixture.nativeElement.querySelector('.aeris-splitter__gutter') as HTMLElement;
    gutter.dispatchEvent(pointerEvent('pointerdown', { pointerId: 7, button: 0, clientY: 200 }));
    document.dispatchEvent(pointerEvent('pointermove', { pointerId: 7, clientY: 250 }));
    document.dispatchEvent(pointerEvent('pointerup', { pointerId: 7, clientY: 250 }));
    fixture.detectChanges();

    expect(fixture.componentInstance.startEvents.length).toBe(1);
    expect(fixture.componentInstance.events.at(-1)?.sizes).toEqual([50, 50]);
    expect(fixture.componentInstance.endEvents.length).toBe(1);
    expect(fixture.nativeElement.querySelector('aeris-splitter').getAttribute('data-dragging')).toBeNull();
  });

  it('marks handles disabled when the splitter is disabled', () => {
    const fixture = TestBed.createComponent(DisabledSplitterHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-splitter') as HTMLElement;
    const gutter = fixture.nativeElement.querySelector('.aeris-splitter__gutter') as HTMLElement;

    expect(host.getAttribute('data-disabled')).toBe('true');
    expect(gutter.getAttribute('aria-disabled')).toBe('true');
    gutter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(gutter.getAttribute('aria-valuenow')).toBe('50');
  });

  it('supports public sizing and focus methods', () => {
    const fixture = TestBed.createComponent(ControlledSplitterHost);
    fixture.detectChanges();

    const gutter = fixture.nativeElement.querySelector('.aeris-splitter__gutter') as HTMLElement;
    let focused = false;
    gutter.focus = () => {
      focused = true;
    };

    fixture.componentInstance.splitter().setSizes([30, 70]);
    fixture.detectChanges();
    expect(fixture.componentInstance.events.at(-1)?.sizes).toEqual([30, 70]);

    fixture.componentInstance.splitter().reset();
    fixture.detectChanges();
    expect(fixture.componentInstance.events.at(-1)?.sizes).toEqual([50, 50]);

    fixture.componentInstance.splitter().focusHandle(0);
    expect(focused).toBe(true);
  });

  it('supports full collapse by default and line divider mode', () => {
    const fixture = TestBed.createComponent(CollapsibleSplitterHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('aeris-splitter') as HTMLElement;
    const gutter = fixture.nativeElement.querySelector('.aeris-splitter__gutter') as HTMLElement;

    expect(host.getAttribute('data-divider')).toBe('line');
    expect(gutter.getAttribute('aria-valuemin')).toBe('0');

    fixture.componentInstance.splitter().setSizes([0, 100]);
    fixture.detectChanges();

    const panels = fixture.nativeElement.querySelectorAll('.aeris-splitter__panel') as NodeListOf<HTMLElement>;
    expect(panels[0]?.style.flexGrow).toBe('0');
    expect(panels[1]?.style.flexGrow).toBe('100');
    expect(panels[0]?.querySelector('.aeris-splitter__panel-content')).not.toBeNull();
    expect(gutter.getAttribute('aria-valuenow')).toBe('0');
  });

  it('stacks overlapped handles from the opposite side when panels collapse to an edge', () => {
    const fixture = TestBed.createComponent(MultiHandleSplitterHost);
    fixture.detectChanges();

    fixture.componentInstance.splitter().setSizes([100, 0, 0]);
    fixture.detectChanges();

    const gutters = fixture.nativeElement.querySelectorAll('.aeris-splitter__gutter') as NodeListOf<HTMLElement>;
    expect(gutters.length).toBe(2);
    expect(gutters[0]?.style.zIndex).toBe('2');
    expect(gutters[1]?.style.zIndex).toBe('1');

    fixture.componentInstance.splitter().setSizes([0, 0, 100]);
    fixture.detectChanges();

    expect(gutters[0]?.style.zIndex).toBe('1');
    expect(gutters[1]?.style.zIndex).toBe('2');
  });

  it('keeps nested splitter instances scoped to their own panels', () => {
    const fixture = TestBed.createComponent(NestedSplitterHost);
    fixture.detectChanges();

    const splitters = fixture.nativeElement.querySelectorAll('aeris-splitter') as NodeListOf<HTMLElement>;
    const roots = fixture.nativeElement.querySelectorAll('.aeris-splitter__root') as NodeListOf<HTMLElement>;
    const outerPanels = Array.from(roots[0]?.children ?? []).filter((child) =>
      child.classList.contains('aeris-splitter__panel'),
    );
    const nestedPanels = Array.from(roots[1]?.children ?? []).filter((child) =>
      child.classList.contains('aeris-splitter__panel'),
    );

    expect(splitters[0]?.getAttribute('data-orientation')).toBe('horizontal');
    expect(splitters[1]?.getAttribute('data-orientation')).toBe('vertical');
    expect(outerPanels.length).toBe(2);
    expect(nestedPanels.length).toBe(2);
  });
});

function pointerEvent(
  type: string,
  init: {
    readonly pointerId: number;
    readonly button?: number;
    readonly clientX?: number;
    readonly clientY?: number;
  },
): PointerEvent {
  const event = new Event(type, { bubbles: true, cancelable: true }) as PointerEvent;
  Object.defineProperties(event, {
    pointerId: { value: init.pointerId },
    button: { value: init.button ?? 0 },
    clientX: { value: init.clientX ?? 0 },
    clientY: { value: init.clientY ?? 0 },
  });
  return event;
}
