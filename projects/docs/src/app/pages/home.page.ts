import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisThemeService } from '@aeris-ui/core/theming';
import { LucideDynamicIcon } from '@lucide/angular';

import { AERIS_CURRENT_VERSION } from '../data/aeris-version';
import { COMPONENT_CATALOG } from '../data/component-catalog';
import { DocsAppearanceService } from '../shared/appearance/docs-appearance.service';
import { AerisLogoMarkComponent } from '../shared/branding/aeris-logo-mark.component';
import { CodeBlockComponent, type CodeSource } from '../shared/code-block.component';
import { DOC_ICONS } from '../shared/documentation/doc-icons';
import { AerisShowcaseGalleryComponent } from '../shared/showcase/aeris-showcase-gallery.component';
import { HomeProfileDemoComponent, HOME_PROFILE_SOURCES } from './home-profile-demo.component';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    AerisButton,
    LucideDynamicIcon,
    AerisLogoMarkComponent,
    CodeBlockComponent,
    AerisShowcaseGalleryComponent,
    HomeProfileDemoComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss', './home-showcase.page.scss'],
})
export class HomePage {
  protected readonly icons = DOC_ICONS;
  protected readonly version = AERIS_CURRENT_VERSION;
  protected readonly componentCount = COMPONENT_CATALOG.length;
  protected readonly appearance = inject(DocsAppearanceService);
  protected readonly theme = inject(AerisThemeService);
  protected readonly profileSources = HOME_PROFILE_SOURCES;
  protected readonly installSources: readonly CodeSource[] = [
    { label: 'Guided', language: 'Shell', code: `ng add @aeris-ui/core@${AERIS_CURRENT_VERSION}` },
    {
      label: 'Package only',
      language: 'Shell',
      code: `npm install @aeris-ui/core@${AERIS_CURRENT_VERSION}`,
    },
  ];
  protected readonly themeCode = computed(() => {
    const palette = this.appearance.activePaletteId();
    if (!palette) return null;
    return `import { ApplicationConfig } from '@angular/core';
import { AERIS_THEME_PRESETS, provideAeris } from '@aeris-ui/core/theming';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAeris({
      theme: {
        ...AERIS_THEME_PRESETS.${palette},
        radius: '${this.appearance.activeRadiusId()}',
        density: '${this.appearance.activeDensityId()}',
      },
      mode: '${this.theme.mode()}',
    }),
  ],
};`;
  });
}
