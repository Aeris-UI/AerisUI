import { Component, computed, contentChild, input } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';

import { CodeBlockComponent, type CodeSource } from '../../../../shared/code-block.component';
import { buildAngularDemoSources } from '../../../../shared/demo-code';
import { DOC_EXAMPLE_STYLES } from '../../../../shared/generated-example-styles';
import { ProjectedCode } from '../../../../shared/projected-code.directive';

@Component({
  selector: 'app-form-demo',
  imports: [AerisCardModule, CodeBlockComponent],
  template: `
    <aeris-card
      class="demo-card"
      padding="none"
      role="region"
      [ariaLabelledBy]="anchor() + '-title'"
    >
      <header aerisCardHeader>
        <h3 [id]="anchor() + '-title'">{{ title() }}</h3>
        <p>{{ description() }}</p>
      </header>
      <div class="preview"><ng-content select="[preview]" /></div>
      <div class="source">
        <div class="projected-code"><ng-content select="[code]" /></div>
        <app-code-block [sources]="sources()" />
      </div>
    </aeris-card>
  `,
  styles: `
    :host {
      display: block;
      margin-top: 22px;
      scroll-margin-top: 8rem;
    }
    .demo-card {
      --aeris-card-gap: 0;
      --aeris-card-radius: 12px;
    }
    .demo-card header {
      display: block;
      padding: 19px 22px;
      border-bottom: 1px solid var(--border);
      border-radius: 11px 11px 0 0;
      background: var(--surface);
    }
    h3 {
      margin: 0;
      font-size: 16px;
    }
    p {
      margin: 5px 0 0;
      color: var(--text-2);
      font-size: 14px;
      line-height: 1.55;
    }
    .preview {
      --aeris-card-gap: 1rem;
      --aeris-card-radius: var(--aeris-radius-lg, 1.125rem);

      min-height: 112px;
      display: flex;
      align-items: center;
      padding: 30px;
    }
    .preview ::ng-deep > [preview] {
      width: 100%;
      min-width: 0;
    }
    .source {
      position: relative;
      z-index: 0;
      border-top: 1px solid var(--border);
      border-radius: 0 0 11px 11px;
      background: var(--surface);
      overflow: hidden;
    }
    .source app-code-block ::ng-deep .code-block {
      border: 0;
      border-radius: 0;
    }
    .projected-code {
      display: none;
    }
    @media (max-width: 40rem) {
      .demo-card header {
        padding: 17px 16px;
      }
      .preview {
        padding: 22px 16px;
      }
    }
    @media (max-width: 28rem) {
      .preview {
        padding: 18px 12px;
      }
    }
  `,
  host: {
    '[attr.id]': 'anchor()',
    '[attr.title]': 'null',
    tabindex: '-1',
  },
})
export class FormDemoComponent {
  readonly anchor = input.required<string>({ alias: 'id' });
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly htmlCode = input('');
  readonly tsCode = input('');
  readonly cssCode = input('');
  protected readonly code = contentChild(ProjectedCode);
  protected readonly sources = computed<readonly CodeSource[]>(() =>
    buildAngularDemoSources({
      anchor: this.anchor(),
      title: this.title(),
      template: this.htmlCode() || this.code()?.text() || '',
      classCode: this.tsCode(),
      cssCode: [DOC_EXAMPLE_STYLES[this.anchor()], this.cssCode()].filter(Boolean).join('\n\n'),
    }),
  );
}
