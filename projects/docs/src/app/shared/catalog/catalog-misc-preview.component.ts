import { Component, input } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisBlockUIModule } from '@aeris-ui/core/block-ui';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { AerisFluidModule } from '@aeris-ui/core/fluid';
import { AerisInplaceModule } from '@aeris-ui/core/inplace';
import { AerisMeterGroupModule } from '@aeris-ui/core/meter-group';
import { AerisProgressBarModule } from '@aeris-ui/core/progress-bar';
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';
import { AerisInputText } from '@aeris-ui/core/input-text';
@Component({
  selector: 'app-catalog-misc-preview',
  imports: [
    AerisAvatarModule,
    AerisBadgeModule,
    AerisBlockUIModule,
    AerisChipModule,
    AerisFluidModule,
    AerisInplaceModule,
    AerisMeterGroupModule,
    AerisProgressBarModule,
    AerisProgressSpinnerModule,
    AerisSkeletonModule,
    AerisInputText,
  ],
  template: `
    @switch (kind()) {
      @case ('avatar') {
        <aeris-avatar-group
          ><aeris-avatar label="AM" /><aeris-avatar label="JL" tone="info" /><aeris-avatar
            label="+3"
            tone="neutral"
        /></aeris-avatar-group>
      }
      @case ('badge') {
        <div class="row">
          <aeris-badge value="New" /><aeris-badge value="12" severity="secondary" /><aeris-badge
            value="Online"
            severity="success"
          />
        </div>
      }
      @case ('block-ui') {
        <aeris-block-ui [blocked]="active()"
          ><div class="sample stack">
            <strong>Preparing your workspace</strong>
            <p class="muted">Your changes are being saved.</p>
          </div></aeris-block-ui
        >
      }
      @case ('chip') {
        <div class="row">
          <aeris-chip label="Design" /><aeris-chip label="Research" [removable]="true" />
        </div>
      }
      @case ('fluid') {
        <aeris-fluid
          ><div class="stack">
            <input
              aerisInputText
              size="sm"
              value="Full-width controls"
              aria-label="Example"
            /><input
              aerisInputText
              size="sm"
              placeholder="Another field"
              aria-label="Another field"
            /></div
        ></aeris-fluid>
      }
      @case ('inplace') {
        <div class="stack">
          <strong>Project name</strong>
          <aeris-inplace
            label="Website redesign"
            ariaLive="off"
            [closable]="true"
            [autofocusContent]="false"
            [active]="active()"
            ><ng-template aerisInplaceContent
              ><input
                aerisInputText
                size="sm"
                fluid
                readonly
                aria-label="Project name"
                value="Website redesign" /></ng-template
          ></aeris-inplace>
          <small>Inline editing</small>
        </div>
      }
      @case ('meter-group') {
        <aeris-meter-group [items]="meters" size="sm" />
      }
      @case ('progress-bar') {
        <div class="stack">
          <span>Uploading assets</span><aeris-progress-bar [value]="active() ? 85 : 35" />
        </div>
      }
      @case ('progress-spinner') {
        <aeris-progress-spinner [value]="active() ? null : 72" size="lg" />
      }
      @case ('skeleton') {
        <div class="row">
          <aeris-skeleton
            shape="circle"
            width="3rem"
            height="3rem"
            [animation]="active() ? 'wave' : 'none'"
          />
          <div class="stack" style="width:60%">
            <aeris-skeleton width="75%" [animation]="active() ? 'wave' : 'none'" /><aeris-skeleton
              [animation]="active() ? 'wave' : 'none'"
            /><aeris-skeleton width="90%" [animation]="active() ? 'wave' : 'none'" />
          </div>
        </div>
      }
    }
  `,
  styleUrl: './catalog-scene.scss',
})
export class CatalogMiscPreviewComponent {
  readonly kind = input.required<string>();
  readonly active = input(false);
  protected readonly meters = [
    { label: 'Design', value: 45 },
    { label: 'Development', value: 30, tone: 'secondary' as const },
  ];
}
