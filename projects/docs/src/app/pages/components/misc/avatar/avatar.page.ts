import { Component, signal } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { LucideDynamicIcon, LucideUserRound } from '@lucide/angular';

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

interface TokenRow {
  readonly name: string;
  readonly purpose: string;
  readonly fallback: string;
}

@Component({
  selector: 'app-avatar-page',
  imports: [
    AerisAvatarModule,
    AerisBadgeModule,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './avatar.page.html',
  styleUrl: './avatar.page.scss',
})
export class AvatarPage {
  protected readonly icons = { UserRound: LucideUserRound };
  protected readonly imageStatus = signal('Waiting for the image.');

  protected readonly importCode = `import { AerisAvatarModule } from '@aeris-ui/core/avatar';`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'avatar-import', label: 'Import' },
    { id: 'avatar-basic', label: 'Basic' },
    { id: 'avatar-images', label: 'Images' },
    { id: 'avatar-sizes', label: 'Sizes and shapes' },
    { id: 'avatar-tones', label: 'Tones' },
    { id: 'avatar-badge', label: 'Badge' },
    { id: 'avatar-group', label: 'Group' },
    { id: 'avatar-fallback', label: 'Image fallback' },
    { id: 'avatar-custom', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'avatar-import', label: 'Import' },
    { id: 'avatar-api-inputs', label: 'Avatar inputs' },
    { id: 'avatar-api-outputs', label: 'Avatar outputs' },
    { id: 'avatar-api-content', label: 'Content' },
    { id: 'avatar-api-methods', label: 'Methods' },
    { id: 'avatar-api-group', label: 'Group inputs' },
  ];

  protected readonly rowCssCode = `.avatar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}`;

  protected readonly fallbackTsCode = `protected readonly imageStatus = signal(
  'Waiting for the image.',
);`;

  protected readonly fallbackCssCode = `.avatar-fallback-demo {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.avatar-fallback-demo p {
  margin: 0;
}`;

  protected readonly customCssCode = `.brand-avatar {
  --aeris-avatar-size: 4.5rem;
  --aeris-avatar-background: linear-gradient(135deg, #17200f, #7f9564);
  --aeris-avatar-color: #f8faef;
  --aeris-avatar-border: color-mix(in srgb, #b9d897 58%, transparent);
  --aeris-avatar-border-width: 2px;
  --aeris-avatar-font-size: 1.25rem;
  --aeris-avatar-shadow: 0 0.75rem 2rem rgb(40 58 28 / 22%);
}`;

  protected readonly interfacesCode = `type AerisAvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type AerisAvatarShape = 'circle' | 'rounded' | 'square';
type AerisAvatarTone =
  | 'primary'
  | 'neutral'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';
type AerisAvatarImageFit = 'cover' | 'contain';
type AerisAvatarImageLoading = 'eager' | 'lazy';
type AerisAvatarGroupOverlap = 'subtle' | 'default' | 'strong';`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'label',
      type: 'string',
      defaultValue: "''",
      description:
        'Initials or a short fallback label. It takes precedence over projected content.',
    },
    {
      name: 'imageSrc',
      type: 'string',
      defaultValue: "''",
      description:
        'Image URL. A failed image automatically falls back to the label or projected content.',
    },
    {
      name: 'imageAlt',
      type: 'string',
      defaultValue: "''",
      description: 'Alternative text for a meaningful image and the fallback accessible name.',
    },
    {
      name: 'imageLoading',
      type: 'AerisAvatarImageLoading',
      defaultValue: "'lazy'",
      description: 'Sets native eager or lazy image loading.',
    },
    {
      name: 'imageFit',
      type: 'AerisAvatarImageFit',
      defaultValue: "'cover'",
      description: 'Controls whether an image covers or fits within the avatar.',
    },
    {
      name: 'size',
      type: 'AerisAvatarSize',
      defaultValue: "'md'",
      description: 'Sets the avatar dimensions and typography.',
    },
    {
      name: 'shape',
      type: 'AerisAvatarShape',
      defaultValue: "'circle'",
      description: 'Sets circle, rounded, or compact square corners.',
    },
    {
      name: 'tone',
      type: 'AerisAvatarTone',
      defaultValue: "'primary'",
      description: 'Sets a theme-aware fallback background and foreground.',
    },
    {
      name: 'decorative',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Hides the complete avatar from assistive technology when nearby content identifies it.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description:
        'Accessible name for initials or projected content, or an override for image semantics.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of visible text that labels the avatar.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'imageError',
      type: 'Event',
      defaultValue: '-',
      description: 'Emits when the image fails before the fallback content is shown.',
    },
  ];

  protected readonly content: readonly ApiRow[] = [
    {
      name: 'default avatar content',
      type: 'content projection',
      defaultValue: '-',
      description: 'Consumer icon or custom content rendered when no image or label is available.',
    },
    {
      name: 'default group content',
      type: 'content projection',
      defaultValue: '-',
      description: 'Avatar components rendered in the responsive overlapping group.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'retryImage()',
      type: '() => void',
      defaultValue: '-',
      description: 'Clears the failed-image state and attempts to render the current source again.',
    },
  ];

  protected readonly groupInputs: readonly ApiRow[] = [
    {
      name: 'overlap',
      type: 'AerisAvatarGroupOverlap',
      defaultValue: "'default'",
      description: 'Controls how closely neighboring avatars overlap.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name for the group.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of visible text that labels the group.',
    },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-avatar-size',
      purpose: 'Default avatar size.',
      fallback: '--aeris-control-height',
    },
    {
      name: '--aeris-avatar-sm-size',
      purpose: 'Small avatar size.',
      fallback: 'control height − 0.625rem',
    },
    {
      name: '--aeris-avatar-lg-size',
      purpose: 'Large avatar size.',
      fallback: 'control height + 0.75rem',
    },
    {
      name: '--aeris-avatar-xl-size',
      purpose: 'Extra-large avatar size.',
      fallback: 'control height + 1.75rem',
    },
    {
      name: '--aeris-avatar-background',
      purpose: 'Fallback background.',
      fallback: 'tone color mix',
    },
    {
      name: '--aeris-avatar-color',
      purpose: 'Fallback text and icon color.',
      fallback: 'tone color mix',
    },
    {
      name: '--aeris-avatar-border',
      purpose: 'Avatar border color.',
      fallback: 'tone and border mix',
    },
    { name: '--aeris-avatar-border-width', purpose: 'Avatar border width.', fallback: '1px' },
    {
      name: '--aeris-avatar-radius',
      purpose: 'Rounded shape radius.',
      fallback: '--aeris-radius-lg',
    },
    { name: '--aeris-avatar-square-radius', purpose: 'Square shape radius.', fallback: '0.25rem' },
    {
      name: '--aeris-avatar-font-size',
      purpose: 'Default label font size.',
      fallback: '0.8125rem',
    },
    { name: '--aeris-avatar-font-weight', purpose: 'Label font weight.', fallback: '800' },
    { name: '--aeris-avatar-icon-size', purpose: 'Projected icon size.', fallback: '52%' },
    { name: '--aeris-avatar-shadow', purpose: 'Avatar surface shadow.', fallback: 'subtle shadow' },
    {
      name: '--aeris-avatar-group-overlap',
      purpose: 'Default group overlap.',
      fallback: '0.65rem',
    },
    {
      name: '--aeris-avatar-group-ring-size',
      purpose: 'Group separation ring width.',
      fallback: '2px',
    },
    {
      name: '--aeris-avatar-group-ring-color',
      purpose: 'Group separation ring color.',
      fallback: '--aeris-surface',
    },
  ];
}
