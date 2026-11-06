import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { ɵAerisIcon } from '@aeris-ui/core';

interface TimeControlChange {
  readonly value: number;
  readonly originalEvent: Event;
}

interface TimeDrag {
  readonly pointerId: number;
  readonly startY: number;
  readonly rowHeight: number;
  readonly value: number;
}

/** Internal popup time control. Touch wheels and desktop steppers share one value. */
@Component({
  selector: 'aeris-internal-date-picker-time-control',
  imports: [ɵAerisIcon],
  template: `
    <span class="time-label" [id]="labelId()">{{ label() }}</span>
    <div class="stepper">
      <input
        #numberInput
        type="number"
        inputmode="numeric"
        [attr.aria-labelledby]="labelId()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="formattedValue()"
        [disabled]="disabled()"
        (input)="handleInput($event)"
        (keydown)="handleKeydown($event)"
      />
      <div class="stepper-actions">
        <button
          type="button"
          [attr.aria-label]="increaseLabel()"
          [disabled]="disabled()"
          (click)="adjust(1, $event)"
        >
          <span aerisInternalIcon="chevron" class="chevron-up" aria-hidden="true"></span>
        </button>
        <button
          type="button"
          [attr.aria-label]="decreaseLabel()"
          [disabled]="disabled()"
          (click)="adjust(-1, $event)"
        >
          <span aerisInternalIcon="chevron" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    <div
      #wheel
      class="wheel"
      role="spinbutton"
      [attr.aria-labelledby]="labelId()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuenow]="wheelValue()"
      [attr.aria-disabled]="disabled() || null"
      [attr.tabindex]="disabled() ? -1 : 0"
      [attr.data-dragging]="dragging() || null"
      (keydown)="handleKeydown($event)"
      (pointerdown)="startDrag($event)"
      (pointermove)="moveDrag($event)"
      (pointerup)="endDrag($event)"
      (pointercancel)="cancelDrag($event)"
      (lostpointercapture)="cancelDrag($event)"
    >
      <div class="wheel-track" [style.translate]="wheelTranslate()" aria-hidden="true">
        @for (row of rows(); track row.offset) {
          <span class="wheel-row" [attr.data-selected]="row.offset === 0 || null">{{
            row.text
          }}</span>
        }
      </div>
    </div>
  `,
  styleUrl: './aeris-date-picker-time-control.scss',
})
export class ɵAerisDatePickerTimeControl {
  readonly value = input.required<number>();
  readonly min = input(0);
  readonly max = input(59);
  readonly step = input(1);
  readonly label = input.required<string>();
  readonly labelId = input.required<string>();
  readonly disabled = input(false);
  readonly changed = output<TimeControlChange>();

  private readonly numberInput = viewChild<ElementRef<HTMLInputElement>>('numberInput');
  private readonly wheel = viewChild<ElementRef<HTMLElement>>('wheel');
  private drag: TimeDrag | null = null;
  private readonly dragSteps = signal(0);
  private readonly offset = signal(0);
  protected readonly dragging = signal(false);
  protected readonly increaseLabel = computed(() => `Increase ${this.label()}`);
  protected readonly decreaseLabel = computed(() => `Decrease ${this.label()}`);
  protected readonly formattedValue = computed(() => String(this.value()).padStart(2, '0'));
  protected readonly wheelValue = computed(() =>
    this.wrap(this.value() + this.dragSteps() * this.step()),
  );
  protected readonly wheelTranslate = computed(() => `0 ${this.offset()}px`);
  protected readonly rows = computed(() =>
    [-1, 0, 1].map((offset) => ({
      offset,
      text: String(this.wrap(this.wheelValue() + offset * this.step())).padStart(2, '0'),
    })),
  );

  focus(): void {
    const input = this.numberInput()?.nativeElement;
    const wheel = this.wheel()?.nativeElement;
    // Match the CSS presentation, including hybrid devices with a fine primary pointer.
    const touch = wheel?.ownerDocument.defaultView?.matchMedia?.('(pointer: coarse)').matches;
    (touch ? wheel : input)?.focus({ preventScroll: true });
  }

  protected handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '' || !Number.isFinite(input.valueAsNumber)) return;
    this.commit(Math.max(this.min(), Math.min(this.max(), Math.trunc(input.valueAsNumber))), event);
  }

  protected adjust(direction: number, event: Event): void {
    this.commit(this.wrap(this.value() + direction * this.step()), event);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const direction = event.key === 'ArrowUp' ? 1 : event.key === 'ArrowDown' ? -1 : 0;
    if (direction) {
      event.preventDefault();
      this.adjust(direction, event);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.commit(event.key === 'Home' ? this.min() : this.max(), event);
    }
  }

  protected startDrag(event: PointerEvent): void {
    if (this.disabled() || this.drag || event.isPrimary === false || event.button !== 0) return;
    const wheel = event.currentTarget as HTMLElement;
    const row = wheel.querySelector<HTMLElement>('.wheel-row');
    const rowHeight = row?.getBoundingClientRect().height ?? 0;
    if (rowHeight <= 0) return;
    event.preventDefault();
    wheel.focus({ preventScroll: true });
    this.drag = {
      pointerId: event.pointerId,
      startY: event.clientY,
      rowHeight,
      value: this.value(),
    };
    this.dragging.set(true);
    wheel.setPointerCapture(event.pointerId);
  }

  protected moveDrag(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (this.disabled()) {
      this.cancelDrag(event);
      return;
    }
    const distance = event.clientY - drag.startY;
    const steps = Math.round(-distance / drag.rowHeight);
    this.dragSteps.set(steps);
    this.offset.set(distance + steps * drag.rowHeight);
  }

  protected endDrag(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    this.moveDrag(event);
    if (!this.drag) return;
    const value = this.wrap(drag.value + this.dragSteps() * this.step());
    this.finishDrag(event);
    this.commit(value, event);
  }

  protected cancelDrag(event: PointerEvent): void {
    if (this.drag?.pointerId === event.pointerId) this.finishDrag(event);
  }

  private finishDrag(event: PointerEvent): void {
    this.drag = null;
    this.dragging.set(false);
    this.dragSteps.set(0);
    this.offset.set(0);
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
  }

  private wrap(value: number): number {
    const count = this.max() - this.min() + 1;
    return this.min() + ((((value - this.min()) % count) + count) % count);
  }

  private commit(value: number, originalEvent: Event): void {
    if (!this.disabled() && value !== this.value()) this.changed.emit({ value, originalEvent });
  }
}
