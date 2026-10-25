import {
  Directive,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  type WritableSignal,
} from '@angular/core';
import { aerisInternalFocusableElements } from './aeris-focus';

/** A cell draft commits on completion; consumers own its validation. */
export interface AerisCellEditor {
  readonly value: WritableSignal<unknown>;
  readonly valid: WritableSignal<boolean>;
  readonly originalValue: unknown;
  readonly ariaLabel: string;
  readonly commit: (event?: Event) => void;
  readonly cancel: (event?: Event) => void;
}

/** Focus and keyboard boundary shared by the two table editing views. */
@Directive({
  selector: '[aerisInternalCellEditor]',
  host: {
    class: 'aeris-cell-editor',
    tabindex: '-1',
    '(keydown)': 'handleKeydown($event)',
    '(focusout)': 'handleFocusOut($event)',
    '(click)': '$event.stopPropagation()',
    '(dblclick)': '$event.stopPropagation()',
  },
})
export class ɵAerisCellEditor {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  readonly aerisInternalCellEditor = input.required<AerisCellEditor>();
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      const first = aerisInternalFocusableElements(this.element, {
        checkComputedVisibility: true,
      })[0];
      (first ?? this.element).focus({ preventScroll: true });
      const document = this.element.ownerDocument;
      const leave = (event: Event) => {
        if (this.owns(event.target)) return;
        this.scheduleCommit(event);
      };
      document.addEventListener('pointerdown', leave, true);
      document.addEventListener('focusin', leave);
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('pointerdown', leave, true);
        document.removeEventListener('focusin', leave);
      });
    });
    this.destroyRef.onDestroy(() => {
      if (this.timer !== null) clearTimeout(this.timer);
    });
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.isComposing) return;
    // A child picker gets the first Escape, including when its panel is portaled.
    if (this.element.querySelector('[aria-expanded="true"][aria-controls]')) return;
    if (event.key === 'Enter') {
      if ((event.target as HTMLElement).closest('textarea,[contenteditable="true"],button')) return;
      event.preventDefault();
      event.stopPropagation();
      this.aerisInternalCellEditor().commit(event);
      return;
    }
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.aerisInternalCellEditor().cancel(event);
  }

  protected handleFocusOut(event: FocusEvent): void {
    if (this.owns(event.relatedTarget)) return;
    if (!event.relatedTarget && this.element.querySelector('[aria-expanded="true"][aria-controls]'))
      return;
    this.scheduleCommit(event);
  }

  private scheduleCommit(event: Event): void {
    const editor = this.aerisInternalCellEditor();
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      if (this.destroyRef.destroyed || this.aerisInternalCellEditor() !== editor) return;
      if (event.type !== 'pointerdown' && this.owns(this.element.ownerDocument.activeElement))
        return;
      editor.commit(event);
    }, 0);
  }

  private owns(target: EventTarget | null): boolean {
    if (!(target instanceof Node)) return false;
    const roots: Element[] = [this.element];
    const visited = new Set<Element>();
    for (const root of roots) {
      if (visited.has(root)) continue;
      visited.add(root);
      if (root.contains(target)) return true;
      for (const controller of [root, ...root.querySelectorAll('[aria-controls], [aria-owns]')]) {
        const ids = `${controller.getAttribute('aria-controls') ?? ''} ${controller.getAttribute('aria-owns') ?? ''}`;
        for (const id of ids.split(/\s+/).filter(Boolean)) {
          const panel = this.element.ownerDocument.getElementById(id);
          if (panel && !visited.has(panel)) roots.push(panel);
        }
      }
    }
    return false;
  }
}
