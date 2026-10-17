import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ɵAerisAppendTo } from '@aeris-ui/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPopoverModule, aerisInternalCreateHoverInteraction } from '@aeris-ui/core/popover';

/** Internal integration harness, not the future public HoverCard component. */
@Component({
  selector: 'app-hover-overlay-fixture',
  imports: [ɵAerisAppendTo, AerisButton, AerisPopoverModule],
  template: `
    <section data-fixture="hover-overlay" aria-label="Hover overlay foundation">
      <h2>Hover overlay foundation</h2>
      <button
        aerisButton
        #trigger
        type="button"
        aria-controls="foundation-preview"
        [attr.aria-expanded]="open()"
        (pointerdown)="interaction.pointerDown()"
        (pointerenter)="interaction.pointerEnter('trigger', $event)"
        (pointerleave)="interaction.pointerLeave('trigger', $event)"
        (focusin)="interaction.focusIn()"
        (focusout)="interaction.focusOut($event.relatedTarget)"
        (keydown.escape)="interaction.dismiss()"
        (click)="interaction.activate()"
      >
        Preview person
      </button>
      @if (open()) {
        <section
          #content
          id="foundation-preview"
          class="preview"
          role="region"
          aria-label="Person preview"
          [aerisInternalAppendTo]="'body'"
          [aerisInternalAppendToAnchor]="triggerElement()?.nativeElement ?? null"
          aerisInternalAppendToPlacement="bottom"
          [aerisInternalAppendToOffset]="16"
          (pointerenter)="interaction.pointerEnter('content', $event)"
          (pointerleave)="interaction.pointerLeave('content', $event)"
          (focusin)="interaction.focusIn()"
          (focusout)="interaction.focusOut($event.relatedTarget)"
          (keydown.escape)="interaction.dismiss()"
        >
          <p>Preview content retains native focus and button behavior.</p>
          <button aerisButton (click)="actions.update(increment)">Preview action</button>
        </section>
      }
      <output aria-label="Preview actions">{{ actions() }}</output>
      <button aerisButton id="foundation-outside">Outside target</button>
      <div class="anchor-area" [dir]="direction()">
        <button aerisButton (click)="parent.show($event)">Open parent preview</button>
        <aeris-popover
          #parent
          header="Parent preview"
          placement="bottom"
          alignment="start"
          [appendTo]="mount()"
        >
          <button aerisButton (click)="child.show($event)">Open child preview</button>
          <aeris-popover #child header="Child preview" [appendTo]="mount()"
            ><button aerisButton>Child action</button></aeris-popover
          >
        </aeris-popover>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    section[data-fixture] {
      margin-block: 1rem;
      padding: 1rem;
      display: grid;
      gap: 1rem;
    }
    section[data-fixture] > button {
      justify-self: start;
    }
    .preview {
      width: 16rem;
      padding: 1rem;
      background: var(--aeris-surface);
      color: var(--aeris-text);
      border: 1px solid var(--aeris-border);
      border-radius: var(--aeris-radius-surface);
    }
    .preview p {
      margin: 0 0 1rem;
    }
    .anchor-area {
      display: grid;
      justify-items: center;
      padding-block: 1rem;
    }
  `,
})
export class HoverOverlayFixture {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly triggerElement = viewChild('trigger', {
    read: ElementRef<HTMLButtonElement>,
  });
  private readonly content = viewChild('content', { read: ElementRef<HTMLElement> });
  readonly open = signal(false);
  readonly actions = signal(0);
  readonly increment = (count: number) => count + 1;
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly mount = signal<'self' | 'body'>('body');
  readonly interaction = aerisInternalCreateHoverInteraction({
    document: this.document,
    trigger: () => this.triggerElement()?.nativeElement ?? null,
    content: () => this.content()?.nativeElement ?? null,
    isOpen: () => this.open(),
    open: () => this.open.set(true),
    close: () => this.open.set(false),
    openDelay: () => 80,
    closeDelay: () => 100,
  });
  constructor() {
    const params = new URLSearchParams(globalThis.location?.search ?? '');
    this.direction.set(params.get('direction') === 'rtl' ? 'rtl' : 'ltr');
    this.mount.set(params.get('mount') === 'self' ? 'self' : 'body');
    this.destroyRef.onDestroy(() => this.interaction.destroy());
  }
}
