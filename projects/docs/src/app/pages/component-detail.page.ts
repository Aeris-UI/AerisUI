import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';
import { AerisTextarea } from '@aeris-ui/core/textarea';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

import { COMPONENT_CATALOG } from '../data/component-catalog';
import { ComponentPageHeaderComponent } from '../shared/documentation/component-page-header/component-page-header.component';

@Component({
  selector: 'app-component-detail-page',
  imports: [
    RouterLink,
    AerisButton,
    AerisCheckbox,
    AerisInputText,
    AerisRadioButton,
    AerisSelect,
    AerisTextarea,
    AerisToggleSwitch,
    ComponentPageHeaderComponent,
  ],
  template: `
    @if (component(); as item) {
      <div class="component-page">
        <app-component-page-header
          [category]="item.category"
          [title]="item.name"
          [description]="item.description"
        />

        <nav class="page-tabs" aria-label="Page sections">
          <a href="#basic">Basic</a><a href="#states">States</a><a href="#api">API</a
          ><a href="#accessibility">Accessibility</a>
        </nav>
        <section id="basic" class="doc-section">
          <h2>Basic</h2>
          <p>
            This example uses the published <code>&#64;aeris-ui/core/{{ item.slug }}</code> entry
            point.
          </p>
          <div class="demo">
            <div class="form-demo">
              @switch (item.slug) {
                @case ('input-text') {
                  <label class="demo-field"
                    ><span>Email address</span
                    ><input aerisInputText type="email" placeholder="you@example.com"
                  /></label>
                }
                @case ('textarea') {
                  <label class="demo-field"
                    ><span>Project description</span
                    ><textarea aerisTextarea placeholder="Tell us what you are building"></textarea>
                  </label>
                }
                @case ('checkbox') {
                  <aeris-checkbox [(checked)]="checkboxValue">Email notifications</aeris-checkbox>
                  <small>Checked: {{ checkboxValue() }}</small>
                }
                @case ('radio-button') {
                  <div class="stack">
                    <aeris-radio-button name="plan" value="starter" [(selected)]="radioValue"
                      >Starter</aeris-radio-button
                    ><aeris-radio-button name="plan" value="pro" [(selected)]="radioValue"
                      >Professional</aeris-radio-button
                    >
                  </div>
                }
                @case ('toggle-switch') {
                  <div class="switch-demo">
                    <span
                      ><strong>Product updates</strong
                      ><small>Receive important release notes</small></span
                    ><aeris-toggle-switch ariaLabel="Product updates" [(checked)]="switchValue" />
                  </div>
                }
                @case ('select') {
                  <label class="demo-field"
                    ><span>Role</span
                    ><aeris-select
                      ariaLabel="Role"
                      [options]="selectOptions"
                      [(value)]="selectValue"
                  /></label>
                }
              }
            </div>
          </div>
        </section>
        <section id="states" class="doc-section">
          <h2>States</h2>
          <p>
            Every control supports visible focus, disabled behavior, theme tokens, and
            reduced-motion preferences. Validation-capable fields expose <code>aria-invalid</code>.
          </p>
        </section>
        <section id="api" class="doc-section">
          <h2>API</h2>
          <div class="api-table">
            <div><b>Binding</b><b>Purpose</b><b>Type</b></div>
            <div>
              <code>{{ modelName(item.slug) }}</code
              ><span>Two-way signal model for the component value.</span
              ><code>{{ modelType(item.slug) }}</code>
            </div>
            <div>
              <code>disabled</code><span>Prevents user interaction.</span><code>boolean</code>
            </div>
          </div>
        </section>
        <section id="accessibility" class="doc-section">
          <h2>Accessibility</h2>
          <p>{{ accessibilityNote(item.slug) }}</p>
        </section>
      </div>
    } @else {
      <main class="component-not-found" aria-labelledby="component-not-found-title">
        <section>
          <span aria-hidden="true">404</span>
          <p class="page-kicker">Component not found</p>
          <h1 id="component-not-found-title">No component named "{{ slug() }}"</h1>
          <p>
            This component is not part of the current Aeris documentation. It may have been removed
            or renamed.
          </p>
          <div>
            <a aerisButton routerLink="/components">Browse components</a>
            <a aerisButton variant="secondary" routerLink="/">Go home</a>
          </div>
        </section>
      </main>
    }
  `,
  styles: `
    .component-page {
      max-width: 940px;
      margin: 0 auto;
      padding: 42px 48px 110px;
    }
    .crumb {
      display: flex;
      gap: 8px;
      color: var(--text-3);
      font-size: 9px;
    }
    .crumb a {
      color: var(--text-2);
      text-decoration: none;
    }
    .component-hero {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 30px;
      padding: 38px 0 32px;
    }
    .page-kicker {
      color: var(--primary-text);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .component-hero h1 {
      margin: 7px 0 10px;
      font-size: 48px;
      letter-spacing: -0.055em;
    }
    .component-hero p {
      max-width: 620px;
      margin: 0;
      color: var(--text-2);
      font-size: 13px;
    }
    .page-tabs {
      position: sticky;
      z-index: 5;
      top: 64px;
      display: flex;
      gap: 20px;
      padding: 12px 0;
      border-block: 1px solid var(--border);
      background: var(--page);
    }
    .page-tabs a {
      color: var(--text-2);
      font-size: 10px;
      font-weight: 600;
      text-decoration: none;
    }
    .page-tabs a:hover {
      color: var(--primary-text);
    }
    .doc-section {
      padding: 42px 0;
      border-bottom: 1px solid var(--border);
      scroll-margin-top: 110px;
    }
    .doc-section h2 {
      margin: 0 0 8px;
      font-size: 22px;
      letter-spacing: -0.035em;
    }
    .doc-section > p {
      margin: 0 0 18px;
      color: var(--text-2);
      font-size: 11px;
    }
    .doc-section code {
      padding: 2px 5px;
      border-radius: 4px;
      background: var(--surface-2);
      font:
        10px ui-monospace,
        monospace;
    }
    .demo {
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface);
      overflow: hidden;
    }
    .demo > div {
      display: flex;
      gap: 9px;
      padding: 32px;
    }
    .demo .wrap {
      flex-wrap: wrap;
    }
    .demo .align {
      align-items: center;
    }
    .demo pre {
      margin: 0;
      padding: 14px 17px;
      border-top: 1px solid var(--border);
      background: var(--surface-2);
      overflow: auto;
    }
    .api-table {
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
    }
    .api-table > div {
      display: grid;
      grid-template-columns: 130px 1fr 100px;
      gap: 15px;
      padding: 12px 15px;
      border-bottom: 1px solid var(--border);
      color: var(--text-2);
      font-size: 9px;
    }
    .api-table > div:first-child {
      background: var(--surface-2);
      color: var(--text);
      font-size: 8px;
      text-transform: uppercase;
    }
    .api-table > div:last-child {
      border-bottom: 0;
    }
    @media (max-width: 620px) {
      .component-page {
        padding: 30px 20px 80px;
      }
      .component-hero {
        flex-direction: column;
      }
      .component-hero h1 {
        font-size: 40px;
      }
      .page-tabs {
        gap: 14px;
        overflow: auto;
      }
      .api-table > div {
        grid-template-columns: 80px 1fr;
      }
      .api-table > div > *:last-child {
        display: none;
      }
    }
    .component-not-found {
      min-height: calc(100vh - 64px);
      display: grid;
      place-items: center;
      padding: 60px 24px 96px;
    }
    .component-not-found section {
      width: min(680px, 100%);
      position: relative;
      display: grid;
      justify-items: center;
      gap: 14px;
      padding: clamp(40px, 7vw, 72px);
      border: 1px solid var(--border);
      border-radius: 20px;
      background:
        radial-gradient(
          circle at 20% 0%,
          color-mix(in srgb, var(--primary) 18%, transparent),
          transparent 34%
        ),
        linear-gradient(135deg, var(--surface), var(--surface-2));
      box-shadow: var(--shadow-md);
      overflow: hidden;
      text-align: center;
    }
    .component-not-found section > span {
      position: absolute;
      inset: -38px auto auto 50%;
      color: color-mix(in srgb, var(--primary) 12%, transparent);
      font-size: clamp(128px, 22vw, 208px);
      font-weight: 800;
      letter-spacing: -0.08em;
      line-height: 1;
      transform: translateX(-50%);
      pointer-events: none;
    }
    .component-not-found .page-kicker {
      position: relative;
      margin: 0;
    }
    .component-not-found h1 {
      position: relative;
      margin: 0;
      color: var(--text);
      font-size: clamp(36px, 7vw, 66px);
      letter-spacing: -0.06em;
      line-height: 0.98;
    }
    .component-not-found section > p:not(.page-kicker) {
      position: relative;
      max-width: 540px;
      margin: 0;
      color: var(--text-2);
      font-size: 15px;
      line-height: 1.7;
    }
    .component-not-found section > div {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-top: 8px;
    }
    @media (max-width: 620px) {
      .component-not-found section > div {
        width: 100%;
        display: grid;
      }
    }
  `,
})
export class ComponentDetailPage {
  readonly slug = input.required<string>();
  protected readonly checkboxValue = signal(true);
  protected readonly radioValue = signal<string | null>('pro');
  protected readonly switchValue = signal(true);
  protected readonly selectValue = signal<string | null>('designer');
  protected readonly selectOptions: readonly AerisSelectOption[] = [
    { label: 'Product designer', value: 'designer' },
    { label: 'Frontend engineer', value: 'engineer' },
    { label: 'Design engineer', value: 'design-engineer' },
  ];
  protected readonly component = computed(() =>
    COMPONENT_CATALOG.find((item) => item.slug === this.slug()),
  );

  protected modelName(slug: string): string {
    if (slug === 'checkbox' || slug === 'toggle-switch') return 'checked';
    if (slug === 'radio-button') return 'selected';
    if (slug === 'select') return 'value';
    return 'native value';
  }

  protected modelType(slug: string): string {
    if (slug === 'checkbox' || slug === 'toggle-switch') return 'boolean';
    if (slug === 'radio-button' || slug === 'select') return 'string | null';
    return 'string';
  }

  protected accessibilityNote(slug: string): string {
    if (slug === 'select') {
      return 'Uses listbox semantics, arrow-key navigation, Enter selection, and Escape dismissal.';
    }
    if (slug === 'toggle-switch') {
      return 'Uses the switch role with synchronized aria-checked state and requires an accessible label.';
    }
    return 'Preserves native input semantics, keyboard behavior, focus indication, disabled state, and accessible labeling.';
  }
}
