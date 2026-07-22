import {
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

export type AerisAvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AerisAvatarShape = 'circle' | 'rounded' | 'square';
export type AerisAvatarTone = 'primary' | 'neutral' | 'success' | 'info' | 'warning' | 'danger';
export type AerisAvatarImageFit = 'cover' | 'contain';
export type AerisAvatarImageLoading = 'eager' | 'lazy';
export type AerisAvatarGroupOverlap = 'subtle' | 'default' | 'strong';

@Component({
  selector: 'aeris-avatar',
  template: `
    @if (showImage()) {
      <img
        class="aeris-avatar__image"
        [src]="imageSrc()"
        [alt]="resolvedImageAlt()"
        [attr.loading]="imageLoading()"
        [attr.decoding]="imageLoading() === 'lazy' ? 'async' : 'auto'"
        draggable="false"
        (error)="handleImageError($event)"
      />
    } @else if (label()) {
      <span class="aeris-avatar__label" aria-hidden="true">{{ label() }}</span>
    } @else {
      <span class="aeris-avatar__content" aria-hidden="true"><ng-content /></span>
    }
  `,
  styleUrl: './aeris-avatar.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-avatar',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-image-fit]': 'imageFit()',
    '[attr.data-image-failed]': 'imageFailed() || null',
    '[attr.role]': 'resolvedRole()',
    '[attr.aria-label]': 'resolvedHostLabel()',
    '[attr.aria-labelledby]': 'decorative() ? null : ariaLabelledBy() || null',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class AerisAvatar {
  readonly label = input('');
  readonly imageSrc = input('');
  readonly imageAlt = input('');
  readonly imageLoading = input<AerisAvatarImageLoading>('lazy');
  readonly imageFit = input<AerisAvatarImageFit>('cover');
  readonly size = input<AerisAvatarSize>('md');
  readonly shape = input<AerisAvatarShape>('circle');
  readonly tone = input<AerisAvatarTone>('primary');
  readonly decorative = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');

  readonly imageError = output<Event>();

  private readonly failedImageSrc = signal('');
  protected readonly showImage = computed(
    () => !!this.imageSrc() && this.failedImageSrc() !== this.imageSrc(),
  );
  protected readonly imageFailed = computed(
    () => !!this.imageSrc() && this.failedImageSrc() === this.imageSrc(),
  );
  protected readonly resolvedImageAlt = computed(() =>
    this.decorative() || this.ariaLabel() || this.ariaLabelledBy() ? '' : this.imageAlt(),
  );
  protected readonly accessibleName = computed(
    () => this.ariaLabel() || this.imageAlt() || this.label(),
  );
  protected readonly resolvedRole = computed(() => {
    if (this.decorative() || (this.showImage() && this.resolvedImageAlt())) return null;
    return this.accessibleName() || this.ariaLabelledBy() ? 'img' : null;
  });
  protected readonly resolvedHostLabel = computed(() => {
    if (this.decorative() || !this.resolvedRole() || this.ariaLabelledBy()) return null;
    return this.accessibleName() || null;
  });

  retryImage(): void {
    this.failedImageSrc.set('');
  }

  protected handleImageError(event: Event): void {
    this.failedImageSrc.set(this.imageSrc());
    this.imageError.emit(event);
  }
}

@Component({
  selector: 'aeris-avatar-group',
  template: `<ng-content />`,
  styleUrl: './aeris-avatar.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-avatar-group',
    role: 'group',
    '[attr.data-overlap]': 'overlap()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
  },
})
export class AerisAvatarGroup {
  readonly overlap = input<AerisAvatarGroupOverlap>('default');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
}

export const AerisAvatarModule = [AerisAvatar, AerisAvatarGroup] as const;
