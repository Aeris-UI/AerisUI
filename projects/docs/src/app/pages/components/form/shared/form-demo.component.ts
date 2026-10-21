import { Component, computed, contentChild, input, signal } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';

import { CodeBlockComponent, type CodeSource } from '../../../../shared/code-block.component';
import { buildAngularDemoSources } from '../../../../shared/demo-code';
import { DOC_EXAMPLE_CODE } from '../../../../shared/generated-example-code';
import { DOC_EXAMPLE_STYLES } from '../../../../shared/generated-example-styles';
import { ExampleToolbarComponent } from '../../../../shared/documentation/example-toolbar.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';

@Component({
  selector: 'app-form-demo',
  imports: [AerisCardModule, CodeBlockComponent, ExampleToolbarComponent],
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
      <app-example-toolbar
        [title]="title()"
        [panelId]="anchor() + '-code'"
        [(codeVisible)]="codeVisible"
      />
      <div class="preview"><ng-content select="[preview]" /></div>
      <div class="source" [id]="anchor() + '-code'" [hidden]="!codeVisible()">
        <div class="projected-code"><ng-content select="[code]" /></div>
        <app-code-block [sources]="sources()" [ariaLabel]="title() + ' example code'" />
      </div>
    </aeris-card>
  `,
  styleUrl: '../../../../shared/documentation/example-demo.scss',
  host: {
    '[attr.id]': 'anchor()',
    '[attr.title]': 'null',
    tabindex: '-1',
  },
})
export class FormDemoComponent {
  protected readonly codeVisible = signal(true);
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
      classCode: [DOC_EXAMPLE_CODE[this.anchor()], this.tsCode()].filter(Boolean).join('\n\n'),
      cssCode: [DOC_EXAMPLE_STYLES[this.anchor()], this.cssCode()].filter(Boolean).join('\n\n'),
    }),
  );
}
