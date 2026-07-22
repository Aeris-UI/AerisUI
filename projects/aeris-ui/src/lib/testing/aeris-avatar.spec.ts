import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AerisAvatar, AerisAvatarGroup, AerisAvatarModule } from '../../../avatar/aeris-avatar';

@Component({
  imports: [AerisAvatarModule],
  template: `
    <aeris-avatar label="AR" ariaLabel="Avery Reed" size="lg" shape="rounded" tone="info" />
    <aeris-avatar imageSrc="/person.jpg" imageAlt="Jordan Lee" imageLoading="eager" />
    <aeris-avatar class="icon-avatar" ariaLabel="Account"
      ><svg aria-hidden="true"></svg
    ></aeris-avatar>
    <aeris-avatar class="decorative-avatar" label="UI" decorative />
  `,
})
class AvatarHost {}

@Component({
  imports: [AerisAvatarModule],
  template: `
    <aeris-avatar-group ariaLabel="Project members" overlap="strong">
      <aeris-avatar label="AR" ariaLabel="Avery Reed" />
      <aeris-avatar label="JL" ariaLabel="Jordan Lee" />
      <aeris-avatar label="+3" ariaLabel="Three more project members" />
    </aeris-avatar-group>
  `,
})
class GroupHost {}

@Component({
  imports: [AerisAvatar],
  template: `
    <aeris-avatar
      #avatar
      label="AR"
      imageSrc="/broken.jpg"
      imageAlt="Avery Reed"
      (imageError)="errors.update((count) => count + 1)"
    />
  `,
})
class FallbackHost {
  readonly errors = signal(0);
  readonly avatar = viewChild.required<AerisAvatar>('avatar');
}

describe('AerisAvatar', () => {
  it('renders labels, images, projected content, sizes, shapes, tones, and semantics', () => {
    const fixture = TestBed.createComponent(AvatarHost);
    fixture.detectChanges();
    const avatars = fixture.nativeElement.querySelectorAll(
      'aeris-avatar',
    ) as NodeListOf<HTMLElement>;

    expect(avatars[0]?.textContent?.trim()).toBe('AR');
    expect(avatars[0]?.dataset['size']).toBe('lg');
    expect(avatars[0]?.dataset['shape']).toBe('rounded');
    expect(avatars[0]?.dataset['tone']).toBe('info');
    expect(avatars[0]?.getAttribute('role')).toBe('img');
    expect(avatars[0]?.getAttribute('aria-label')).toBe('Avery Reed');

    const image = avatars[1]?.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('/person.jpg');
    expect(image.alt).toBe('Jordan Lee');
    expect(image.getAttribute('loading')).toBe('eager');
    expect(avatars[1]?.getAttribute('role')).toBeNull();

    expect(avatars[2]?.querySelector('svg')).not.toBeNull();
    expect(avatars[2]?.getAttribute('aria-label')).toBe('Account');
    expect(avatars[3]?.getAttribute('aria-hidden')).toBe('true');
    expect(avatars[3]?.getAttribute('role')).toBeNull();
  });

  it('exports grouping with Avatar through one module-array import', () => {
    expect(AerisAvatarModule).toEqual([AerisAvatar, AerisAvatarGroup]);
    const fixture = TestBed.createComponent(GroupHost);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('aeris-avatar-group') as HTMLElement;

    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Project members');
    expect(group.dataset['overlap']).toBe('strong');
    expect(group.querySelectorAll('aeris-avatar')).toHaveLength(3);
  });

  it('falls back to its label, emits image errors, and supports retrying the source', () => {
    const fixture = TestBed.createComponent(FallbackHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('aeris-avatar') as HTMLElement;
    const image = host.querySelector('img') as HTMLImageElement;

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.componentInstance.errors()).toBe(1);
    expect(host.dataset['imageFailed']).toBe('true');
    expect(host.textContent?.trim()).toBe('AR');

    fixture.componentInstance.avatar().retryImage();
    fixture.detectChanges();
    expect(host.querySelector('img')).not.toBeNull();
    expect(host.dataset['imageFailed']).toBeUndefined();
  });

  it('keeps the group structurally contained for narrow responsive layouts', () => {
    const fixture = TestBed.createComponent(GroupHost);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('aeris-avatar-group') as HTMLElement;
    const styles = getComputedStyle(group);

    expect(styles.maxInlineSize).toBe('100%');
    expect(styles.overflowX).toBe('auto');
  });
});
