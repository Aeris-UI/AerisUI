import { Component } from '@angular/core';
import { AerisEditor } from '@aeris-ui/core/editor';
@Component({
  selector: 'app-catalog-editor-preview',
  imports: [AerisEditor],
  template: `<aeris-editor
    size="sm"
    fluid
    minHeight="4rem"
    [formats]="['bold', 'italic', 'underline']"
    value="<p>Make room for <strong>better ideas.</strong></p>"
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
export class CatalogEditorPreviewComponent {}
