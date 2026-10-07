import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  PLATFORM_ID,
  DestroyRef,
  afterNextRender,
  afterRenderEffect,
  Component,
  Directive,
  ElementRef,
  InjectionToken,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

export type AerisTabsOrientation = 'horizontal' | 'vertical';
export type AerisTabsActivationMode = 'automatic' | 'manual';
export type AerisTabsVariant = 'line' | 'pill';
export type AerisTabsSize = 'sm' | 'md' | 'lg';
export type AerisTabsJustify = 'start' | 'center' | 'end' | 'stretch';
export type AerisTabContentStrategy = 'preserve' | 'active';

type AerisTabRenderStrategy = 'eager' | AerisTabContentStrategy;

export interface AerisTabChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: string;
  readonly previousValue: string;
}

interface AerisTabHeaderContext {
  readonly $implicit: boolean;
  readonly selected: boolean;
  readonly disabled: boolean;
}

interface AerisTabsOwner {
  readonly host: HTMLElement;
}

interface AerisTabPanelView {
  readonly panel: AerisTabPanel;
  readonly active: boolean;
  readonly rendered: boolean;
}

interface AerisTabsIndicatorRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

const AERIS_TABS_OWNER = new InjectionToken<AerisTabsOwner>('AerisTabsOwner');

@Directive({ selector: 'ng-template[aerisTabHeader]' })
export class AerisTabHeaderTemplate {
  readonly template = inject<TemplateRef<AerisTabHeaderContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisTabContent]' })
export class AerisTabContentTemplate {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
  readonly renderStrategy = input<AerisTabContentStrategy, AerisTabContentStrategy | ''>(
    'preserve',
    {
      alias: 'aerisTabContent',
      transform: (value) => value || 'preserve',
    },
  );
}

let nextPanelId = 0;

@Component({
  selector: 'aeris-tab-panel',
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
  host: {
    '[style.display]': '"none"',
  },
})
export class AerisTabPanel {
  private readonly owner = inject(AERIS_TABS_OWNER, { optional: true });
  private readonly instanceId = nextPanelId++;
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly panelId = `aeris-tab-panel-${this.instanceId}`;
  readonly tabId = `aeris-tab-${this.instanceId}`;
  private readonly projectedContent = viewChild.required<TemplateRef<unknown>>('content');
  private readonly deferredContent = contentChild(AerisTabContentTemplate, {
    descendants: false,
  });
  readonly headerTemplate = contentChild(AerisTabHeaderTemplate, {
    descendants: false,
  });
  readonly content = computed(() => this.deferredContent()?.template ?? this.projectedContent());
  readonly renderStrategy = computed<AerisTabRenderStrategy>(
    () => this.deferredContent()?.renderStrategy() ?? 'eager',
  );

  isDirectPanelOf(tabsHost: HTMLElement): boolean {
    return this.owner?.host === tabsHost;
  }
}

@Component({
  selector: 'aeris-tabs',
  providers: [
    {
      provide: AERIS_TABS_OWNER,
      useFactory: () => ({
        host: inject<ElementRef<HTMLElement>>(ElementRef).nativeElement,
      }),
    },
  ],
  imports: [NgTemplateOutlet],
  template: `
    <div class="aeris-tabs__panel-source" aria-hidden="true">
      <ng-content />
    </div>

    <div #tabHeader class="aeris-tabs__header">
      @if (showScrollControls()) {
        <button
          class="aeris-tabs__scroll aeris-tabs__scroll--previous"
          type="button"
          aria-label="Scroll tabs backward"
          [disabled]="!canScrollPrevious()"
          (click)="scrollTabs(-1)"
        >
          <span aria-hidden="true"></span>
        </button>
      }

      <div
        #tabList
        class="aeris-tabs__list"
        role="tablist"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.aria-orientation]="orientation()"
        (keydown)="handleKeydown($event)"
        (scroll)="updateScrollState()"
      >
        @if (indicatorRect(); as indicator) {
          <span
            class="aeris-tabs__indicator"
            aria-hidden="true"
            [attr.data-ready]="indicatorReady() || null"
            [style.width.px]="indicator.width"
            [style.height.px]="indicator.height"
            [style.transform]="indicatorTransform()"
          ></span>
        }
        @for (panel of panels(); track panel.value()) {
          <button
            #tabButton
            type="button"
            role="tab"
            [id]="panel.tabId"
            [disabled]="panel.disabled()"
            [attr.aria-selected]="panel === activePanel()"
            [attr.aria-controls]="panel.panelId"
            [attr.tabindex]="panel === focusedPanel() ? 0 : -1"
            (click)="select(panel, $event)"
            (focus)="handleTabFocus(panel, $event)"
          >
            @if (panel.headerTemplate(); as header) {
              <ng-container
                [ngTemplateOutlet]="header.template"
                [ngTemplateOutletContext]="{
                  $implicit: panel === activePanel(),
                  selected: panel === activePanel(),
                  disabled: panel.disabled(),
                }"
              />
            } @else {
              {{ panel.label() }}
            }
          </button>
        }
      </div>

      @if (showScrollControls()) {
        <button
          class="aeris-tabs__scroll aeris-tabs__scroll--next"
          type="button"
          aria-label="Scroll tabs forward"
          [disabled]="!canScrollNext()"
          (click)="scrollTabs(1)"
        >
          <span aria-hidden="true"></span>
        </button>
      }
    </div>

    @for (view of panelViews(); track view.panel.panelId) {
      <div
        class="aeris-tabs__panel"
        role="tabpanel"
        [id]="view.panel.panelId"
        [attr.aria-labelledby]="view.panel.tabId"
        [attr.tabindex]="view.active ? panelTabIndex() : -1"
        [hidden]="!view.active"
      >
        @if (view.rendered) {
          <ng-container [ngTemplateOutlet]="view.panel.content()" />
        }
      </div>
    }
  `,
  styleUrl: './aeris-tabs.scss',
  host: {
    class: 'aeris-tabs',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-justify]': 'justify()',
    '[attr.data-scrollable]': 'scrollable() || null',
  },
})
export class AerisTabs {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  readonly value = model('');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly orientation = input<AerisTabsOrientation>('horizontal');
  readonly activationMode = input<AerisTabsActivationMode>('automatic');
  readonly variant = input<AerisTabsVariant>('line');
  readonly size = input<AerisTabsSize>('md');
  readonly justify = input<AerisTabsJustify>('start');
  readonly scrollable = input(true, { transform: booleanAttribute });
  readonly panelTabIndex = input<0 | -1>(0);

  readonly changed = output<AerisTabChangeEvent>();
  readonly tabFocused = output<string>();

  private readonly discoveredPanels = contentChildren(AerisTabPanel, {
    descendants: true,
  });
  protected readonly panels = computed(() =>
    this.discoveredPanels().filter((panel) => panel.isDirectPanelOf(this.hostElement)),
  );
  protected readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  private readonly tabList = viewChild<ElementRef<HTMLElement>>('tabList');
  private readonly tabHeader = viewChild<ElementRef<HTMLElement>>('tabHeader');
  private readonly focusedValue = signal('');
  private readonly activatedPanels = signal<ReadonlySet<AerisTabPanel>>(new Set());
  private readonly hasOverflow = signal(false);
  protected readonly indicatorRect = signal<AerisTabsIndicatorRect | null>(null);
  protected readonly indicatorReady = signal(false);
  protected readonly indicatorTransform = computed(() => {
    const indicator = this.indicatorRect();
    return indicator ? `translate3d(${indicator.x}px, ${indicator.y}px, 0)` : 'none';
  });
  private indicatorFrame: number | null = null;
  private indicatorReadyFrame: number | null = null;
  protected readonly canScrollPrevious = signal(false);
  protected readonly canScrollNext = signal(false);
  protected readonly showScrollControls = computed(
    () => this.scrollable() && this.orientation() === 'horizontal' && this.hasOverflow(),
  );
  protected readonly activePanel = computed(
    () =>
      this.panels().find((panel) => !panel.disabled() && panel.value() === this.value()) ??
      this.panels().find((panel) => !panel.disabled()),
  );
  protected readonly focusedPanel = computed(
    () =>
      this.panels().find((panel) => !panel.disabled() && panel.value() === this.focusedValue()) ??
      this.activePanel(),
  );
  protected readonly panelViews = computed<readonly AerisTabPanelView[]>(() => {
    const activePanel = this.activePanel();
    const activatedPanels = this.activatedPanels();
    return this.panels().map((panel) => {
      const active = panel === activePanel;
      const strategy = panel.renderStrategy();
      return {
        panel,
        active,
        rendered:
          strategy === 'eager' || active || (strategy === 'preserve' && activatedPanels.has(panel)),
      };
    });
  });

  constructor() {
    afterNextRender(() => {
      this.updateScrollState();
      this.observeTabSizing();
      this.scheduleIndicatorUpdate();
    });

    effect(() => {
      const panelCount = this.panels().length;
      this.tabButtons();
      if (panelCount === 0) return;
      queueMicrotask(() => this.updateScrollState());
    });

    afterRenderEffect(() => {
      const panel = this.activePanel();
      this.variant();
      this.orientation();
      this.justify();
      this.tabButtons();
      this.scheduleIndicatorUpdate();
      if (panel && !this.activatedPanels().has(panel)) {
        this.activatedPanels.update((current) => new Set(current).add(panel));
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.indicatorFrame !== null) cancelAnimationFrame(this.indicatorFrame);
      if (this.indicatorReadyFrame !== null) cancelAnimationFrame(this.indicatorReadyFrame);
    });
  }

  select(valueOrPanel: string | AerisTabPanel, originalEvent: Event | null = null): void {
    const panel =
      typeof valueOrPanel === 'string'
        ? this.panels().find((candidate) => candidate.value() === valueOrPanel)
        : valueOrPanel;
    if (!panel || panel.disabled()) return;
    const previousValue = this.activePanel()?.value() ?? '';
    this.focusedValue.set(panel.value());
    if (previousValue === panel.value() && this.value() === panel.value()) return;
    this.value.set(panel.value());
    this.changed.emit({
      originalEvent,
      value: panel.value(),
      previousValue,
    });
  }

  focusTab(value: string, options?: FocusOptions): void {
    const panelIndex = this.panels().findIndex(
      (panel) => !panel.disabled() && panel.value() === value,
    );
    if (panelIndex < 0) return;
    this.focusedValue.set(value);
    this.tabButtons()[panelIndex]?.nativeElement.focus(options);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.activationMode() === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      const panel = this.focusedPanel();
      if (panel) this.select(panel, event);
      return;
    }

    const direction = this.keyDirection(event.key);
    if (direction === undefined) return;
    event.preventDefault();
    const enabledPanels = this.panels().filter((panel) => !panel.disabled());
    if (enabledPanels.length === 0) return;

    const currentPanel = this.focusedPanel() ?? this.activePanel();
    const currentIndex = Math.max(enabledPanels.indexOf(currentPanel!), 0);
    const nextIndex =
      direction === 'first'
        ? 0
        : direction === 'last'
          ? enabledPanels.length - 1
          : (currentIndex + direction + enabledPanels.length) % enabledPanels.length;
    const nextPanel = enabledPanels[nextIndex];
    if (!nextPanel) return;

    this.focusedValue.set(nextPanel.value());
    if (this.activationMode() === 'automatic') this.select(nextPanel, event);
    this.focusTab(nextPanel.value());
    this.scrollPanelIntoView(nextPanel);
  }

  protected handleTabFocus(panel: AerisTabPanel, event: FocusEvent): void {
    this.focusedValue.set(panel.value());
    this.tabFocused.emit(panel.value());
    if (this.activationMode() === 'automatic' && panel !== this.activePanel()) {
      this.select(panel, event);
    }
  }

  protected scrollTabs(direction: -1 | 1): void {
    const list = this.tabList()?.nativeElement;
    if (!list) return;
    const left = direction * Math.max(list.clientWidth * 0.75, 160);
    if (typeof list.scrollBy === 'function') {
      list.scrollBy({ left, behavior: 'smooth' });
    } else {
      list.scrollLeft += left;
    }
    queueMicrotask(() => this.updateScrollState());
  }

  protected updateScrollState(): void {
    const list = this.tabList()?.nativeElement;
    const header = this.tabHeader()?.nativeElement;
    if (!list || !header) return;

    const overflow =
      this.scrollable() &&
      this.orientation() === 'horizontal' &&
      list.scrollWidth > header.clientWidth + 1;
    this.hasOverflow.set(overflow);

    if (!overflow) {
      this.canScrollPrevious.set(false);
      this.canScrollNext.set(false);
      return;
    }

    this.canScrollPrevious.set(list.scrollLeft > 1);
    this.canScrollNext.set(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
  }

  private observeTabSizing(): void {
    if (!this.isBrowser || typeof globalThis.ResizeObserver !== 'function') return;

    const header = this.tabHeader()?.nativeElement;
    const list = this.tabList()?.nativeElement;
    if (!header || !list) return;

    const observer = new ResizeObserver(() => {
      this.updateScrollState();
      this.scheduleIndicatorUpdate();
    });
    observer.observe(header);
    observer.observe(list);
    for (const button of this.tabButtons()) observer.observe(button.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private scheduleIndicatorUpdate(): void {
    if (!this.isBrowser) return;
    if (this.indicatorFrame !== null) cancelAnimationFrame(this.indicatorFrame);
    this.indicatorFrame = requestAnimationFrame(() => {
      this.indicatorFrame = null;
      this.updateIndicator();
    });
  }

  private updateIndicator(): void {
    const panel = this.activePanel();
    const list = this.tabList()?.nativeElement;
    const panelIndex = panel ? this.panels().indexOf(panel) : -1;
    const button = panelIndex >= 0 ? this.tabButtons()[panelIndex]?.nativeElement : undefined;
    if (!list || !button) {
      this.indicatorReady.set(false);
      this.indicatorRect.set(null);
      return;
    }

    const pill = this.variant() === 'pill';
    const vertical = getComputedStyle(list).flexDirection === 'column';
    const rect: AerisTabsIndicatorRect = pill
      ? {
          x: button.offsetLeft,
          y: button.offsetTop,
          width: button.offsetWidth,
          height: button.offsetHeight,
        }
      : vertical
        ? {
            x: list.clientWidth - 2,
            y: button.offsetTop + 8,
            width: 2,
            height: Math.max(button.offsetHeight - 16, 2),
          }
        : {
            x: button.offsetLeft + 12,
            y: button.offsetTop + button.offsetHeight - 2,
            width: Math.max(button.offsetWidth - 24, 2),
            height: 2,
          };

    const currentRect = this.indicatorRect();
    if (
      !currentRect ||
      currentRect.x !== rect.x ||
      currentRect.y !== rect.y ||
      currentRect.width !== rect.width ||
      currentRect.height !== rect.height
    ) {
      this.indicatorRect.set(rect);
    }
    if (this.indicatorReady()) return;
    if (this.indicatorReadyFrame !== null) cancelAnimationFrame(this.indicatorReadyFrame);
    this.indicatorReadyFrame = requestAnimationFrame(() => {
      this.indicatorReadyFrame = null;
      this.indicatorReady.set(true);
    });
  }

  private scrollPanelIntoView(panel: AerisTabPanel): void {
    const panelIndex = this.panels().indexOf(panel);
    const tab = this.tabButtons()[panelIndex]?.nativeElement;
    if (typeof tab?.scrollIntoView === 'function') {
      tab.scrollIntoView({
        behavior: this.isBrowser ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'nearest',
      });
    }
    queueMicrotask(() => this.updateScrollState());
  }

  private keyDirection(key: string): -1 | 1 | 'first' | 'last' | undefined {
    if (key === 'Home') return 'first';
    if (key === 'End') return 'last';
    if (
      (this.orientation() === 'horizontal' && key === 'ArrowLeft') ||
      (this.orientation() === 'vertical' && key === 'ArrowUp')
    ) {
      return -1;
    }
    if (
      (this.orientation() === 'horizontal' && key === 'ArrowRight') ||
      (this.orientation() === 'vertical' && key === 'ArrowDown')
    ) {
      return 1;
    }
    return undefined;
  }
}

export const AerisTabsModule = [
  AerisTabs,
  AerisTabPanel,
  AerisTabHeaderTemplate,
  AerisTabContentTemplate,
] as const;
