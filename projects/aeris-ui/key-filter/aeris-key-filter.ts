import {
  Directive,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

export type AerisKeyFilterPreset =
  | 'int'
  | 'pint'
  | 'num'
  | 'pnum'
  | 'hex'
  | 'alpha'
  | 'alphanum'
  | 'email';

export type AerisKeyFilterPattern = AerisKeyFilterPreset | RegExp | string;
export type AerisKeyFilterRejectReason = 'key' | 'paste' | 'input';

export interface AerisKeyFilterRejectEvent {
  readonly originalEvent: KeyboardEvent | ClipboardEvent | InputEvent | CompositionEvent;
  readonly reason: AerisKeyFilterRejectReason;
  readonly value: string;
  readonly attemptedValue: string;
}

const presetPatterns: Readonly<Record<AerisKeyFilterPreset, RegExp>> = {
  int: /^-?\d*$/,
  pint: /^\d*$/,
  num: /^-?(?:\d+)?(?:[.,]\d*)?$/,
  pnum: /^(?:\d+)?(?:[.,]\d*)?$/,
  hex: /^[\da-f]*$/i,
  alpha: /^\p{L}*$/u,
  alphanum: /^[\p{L}\p{N}]*$/u,
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]*$/,
};

const editingKeys = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Enter',
  'Escape',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);
const INVALID_PATTERN = /(?!)/;
const MAX_PATTERN_LENGTH = 2048;

@Directive({
  selector: 'input[aerisKeyFilter], textarea[aerisKeyFilter]',
  host: {
    '[attr.data-aeris-key-filter]': 'filterName()',
    '(beforeinput)': 'handleBeforeInput($event)',
    '(keydown)': 'handleKeydown($event)',
    '(paste)': 'handlePaste($event)',
    '(input)': 'handleInput($event)',
    '(compositionstart)': 'handleCompositionStart()',
    '(compositionend)': 'handleCompositionEnd($event)',
    '(focus)': 'rememberValue($event)',
  },
})
export class AerisKeyFilterDirective {
  readonly aerisKeyFilter = input<AerisKeyFilterPattern>('alphanum');
  readonly validateOnly = input(false, { transform: booleanAttribute });
  readonly allowPaste = input(true, { transform: booleanAttribute });

  readonly rejected = output<AerisKeyFilterRejectEvent>();

  private readonly lastAcceptedValue = signal('');
  private readonly isComposing = signal(false);
  private readonly resolvedPattern = computed(() => this.compilePattern(this.aerisKeyFilter()));

  protected filterName(): string {
    const filter = this.aerisKeyFilter();
    return typeof filter === 'string' ? filter : 'custom';
  }

  protected handleCompositionStart(): void {
    this.isComposing.set(true);
  }

  protected handleCompositionEnd(event: Event): void {
    this.isComposing.set(false);
    this.handleInput(event);
  }

  protected rememberValue(event: Event): void {
    const control = this.getControl(event);
    if (!control) return;
    this.lastAcceptedValue.set(control.value);
  }

  protected handleBeforeInput(event: Event): void {
    const inputEvent = event as InputEvent;
    if (this.validateOnly() || this.isComposing()) return;
    if (!this.isInsertInput(inputEvent.inputType)) return;

    const control = this.getControl(inputEvent);
    if (!control) return;

    const data = inputEvent.data ?? '';
    if (!data) return;

    const attemptedValue = this.getAttemptedValue(control, data);
    if (this.accepts(attemptedValue)) return;

    inputEvent.preventDefault();
    this.emitRejected(inputEvent, 'input', control.value, attemptedValue);
  }

  protected handleKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.validateOnly() || this.isComposing()) return;
    if (keyboardEvent.ctrlKey || keyboardEvent.metaKey || keyboardEvent.altKey) return;
    if (editingKeys.has(keyboardEvent.key)) return;
    if (keyboardEvent.key.length !== 1) return;

    const control = this.getControl(keyboardEvent);
    if (!control) return;

    const attemptedValue = this.getAttemptedValue(control, keyboardEvent.key);
    if (this.accepts(attemptedValue)) return;

    keyboardEvent.preventDefault();
    this.emitRejected(keyboardEvent, 'key', control.value, attemptedValue);
  }

  protected handlePaste(event: Event): void {
    const clipboardEvent = event as ClipboardEvent;
    const control = this.getControl(clipboardEvent);
    if (!control) return;

    const pastedText = clipboardEvent.clipboardData?.getData('text') ?? '';
    const attemptedValue = this.getAttemptedValue(control, pastedText);

    const accepted = this.accepts(attemptedValue);

    if (!this.allowPaste()) {
      clipboardEvent.preventDefault();
      this.emitRejected(clipboardEvent, 'paste', control.value, attemptedValue);
      return;
    }

    if (!accepted) {
      this.emitRejected(clipboardEvent, 'paste', control.value, attemptedValue);

      if (!this.validateOnly()) {
        clipboardEvent.preventDefault();
      }
    }
  }

  protected handleInput(event: Event): void {
    const control = this.getControl(event);
    if (!control || this.isComposing()) return;

    if (this.accepts(control.value)) {
      this.lastAcceptedValue.set(control.value);
      return;
    }

    this.emitRejected(event as InputEvent | CompositionEvent, 'input', control.value, control.value);

    if (this.validateOnly()) return;

    const previousValue = this.lastAcceptedValue();
    control.value = previousValue;
    control.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private accepts(value: string): boolean {
    const pattern = this.resolvedPattern();
    pattern.lastIndex = 0;
    return pattern.test(value);
  }

  private compilePattern(filter: AerisKeyFilterPattern): RegExp {
    if (filter instanceof RegExp) {
      if (filter.source.length > MAX_PATTERN_LENGTH) return INVALID_PATTERN;
      try {
        return new RegExp(filter.source, filter.flags.replace(/[gy]/gu, ''));
      } catch {
        return INVALID_PATTERN;
      }
    }

    if (this.isPreset(filter)) {
      return presetPatterns[filter];
    }

    if (filter.length > MAX_PATTERN_LENGTH) return INVALID_PATTERN;
    try {
      return new RegExp(filter);
    } catch {
      return INVALID_PATTERN;
    }
  }

  private isPreset(value: string): value is AerisKeyFilterPreset {
    return Object.prototype.hasOwnProperty.call(presetPatterns, value);
  }

  private isInsertInput(inputType: string): boolean {
    return inputType === 'insertText' || inputType === 'insertCompositionText';
  }

  private getAttemptedValue(
    control: HTMLInputElement | HTMLTextAreaElement,
    text: string,
  ): string {
    const value = control.value;
    const selectionStart = control.selectionStart ?? value.length;
    const selectionEnd = control.selectionEnd ?? selectionStart;
    return `${value.slice(0, selectionStart)}${text}${value.slice(selectionEnd)}`;
  }

  private getControl(event: Event): HTMLInputElement | HTMLTextAreaElement | null {
    const target = event.target;

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return target;
    }

    return null;
  }

  private emitRejected(
    originalEvent: KeyboardEvent | ClipboardEvent | InputEvent | CompositionEvent,
    reason: AerisKeyFilterRejectReason,
    value: string,
    attemptedValue: string,
  ): void {
    this.rejected.emit({ originalEvent, reason, value, attemptedValue });
  }
}

export const AerisKeyFilter = [AerisKeyFilterDirective] as const;
