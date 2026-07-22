import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

import { DOC_ICONS } from './documentation/doc-icons';

export interface CodeSource {
  readonly language: 'HTML' | 'TypeScript' | 'CSS' | 'JSON' | 'Shell';
  readonly label: string;
  readonly code: string;
}

@Component({
  selector: 'app-code-block',
  imports: [LucideDynamicIcon],
  template: `
    <div class="code-block">
      <div class="code-block__toolbar" role="tablist" aria-label="Code language">
        @for (source of availableSources(); track source.label) {
          <button
            type="button"
            role="tab"
            [id]="blockId + '-tab-' + source.label"
            [attr.aria-selected]="activeLabel() === source.label"
            [attr.aria-controls]="blockId + '-panel-' + source.label"
            [attr.tabindex]="activeLabel() === source.label ? 0 : -1"
            (click)="activeLabel.set(source.label)"
            (keydown)="handleLanguageKeydown($event, source.label)"
          >
            {{ source.label }}
          </button>
        }
      </div>
      <pre
        role="tabpanel"
        [id]="blockId + '-panel-' + activeSource().label"
        [attr.aria-labelledby]="blockId + '-tab-' + activeSource().label"
      ><code>{{ activeSource().code }}</code></pre>
      <button
        class="code-block__copy"
        type="button"
        [attr.aria-label]="copied() ? 'Code copied' : 'Copy code'"
        (click)="copy()"
      >
        @if (copied()) {
          <svg [lucideIcon]="icons.Check"></svg>
          Copied
        } @else {
          <svg [lucideIcon]="icons.Copy"></svg>
          Copy
        }
      </button>
      <span class="visually-hidden" aria-live="polite">
        {{ copied() ? 'Code copied to clipboard.' : '' }}
      </span>
    </div>
  `,
  styleUrl: './code-block.component.scss',
})
export class CodeBlockComponent {
  private static nextId = 0;

  protected readonly icons = DOC_ICONS;
  protected readonly blockId = `docs-code-block-${++CodeBlockComponent.nextId}`;
  readonly code = input('');
  readonly language = input('HTML');
  readonly sources = input<readonly CodeSource[]>([]);
  protected readonly copied = signal(false);
  protected readonly availableSources = computed<readonly CodeSource[]>(() => {
    const sources = this.sources().filter((source) => source.code.trim());
    if (sources.length > 0) return sources;

    return [
      {
        language: this.language() as CodeSource['language'],
        label: this.language() === 'TypeScript' ? 'TS' : (this.language() as CodeSource['label']),
        code: this.code(),
      },
    ];
  });
  protected readonly activeLabel = linkedSignal<string>(
    () => this.availableSources()[0]?.label ?? 'HTML',
  );
  protected readonly activeSource = computed(
    () =>
      this.availableSources().find((source) => source.label === this.activeLabel()) ??
      this.availableSources()[0] ?? {
        language: 'HTML',
        label: 'HTML',
        code: '',
      },
  );
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  protected handleLanguageKeydown(event: KeyboardEvent, label: string): void {
    const sources = this.availableSources();
    const index = sources.findIndex((source) => source.label === label);
    if (index < 0) return;

    const direction = this.languageKeyDirection(event.key);
    if (direction === undefined) return;

    event.preventDefault();
    const nextIndex =
      direction === 'first'
        ? 0
        : direction === 'last'
          ? sources.length - 1
          : (index + direction + sources.length) % sources.length;
    this.activeLabel.set(sources[nextIndex]?.label ?? label);
  }

  protected async copy(): Promise<void> {
    try {
      await globalThis.navigator.clipboard.writeText(this.activeSource().code);
      this.copied.set(true);
      if (this.resetTimer) globalThis.clearTimeout(this.resetTimer);
      this.resetTimer = globalThis.setTimeout(() => this.copied.set(false), 1800);
    } catch {
      this.copied.set(false);
    }
  }

  private languageKeyDirection(key: string): -1 | 1 | 'first' | 'last' | undefined {
    if (key === 'ArrowLeft' || key === 'ArrowUp') return -1;
    if (key === 'ArrowRight' || key === 'ArrowDown') return 1;
    if (key === 'Home') return 'first';
    if (key === 'End') return 'last';
    return undefined;
  }
}
