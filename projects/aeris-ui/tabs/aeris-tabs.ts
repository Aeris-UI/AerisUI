import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  PLATFORM_ID,
  DestroyRef,
  afterNextRender,
  Component,
  Directive,
  ElementRef,
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

@Directive({ selector: 'ng-template[aerisTabHeader]' })
export class AerisTabHeaderTemplate {
  readonly template = inject<TemplateRef<AerisTabHeaderContext>>(TemplateRef);
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
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly instanceId = nextPanelId++;
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly panelId = `aeris-tab-panel-${this.instanceId}`;
  readonly tabId = `aeris-tab-${this.instanceId}`;
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
  readonly headerTemplate = contentChild(AerisTabHeaderTemplate, {
    descendants: false,
  });

  isDirectPanelOf(tabsHost: HTMLElement): boolean {
    const parent = this.element.nativeElement.parentElement;
    return (
      parent?.classList.contains('aeris-tabs__panel-source') === true &&
      parent.parentElement === tabsHost
    );
  }
}

@Component({
  selector: 'aeris-tabs',
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

    @if (activePanel(); as panel) {
      <div
        class="aeris-tabs__panel"
        role="tabpanel"
        [id]="panel.panelId"
        [attr.aria-labelledby]="panel.tabId"
        [attr.tabindex]="panelTabIndex()"
      >
        <ng-container [ngTemplateOutlet]="panel.content()" />
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
  private readonly hasOverflow = signal(false);
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

  constructor() {
    afterNextRender(() => {
      this.updateScrollState();
      this.observeTabSizing();
    });

    effect(() => {
      const panelSignature = this.panels()
        .map((panel) => `${panel.value()}:${panel.label()}:${panel.disabled()}`)
        .join('|');
      if (!panelSignature) return;
      queueMicrotask(() => this.updateScrollState());
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

    const observer = new ResizeObserver(() => this.updateScrollState());
    observer.observe(header);
    observer.observe(list);
    for (const button of this.tabButtons()) observer.observe(button.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
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

export const AerisTabsModule = [AerisTabs, AerisTabPanel, AerisTabHeaderTemplate] as const;
