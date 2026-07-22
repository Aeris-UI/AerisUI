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
  viewChild,
  viewChildren,
} from '@angular/core';

export type AerisStepperOrientation = 'horizontal' | 'vertical';
export type AerisStepperActivationMode = 'automatic' | 'manual';
export type AerisStepperSize = 'sm' | 'md' | 'lg';
export type AerisStepperVariant = 'line' | 'contained';

export interface AerisStepperChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: string;
  readonly previousValue: string;
  readonly index: number;
}

export interface AerisStepTemplateContext {
  readonly $implicit: boolean;
  readonly selected: boolean;
  readonly active: boolean;
  readonly completed: boolean;
  readonly invalid: boolean;
  readonly disabled: boolean;
  readonly optional: boolean;
  readonly index: number;
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

interface AerisStepState extends AerisStepTemplateContext {
  readonly step: AerisStep;
  readonly stepId: string;
  readonly panelId: string;
  readonly reachable: boolean;
  readonly content: TemplateRef<unknown>;
  readonly headerTemplate: TemplateRef<AerisStepTemplateContext> | null;
  readonly indicatorTemplate: TemplateRef<AerisStepTemplateContext> | null;
}

@Directive({ selector: 'ng-template[aerisStepHeader]' })
export class AerisStepHeaderTemplate {
  readonly template = inject<TemplateRef<AerisStepTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisStepIndicator]' })
export class AerisStepIndicatorTemplate {
  readonly template = inject<TemplateRef<AerisStepTemplateContext>>(TemplateRef);
}

let nextStepId = 0;

@Component({
  selector: 'aeris-step',
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
  host: {
    '[style.display]': '"none"',
  },
})
export class AerisStep {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly instanceId = nextStepId++;

  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly description = input('');
  readonly optional = input(false, { transform: booleanAttribute });
  readonly completed = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly stepId = `aeris-step-${this.instanceId}`;
  readonly panelId = `aeris-step-panel-${this.instanceId}`;
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
  readonly headerTemplate = contentChild(AerisStepHeaderTemplate, {
    descendants: false,
  });
  readonly indicatorTemplate = contentChild(AerisStepIndicatorTemplate, {
    descendants: false,
  });

  isDirectStepOf(stepperHost: HTMLElement): boolean {
    const parent = this.element.nativeElement.parentElement;
    return (
      parent?.classList.contains('aeris-stepper__step-source') === true &&
      parent.parentElement === stepperHost
    );
  }
}

@Component({
  selector: 'aeris-stepper',
  imports: [NgTemplateOutlet],
  template: `
    <div class="aeris-stepper__step-source" aria-hidden="true">
      <ng-content />
    </div>

    <div
      class="aeris-stepper__list"
      [attr.role]="stepsOnly() ? 'list' : 'tablist'"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-labelledby]="ariaLabelledBy() || null"
      [attr.aria-orientation]="stepsOnly() ? null : orientation()"
      (keydown)="handleListKeydown($event)"
    >
      @for (state of stepStates(); track state.value; let last = $last) {
        <div
          class="aeris-stepper__item"
          [attr.role]="stepsOnly() ? 'listitem' : null"
          [attr.data-selected]="state.selected || null"
          [attr.data-completed]="state.completed || null"
          [attr.data-invalid]="state.invalid || null"
          [attr.data-disabled]="state.disabled || null"
          [attr.data-reachable]="state.reachable || null"
        >
          <button
            #stepButton
            class="aeris-stepper__trigger"
            type="button"
            [attr.role]="stepsOnly() ? null : 'tab'"
            [id]="state.stepId"
            [disabled]="state.disabled || !state.reachable"
            [attr.aria-selected]="stepsOnly() ? null : state.selected"
            [attr.aria-controls]="stepsOnly() ? null : state.panelId"
            [attr.aria-current]="state.selected ? 'step' : null"
            [attr.aria-invalid]="state.invalid || null"
            [attr.tabindex]="state.selected ? 0 : -1"
            (click)="select(state.value, $event)"
            (focus)="stepFocused.emit(state.value)"
          >
            <span class="aeris-stepper__indicator" aria-hidden="true">
              @if (state.indicatorTemplate; as indicatorTemplate) {
                <ng-container
                  [ngTemplateOutlet]="indicatorTemplate"
                  [ngTemplateOutletContext]="state"
                />
              } @else if (state.completed) {
                <span class="aeris-stepper__check"></span>
              } @else {
                {{ state.index + 1 }}
              }
            </span>
            <span class="aeris-stepper__header">
              @if (state.headerTemplate; as headerTemplate) {
                <ng-container
                  [ngTemplateOutlet]="headerTemplate"
                  [ngTemplateOutletContext]="state"
                />
              } @else {
                <span class="aeris-stepper__label">{{ state.label }}</span>
                @if (!stepsOnly() && state.description) {
                  <span class="aeris-stepper__description">{{ state.description }}</span>
                }
                @if (!stepsOnly() && state.optional) {
                  <span class="aeris-stepper__optional">{{ optionalLabel() }}</span>
                }
              }
            </span>
          </button>
          @if (!last) {
            <span class="aeris-stepper__connector" aria-hidden="true"></span>
          }
        </div>
      }
    </div>

    @if (!stepsOnly()) {
      @if (activeState(); as state) {
        <section
          class="aeris-stepper__panel"
          role="tabpanel"
          [id]="state.panelId"
          [attr.aria-labelledby]="state.stepId"
          [attr.tabindex]="panelTabIndex()"
        >
          <ng-container [ngTemplateOutlet]="state.content" />
        </section>
      }
    }
  `,
  styleUrl: './aeris-stepper.scss',
  host: {
    class: 'aeris-stepper',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-linear]': 'linear() || null',
    '[attr.data-steps-only]': 'stepsOnly() || null',
  },
})
export class AerisStepper {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly value = model('');
  readonly orientation = input<AerisStepperOrientation>('horizontal');
  readonly activationMode = input<AerisStepperActivationMode>('automatic');
  readonly linear = input(false, { transform: booleanAttribute });
  readonly stepsOnly = input(false, { transform: booleanAttribute });
  readonly size = input<AerisStepperSize>('md');
  readonly variant = input<AerisStepperVariant>('line');
  readonly optionalLabel = input('Optional');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly panelTabIndex = input<0 | -1>(0);

  readonly changed = output<AerisStepperChangeEvent>();
  readonly stepFocused = output<string>();

  private readonly indicatorTemplate = contentChild(AerisStepIndicatorTemplate, {
    descendants: false,
  });
  private readonly discoveredSteps = contentChildren(AerisStep, {
    descendants: true,
  });
  protected readonly stepButtons = viewChildren<ElementRef<HTMLButtonElement>>('stepButton');
  protected readonly steps = computed(() =>
    this.discoveredSteps().filter((step) => step.isDirectStepOf(this.hostElement)),
  );
  protected readonly activeState = computed(() => {
    const selectedValue = this.value();
    return (
      this.stepStates().find((state) => state.selected && !state.disabled) ??
      this.stepStates().find((state) => !state.disabled)
    );
  });
  protected readonly stepStates = computed<readonly AerisStepState[]>(() => {
    const steps = this.steps();
    const selectedValue = this.value();
    const activeIndex = Math.max(
      steps.findIndex((step) => !step.disabled() && step.value() === selectedValue),
      steps.findIndex((step) => !step.disabled()),
    );
    const globalIndicator = this.indicatorTemplate()?.template ?? null;

    const lastReachableIndex = this.linear()
      ? Math.min(activeIndex + 1, steps.length - 1)
      : steps.length - 1;

    return steps.map((step, index) => {
      const selected = index === activeIndex;
      const completed = step.completed() || index < activeIndex;
      const invalid = step.invalid();
      const disabled = step.disabled();
      const reachable = !this.linear() || index <= lastReachableIndex;
      const context: AerisStepTemplateContext = {
        $implicit: selected,
        selected,
        active: selected,
        completed,
        invalid,
        disabled,
        optional: step.optional(),
        index,
        value: step.value(),
        label: step.label(),
        description: step.description(),
      };

      return {
        ...context,
        step,
        stepId: step.stepId,
        panelId: step.panelId,
        reachable,
        content: step.content(),
        headerTemplate: step.headerTemplate()?.template ?? null,
        indicatorTemplate: step.indicatorTemplate()?.template ?? globalIndicator,
      };
    });
  });

  select(value: string, originalEvent: Event | null = null): void {
    const state = this.stepStates().find((candidate) => candidate.value === value);
    if (!state || state.disabled || !state.reachable) return;

    const previousValue = this.activeState()?.value ?? '';
    if (previousValue === value && this.value() === value) return;
    this.value.set(value);
    this.changed.emit({
      originalEvent,
      value,
      previousValue,
      index: state.index,
    });
  }

  next(originalEvent: Event | null = null): void {
    const states = this.stepStates();
    const currentIndex = this.activeState()?.index ?? -1;
    const nextState = states.slice(currentIndex + 1).find((state) => !state.disabled && state.reachable);
    if (nextState) this.select(nextState.value, originalEvent);
  }

  previous(originalEvent: Event | null = null): void {
    const states = this.stepStates();
    const currentIndex = this.activeState()?.index ?? states.length;
    const previousState = [...states.slice(0, currentIndex)].reverse().find((state) => !state.disabled);
    if (previousState) this.select(previousState.value, originalEvent);
  }

  focusStep(value: string, options?: FocusOptions): void {
    const index = this.stepStates().findIndex(
      (state) => state.value === value && !state.disabled && state.reachable,
    );
    if (index < 0) return;
    this.stepButtons()[index]?.nativeElement.focus(options);
  }

  protected handleListKeydown(event: KeyboardEvent): void {
    if (
      this.activationMode() === 'manual' &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      const focused = this.focusedButtonState(event);
      if (focused) this.select(focused.value, event);
      return;
    }

    const direction = this.keyDirection(event.key);
    if (direction === undefined) return;
    event.preventDefault();

    const states = this.stepStates().filter((state) => !state.disabled && state.reachable);
    if (states.length === 0) return;
    const focused = this.focusedButtonState(event) ?? this.activeState();
    const currentIndex = Math.max(states.findIndex((state) => state.value === focused?.value), 0);
    const nextIndex =
      direction === 'first'
        ? 0
        : direction === 'last'
          ? states.length - 1
          : (currentIndex + direction + states.length) % states.length;
    const nextState = states[nextIndex];
    if (!nextState) return;

    if (this.activationMode() === 'automatic') this.select(nextState.value, event);
    this.focusStep(nextState.value);
  }

  private focusedButtonState(event: Event): AerisStepState | undefined {
    const index = this.stepButtons().findIndex((button) => button.nativeElement === event.target);
    return index >= 0 ? this.stepStates()[index] : undefined;
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

export const AerisStepperModule = [
  AerisStepper,
  AerisStep,
  AerisStepHeaderTemplate,
  AerisStepIndicatorTemplate,
] as const;
