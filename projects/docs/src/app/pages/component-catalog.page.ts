import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisIconField } from '@aeris-ui/core/icon-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon } from '@lucide/angular';

import {
  COMPONENT_CATALOG,
  COMPONENT_CATEGORIES,
  type ComponentCategory,
} from '../data/component-catalog';
import { DOC_ICONS } from '../shared/documentation/doc-icons';

@Component({
  selector: 'app-component-catalog-page',
  imports: [
    RouterLink,
    AerisButton,
    AerisCardModule,
    AerisIconField,
    AerisInputText,
    LucideDynamicIcon,
  ],
  template: `
    <div class="reference-page">
      <header class="reference-hero">
        <span class="page-kicker">Library</span>
        <h1>Components</h1>
        <p>Complete interface coverage, built with accessible behavior and modern Angular APIs.</p>
        <div class="catalog-stats">
          <span
            ><strong>{{ catalog.length }}</strong> components</span
          >
          <span
            ><strong>{{ categories.length }}</strong> groups</span
          >
        </div>
      </header>

      <div class="catalog-controls">
        <aeris-icon-field class="catalog-search" size="sm" fluid>
          <svg aerisIconStart [lucideIcon]="icons.Search"></svg>
          <input
            aerisInputText
            size="sm"
            fluid
            type="search"
            aria-label="Filter components"
            placeholder="Filter components"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
          />
        </aeris-icon-field>
        <div role="group" aria-label="Filter by category">
          <button
            aerisButton
            type="button"
            size="xs"
            [variant]="category() === 'All' ? 'secondary' : 'ghost'"
            [attr.aria-pressed]="category() === 'All'"
            (click)="category.set('All')"
          >
            All
          </button>
          @for (item of categories; track item) {
            <button
              aerisButton
              type="button"
              size="xs"
              [variant]="category() === item ? 'secondary' : 'ghost'"
              [attr.aria-pressed]="category() === item"
              (click)="category.set(item)"
            >
              {{ item }}
            </button>
          }
        </div>
      </div>

      <div class="catalog-grid">
        @for (item of filtered(); track item.slug) {
          <a [routerLink]="['/components', item.slug]">
            <aeris-card hoverable>
              <div class="catalog-card">
                <span class="catalog-icon">{{ item.name.slice(0, 2) }}</span>
                <span class="catalog-copy"
                  ><strong>{{ item.name }}</strong
                  ><small>{{ item.description }}</small></span
                >
              </div>
            </aeris-card>
          </a>
        } @empty {
          <div class="catalog-empty">No components match this filter.</div>
        }
      </div>
    </div>
  `,
  styles: `
    .reference-page {
      max-width: 1180px;
      margin: 0 auto;
      padding: 65px 48px 110px;
    }
    .reference-hero {
      max-width: 680px;
    }
    .page-kicker {
      color: var(--primary-text);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }
    .reference-hero h1 {
      margin: 8px 0 12px;
      font-size: 48px;
      letter-spacing: -0.055em;
    }
    .reference-hero p {
      margin: 0;
      color: var(--text-2);
      font-size: 14px;
    }
    .catalog-stats {
      display: flex;
      gap: 25px;
      margin-top: 25px;
      color: var(--text-3);
      font-size: 10px;
    }
    .catalog-stats strong {
      color: var(--text);
      font-size: 12px;
    }
    .catalog-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin: 45px 0 22px;
    }
    .catalog-search {
      width: 270px;
      flex: 0 0 270px;
    }
    .catalog-search svg {
      width: 15px;
      height: 15px;
    }
    .catalog-controls > div {
      min-width: 0;
      display: flex;
      gap: 3px;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 2px;
    }
    .catalog-controls > div button {
      flex: 0 0 auto;
      white-space: nowrap;
    }
    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .catalog-grid > a {
      min-width: 0;
      display: block;
      color: var(--text);
      text-decoration: none;
    }
    .catalog-grid > a:focus-visible {
      border-radius: var(--aeris-radius-lg);
      outline: 3px solid color-mix(in srgb, var(--focus) 44%, transparent);
      outline-offset: 3px;
    }
    .catalog-grid aeris-card {
      height: 100%;
    }
    .catalog-card {
      min-height: 72px;
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      align-items: start;
      gap: 12px;
    }
    .catalog-icon {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 9px;
      background: var(--primary-soft);
      color: var(--primary-text);
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .catalog-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .catalog-copy strong {
      font-size: 11px;
    }
    .catalog-copy small {
      margin-top: 5px;
      color: var(--text-3);
      font-size: 9px;
      line-height: 1.5;
    }
    .catalog-empty {
      grid-column: 1/-1;
      padding: 60px;
      text-align: center;
      color: var(--text-3);
    }
    @media (max-width: 900px) {
      .catalog-grid {
        grid-template-columns: 1fr 1fr;
      }
      .catalog-controls {
        align-items: flex-start;
        flex-direction: column;
      }
      .catalog-controls > div {
        width: 100%;
      }
    }
    @media (max-width: 620px) {
      .reference-page {
        padding: 45px 20px 80px;
      }
      .catalog-grid {
        grid-template-columns: 1fr;
      }
      .catalog-search {
        width: 100%;
        flex-basis: auto;
      }
    }
  `,
})
export class ComponentCatalogPage {
  protected readonly icons = DOC_ICONS;
  protected readonly catalog = COMPONENT_CATALOG;
  protected readonly categories = COMPONENT_CATEGORIES;
  protected readonly query = signal('');
  protected readonly category = signal<ComponentCategory | 'All'>('All');

  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    const category = this.category();
    return this.catalog.filter(
      (item) =>
        (category === 'All' || item.category === category) &&
        (!query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)),
    );
  });
}
