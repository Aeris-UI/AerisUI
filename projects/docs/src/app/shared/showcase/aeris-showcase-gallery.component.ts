import { Component, ElementRef, computed, input, signal, viewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisSkeleton } from '@aeris-ui/core/skeleton';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';

import { DOC_ICONS } from '../documentation/doc-icons';
import {
  AerisShowcaseContentComponent,
  type ShowcaseView,
} from './aeris-showcase-content.component';

interface ShowcaseOption {
  readonly id: ShowcaseView;
  readonly label: string;
  readonly icon: LucideIconInput;
}

@Component({
  selector: 'app-aeris-showcase-gallery',
  imports: [
    AerisTabsModule,
    AerisSkeleton,
    RouterLink,
    AerisShowcaseContentComponent,
    LucideDynamicIcon,
  ],
  templateUrl: './aeris-showcase-gallery.component.html',
  styleUrl: './aeris-showcase-gallery.component.scss',
  host: {
    '[attr.data-compact]': 'compact() || null',
  },
})
export class AerisShowcaseGalleryComponent {
  readonly compact = input(false);
  private readonly viewports = viewChildren<ElementRef<HTMLElement>>('viewport');

  protected readonly activeView = signal<ShowcaseView>('components');
  protected readonly documentationLinks = computed(() => {
    const components: Record<ShowcaseView, readonly string[]> = {
      components: ['input-text', 'select', 'button', 'tabs'],
      dashboard: ['card', 'chart', 'checkbox'],
      chat: ['input-group', 'avatar', 'toolbar'],
      crm: ['table', 'paginator', 'meter-group'],
      mail: ['button', 'icon-field', 'textarea'],
      finances: ['chart', 'select', 'slider'],
    };
    return components[this.activeView()].map((slug) => ({
      path: `/components/${slug}`,
      label: slug
        .split('-')
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' '),
    }));
  });
  protected readonly options: readonly ShowcaseOption[] = [
    { id: 'components', label: 'Components', icon: DOC_ICONS.Package },
    { id: 'dashboard', label: 'Dashboard', icon: DOC_ICONS.BarChart3 },
    { id: 'chat', label: 'Chat', icon: DOC_ICONS.Mail },
    { id: 'crm', label: 'CRM', icon: DOC_ICONS.Monitor },
    { id: 'mail', label: 'Mail', icon: DOC_ICONS.Archive },
    { id: 'finances', label: 'Finances', icon: DOC_ICONS.BarChart3 },
  ];

  protected selectView(view: string): void {
    const option = this.options.find((option) => option.id === view);
    if (!option || this.activeView() === option.id) return;
    this.activeView.set(option.id);
    for (const { nativeElement: viewport } of this.viewports()) {
      viewport.scrollTop = 0;
      viewport.scrollLeft = 0;
    }
  }
}
