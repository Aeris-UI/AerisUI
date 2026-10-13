import { Component, computed, input, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisSelect } from '@aeris-ui/core/select';
import type { CodeSource } from '../shared/code-block.component';

// The live demo and copyable sources share the same template and styling.
const TEMPLATE = `<aeris-card variant="filled" padding="lg">
  <header aerisCardHeader><h3 aerisCardTitle>Profile settings</h3></header>
  <form class="profile-form" (submit)="save($event)" novalidate>
    <label [for]="idPrefix() + '-name'">Name</label>
    <input
      aerisInputText
      fluid
      autocomplete="name"
      [id]="idPrefix() + '-name'"
      [formField]="profileForm.name"
      [attr.aria-describedby]="idPrefix() + '-feedback'"
    />
    <label [id]="idPrefix() + '-role-label'">Role</label>
    <aeris-select
      fluid
      appendTo="self"
      [ariaLabelledBy]="idPrefix() + '-role-label'"
      [options]="roles"
      [formField]="profileForm.role"
    />
    <p class="feedback" [id]="idPrefix() + '-feedback'" aria-live="polite">
      @if (nameInvalid()) {
        Enter your name before saving.
      } @else if (savedName()) {
        Settings saved for {{ savedName() }}.
      } @else {
        Your changes stay in this demo.
      }
    </p>
    <button aerisButton type="submit">Save settings</button>
  </form>
</aeris-card>`;

const STYLES = `:host {
  display: block;
  min-width: 0;
  color: var(--aeris-text);
}

.profile-form {
  display: grid;
  gap: 0.625rem;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
}

label:not(:first-child) {
  margin-top: 0.625rem;
}

.feedback {
  margin: 0.5rem 0;
  color: var(--aeris-text-2);
  font-size: 0.875rem;
  line-height: 1.5;
}

button {
  justify-self: start;
}`;

@Component({
  selector: 'app-home-profile-demo',
  imports: [AerisButton, AerisCardModule, AerisInputText, AerisSelect, FormField],
  template: TEMPLATE,
  styles: STYLES,
})
export class HomeProfileDemoComponent {
  readonly idPrefix = input('profile');
  protected readonly profile = signal({ name: 'Alex Morgan', role: 'designer' });
  protected readonly profileForm = form(this.profile, (path) => required(path.name));
  protected readonly nameInvalid = computed(
    () => this.profileForm.name().touched() && this.profileForm.name().invalid(),
  );
  protected readonly savedName = signal('');
  protected readonly roles = [
    { label: 'Designer', value: 'designer' },
    { label: 'Developer', value: 'developer' },
    { label: 'Product manager', value: 'product' },
  ];

  protected async save(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    await submit(this.profileForm, async () => {
      this.savedName.set(this.profile().name);
    });
  }
}

export const HOME_PROFILE_SOURCES: readonly CodeSource[] = [
  {
    label: 'profile.component.ts',
    language: 'TypeScript',
    code: `import { Component, computed, input, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-profile',
  imports: [AerisButton, AerisCardModule, AerisInputText, AerisSelect, FormField],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  readonly idPrefix = input('profile');
  protected readonly profile = signal({ name: 'Alex Morgan', role: 'designer' });
  protected readonly profileForm = form(this.profile, (path) => required(path.name));
  protected readonly nameInvalid = computed(() =>
    this.profileForm.name().touched() && this.profileForm.name().invalid());
  protected readonly savedName = signal('');
  protected readonly roles = [
    { label: 'Designer', value: 'designer' },
    { label: 'Developer', value: 'developer' },
    { label: 'Product manager', value: 'product' },
  ];

  protected async save(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    await submit(this.profileForm, async () => {
      this.savedName.set(this.profile().name);
    });
  }
}`,
  },
  { label: 'profile.component.html', language: 'HTML', code: TEMPLATE },
  { label: 'profile.component.css', language: 'CSS', code: STYLES },
];
