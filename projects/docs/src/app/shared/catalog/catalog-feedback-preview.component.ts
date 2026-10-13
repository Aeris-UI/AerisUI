import { Component, input, inject, afterRenderEffect, untracked } from '@angular/core';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { AerisToastModule, AerisToastService } from '@aeris-ui/core/toast';
@Component({
  selector: 'app-catalog-feedback-preview',
  imports: [AerisMessageModule, AerisToastModule],
  providers: [AerisToastService],
  template: `@switch (kind()) {
    @case ('message') {
      <aeris-message
        text="Your changes have been saved."
        severity="success"
        size="sm"
        ariaLive="off"
      />
    }
    @case ('toast') {
      <aeris-toast position="center" [showIcon]="false" />
    }
  }`,
  styles: [
    `
      :host {
        display: grid;
        align-items: center;
        position: relative;
        transform: translateZ(0);
        width: 100%;
        height: 100%;
        --aeris-toast-width: min(16rem, 100%);
      }
    `,
  ],
})
export class CatalogFeedbackPreviewComponent {
  readonly kind = input.required<string>();
  readonly active = input(false);
  private readonly toast = inject(AerisToastService);
  constructor() {
    afterRenderEffect(() => {
      const toast = this.kind() === 'toast';
      untracked(() => {
        this.toast.clear();
        if (toast) this.toast.show({ detail: 'Project created successfully.', sticky: true });
      });
    });
  }
}
