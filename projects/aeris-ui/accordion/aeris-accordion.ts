import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

export type AerisAccordionValue = string | readonly string[];
export type AerisAccordionVariant = 'outlined' | 'filled' | 'separated';
export type AerisAccordionSize = 'sm' | 'md' | 'lg';
export type AerisAccordionIconPosition = 'start' | 'end';

export interface AerisAccordionChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: AerisAccordionValue;
  readonly previousValue: AerisAccordionValue;
  readonly changedValue: string;
  readonly expanded: boolean;
}

export interface AerisAccordionHeaderContext {
  readonly $implicit: boolean;
  readonly expanded: boolean;
  readonly disabled: boolean;
  readonly value: string;
}

export interface AerisAccordionToggleIconContext extends AerisAccordionHeaderContext {}

interface AerisAccordionPanelState {
  readonly panel: AerisAccordionPanel;
  readonly value: string;
  readonly header: string;
  readonly disabled: boolean;
  readonly expanded: boolean;
  readonly headerId: string;
  readonly panelId: string;
  readonly content: TemplateRef<unknown>;
  readonly headerTemplate: TemplateRef<AerisAccordionHeaderContext> | null;
  readonly toggleIconTemplate: TemplateRef<AerisAccordionToggleIconContext> | null;
}

@Directive({ selector: 'ng-template[aerisAccordionHeader]' })
export class AerisAccordionHeaderTemplate {
  readonly template = inject<TemplateRef<AerisAccordionHeaderContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisAccordionToggleIcon]' })
export class AerisAccordionToggleIconTemplate {
  readonly template = inject<TemplateRef<AerisAccordionToggleIconContext>>(TemplateRef);
}

let nextPanelId = 0;

@Component({
  selector: 'aeris-accordion-panel',
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
  host: {
    '[style.display]': '"none"',
  },
})
export class AerisAccordionPanel {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly instanceId = nextPanelId++;

  readonly value = input.required<string>();
  readonly header = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly panelId = `aeris-accordion-panel-${this.instanceId}`;
  readonly headerId = `aeris-accordion-header-${this.instanceId}`;
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
  readonly headerTemplate = contentChild(AerisAccordionHeaderTemplate, {
    descendants: false,
  });
  readonly toggleIconTemplate = contentChild(AerisAccordionToggleIconTemplate, {
    descendants: false,
  });

  isDirectPanelOf(accordionHost: HTMLElement): boolean {
    const parent = this.element.nativeElement.parentElement;
    return (
      parent?.classList.contains('aeris-accordion__panel-source') === true &&
      parent.parentElement === accordionHost
    );
  }
}

@Component({
  selector: 'aeris-accordion',
  imports: [NgTemplateOutlet],
  template: `
    <div class="aeris-accordion__panel-source" aria-hidden="true">
      <ng-content />
    </div>

    @for (state of panelStates(); track state.value) {
      <section
        class="aeris-accordion__item"
        [attr.data-expanded]="state.expanded || null"
        [attr.data-disabled]="state.disabled || null"
      >
        <div
          class="aeris-accordion__heading"
          role="heading"
          [attr.aria-level]="headingLevel()"
        >
          <button
            #headerButton
            class="aeris-accordion__trigger"
            type="button"
            [id]="state.headerId"
            [disabled]="state.disabled"
            [attr.aria-expanded]="state.expanded"
            [attr.aria-controls]="state.panelId"
            (click)="toggle(state.value, $event)"
            (focus)="handleHeaderFocus(state.value)"
            (keydown)="handleHeaderKeydown($event)"
          >
            <span class="aeris-accordion__icon" aria-hidden="true">
              @if (state.toggleIconTemplate; as toggleIconTemplate) {
                <ng-container
                  [ngTemplateOutlet]="toggleIconTemplate"
                  [ngTemplateOutletContext]="{
                    $implicit: state.expanded,
                    expanded: state.expanded,
                    disabled: state.disabled,
                    value: state.value
                  }"
                />
              } @else {
                <span class="aeris-accordion__default-icon"></span>
              }
            </span>
            <span class="aeris-accordion__label">
              @if (state.headerTemplate; as headerTemplate) {
                <ng-container
                  [ngTemplateOutlet]="headerTemplate"
                  [ngTemplateOutletContext]="{
                    $implicit: state.expanded,
                    expanded: state.expanded,
                    disabled: state.disabled,
                    value: state.value
                  }"
                />
              } @else {
                {{ state.header }}
              }
            </span>
          </button>
        </div>

        @if (state.expanded) {
          <div
            class="aeris-accordion__panel"
            role="region"
            [id]="state.panelId"
            [attr.aria-labelledby]="state.headerId"
            [attr.tabindex]="panelTabIndex()"
          >
            <ng-container [ngTemplateOutlet]="state.content" />
          </div>
        }
      </section>
    }
  `,
  styleUrl: './aeris-accordion.scss',
  host: {
    class: 'aeris-accordion',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-icon-position]': 'iconPosition()',
    '[attr.data-disabled]': 'disabled() || null',
    '(keydown)': 'handleAccordionKeydown($event)',
  },
})
export class AerisAccordion {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly value = model<AerisAccordionValue>('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<AerisAccordionVariant>('outlined');
  readonly size = input<AerisAccordionSize>('md');
  readonly iconPosition = input<AerisAccordionIconPosition>('end');
  readonly headingLevel = input<1 | 2 | 3 | 4 | 5 | 6>(3);
  readonly panelTabIndex = input<0 | -1>(0);
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');

  readonly changed = output<AerisAccordionChangeEvent>();
  readonly panelExpanded = output<AerisAccordionChangeEvent>();
  readonly panelCollapsed = output<AerisAccordionChangeEvent>();
  readonly headerFocused = output<string>();

  private readonly toggleIconTemplate = contentChild(AerisAccordionToggleIconTemplate, {
    descendants: false,
  });
  private readonly discoveredPanels = contentChildren(AerisAccordionPanel, {
    descendants: true,
  });
  protected readonly panels = computed(() =>
    this.discoveredPanels().filter((panel) => panel.isDirectPanelOf(this.hostElement)),
  );
  protected readonly headerButtons = viewChildren<ElementRef<HTMLButtonElement>>('headerButton');
  private readonly focusedValue = signal('');
  private readonly expandedValues = computed(() => this.normalizeValue(this.value()));
  protected readonly panelStates = computed<readonly AerisAccordionPanelState[]>(() => {
    const expandedValues = new Set(this.expandedValues());
    const accordionDisabled = this.disabled();
    const toggleIconTemplate = this.toggleIconTemplate()?.template ?? null;

    return this.panels().map((panel) => {
      const value = panel.value();
      return {
        panel,
        value,
        header: panel.header(),
        disabled: accordionDisabled || panel.disabled(),
        expanded: expandedValues.has(value),
        headerId: panel.headerId,
        panelId: panel.panelId,
        content: panel.content(),
        headerTemplate: panel.headerTemplate()?.template ?? null,
        toggleIconTemplate: panel.toggleIconTemplate()?.template ?? toggleIconTemplate,
      };
    });
  });

  toggle(value: string, originalEvent: Event | null = null): void {
    const state = this.enabledState(value);
    if (!state) return;
    if (state.expanded) {
      this.collapse(value, originalEvent);
    } else {
      this.expand(value, originalEvent);
    }
  }

  expand(value: string, originalEvent: Event | null = null): void {
    const state = this.enabledState(value);
    if (!state || state.expanded) return;
    const previousValue = this.value();
    const current = this.expandedValues();
    const nextValues = this.multiple() ? [...current, value] : [value];
    this.commitValue(nextValues, value, true, previousValue, originalEvent);
  }

  collapse(value: string, originalEvent: Event | null = null): void {
    const state = this.enabledState(value);
    if (!state || !state.expanded) return;
    const current = this.expandedValues();
    if (!this.collapsible() && current.length <= 1) return;
    const previousValue = this.value();
    const nextValues = current.filter((item) => item !== value);
    this.commitValue(nextValues, value, false, previousValue, originalEvent);
  }

  focusPanel(value: string, options?: FocusOptions): void {
    const stateIndex = this.panelStates().findIndex((state) => state.value === value && !state.disabled);
    if (stateIndex < 0) return;
    this.focusedValue.set(value);
    this.headerButtons()[stateIndex]?.nativeElement.focus(options);
  }

  protected handleHeaderFocus(value: string): void {
    this.focusedValue.set(value);
    this.headerFocused.emit(value);
  }

  protected handleHeaderKeydown(event: KeyboardEvent): void {
    const direction = this.keyDirection(event.key);
    if (direction === undefined) return;

    event.preventDefault();
    const states = this.panelStates();
    const buttonIndex = this.headerButtons().findIndex(
      (button) => button.nativeElement === event.currentTarget,
    );
    const currentState = states[buttonIndex];
    const enabledStates = states.filter((state) => !state.disabled);
    if (!currentState || enabledStates.length === 0) return;

    const currentIndex = Math.max(
      enabledStates.findIndex((state) => state.value === currentState.value),
      0,
    );
    const nextIndex =
      direction === 'first'
        ? 0
        : direction === 'last'
          ? enabledStates.length - 1
          : (currentIndex + direction + enabledStates.length) % enabledStates.length;
    const nextState = enabledStates[nextIndex];
    if (nextState) this.focusPanel(nextState.value);
  }

  protected handleAccordionKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    const value = this.focusedValue();
    if (value) this.focusPanel(value);
  }

  private enabledState(value: string): AerisAccordionPanelState | undefined {
    return this.panelStates().find((state) => state.value === value && !state.disabled);
  }

  private commitValue(
    nextValues: readonly string[],
    changedValue: string,
    expanded: boolean,
    previousValue: AerisAccordionValue,
    originalEvent: Event | null,
  ): void {
    const uniqueValues = [...new Set(nextValues.filter(Boolean))];
    const nextValue: AerisAccordionValue = this.multiple() ? uniqueValues : (uniqueValues[0] ?? '');
    this.value.set(nextValue);
    const event: AerisAccordionChangeEvent = {
      originalEvent,
      value: nextValue,
      previousValue,
      changedValue,
      expanded,
    };
    this.changed.emit(event);
    if (expanded) {
      this.panelExpanded.emit(event);
    } else {
      this.panelCollapsed.emit(event);
    }
  }

  private normalizeValue(value: AerisAccordionValue): readonly string[] {
    if (typeof value === 'string') return value ? [value] : [];
    return [...new Set(value.filter(Boolean))];
  }

  private keyDirection(key: string): -1 | 1 | 'first' | 'last' | undefined {
    if (key === 'Home') return 'first';
    if (key === 'End') return 'last';
    if (key === 'ArrowUp') return -1;
    if (key === 'ArrowDown') return 1;
    return undefined;
  }
}

export const AerisAccordionModule = [
  AerisAccordion,
  AerisAccordionPanel,
  AerisAccordionHeaderTemplate,
  AerisAccordionToggleIconTemplate,
] as const;
