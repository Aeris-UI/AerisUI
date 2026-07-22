import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

export type AerisSplitterOrientation = 'horizontal' | 'vertical';
export type AerisSplitterVariant = 'outlined' | 'filled' | 'plain';
export type AerisSplitterSize = 'sm' | 'md' | 'lg';
export type AerisSplitterDivider = 'handle' | 'line';

export interface AerisSplitterResizeEvent {
  readonly originalEvent: Event | null;
  readonly sizes: readonly number[];
  readonly previousSizes: readonly number[];
  readonly index: number;
  readonly nextIndex: number;
}

interface AerisSplitterPanelState {
  readonly panel: AerisSplitterPanel;
  readonly index: number;
  readonly id: string;
  readonly label: string;
  readonly size: number;
  readonly minSize: number;
  readonly maxSize: number;
  readonly resizable: boolean;
  readonly content: TemplateRef<unknown>;
}

interface AerisSplitterHandleState {
  readonly index: number;
  readonly id: string;
  readonly currentPanelId: string;
  readonly nextPanelId: string;
  readonly disabled: boolean;
  readonly active: boolean;
  readonly min: number;
  readonly max: number;
  readonly value: number;
  readonly zIndex: number;
}

interface ResizeSession {
  readonly index: number;
  readonly pointerId: number;
  readonly startCoordinate: number;
  readonly containerSize: number;
  readonly startSizes: readonly number[];
  readonly previousSizes: readonly number[];
  readonly move: (event: PointerEvent) => void;
  readonly end: (event: PointerEvent) => void;
}

let nextSplitterPanelId = 0;

@Component({
  selector: 'aeris-splitter-panel',
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
  host: {
    '[style.display]': '"none"',
  },
})
export class AerisSplitterPanel {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly instanceId = ++nextSplitterPanelId;

  readonly size = input<number | null>(null, { transform: nullableNumberAttribute });
  readonly minSize = input(0, { transform: numberAttribute });
  readonly maxSize = input(100, { transform: numberAttribute });
  readonly resizable = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('');
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
  readonly panelId = `aeris-splitter-panel-${this.instanceId}`;

  isDirectPanelOf(splitterHost: HTMLElement): boolean {
    const parent = this.element.nativeElement.parentElement;
    return (
      parent?.classList.contains('aeris-splitter__panel-source') === true &&
      parent.parentElement === splitterHost
    );
  }
}

@Component({
  selector: 'aeris-splitter',
  imports: [NgTemplateOutlet],
  template: `
    <div class="aeris-splitter__panel-source" aria-hidden="true">
      <ng-content />
    </div>

    <div
      #root
      class="aeris-splitter__root"
      [attr.role]="role()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-labelledby]="ariaLabelledBy() || null"
      [attr.aria-describedby]="ariaDescribedBy() || null"
      [style.block-size]="height() || null"
      [style.min-block-size]="minHeight() || null"
      [style.max-block-size]="maxHeight() || null"
      [style.inline-size]="width() || null"
      [style.max-inline-size]="maxWidth() || null"
    >
      @for (state of panelStates(); track state.id; let last = $last) {
        <section
          class="aeris-splitter__panel"
          [id]="state.id"
          [attr.aria-label]="state.label || null"
          [attr.data-resizable]="state.resizable || null"
          [style.flex-grow]="state.size"
          [style.flex-basis.%]="0"
          [style.min-inline-size.%]="orientation() === 'horizontal' ? state.minSize : null"
          [style.max-inline-size.%]="orientation() === 'horizontal' ? state.maxSize : null"
          [style.min-block-size.%]="orientation() === 'vertical' ? state.minSize : null"
          [style.max-block-size.%]="orientation() === 'vertical' ? state.maxSize : null"
        >
          <div class="aeris-splitter__panel-content">
            <ng-container [ngTemplateOutlet]="state.content" />
          </div>
        </section>

        @if (!last) {
          <div
            #gutter
            class="aeris-splitter__gutter"
            role="separator"
            tabindex="0"
            [id]="handleStates()[state.index]?.id"
            [attr.aria-label]="separatorLabel()"
            [attr.aria-controls]="handleStates()[state.index]?.currentPanelId + ' ' + handleStates()[state.index]?.nextPanelId"
            [attr.aria-orientation]="orientation()"
            [attr.aria-valuemin]="handleStates()[state.index]?.min"
            [attr.aria-valuemax]="handleStates()[state.index]?.max"
            [attr.aria-valuenow]="handleStates()[state.index]?.value"
            [attr.aria-disabled]="handleStates()[state.index]?.disabled || null"
            [attr.data-active]="handleStates()[state.index]?.active || null"
            [attr.data-disabled]="handleStates()[state.index]?.disabled || null"
            [style.z-index]="handleStates()[state.index]?.zIndex"
            (pointerdown)="handlePointerDown($event, state.index)"
            (keydown)="handleGutterKeydown($event, state.index)"
          >
            <span class="aeris-splitter__handle" aria-hidden="true"></span>
          </div>
        }
      }
    </div>
  `,
  styleUrl: './aeris-splitter.scss',
  host: {
    class: 'aeris-splitter',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-divider]': 'divider()',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-dragging]': 'activeHandle() !== null || null',
    '[attr.data-fluid]': 'fluid() || null',
    '[style.block-size]': 'height() || null',
    '[style.min-block-size]': 'minHeight() || null',
    '[style.max-block-size]': 'maxHeight() || null',
    '[style.inline-size]': 'width() || null',
    '[style.max-inline-size]': 'maxWidth() || null',
  },
})
export class AerisSplitter {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');

  readonly sizes = model<readonly number[]>([]);
  readonly orientation = input<AerisSplitterOrientation>('horizontal');
  readonly variant = input<AerisSplitterVariant>('outlined');
  readonly size = input<AerisSplitterSize>('md');
  readonly divider = input<AerisSplitterDivider>('handle');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly step = input(5, { transform: numberAttribute });
  readonly height = input('');
  readonly minHeight = input('');
  readonly maxHeight = input('');
  readonly width = input('100%');
  readonly maxWidth = input('');
  readonly role = input<'group' | 'region' | null>('group');
  readonly ariaLabel = input('Resizable panels');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
  readonly separatorLabel = input('Resize panels');

  readonly resizeStart = output<AerisSplitterResizeEvent>();
  readonly resized = output<AerisSplitterResizeEvent>();
  readonly resizeEnd = output<AerisSplitterResizeEvent>();

  private readonly discoveredPanels = contentChildren(AerisSplitterPanel, {
    descendants: true,
  });
  protected readonly gutters = viewChildren<ElementRef<HTMLElement>>('gutter');
  protected readonly activeHandle = signal<number | null>(null);
  protected readonly panels = computed(() =>
    this.discoveredPanels().filter((panel) => panel.isDirectPanelOf(this.hostElement)),
  );
  protected readonly normalizedSizes = computed(() => this.normalizeSizes(this.panels(), this.sizes()));
  protected readonly panelStates = computed<readonly AerisSplitterPanelState[]>(() => {
    const sizes = this.normalizedSizes();
    return this.panels().map((panel, index) => ({
      panel,
      index,
      id: panel.panelId,
      label: panel.ariaLabel(),
      size: sizes[index] ?? 0,
      minSize: this.clampPercent(panel.minSize()),
      maxSize: this.clampPercent(Math.max(panel.maxSize(), panel.minSize())),
      resizable: panel.resizable(),
      content: panel.content(),
    }));
  });
  protected readonly handleStates = computed<readonly AerisSplitterHandleState[]>(() => {
    const states = this.panelStates();
    const activeHandle = this.activeHandle();
    return states.slice(0, -1).map((state, index) => {
      const next = states[index + 1];
      const bounds = this.handleBoundsFromStates(states, index);
      return {
        index,
        id: `aeris-splitter-gutter-${state.id}`,
        currentPanelId: state.id,
        nextPanelId: next?.id ?? '',
        disabled: this.disabled() || !state.resizable || !next?.resizable,
        active: activeHandle === index,
        min: Math.round(bounds.min),
        max: Math.round(bounds.max),
        value: Math.round(state.size),
        zIndex: this.handleZIndex(states, index),
      };
    });
  });

  private activeSession: ResizeSession | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.removeDocumentListeners());
  }

  setSizes(sizes: readonly number[], originalEvent: Event | null = null): void {
    const previousSizes = this.normalizedSizes();
    const nextSizes = this.normalizeExplicitSizes(this.panels(), sizes);
    this.commitSizes(nextSizes, previousSizes, -1, originalEvent, this.resized);
  }

  reset(originalEvent: Event | null = null): void {
    const previousSizes = this.normalizedSizes();
    const nextSizes = this.normalizeSizes(this.panels(), []);
    this.commitSizes(nextSizes, previousSizes, -1, originalEvent, this.resized);
  }

  focusHandle(index: number, options?: FocusOptions): void {
    this.gutters()[index]?.nativeElement.focus(options);
  }

  protected handlePointerDown(event: PointerEvent, index: number): void {
    if (event.button !== 0 || this.handleStates()[index]?.disabled) return;
    const containerSize = this.containerPixelSize();
    if (containerSize <= 0) return;

    event.preventDefault();
    const startSizes = this.normalizedSizes();
    const session: ResizeSession = {
      index,
      pointerId: event.pointerId,
      startCoordinate: this.pointerCoordinate(event),
      containerSize,
      startSizes,
      previousSizes: startSizes,
      move: (moveEvent) => this.handlePointerMove(moveEvent),
      end: (endEvent) => this.handlePointerEnd(endEvent),
    };
    this.activeSession = session;
    this.activeHandle.set(index);
    this.document.addEventListener('pointermove', session.move);
    this.document.addEventListener('pointerup', session.end);
    this.document.addEventListener('pointercancel', session.end);
    this.resizeStart.emit(this.eventPayload(event, startSizes, startSizes, index));
  }

  protected handleGutterKeydown(event: KeyboardEvent, index: number): void {
    if (this.handleStates()[index]?.disabled) return;

    const amount = this.keyAmount(event);
    if (amount === null) return;

    event.preventDefault();
    const previousSizes = this.normalizedSizes();
    const nextSizes =
      amount === 'min'
        ? this.resizePair(previousSizes, index, Number.NEGATIVE_INFINITY)
        : amount === 'max'
          ? this.resizePair(previousSizes, index, Number.POSITIVE_INFINITY)
          : this.resizePair(previousSizes, index, amount);
    this.commitSizes(nextSizes, previousSizes, index, event, this.resized);
  }

  private handlePointerMove(event: PointerEvent): void {
    const session = this.activeSession;
    if (!session || event.pointerId !== session.pointerId) return;
    event.preventDefault();
    const delta = ((this.pointerCoordinate(event) - session.startCoordinate) / session.containerSize) * 100;
    const nextSizes = this.resizePair(session.startSizes, session.index, delta);
    this.commitSizes(nextSizes, session.previousSizes, session.index, event, this.resized);
  }

  private handlePointerEnd(event: PointerEvent): void {
    const session = this.activeSession;
    if (!session || event.pointerId !== session.pointerId) return;
    event.preventDefault();
    const previousSizes = session.previousSizes;
    const nextSizes = this.normalizedSizes();
    this.removeDocumentListeners();
    this.resizeEnd.emit(this.eventPayload(event, nextSizes, previousSizes, session.index));
  }

  private removeDocumentListeners(): void {
    const session = this.activeSession;
    if (!session) return;
    this.document.removeEventListener('pointermove', session.move);
    this.document.removeEventListener('pointerup', session.end);
    this.document.removeEventListener('pointercancel', session.end);
    this.activeSession = null;
    this.activeHandle.set(null);
  }

  private commitSizes(
    nextSizes: readonly number[],
    previousSizes: readonly number[],
    index: number,
    originalEvent: Event | null,
    emitter: { emit: (event: AerisSplitterResizeEvent) => void },
  ): void {
    const normalized = this.normalizeExplicitSizes(this.panels(), nextSizes);
    if (this.sameSizes(normalized, this.normalizedSizes())) return;
    this.sizes.set(normalized);
    emitter.emit(this.eventPayload(originalEvent, normalized, previousSizes, index));
  }

  private eventPayload(
    originalEvent: Event | null,
    sizes: readonly number[],
    previousSizes: readonly number[],
    index: number,
  ): AerisSplitterResizeEvent {
    return {
      originalEvent,
      sizes,
      previousSizes,
      index,
      nextIndex: index >= 0 ? index + 1 : -1,
    };
  }

  private normalizeSizes(
    panels: readonly AerisSplitterPanel[],
    requestedSizes: readonly number[],
  ): readonly number[] {
    if (panels.length === 0) return [];
    if (requestedSizes.length > 0) return this.normalizeExplicitSizes(panels, requestedSizes);

    const explicit = panels.map((panel) => panel.size());
    const totalExplicit = explicit.reduce<number>((total, value) => total + (value ?? 0), 0);
    const unsetCount = explicit.filter((value) => value === null).length;
    const fallbackSize = unsetCount > 0 ? Math.max(0, (100 - totalExplicit) / unsetCount) : 0;
    return this.normalizeExplicitSizes(
      panels,
      explicit.map((value) => value ?? fallbackSize),
    );
  }

  private normalizeExplicitSizes(
    panels: readonly AerisSplitterPanel[],
    requestedSizes: readonly number[],
  ): readonly number[] {
    if (panels.length === 0) return [];
    const fallbackSize = 100 / panels.length;
    const raw = panels.map((panel, index) => {
      const min = this.clampPercent(panel.minSize());
      const max = this.clampPercent(Math.max(panel.maxSize(), panel.minSize()));
      return clamp(requestedSizes[index] ?? panel.size() ?? fallbackSize, min, max);
    });
    const total = raw.reduce((sum, value) => sum + value, 0);
    if (total <= 0) return panels.map(() => roundSize(fallbackSize));
    return raw.map((value) => roundSize((value / total) * 100));
  }

  private resizePair(sizes: readonly number[], index: number, delta: number): readonly number[] {
    const states = this.panelStates();
    const current = states[index];
    const next = states[index + 1];
    if (!current || !next) return sizes;

    const pairTotal = (sizes[index] ?? current.size) + (sizes[index + 1] ?? next.size);
    const minCurrent = Math.max(current.minSize, pairTotal - next.maxSize);
    const maxCurrent = Math.min(current.maxSize, pairTotal - next.minSize);
    const currentSize = clamp((sizes[index] ?? current.size) + delta, minCurrent, maxCurrent);
    const nextSize = pairTotal - currentSize;

    return sizes.map((size, sizeIndex) =>
      sizeIndex === index
        ? roundSize(currentSize)
        : sizeIndex === index + 1
          ? roundSize(nextSize)
          : size,
    );
  }

  private handleBoundsFromStates(
    states: readonly AerisSplitterPanelState[],
    index: number,
  ): { readonly min: number; readonly max: number } {
    const current = states[index];
    const next = states[index + 1];
    if (!current || !next) return { min: 0, max: 0 };
    const pairTotal = current.size + next.size;
    return {
      min: Math.max(current.minSize, pairTotal - next.maxSize),
      max: Math.min(current.maxSize, pairTotal - next.minSize),
    };
  }

  private handleZIndex(states: readonly AerisSplitterPanelState[], index: number): number {
    const handleCount = Math.max(0, states.length - 1);
    const position = states.slice(0, index + 1).reduce((total, state) => total + state.size, 0);
    return position > 50 ? handleCount - index : index + 1;
  }

  private keyAmount(event: KeyboardEvent): number | 'min' | 'max' | null {
    const step = Math.max(1, this.step());
    if (event.key === 'Home') return 'min';
    if (event.key === 'End') return 'max';
    if (this.orientation() === 'horizontal') {
      if (event.key === 'ArrowLeft') return -step;
      if (event.key === 'ArrowRight') return step;
    } else {
      if (event.key === 'ArrowUp') return -step;
      if (event.key === 'ArrowDown') return step;
    }
    return null;
  }

  private pointerCoordinate(event: PointerEvent): number {
    return this.orientation() === 'horizontal' ? event.clientX : event.clientY;
  }

  private containerPixelSize(): number {
    const rect = this.root()?.nativeElement.getBoundingClientRect();
    return this.orientation() === 'horizontal' ? rect?.width ?? 0 : rect?.height ?? 0;
  }

  private sameSizes(left: readonly number[], right: readonly number[]): boolean {
    return left.length === right.length && left.every((value, index) => Math.abs(value - (right[index] ?? 0)) < 0.001);
  }

  private clampPercent(value: number): number {
    return clamp(Number.isFinite(value) ? value : 0, 0, 100);
  }
}

function nullableNumberAttribute(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundSize(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export const AerisSplitterModule = [AerisSplitter, AerisSplitterPanel] as const;
