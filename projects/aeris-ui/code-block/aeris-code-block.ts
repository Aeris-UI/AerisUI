import { ɵAerisIcon } from '@aeris-ui/core';
import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  resource,
  viewChildren,
  booleanAttribute,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  highlightAerisCode,
  plainAerisCode,
  supportsAerisCodeLanguage,
} from './aeris-code-highlight';

export type AerisCodeLanguage =
  'html' | 'typescript' | 'javascript' | 'css' | 'scss' | 'json' | 'shell' | 'text';
export interface AerisCodeSource {
  readonly code: string;
  readonly language: string;
  readonly label: string;
}
export interface AerisCodeCopyEvent {
  readonly code: string;
  readonly language: string;
  readonly index: number;
}
let nextId = 0;

@Component({
  selector: 'aeris-code-block',
  imports: [ɵAerisIcon, NgTemplateOutlet],
  templateUrl: './aeris-code-block.html',
  styleUrl: './aeris-code-block.scss',
  host: {
    class: 'aeris-code-block',
    '[attr.data-wrap]': 'wrap() || null',
    '[attr.data-line-numbers]': 'lineNumbers() || null',
    '[style.--_aeris-code-block-max-height]': 'maxHeight()',
    '[style.--aeris-code-block-tab-size]': 'resolvedTabSize()',
  },
})
export class AerisCodeBlock {
  readonly copyIconTemplate = input<TemplateRef<void>>();
  readonly copiedIconTemplate = input<TemplateRef<void>>();
  readonly code = input('');
  readonly language = input<string>('text');
  readonly label = input('');
  readonly sources = input<readonly AerisCodeSource[]>([]);
  readonly activeSource = model(0);
  readonly highlight = input(true, { transform: booleanAttribute });
  readonly lineNumbers = input(false, { transform: booleanAttribute });
  readonly highlightLines = input<readonly number[]>([]);
  readonly wrap = input(false, { transform: booleanAttribute });
  readonly maxHeight = input<string | null>(null);
  readonly tabSize = input(2);
  readonly copyable = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Code example');
  readonly copyLabel = input('Copy');
  readonly copiedLabel = input('Copied');
  readonly copyAriaLabel = input('Copy code');
  readonly copiedMessage = input('Code copied to clipboard.');
  readonly copyErrorMessage = input('Unable to copy code. Select the code and copy it manually.');
  readonly sourceTabsLabel = input('Code source');
  readonly scrollHint = input('Swipe sideways for long lines');
  readonly scrollDescription = input('Scroll horizontally to view long lines.');
  readonly copied = output<AerisCodeCopyEvent>();
  readonly copyError = output<unknown>();
  readonly highlightError = output<unknown>();

  protected readonly blockId = `aeris-code-block-${++nextId}`;
  protected readonly availableSources = computed<readonly AerisCodeSource[]>(() =>
    this.sources().length
      ? this.sources()
      : [{ code: this.code(), language: this.language(), label: this.label() || this.language() }],
  );
  protected readonly resolvedIndex = computed(() =>
    Math.min(Math.max(0, Math.trunc(this.activeSource()) || 0), this.availableSources().length - 1),
  );
  protected readonly source = computed(() => this.availableSources()[this.resolvedIndex()]);
  private readonly syntax = resource({
    params: () =>
      this.highlight() &&
      supportsAerisCodeLanguage(this.source().language) &&
      this.source().code.length <= 100_000
        ? { code: this.source().code, language: this.source().language }
        : undefined,
    loader: async ({ params, abortSignal }) => {
      try {
        return await highlightAerisCode(params.code, params.language);
      } catch (error: unknown) {
        if (!this.destroyed && !abortSignal.aborted) this.highlightError.emit(error);
        return plainAerisCode(params.code);
      }
    },
  });
  protected readonly lines = computed(
    () => this.syntax.value() ?? plainAerisCode(this.source().code),
  );
  protected readonly markedLines = computed(() => new Set(this.highlightLines()));
  protected readonly resolvedTabSize = computed(() =>
    Math.min(16, Math.max(1, Math.trunc(this.tabSize()) || 2)),
  );
  protected readonly copyState = signal<'idle' | 'copying' | 'copied' | 'error'>('idle');
  protected readonly announcement = computed(() =>
    this.copyState() === 'copied'
      ? this.copiedMessage()
      : this.copyState() === 'error'
        ? this.copyErrorMessage()
        : '',
  );
  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private resetTimer: ReturnType<typeof setTimeout> | undefined;
  private destroyed = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      clearTimeout(this.resetTimer);
    });
    effect(() => {
      this.source();
      clearTimeout(this.resetTimer);
      this.copyState.set('idle');
    });
  }

  selectSource(index: number): void {
    if (Number.isInteger(index) && index >= 0 && index < this.availableSources().length)
      this.activeSource.set(index);
  }

  async copy(): Promise<boolean> {
    if (!this.copyable() || this.copyState() === 'copying' || this.destroyed) return false;
    const source = this.source();
    const index = this.resolvedIndex();
    this.copyState.set('copying');
    try {
      if (!globalThis.navigator?.clipboard?.writeText)
        throw new Error('Clipboard access requires a supported browser and a secure context.');
      await globalThis.navigator.clipboard.writeText(source.code);
      if (this.destroyed) return true;
      if (this.source() === source) {
        this.copyState.set('copied');
        clearTimeout(this.resetTimer);
        this.resetTimer = setTimeout(() => this.copyState.set('idle'), 1800);
      }
      this.copied.emit({ code: source.code, language: source.language, index });
      return true;
    } catch (error: unknown) {
      if (!this.destroyed) {
        if (this.source() === source) this.copyState.set('error');
        this.copyError.emit(error);
      }
      return false;
    }
  }

  protected handleTabKeydown(event: KeyboardEvent, index: number): void {
    const rtl =
      this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(this.host.nativeElement)
        .direction === 'rtl';
    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = this.availableSources().length - 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const direction = (event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1);
      next = (index + direction + this.availableSources().length) % this.availableSources().length;
    } else return;
    event.preventDefault();
    this.selectSource(next);
    const tab = this.tabs()[next]?.nativeElement;
    tab?.focus({ preventScroll: true });
    if (tab?.parentElement) {
      const bounds = tab.getBoundingClientRect();
      const viewport = tab.parentElement.getBoundingClientRect();
      const offset =
        bounds.left < viewport.left
          ? bounds.left - viewport.left
          : bounds.right > viewport.right
            ? bounds.right - viewport.right
            : 0;
      if (offset) tab.parentElement.scrollBy({ left: offset, behavior: 'instant' });
    }
  }
}
export const AerisCodeBlockModule = [AerisCodeBlock] as const;
