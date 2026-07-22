# Avatar

> Represent people and entities with images, initials, icons, fallbacks, theme-aware tones, and responsive groups.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/avatar`
- Human-readable documentation: [https://aeris-ui.dev/components/avatar](https://aeris-ui.dev/components/avatar)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `''` | Initials or a short fallback label. It takes precedence over projected content. |
| `imageSrc` | `string` | `''` | Image URL. A failed image automatically falls back to the label or projected content. |
| `imageAlt` | `string` | `''` | Alternative text for a meaningful image and the fallback accessible name. |
| `imageLoading` | `AerisAvatarImageLoading` | `'lazy'` | Sets native eager or lazy image loading. |
| `imageFit` | `AerisAvatarImageFit` | `'cover'` | Controls whether an image covers or fits within the avatar. |
| `size` | `AerisAvatarSize` | `'md'` | Sets the avatar dimensions and typography. |
| `shape` | `AerisAvatarShape` | `'circle'` | Sets circle, rounded, or compact square corners. |
| `tone` | `AerisAvatarTone` | `'primary'` | Sets a theme-aware fallback background and foreground. |
| `decorative` | `boolean` | `false` | Hides the complete avatar from assistive technology when nearby content identifies it. |
| `ariaLabel` | `string` | `''` | Accessible name for initials or projected content, or an override for image semantics. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the avatar. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `imageError` | `Event` | `-` | Emits when the image fails before the fallback content is shown. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default avatar content` | `content projection` | `-` | Consumer icon or custom content rendered when no image or label is available. |
| `default group content` | `content projection` | `-` | Avatar components rendered in the responsive overlapping group. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `retryImage()` | `() =&gt; void` | `-` | Clears the failed-image state and attempts to render the current source again. |

### Group Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `overlap` | `AerisAvatarGroupOverlap` | `'default'` | Controls how closely neighboring avatars overlap. |
| `ariaLabel` | `string` | `''` | Accessible name for the group. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the group. |

## Interfaces and types

### Interfaces

```ts
type AerisAvatarSize = 'sm' | 'md' | 'lg' | 'xl';
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
type AerisAvatarGroupOverlap = 'subtle' | 'default' | 'strong';
```

## Examples

### Basic

Render concise labels or project an icon from any consumer-selected icon library.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
import { LucideDynamicIcon, LucideUserRound } from '@lucide/angular';

@Component({
  selector: 'app-avatar-basic-demo',
  imports: [AerisAvatarModule, LucideDynamicIcon],
  template: `
    <div>
      <div class="avatar-row">
        <aeris-avatar label="AR" ariaLabel="Avery Reed" />
        <aeris-avatar label="UI" ariaLabel="Aeris UI" shape="rounded" tone="info" />
        <aeris-avatar ariaLabel="User account" tone="neutral">
          <svg [lucideIcon]="icons.UserRound"></svg>
        </aeris-avatar>
      </div>
    </div>
  `,
  styles: `
    .avatar-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }
  `
})
export class AvatarBasicBasicDemo {

  protected readonly icons = { UserRound: LucideUserRound };
}
```

### Images

Use native image loading and alternative text without writing image sizing or cropping CSS.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';

@Component({
  selector: 'app-avatar-images-demo',
  imports: [AerisAvatarModule],
  templateUrl: './avatar-images.demo.html',
  styleUrl: './avatar-images.demo.scss'
})
export class AvatarImagesImagesDemo {
}
```

#### HTML

```html
<div>
  <div class="avatar-row">
    <aeris-avatar
      imageSrc="/puppies/puppy1.jpg"
      imageAlt="Golden puppy sitting outdoors"
      size="lg"
    />
    <aeris-avatar
      imageSrc="/puppies/puppy2.jpg"
      imageAlt="Small puppy looking toward the camera"
      size="lg"
      shape="rounded"
    />
    <aeris-avatar
      imageSrc="/puppies/puppy3.jpg"
      imageAlt="Playful puppy portrait"
      size="lg"
      shape="square"
    />
  </div>
</div>
```

#### CSS

```css
.avatar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
```

### Sizes and shapes

Choose a density-aware size and a circle, rounded, or square silhouette.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';

@Component({
  selector: 'app-avatar-sizes-demo',
  imports: [AerisAvatarModule],
  templateUrl: './avatar-sizes.demo.html',
  styleUrl: './avatar-sizes.demo.scss'
})
export class AvatarSizesSizesAndShapesDemo {
}
```

#### HTML

```html
<div>
  <div class="avatar-row">
    <aeris-avatar label="SM" ariaLabel="Small avatar" size="sm" />
    <aeris-avatar label="MD" ariaLabel="Medium avatar" />
    <aeris-avatar
      label="LG"
      ariaLabel="Large rounded avatar"
      size="lg"
      shape="rounded"
    />
    <aeris-avatar
      label="XL"
      ariaLabel="Extra-large square avatar"
      size="xl"
      shape="square"
    />
  </div>
</div>
```

#### CSS

```css
.avatar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
```

### Tones

Apply semantic, palette-aware fallback colors while images remain unchanged.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';

@Component({
  selector: 'app-avatar-tones-demo',
  imports: [AerisAvatarModule],
  template: `
    <div>
      <div class="avatar-row">
        <aeris-avatar label="PR" ariaLabel="Primary" />
        <aeris-avatar label="NE" ariaLabel="Neutral" tone="neutral" />
        <aeris-avatar label="SU" ariaLabel="Success" tone="success" />
        <aeris-avatar label="IN" ariaLabel="Information" tone="info" />
        <aeris-avatar label="WA" ariaLabel="Warning" tone="warning" />
        <aeris-avatar label="DA" ariaLabel="Danger" tone="danger" />
      </div>
    </div>
  `,
  styles: `
    .avatar-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }
  `
})
export class AvatarTonesTonesDemo {
}
```

### Badge

Compose Avatar with BadgeOverlay for presence and counts while keeping the accessible state in the avatar label.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
import { AerisBadgeModule } from '@aeris-ui/core/badge';

@Component({
  selector: 'app-avatar-badge-demo',
  imports: [AerisAvatarModule, AerisBadgeModule],
  template: `
    <div>
      <div class="avatar-row">
        <aeris-badge-overlay dot severity="success" position="bottom-right">
          <aeris-avatar label="AR" ariaLabel="Avery Reed, online" />
        </aeris-badge-overlay>
        <aeris-badge-overlay value="4" severity="info">
          <aeris-avatar
            imageSrc="/puppies/puppy4.jpg"
            ariaLabel="Four new photos from puppy club"
            size="lg"
          />
        </aeris-badge-overlay>
      </div>
    </div>
  `,
  styles: `
    .avatar-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }
  `
})
export class AvatarBadgeBadgeDemo {
}
```

### Group

AvatarGroup is included in the Avatar import and contains long teams within narrow layouts.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';

@Component({
  selector: 'app-avatar-group-demo',
  imports: [AerisAvatarModule],
  template: `
    <div>
      <aeris-avatar-group ariaLabel="Design team" overlap="default">
        <aeris-avatar imageSrc="/puppies/puppy5.jpg" imageAlt="Milo" />
        <aeris-avatar imageSrc="/puppies/puppy6.jpg" imageAlt="Luna" />
        <aeris-avatar imageSrc="/puppies/puppy7.jpg" imageAlt="Archie" />
        <aeris-avatar imageSrc="/puppies/puppy8.jpg" imageAlt="Daisy" />
        <aeris-avatar
          label="+4"
          ariaLabel="Four more design team members"
          tone="neutral"
        />
      </aeris-avatar-group>
    </div>
  `
})
export class AvatarGroupGroupDemo {
}
```

### Image fallback

A failed source emits imageError and immediately reveals the configured label.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';

@Component({
  selector: 'app-avatar-fallback-demo',
  imports: [AerisAvatarModule],
  template: `
    <div>
      <div class="avatar-fallback-demo">
        <aeris-avatar
          label="AR"
          imageSrc="/missing-profile-photo.jpg"
          imageAlt="Avery Reed"
          size="lg"
          (imageError)="imageStatus.set('The label fallback is now visible.')"
        />
        <p aria-live="polite">{{ imageStatus() }}</p>
      </div>
    </div>
  `,
  styles: `
    .avatar-fallback-demo {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }
    
    .avatar-fallback-demo p {
      margin: 0;
    }
  `
})
export class AvatarFallbackImageFallbackDemo {
  protected readonly imageStatus = signal(
    'Waiting for the image.',
  );
}
```

### Token customization

Scope Avatar tokens to create a distinct identity without replacing component structure.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';

@Component({
  selector: 'app-avatar-custom-demo',
  imports: [AerisAvatarModule],
  template: `
    <div>
      <aeris-avatar
        class="brand-avatar"
        label="AU"
        ariaLabel="Aeris UI"
        shape="rounded"
      />
    </div>
  `,
  styles: `
    .brand-avatar {
      --aeris-avatar-size: 4.5rem;
      --aeris-avatar-background: linear-gradient(135deg, #17200f, #7f9564);
      --aeris-avatar-color: #f8faef;
      --aeris-avatar-border: color-mix(in srgb, #b9d897 58%, transparent);
      --aeris-avatar-border-width: 2px;
      --aeris-avatar-font-size: 1.25rem;
      --aeris-avatar-shadow: 0 0.75rem 2rem rgb(40 58 28 / 22%);
    }
  `
})
export class AvatarCustomTokenCustomizationDemo {
}
```

## Accessibility

- Avatar is non-interactive and is not added to the tab order.
- A meaningful image uses its native alt. Initials and projected content use an image role only when an accessible name is available.
- Set decorative when adjacent visible text already identifies the person or entity. The host and image are then hidden from assistive technology.
- When ariaLabel or ariaLabelledBy names an image avatar, the nested image uses an empty alt to prevent duplicate announcements.
- AvatarGroup uses a group role and accepts an accessible name. Its horizontal overflow remains contained at narrow widths.
- Badge overlays are visual. Include meaningful presence or count information in the avatar or surrounding control label.
- Avatar includes no required animation and respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Avatar and AvatarGroup are skipped because they are non-interactive. Focus continues to nearby native controls. |
| `Enter / Space` | No built-in behavior. If an avatar represents an action, place it inside a semantic button or link. |
| `Arrow keys` | No built-in behavior. Group members are informational rather than a composite widget. |
