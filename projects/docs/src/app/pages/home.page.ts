import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';
import { LucideDynamicIcon } from '@lucide/angular';

import { COMPONENT_CATALOG } from '../data/component-catalog';
import { AERIS_CURRENT_VERSION } from '../data/aeris-version';
import { AerisLogoMarkComponent } from '../shared/branding/aeris-logo-mark.component';
import { DOC_ICONS } from '../shared/documentation/doc-icons';
import { AerisApplicationShowcaseComponent } from '../shared/showcase/aeris-application-showcase.component';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    AerisAvatarModule,
    AerisBadgeModule,
    AerisButton,
    AerisCardModule,
    AerisChipModule,
    AerisInputText,
    AerisMessageModule,
    AerisSelect,
    AerisToggleSwitch,
    LucideDynamicIcon,
    AerisLogoMarkComponent,
    AerisApplicationShowcaseComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss', './home-brand.page.scss', './home-showcase.page.scss'],
})
export class HomePage {
  protected readonly icons = DOC_ICONS;
  protected readonly componentCount = COMPONENT_CATALOG.length;
  protected readonly currentVersion = AERIS_CURRENT_VERSION;
  protected readonly workspaceType = signal<string | null>('product');
  protected readonly updatesEnabled = signal(true);
  protected readonly saveVisible = signal(false);

  protected readonly workspaceTypes: readonly AerisSelectOption[] = [
    { label: 'Product team', value: 'product' },
    { label: 'Engineering team', value: 'engineering' },
    { label: 'Design system', value: 'design-system' },
  ];

  protected saveWorkspace(event: Event): void {
    event.preventDefault();
    this.saveVisible.set(true);
  }
}
