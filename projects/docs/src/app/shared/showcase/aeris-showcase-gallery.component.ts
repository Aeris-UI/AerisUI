import { Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
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
  imports: [AerisButton, RouterLink, AerisShowcaseContentComponent, LucideDynamicIcon],
  templateUrl: './aeris-showcase-gallery.component.html',
  styleUrl: './aeris-showcase-gallery.component.scss',
  host: {
    '[attr.data-compact]': 'compact() || null',
  },
})
export class AerisShowcaseGalleryComponent {
  private static nextId = 0;
  protected readonly instanceId = `showcase-${AerisShowcaseGalleryComponent.nextId++}`;
  readonly compact = input(false);
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');

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

  protected selectView(view: ShowcaseView): void {
    if (this.activeView() === view) return;
    this.activeView.set(view);
    const viewport = this.viewport()?.nativeElement;
    if (viewport) {
      viewport.scrollTop = 0;
      viewport.scrollLeft = 0;
    }
  }

  protected handleTabKeydown(event: KeyboardEvent, currentIndex: number): void {
    const lastIndex = this.options.length - 1;
    const isRtl = getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl';
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + (isRtl ? -1 : 1) + this.options.length) % this.options.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex + (isRtl ? 1 : -1) + this.options.length) % this.options.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.selectView(this.options[nextIndex].id);
    const tabs = (
      event.currentTarget as HTMLButtonElement
    ).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.item(nextIndex).focus();
  }
}
