# Sidebar

> Responsive navigation with native links, collapsible groups, icon-only presentation, and an accessible mobile drawer.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/sidebar`
- Human-readable documentation: [https://aeris-ui.dev/components/sidebar](https://aeris-ui.dev/components/sidebar)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `AerisSidebarMode` | `'auto'` | Options: 'auto', 'desktop', 'mobile'. Auto switches to a modal drawer at or below breakpoint. Explicit modes support embedded layouts. |
| `breakpoint` | `number` | `768` | Viewport width in pixels at or below which auto mode uses Drawer. Non-finite values use 768; negative values use zero. |
| `side` | `AerisSidebarSide` | `'start'` | Options: 'start', 'end'. Logical edge follows inherited direction. Place the component in the matching desktop layout column. |
| `width` | `string` | `''` | Desktop CSS width. Empty uses --aeris-sidebar-width (16rem). |
| `collapsedWidth` | `string` | `''` | Icon-only CSS width. Empty uses --aeris-sidebar-collapsed-width (4.25rem). |
| `mobileWidth` | `string` | `'min(20rem, calc(100vw - 2rem))'` | Drawer width, constrained by the visual viewport. |
| `collapsible` | `boolean` | `true` | Shows and enables the desktop collapse action. Mobile close remains available. |
| `closeOnNavigate` | `boolean` | `true` | Closes mobile navigation after an enabled item activation. Modified/new-tab link activations leave it open. |
| `swipeToClose` | `boolean` | `true` | Uses Drawer swipe dismissal on mobile, without a drag handle. |
| `ariaLabel` | `string` | `'Navigation'` | Name of the navigation landmark and mobile dialog. |
| `ariaLabelledBy` | `string` | `''` | ID of a visible external heading, instead of ariaLabel. Keep the heading outside icon-only hidden content. |
| `collapseAriaLabel` | `string` | `'Collapse navigation'` | Accessible name of the expanded desktop collapse button. |
| `expandAriaLabel` | `string` | `'Expand navigation'` | Accessible name of the collapsed desktop or closed mobile toggle. |
| `closeAriaLabel` | `string` | `'Close navigation'` | Accessible name of the mobile close action. |

### State

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` | `boolean (model)` | `false` | Controlled desktop icon-only state; collapsedChange is the model output. Preserved while mobile navigation is expanded. |
| `open` | `boolean (model)` | `false` | Controlled mobile drawer state; openChange is the model output. Closing, Escape, backdrop, swipe or navigation update it. Returning to desktop clears it. |
| `collapsedChange` | `boolean (output)` | `—` | Emits changes to the collapsed model. |
| `openChange` | `boolean (output)` | `—` | Emits changes to the open model. |
| `mobile` | `Signal&lt;boolean&gt;` | `derived` | Read-only current responsive mode. Use it to conditionally show an external mobile toggle. |
| `iconOnly` | `Signal&lt;boolean&gt;` | `derived` | Read-only state: desktop and collapsed. |
| `direction` | `Signal&lt;'ltr' &#124; 'rtl'&gt;` | `inherited` | Read-only inherited text direction, updated when ancestor dir attributes change. |
| `navigationId` | `string` | `generated` | Unique navigation ID used by collapse and toggle controls. |
| `toggle()` | `() =&gt; void` | `—` | Toggles open on mobile or collapsed on desktop, respecting collapsible. |

### Items

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisSidebarItem` | `native a or button component` | `—` | Styles native navigation links or consumer-owned actions. RouterLink remains optional and consumer-owned. |
| `label` | `string` | `required` | Visible item label; also supplies its icon-only accessible name and Aeris tooltip. Long labels wrap. |
| `active` | `boolean` | `false` | Applies active presentation and aria-current="page". Bind RouterLinkActive.isActive for routed links. |
| `disabled` | `boolean` | `false` | Disables native buttons and prevents link activation before RouterLink. Removes disabled links from Tab order. |

### Groups

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `required` | Group title, shown as a native disclosure button when collapsible. |
| `expanded` | `boolean (model)` | `true` | Controlled disclosure state. Icon-only navigation temporarily exposes all group items without overwriting this model. |
| `expandedChange` | `boolean (output)` | `—` | Emits changes to the group expanded model. |
| `collapsible` | `boolean` | `true` | False shows a static group heading and always exposes its content. |

### Toggles

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisSidebarToggle` | `AerisSidebar` | `required` | Native button directive linked to a sidebar. Supplies type, aria-controls, aria-expanded, an accessible label and the toggle action. Compose with aerisButton. |
| `aerisSidebarToggleLabel` | `string` | `''` | Optional replacement accessible name; empty uses the sidebar expand/collapse/close labels. |

### Slots

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisSidebarHeader` | `projected directive` | `—` | Header/brand region beside the built-in collapse/close action. Hidden in icon-only mode. |
| `aerisSidebarFooter` | `projected directive` | `—` | Non-scrolling footer. Use a sidebar item here for an accessible icon-only action. |
| `aerisSidebarIcon` | `projected directive` | `—` | Decorative item icon from any icon library; provide one for each item used in icon-only navigation. |
| `aerisSidebarBadge` | `projected directive` | `—` | Trailing item content. Hidden in icon-only mode; include essential counts/status in the item label when needed. |

## Interfaces and types

### Interfaces

```ts
type AerisSidebarMode = 'auto' | 'desktop' | 'mobile';
type AerisSidebarSide = 'start' | 'end';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-sidebar-width` | `CSS custom property` | `16rem` | Expanded desktop width. |
| `--aeris-sidebar-collapsed-width` | `CSS custom property` | `4.25rem` | Icon-only desktop width. |
| `--aeris-sidebar-padding` | `CSS custom property` | `--aeris-overlay-padding` | Navigation padding. |
| `--aeris-sidebar-gap` | `CSS custom property` | `--aeris-density-gap` | Space between header, body and footer. |
| `--aeris-sidebar-background` | `CSS custom property` | `--aeris-surface` | Surface color. |
| `--aeris-sidebar-color` | `CSS custom property` | `--aeris-text` | Text color. |
| `--aeris-sidebar-border` | `CSS custom property` | `--aeris-border` | Edge divider color. |
| `--aeris-sidebar-font-size` | `CSS custom property` | `--aeris-body-font-size` | Navigation typography. |
| `--aeris-sidebar-item-radius` | `CSS custom property` | `--aeris-radius-item` | Item and control corners. |
| `--aeris-sidebar-item-height` | `CSS custom property` | `--aeris-item-height` | Minimum item height; long labels grow. |
| `--aeris-sidebar-hover-background` | `CSS custom property` | `--aeris-interactive-hover` | Hover surface. |
| `--aeris-sidebar-active-background` | `CSS custom property` | `--aeris-primary-soft` | Active item surface. |
| `--aeris-sidebar-active-color` | `CSS custom property` | `--aeris-on-primary-soft` | Active item text. |
| `--aeris-sidebar-indent` | `CSS custom property` | `0.75rem` | Nested group indentation. |

## Examples

### Basic navigation

Native item buttons update consumer-owned state. Use anchors and RouterLink for real destinations.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
import { LucideDynamicIcon, LucideFolder, LucideHouse, LucideMenu, LucideSettings } from '@lucide/angular';

@Component({
  selector: 'app-sidebar-basic-demo',
  imports: [AerisBadgeModule, AerisSidebarModule, LucideDynamicIcon],
  templateUrl: './sidebar-basic.demo.html',
  styleUrl: './sidebar-basic.demo.scss'
})
export class SidebarBasicDemo {
  protected readonly houseIcon = LucideHouse;

  protected readonly folderIcon = LucideFolder;

  protected readonly settingsIcon = LucideSettings;

  protected readonly active = signal('Overview');
}
```

#### HTML

```html
<div>
  <div class="sidebar-frame">
    <aeris-sidebar
      mode="desktop"
      [collapsible]="false"
      ariaLabel="Basic example navigation"
      width="min(16rem, 55vw)"
    >
      <strong aerisSidebarHeader class="sidebar-brand">Workspace</strong>
      <button
        aerisSidebarItem
        label="Overview"
        [active]="active() === 'Overview'"
        (click)="active.set('Overview')"
      >
        <svg aerisSidebarIcon [lucideIcon]="houseIcon"></svg>
      </button>
      <button
        aerisSidebarItem
        label="Projects"
        [active]="active() === 'Projects'"
        (click)="active.set('Projects')"
      >
        <svg aerisSidebarIcon [lucideIcon]="folderIcon"></svg>
        <aeris-badge aerisSidebarBadge value="3" />
      </button>
      <button aerisSidebarItem label="Unavailable" disabled>
        <svg aerisSidebarIcon [lucideIcon]="settingsIcon"></svg>
      </button>
      <div aerisSidebarFooter>
        <button
          aerisSidebarItem
          label="Settings"
          [active]="active() === 'Settings'"
          (click)="active.set('Settings')"
        >
          <svg aerisSidebarIcon [lucideIcon]="settingsIcon"></svg>
        </button>
      </div>
    </aeris-sidebar>
    <div class="sidebar-main">
      <strong>{{ active() }}</strong>
      <p>The active item and content are controlled by this example.</p>
    </div>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.sidebar-frame {
  display: flex;
  min-inline-size: 0;
  block-size: 23rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-surface);
  overflow: clip;
}

.sidebar-main {
  color: var(--aeris-text);
  flex: 1;
  min-inline-size: 0;
  overflow: auto;
  padding: 1rem;
  background: var(--aeris-surface-2);
}

.sidebar-main p {
  margin-block: 0.75rem 0;
}

.sidebar-brand {
  padding-inline: 0.75rem;
}
```

### Icon-only navigation

Collapse to icons without losing accessible names. Hover or focus an item for its label.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
import { LucideDynamicIcon, LucideFolder, LucideHouse, LucideMenu, LucideSettings } from '@lucide/angular';

@Component({
  selector: 'app-sidebar-collapsed-demo',
  imports: [AerisButton, AerisSidebarModule, LucideDynamicIcon],
  templateUrl: './sidebar-collapsed.demo.html',
  styleUrl: './sidebar-collapsed.demo.scss'
})
export class SidebarCollapsedDemo {
  protected readonly houseIcon = LucideHouse;

  protected readonly folderIcon = LucideFolder;

  protected readonly settingsIcon = LucideSettings;

  protected readonly collapsed = signal(false);
}
```

#### HTML

```html
<div>
  <div class="sidebar-tools">
    <button aerisButton [aerisSidebarToggle]="compactSidebar">Toggle navigation</button>
    <span>Collapsed: {{ collapsed() }}</span>
  </div>
  <div class="sidebar-frame">
    <aeris-sidebar
      #compactSidebar
      mode="desktop"
      [(collapsed)]="collapsed"
      ariaLabel="Compact example navigation"
      width="min(16rem, 55vw)"
    >
      <strong aerisSidebarHeader class="sidebar-brand">Workspace</strong>
      <button aerisSidebarItem label="Overview" active>
        <svg aerisSidebarIcon [lucideIcon]="houseIcon"></svg>
      </button>
      <button aerisSidebarItem label="Projects">
        <svg aerisSidebarIcon [lucideIcon]="folderIcon"></svg>
      </button>
      <div aerisSidebarFooter>
        <button aerisSidebarItem label="Settings">
          <svg aerisSidebarIcon [lucideIcon]="settingsIcon"></svg>
        </button>
      </div>
    </aeris-sidebar>
    <div class="sidebar-main">
      <strong>Controlled collapse</strong>
      <p>The same model drives both the external toggle and built-in collapse button.</p>
    </div>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.sidebar-frame {
  display: flex;
  min-inline-size: 0;
  block-size: 23rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-surface);
  overflow: clip;
}

.sidebar-main {
  color: var(--aeris-text);
  flex: 1;
  min-inline-size: 0;
  overflow: auto;
  padding: 1rem;
  background: var(--aeris-surface-2);
}

.sidebar-main p {
  margin-block: 0.75rem 0;
}

.sidebar-brand {
  padding-inline: 0.75rem;
}

.sidebar-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-block-end: 1rem;
}
```

### Groups and long labels

Nested disclosures preserve their controlled state. Long labels wrap, and only the middle region scrolls.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
import { LucideDynamicIcon, LucideFolder, LucideHouse, LucideMenu, LucideSettings } from '@lucide/angular';

@Component({
  selector: 'app-sidebar-groups-demo',
  imports: [AerisSidebarModule, LucideDynamicIcon],
  templateUrl: './sidebar-groups.demo.html',
  styleUrl: './sidebar-groups.demo.scss'
})
export class SidebarGroupsDemo {
  protected readonly folderIcon = LucideFolder;

  protected readonly settingsIcon = LucideSettings;

  protected readonly groupExpanded = signal(true);
}
```

#### HTML

```html
<div>
  <div class="sidebar-frame">
    <aeris-sidebar
      mode="desktop"
      [collapsible]="false"
      width="min(19rem, 70vw)"
      ariaLabel="Grouped example navigation"
    >
      <strong aerisSidebarHeader class="sidebar-brand">Navigation groups</strong>
      <aeris-sidebar-group label="Workspace" [(expanded)]="groupExpanded">
        <button
          aerisSidebarItem
          label="A project with a longer, descriptive navigation label"
        >
          <svg aerisSidebarIcon [lucideIcon]="folderIcon"></svg>
        </button>
        <aeris-sidebar-group label="Archived projects">
          <button aerisSidebarItem label="Previous work">
            <svg aerisSidebarIcon [lucideIcon]="folderIcon"></svg>
          </button>
        </aeris-sidebar-group>
      </aeris-sidebar-group>
      <aeris-sidebar-group label="More destinations" [collapsible]="false">
        @for (index of [1, 2, 3, 4, 5, 6, 7, 8]; track index) {
          <button aerisSidebarItem [label]="'Project ' + index">
            <svg aerisSidebarIcon [lucideIcon]="folderIcon"></svg>
          </button>
        }
      </aeris-sidebar-group>
      <div aerisSidebarFooter>
        <button aerisSidebarItem label="Settings">
          <svg aerisSidebarIcon [lucideIcon]="settingsIcon"></svg>
        </button>
      </div>
    </aeris-sidebar>
    <div class="sidebar-main">
      <strong>Groups</strong>
      <p>Workspace expanded: {{ groupExpanded() }}</p>
    </div>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.sidebar-frame {
  display: flex;
  min-inline-size: 0;
  block-size: 23rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-surface);
  overflow: clip;
}

.sidebar-main {
  color: var(--aeris-text);
  flex: 1;
  min-inline-size: 0;
  overflow: auto;
  padding: 1rem;
  background: var(--aeris-surface-2);
}

.sidebar-main p {
  margin-block: 0.75rem 0;
}

.sidebar-brand {
  padding-inline: 0.75rem;
}
```

### Responsive navigation

Change the workspace width to see navigation move from a persistent sidebar to an on-demand drawer. This example uses a 560px breakpoint; the library default is 768px.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
import { LucideDynamicIcon, LucideFolder, LucideHouse, LucideMenu, LucideSettings } from '@lucide/angular';

@Component({
  selector: 'app-sidebar-responsive-demo',
  imports: [AerisButton, AerisSidebarModule, LucideDynamicIcon],
  templateUrl: './sidebar-responsive.demo.html',
  styleUrl: './sidebar-responsive.demo.scss'
})
export class SidebarResponsiveDemo {
  protected readonly houseIcon = LucideHouse;

  protected readonly folderIcon = LucideFolder;

  protected readonly settingsIcon = LucideSettings;

  protected readonly menuIcon = LucideMenu;

  protected readonly responsiveActive = signal('Overview');
}
```

#### HTML

```html
<div class="sidebar-workspace">
  <aeris-sidebar
    #responsiveSidebar
    [breakpoint]="560"
    width="12rem"
    ariaLabel="Responsive example navigation"
  >
    <strong aerisSidebarHeader class="sidebar-brand">Workspace</strong>
    <button
      aerisSidebarItem
      label="Overview"
      [active]="responsiveActive() === 'Overview'"
      (click)="responsiveActive.set('Overview')"
    >
      <svg aerisSidebarIcon [lucideIcon]="houseIcon"></svg>
    </button>
    <button
      aerisSidebarItem
      label="Projects"
      [active]="responsiveActive() === 'Projects'"
      (click)="responsiveActive.set('Projects')"
    >
      <svg aerisSidebarIcon [lucideIcon]="folderIcon"></svg>
    </button>
    <div aerisSidebarFooter>
      <button
        aerisSidebarItem
        label="Settings"
        [active]="responsiveActive() === 'Settings'"
        (click)="responsiveActive.set('Settings')"
      >
        <svg aerisSidebarIcon [lucideIcon]="settingsIcon"></svg>
      </button>
    </div>
  </aeris-sidebar>
  <div class="sidebar-workspace__main">
    <header class="sidebar-workspace__header">
      @if (responsiveSidebar.mobile()) {
        <button aerisButton variant="outline" [aerisSidebarToggle]="responsiveSidebar">
          <svg [lucideIcon]="menuIcon" aria-hidden="true"></svg>
          Navigation
        </button>
      }
      <span role="status">
        {{ responsiveSidebar.mobile() ? 'Drawer navigation' : 'Persistent navigation' }}
      </span>
    </header>
    <main class="sidebar-main">
      <h4>{{ responsiveActive() }}</h4>
      @if (responsiveSidebar.mobile()) {
        <p>
          Navigation opens over this content. Select a destination or close the drawer to
          return here.
        </p>
      } @else {
        <p>
          Navigation stays visible beside this content. Select a destination, or use the
          arrow to collapse it to icons.
        </p>
      }
    </main>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.sidebar-main {
  color: var(--aeris-text);
  flex: 1;
  min-inline-size: 0;
  overflow: auto;
  padding: 1rem;
  background: var(--aeris-surface-2);
}

.sidebar-main p {
  margin-block: 0.75rem 0;
}

.sidebar-brand {
  padding-inline: 0.75rem;
}

.sidebar-workspace {
  display: flex;
  block-size: 100dvh;
  min-inline-size: 0;
  background: var(--aeris-surface);
}

.sidebar-workspace__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-inline-size: 0;
}

.sidebar-workspace__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-block-end: 1px solid var(--aeris-border);
  font-size: var(--aeris-body-font-size);
}

.sidebar-workspace h4 {
  margin: 0;
  font-size: 1rem;
}
```

### Mobile drawer

Force drawer mode and control its open state independently of desktop collapse. Disable closeOnNavigate to keep the drawer open when an item is activated.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisSidebarModule } from '@aeris-ui/core/sidebar';
import { LucideDynamicIcon, LucideFolder, LucideHouse, LucideMenu, LucideSettings } from '@lucide/angular';

@Component({
  selector: 'app-sidebar-mobile-demo',
  imports: [AerisButton, AerisSidebarModule, LucideDynamicIcon],
  templateUrl: './sidebar-mobile.demo.html',
  styleUrl: './sidebar-mobile.demo.scss'
})
export class SidebarMobileDemo {
  protected readonly houseIcon = LucideHouse;

  protected readonly folderIcon = LucideFolder;

  protected readonly settingsIcon = LucideSettings;

  protected readonly menuIcon = LucideMenu;

  protected readonly mobileOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton [aerisSidebarToggle]="mobileSidebar">
    <svg [lucideIcon]="menuIcon" aria-hidden="true"></svg>
    Open navigation
  </button>
  <aeris-sidebar
    #mobileSidebar
    mode="mobile"
    side="end"
    [closeOnNavigate]="false"
    [(open)]="mobileOpen"
    ariaLabel="Drawer example navigation"
  >
    <strong aerisSidebarHeader class="sidebar-brand">Navigation</strong>
    <button aerisSidebarItem label="Overview" active>
      <svg aerisSidebarIcon [lucideIcon]="houseIcon"></svg>
    </button>
    <button aerisSidebarItem label="Projects">
      <svg aerisSidebarIcon [lucideIcon]="folderIcon"></svg>
    </button>
    <div aerisSidebarFooter>
      <button aerisSidebarItem label="Settings">
        <svg aerisSidebarIcon [lucideIcon]="settingsIcon"></svg>
      </button>
    </div>
  </aeris-sidebar>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.sidebar-brand {
  padding-inline: 0.75rem;
}
```

## Accessibility

- Sidebar uses a named native navigation landmark, links for destinations and buttons for actions. It is not an ARIA command menu: use normal Tab navigation, not menu arrow-key behavior. Supply distinct names for multiple navigation regions.
- Item labels supply icon-only accessible names and Aeris hover/focus tooltips. Icons are decorative; provide an icon for each item that can collapse. Badges disappear in icon-only mode, so include essential status in the label. Active links expose aria-current="page". Disabled links cannot navigate or receive Tab focus.
- Group disclosure buttons expose expanded state and their content relationship. Hidden groups remove their descendants from keyboard access. Icon-only mode exposes group items while retaining the expanded model for the next expansion.
- At the configured viewport breakpoint, a single Drawer replaces desktop navigation. It traps focus, supports Escape/backdrop/swipe dismissal, prevents background scrolling and restores the opening control. Resizing to desktop closes the mobile state and releases scroll locking. Desktop navigation never traps focus. Use aerisSidebarToggle for an external, correctly named and associated button.
- Use an ancestor dir="rtl" for logical placement and icon direction. Widths and item text can wrap; set a bounded layout height when the navigation body should scroll. Header/footer remain outside that scrolling region. Motion respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Navigate native links and buttons. Only the open mobile Drawer traps focus. |
| `Enter` | Follow a focused link or activate a button. |
| `Space` | Activate a focused toggle, group disclosure or item button. |
| `Escape` | Close the topmost mobile Drawer and restore trigger focus. No special desktop behavior. |
