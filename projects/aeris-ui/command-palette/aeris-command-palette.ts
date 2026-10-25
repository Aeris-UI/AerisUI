import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { AerisDialogModule } from '@aeris-ui/core/dialog';
import { AerisInputTextDirective } from '@aeris-ui/core/input-text';
import { AerisIconFieldComponent, AerisIconStartDirective } from '@aeris-ui/core/icon-field';
import {
  ɵAerisIcon,
  boundarySelectValue,
  filterSelectOptions,
  groupSelectOptions,
  nextEnabledSelectValue,
  type AerisAppendTo,
} from '@aeris-ui/core';

export interface AerisCommandPaletteCommand {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
  readonly keywords?: readonly string[];
  readonly disabled?: boolean;
  /** Consumer-owned icon identifier; rendered through the item template. */
  readonly icon?: string;
  /** Display text only; does not register a keyboard shortcut. */
  readonly shortcut?: string;
}
export interface AerisCommandPaletteExecuteEvent {
  readonly originalEvent: Event;
  readonly command: AerisCommandPaletteCommand;
  readonly query: string;
}
export interface AerisCommandPaletteShortcut {
  readonly key: string;
  readonly modifier: 'mod' | 'ctrl' | 'meta';
  readonly shift?: boolean;
  readonly alt?: boolean;
}
export interface AerisCommandPaletteItemContext {
  readonly $implicit: AerisCommandPaletteCommand;
  readonly command: AerisCommandPaletteCommand;
  readonly active: boolean;
}
export interface AerisCommandPaletteGroupContext {
  readonly $implicit: string;
  readonly group: string;
}
@Directive({ selector: 'ng-template[aerisCommandPaletteItem]' })
export class AerisCommandPaletteItemTemplate {
  readonly template = inject<TemplateRef<AerisCommandPaletteItemContext>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: AerisCommandPaletteItemTemplate,
    context: unknown,
  ): context is AerisCommandPaletteItemContext {
    return true;
  }
}
@Directive({ selector: 'ng-template[aerisCommandPaletteGroup]' })
export class AerisCommandPaletteGroupTemplate {
  readonly template = inject<TemplateRef<AerisCommandPaletteGroupContext>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: AerisCommandPaletteGroupTemplate,
    context: unknown,
  ): context is AerisCommandPaletteGroupContext {
    return true;
  }
}
@Directive({ selector: 'ng-template[aerisCommandPaletteEmpty]' })
export class AerisCommandPaletteEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}
@Directive({ selector: 'ng-template[aerisCommandPaletteLoading]' })
export class AerisCommandPaletteLoadingTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}
@Directive({ selector: 'ng-template[aerisCommandPaletteFooter]' })
export class AerisCommandPaletteFooterTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let nextCommandPaletteId = 0;

@Component({
  selector: 'aeris-command-palette',
  imports: [
    NgTemplateOutlet,
    AerisDialogModule,
    AerisInputTextDirective,
    AerisIconFieldComponent,
    AerisIconStartDirective,
    ɵAerisIcon,
  ],
  templateUrl: './aeris-command-palette.html',
  styleUrl: './aeris-command-palette.scss',
})
export class AerisCommandPaletteComponent {
  readonly commands = input<readonly AerisCommandPaletteCommand[]>([]);
  readonly open = model(false);
  readonly query = model('');
  readonly inline = input(false, { transform: booleanAttribute });
  readonly filter = input(true, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly closeOnExecute = input(true, { transform: booleanAttribute });
  readonly title = input('Commands');
  readonly searchAriaLabel = input('Search commands');
  readonly resultsAriaLabel = input('Command results');
  readonly placeholder = input('Search commands…');
  readonly emptyMessage = input('No commands found');
  readonly loadingMessage = input('Loading commands');
  readonly resultsLabel = input('results');
  readonly helpText = input('Use arrow keys to navigate and Enter to run.');
  readonly closeAriaLabel = input('Close command palette');
  readonly width = input('38rem');
  readonly appendTo = input<AerisAppendTo>();
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly closeOnBackdropClick = input(true, { transform: booleanAttribute });
  readonly backdropBlur = input(true, { transform: booleanAttribute });
  readonly backdropBlurAmount = input('');
  readonly shortcut = input<AerisCommandPaletteShortcut | null>(null);
  readonly executed = output<AerisCommandPaletteExecuteEvent>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  private readonly document = inject(DOCUMENT);
  protected readonly id = `aeris-command-palette-${nextCommandPaletteId++}`;
  protected readonly initialFocus = `#${this.id}-input`;
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly results = viewChild<ElementRef<HTMLElement>>('results');
  private readonly optionElements = viewChildren<ElementRef<HTMLElement>>('optionElement');
  protected readonly itemTemplate = contentChild(AerisCommandPaletteItemTemplate);
  protected readonly groupTemplate = contentChild(AerisCommandPaletteGroupTemplate);
  protected readonly emptyTemplate = contentChild(AerisCommandPaletteEmptyTemplate);
  protected readonly loadingTemplate = contentChild(AerisCommandPaletteLoadingTemplate);
  protected readonly footerTemplate = contentChild(AerisCommandPaletteFooterTemplate);
  private readonly commandMap = computed(
    () => new Map(this.commands().map((command) => [command.id, command])),
  );
  private readonly filteredOptions = computed(() => {
    const options = this.commands().map((command) => ({
      value: command.id,
      label: command.label,
      description: [command.description ?? '', ...(command.keywords ?? [])].join(' '),
      group: command.group,
      disabled: command.disabled,
    }));
    return filterSelectOptions(
      options,
      this.filter() ? this.query() : '',
      ['label', 'description', 'group'],
      'contains',
    );
  });
  private readonly optionGroups = computed(() => groupSelectOptions(this.filteredOptions()));
  private readonly orderedOptions = computed(() =>
    this.optionGroups().flatMap((group) => group.options),
  );
  private readonly active = linkedSignal(() => boundarySelectValue(this.orderedOptions(), 'start'));
  protected readonly groups = computed(() => {
    const active = this.active();
    const commands = this.commandMap();
    let index = 0;
    return this.optionGroups().map((group, groupIndex) => ({
      label: group.label,
      id: `${this.id}-group-${groupIndex}`,
      context: { $implicit: group.label ?? '', group: group.label ?? '' },
      items: group.options.flatMap((option) => {
        const command = commands.get(option.value);
        return command
          ? [
              {
                command,
                id: `${this.id}-option-${index++}`,
                active: !this.loading() && command.id === active,
                context: {
                  $implicit: command,
                  command,
                  active: !this.loading() && command.id === active,
                },
              },
            ]
          : [];
      }),
    }));
  });
  protected readonly activeDescendant = computed(
    () =>
      this.groups()
        .flatMap((group) => group.items)
        .find((item) => item.active)?.id ?? null,
  );
  protected readonly status = computed(() =>
    this.loading()
      ? this.loadingMessage()
      : !this.filteredOptions().length
        ? this.emptyMessage()
        : `${this.filteredOptions().length} ${this.resultsLabel()}`,
  );

  constructor() {
    afterRenderEffect(() => this.revealActive());
    effect((onCleanup) => {
      const results = this.results()?.nativeElement;
      if (!results || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => this.revealActive());
      observer.observe(results);
      onCleanup(() => observer.disconnect());
    });
    effect((onCleanup) => {
      const shortcut = this.shortcut();
      if (!shortcut || this.inline() || shortcut.key.length !== 1) return;
      const listener = (event: KeyboardEvent) => {
        if (
          event.defaultPrevented ||
          event.isComposing ||
          event.repeat ||
          event.key.toLocaleLowerCase() !== shortcut.key.toLocaleLowerCase()
        )
          return;
        const modifier =
          shortcut.modifier === 'mod'
            ? event.ctrlKey !== event.metaKey
            : shortcut.modifier === 'ctrl'
              ? event.ctrlKey && !event.metaKey
              : event.metaKey && !event.ctrlKey;
        if (!modifier || event.shiftKey !== !!shortcut.shift || event.altKey !== !!shortcut.alt)
          return;
        if (
          event
            .composedPath()
            .some(
              (target) =>
                target instanceof HTMLElement &&
                target.matches(
                  'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"]',
                ),
            )
        )
          return;
        // First eligible listener wins; later instances see defaultPrevented.
        event.preventDefault();
        this.show();
      };
      this.document.addEventListener('keydown', listener);
      onCleanup(() => this.document.removeEventListener('keydown', listener));
    });
  }
  show(): void {
    if (!this.inline()) this.open.set(true);
  }
  hide(): void {
    this.open.set(false);
  }
  focus(options?: FocusOptions): void {
    this.searchInput()?.nativeElement.focus(options);
  }
  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
  protected keepSearchFocus(event: PointerEvent): void {
    if (event.pointerType === 'mouse') event.preventDefault();
  }
  protected hover(event: PointerEvent, id: string): void {
    if (event.pointerType !== 'mouse' || this.loading() || this.active() === id) return;
    const option = this.orderedOptions().find((option) => option.value === id);
    if (option && !option.disabled) this.active.set(id);
  }
  protected execute(originalEvent: Event, id: string): void {
    if (
      this.loading() ||
      !this.filteredOptions().some((option) => option.value === id && !option.disabled)
    )
      return;
    const command = this.commandMap().get(id);
    if (!command) return;
    this.active.set(id);
    if (this.closeOnExecute() && !this.inline()) this.hide();
    this.executed.emit({ originalEvent, command, query: this.query() });
  }
  protected onKeydown(event: KeyboardEvent): void {
    if (event.isComposing) {
      event.stopPropagation();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const active = this.active();
      if (
        !event.repeat &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !this.loading() &&
        active !== null
      )
        this.execute(event, active);
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey || this.loading()) return;
    let next: string | null | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = nextEnabledSelectValue(this.orderedOptions(), this.active(), 1);
        break;
      case 'ArrowUp':
        next = nextEnabledSelectValue(this.orderedOptions(), this.active(), -1);
        break;
      case 'Home':
        if (!event.shiftKey) next = boundarySelectValue(this.orderedOptions(), 'start');
        break;
      case 'End':
        if (!event.shiftKey) next = boundarySelectValue(this.orderedOptions(), 'end');
        break;
    }
    if (next !== undefined) {
      event.preventDefault();
      this.active.set(next);
    }
  }
  protected revealActive(): void {
    const results = this.results()?.nativeElement;
    if (!results) return;
    const activeId = this.activeDescendant();
    const option = this.optionElements().find(
      (element) => element.nativeElement.id === activeId,
    )?.nativeElement;
    if (!option) return;
    if (option.offsetTop < results.scrollTop) results.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > results.scrollTop + results.clientHeight)
      results.scrollTop = option.offsetTop + option.offsetHeight - results.clientHeight;
  }
}
export const AerisCommandPalette = [
  AerisCommandPaletteComponent,
  AerisCommandPaletteItemTemplate,
  AerisCommandPaletteGroupTemplate,
  AerisCommandPaletteEmptyTemplate,
  AerisCommandPaletteLoadingTemplate,
  AerisCommandPaletteFooterTemplate,
] as const;
