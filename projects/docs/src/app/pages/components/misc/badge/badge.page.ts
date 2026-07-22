import { Component, computed, signal } from '@angular/core';
import { AerisAvatar } from '@aeris-ui/core/avatar';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
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
  selector: 'app-badge-page',
  imports: [
    AerisAvatar,
    AerisBadgeModule,
    AerisButton,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './badge.page.html',
  styleUrl: './badge.page.scss',
})
export class BadgePage {
  protected readonly unreadCount = signal(128);
  protected readonly unreadLabel = computed(() => `Inbox, ${this.unreadCount()} unread messages`);

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'badge-basic', label: 'Basic' },
    { id: 'badge-severity', label: 'Severity' },
    { id: 'badge-sizes', label: 'Sizes' },
    { id: 'badge-dot', label: 'Dot' },
    { id: 'badge-dynamic', label: 'Dynamic value' },
    { id: 'badge-overlay', label: 'Overlay' },
    { id: 'badge-custom', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'badge-api-inputs', label: 'Badge inputs' },
    { id: 'badge-api-overlay-inputs', label: 'Overlay inputs' },
    { id: 'badge-api-content', label: 'Content' },
  ];

  protected readonly importCode = `import { AerisBadgeModule } from '@aeris-ui/core/badge';`;

  protected readonly rowCssCode = `.badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}`;

  protected readonly statusCssCode = `.badge-status-grid {
  display: grid;
  gap: 0.75rem;
}

.badge-status-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}`;

  protected readonly dynamicTsCode = `import { computed, signal } from '@angular/core';

protected readonly unreadCount = signal(128);
protected readonly unreadLabel = computed(
  () => \`Inbox, \${this.unreadCount()} unread messages\`,
);

protected addUnread(): void {
  this.unreadCount.update((count) => count + 1);
}

protected clearUnread(): void {
  this.unreadCount.set(0);
}`;

  protected readonly dynamicCssCode = `.badge-dynamic-demo {
  display: grid;
  gap: 0.75rem;
}

.badge-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}`;

  protected readonly overlayTsCode = `import { computed, signal } from '@angular/core';

protected readonly unreadCount = signal(128);
protected readonly unreadLabel = computed(
  () => \`Inbox, \${this.unreadCount()} unread messages\`,
);`;

  protected readonly overlayCssCode = `.badge-overlay-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}
`;

  protected readonly customCssCode = `.brand-badge {
  --aeris-badge-size: 1.5rem;
  --aeris-badge-padding-inline: 0.7rem;
  --aeris-badge-font-size: 0.6875rem;
  --aeris-badge-font-weight: 900;
  --aeris-badge-shadow: 0 6px 16px color-mix(
    in srgb,
    var(--aeris-primary) 22%,
    transparent
  );
}`;

  protected readonly interfacesCode = `type AerisBadgeSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

type AerisBadgeSize = 'sm' | 'md' | 'lg';
type AerisBadgeVariant = 'solid' | 'soft' | 'outline';
type AerisBadgeShape = 'pill' | 'rounded';
type AerisBadgeRole = 'status' | 'note' | '';
type AerisBadgeOverlayPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'string | number | null | undefined', defaultValue: 'undefined', description: 'Text or number rendered inside the badge. Projected content is used when no value is provided.' },
    { name: 'severity', type: 'AerisBadgeSeverity', defaultValue: "'primary'", description: 'Sets the semantic color accent.' },
    { name: 'size', type: 'AerisBadgeSize', defaultValue: "'md'", description: 'Controls badge height, padding, and font size.' },
    { name: 'variant', type: 'AerisBadgeVariant', defaultValue: "'solid'", description: 'Sets solid, soft, or outline visual treatment.' },
    { name: 'shape', type: 'AerisBadgeShape', defaultValue: "'pill'", description: 'Sets pill or rounded rectangle corners.' },
    { name: 'max', type: 'number | null', defaultValue: 'null', description: 'Caps numeric values and appends a plus sign when the value is larger.' },
    { name: 'dot', type: 'boolean', defaultValue: 'false', description: 'Renders a compact status dot with no visible text.' },
    { name: 'showZero', type: 'boolean', defaultValue: 'true', description: 'Controls whether numeric zero is rendered.' },
    { name: 'hidden', type: 'boolean', defaultValue: 'false', description: 'Hides the badge visually and from assistive technology.' },
    { name: 'decorative', type: 'boolean', defaultValue: 'false', description: 'Marks a purely visual badge as hidden from assistive technology.' },
    { name: 'role', type: 'AerisBadgeRole', defaultValue: "''", description: 'Optional ARIA role for standalone status or note badges.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for a meaningful badge that does not have enough visible text.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that names the badge.' },
  ];

  protected readonly overlayInputs: readonly ApiRow[] = [
    { name: 'value', type: 'string | number | null | undefined', defaultValue: 'undefined', description: 'Text or number rendered in the visual overlay badge.' },
    { name: 'severity', type: 'AerisBadgeSeverity', defaultValue: "'primary'", description: 'Sets the overlay badge color accent.' },
    { name: 'size', type: 'AerisBadgeSize', defaultValue: "'md'", description: 'Controls overlay badge size.' },
    { name: 'variant', type: 'AerisBadgeVariant', defaultValue: "'solid'", description: 'Sets solid, soft, or outline treatment.' },
    { name: 'shape', type: 'AerisBadgeShape', defaultValue: "'pill'", description: 'Sets pill or rounded overlay corners.' },
    { name: 'max', type: 'number | null', defaultValue: 'null', description: 'Caps numeric overlay values and appends a plus sign.' },
    { name: 'dot', type: 'boolean', defaultValue: 'false', description: 'Renders the overlay as a compact status dot.' },
    { name: 'showZero', type: 'boolean', defaultValue: 'true', description: 'Controls whether zero is rendered in the overlay.' },
    { name: 'hidden', type: 'boolean', defaultValue: 'false', description: 'Hides the overlay badge.' },
    { name: 'position', type: 'AerisBadgeOverlayPosition', defaultValue: "'top-right'", description: 'Places the overlay badge on one corner of the projected content.' },
  ];

  protected readonly content: readonly ApiRow[] = [
    { name: 'default badge content', type: 'content projection', defaultValue: '-', description: 'Text or inline content rendered inside Badge when value is not provided.' },
    { name: 'default overlay content', type: 'content projection', defaultValue: '-', description: 'Button, icon, avatar, or other content that receives a visual badge overlay.' },
  ];

  protected addUnread(): void {
    this.unreadCount.update((count) => count + 1);
  }

  protected clearUnread(): void {
    this.unreadCount.set(0);
  }
}
