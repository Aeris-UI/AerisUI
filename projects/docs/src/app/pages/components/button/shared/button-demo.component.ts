import { Component, computed, contentChild, input, signal } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';
import { CodeBlockComponent, type CodeSource } from '../../../../shared/code-block.component';
import { buildAngularDemoSources } from '../../../../shared/demo-code';
import { DOC_EXAMPLE_CODE } from '../../../../shared/generated-example-code';
import { DOC_EXAMPLE_STYLES } from '../../../../shared/generated-example-styles';
import { ExampleToolbarComponent } from '../../../../shared/documentation/example-toolbar.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';

@Component({
  selector: 'app-button-demo',
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
        <app-code-block [sources]="sources()" />
      </div>
    </aeris-card>
  `,
  styleUrl: '../../../../shared/documentation/example-demo.scss',
  styles: `
    .preview ::ng-deep > [preview] {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
      align-items: center;
    }
    .preview ::ng-deep .wrap {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
    }
    .preview ::ng-deep .align {
      align-items: center;
    }
    .preview ::ng-deep .stack {
      display: grid;
      gap: 12px;
    }
    @media (max-width: 40rem) {
      .preview ::ng-deep > [preview] {
        max-width: 100%;
        flex-wrap: wrap;
      }
      .preview ::ng-deep aeris-button {
        max-width: 100%;
      }
    }
  `,
  host: {
    '[attr.id]': 'anchor()',
    '[attr.title]': 'null',
    tabindex: '-1',
  },
})
export class ButtonDemoComponent {
  protected readonly codeVisible = signal(true);
  readonly anchor = input.required<string>({ alias: 'id' });
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly tsCode = input('');
  readonly cssCode = input('');
  protected readonly code = contentChild(ProjectedCode);
  protected readonly sources = computed<readonly CodeSource[]>(() =>
    buildAngularDemoSources({
      anchor: this.anchor(),
      title: this.title(),
      template: this.code()?.text() ?? '',
      classCode: [DOC_EXAMPLE_CODE[this.anchor()], this.tsCode()].filter(Boolean).join('\n\n'),
      cssCode: DOC_EXAMPLE_STYLES[this.anchor()] ?? this.cssCode(),
    }),
  );
}
