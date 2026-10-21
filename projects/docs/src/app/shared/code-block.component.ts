import { Component, input } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

export interface CodeSource {
  readonly language: 'HTML' | 'TypeScript' | 'CSS' | 'JSON' | 'Shell';
  readonly label: string;
  readonly code: string;
}

/** Documentation adapter; all rendering, highlighting, and interaction belong to Aeris. */
@Component({
  selector: 'app-code-block',
  imports: [AerisCodeBlockModule],
  template: `<aeris-code-block
    [code]="code()"
    [language]="language()"
    [sources]="sources()"
    [ariaLabel]="ariaLabel()"
  />`,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
      max-inline-size: 100%;
    }
  `,
})
export class CodeBlockComponent {
  readonly code = input('');
  readonly ariaLabel = input('Code example');
  readonly language = input('HTML');
  readonly sources = input<readonly CodeSource[]>([]);
}
