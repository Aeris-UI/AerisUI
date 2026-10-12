import { Component, effect, input, signal } from '@angular/core';
import { AerisEditor } from '@aeris-ui/core/editor';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  SKIP_DOM_SELECTION_TAG,
  SKIP_SCROLL_INTO_VIEW_TAG,
  type LexicalEditor,
} from 'lexical';
@Component({
  selector: 'app-catalog-editor-preview',
  imports: [AerisEditor],
  template: `<aeris-editor
    size="sm"
    fluid
    minHeight="4rem"
    [formats]="['bold', 'italic', 'underline']"
    value="<p>Make room for better ideas.</p>"
    (ready)="handleReady($event)"
    ariaLabel="Rich text editor"
  />`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        min-width: 0;
      }
    `,
  ],
})
export class CatalogEditorPreviewComponent {
  readonly active = input(false);
  private readonly editor = signal<LexicalEditor | null>(null);

  constructor() {
    effect(() => {
      const editor = this.editor();
      const active = this.active();
      editor?.update(
        () => {
          const phrase = $createTextNode('better ideas').setFormat(active ? 'bold' : 0);
          $getRoot()
            .clear()
            .append(
              $createParagraphNode().append(
                $createTextNode('Make room for '),
                phrase,
                $createTextNode('.'),
              ),
            );
          // Drive the real toolbar state without moving page focus or scrolling the card.
          phrase.select(0, phrase.getTextContentSize()).setFormat(phrase.getFormat());
        },
        { tag: [SKIP_DOM_SELECTION_TAG, SKIP_SCROLL_INTO_VIEW_TAG] },
      );
    });
  }

  protected handleReady(editor: LexicalEditor): void {
    this.editor.set(editor);
  }
}
