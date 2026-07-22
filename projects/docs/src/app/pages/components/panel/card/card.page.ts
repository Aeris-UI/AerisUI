import { Component } from '@angular/core';
import { AerisBadge } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-card-page',
  imports: [
    AerisBadge,
    AerisButton,
    AerisCardModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './card.page.html',
  styleUrl: './card.page.scss',
})
export class CardPage {
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'card-basic', label: 'Basic' },
    { id: 'card-variants', label: 'Variants' },
    { id: 'card-padding', label: 'Padding' },
    { id: 'card-media', label: 'Media' },
    { id: 'card-horizontal', label: 'Horizontal' },
    { id: 'card-link', label: 'Linked card' },
    { id: 'card-custom', label: 'Customization' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'card-api-inputs', label: 'Inputs' },
    { id: 'card-api-slots', label: 'Slots' },
  ];

  protected readonly importCode =
    `import { AerisCardModule } from '@aeris-ui/core/card';`;

  protected readonly customCssCode = `.brand-card {
  --aeris-card-background: color-mix(
    in srgb,
    var(--aeris-primary) 9%,
    var(--aeris-surface)
  );
  --aeris-card-border: color-mix(
    in srgb,
    var(--aeris-primary) 42%,
    var(--aeris-border)
  );
  --aeris-card-radius: 1.5rem;
  --aeris-card-title-color: var(--aeris-primary-text);
}`;

  protected readonly interfacesCode = `type AerisCardVariant =
  | 'outlined'
  | 'elevated'
  | 'filled';

type AerisCardOrientation = 'vertical' | 'horizontal';
type AerisCardPadding = 'none' | 'sm' | 'md' | 'lg';
type AerisCardRole = 'article' | 'region' | 'group';`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'variant', type: 'AerisCardVariant', defaultValue: "'outlined'", description: 'Outlined, elevated, or filled surface treatment.' },
    { name: 'orientation', type: 'AerisCardOrientation', defaultValue: "'vertical'", description: 'Stacks content vertically or places media beside the body.' },
    { name: 'padding', type: 'AerisCardPadding', defaultValue: "'md'", description: 'Controls body padding without changing projected media.' },
    { name: 'hoverable', type: 'boolean', defaultValue: 'false', description: 'Adds a hover treatment for cards contained by a link or other native control.' },
    { name: 'role', type: 'AerisCardRole | null', defaultValue: 'null', description: 'Optional semantic role for meaningful independent regions.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when visible title text is unavailable.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that names the card region.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of content that provides the card description.' },
  ];

  protected readonly slots: readonly ApiRow[] = [
    { name: 'aerisCardMedia', type: 'attribute directive', defaultValue: '-', description: 'Media placed before the card body or beside it in horizontal orientation.' },
    { name: 'aerisCardHeader', type: 'attribute directive', defaultValue: '-', description: 'Header content projected before the main card content.' },
    { name: 'aerisCardTitle', type: 'attribute directive', defaultValue: '-', description: 'Applies card title typography while preserving the chosen heading element.' },
    { name: 'aerisCardSubtitle', type: 'attribute directive', defaultValue: '-', description: 'Applies secondary heading text styles.' },
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Main card body content.' },
    { name: 'aerisCardFooter', type: 'attribute directive', defaultValue: '-', description: 'Footer actions or metadata projected after the content.' },
  ];
}
