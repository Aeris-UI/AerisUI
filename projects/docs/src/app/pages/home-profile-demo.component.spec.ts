import { TestBed } from '@angular/core/testing';
import { provideAeris } from '@aeris-ui/core/theming';
import { HomeProfileDemoComponent, HOME_PROFILE_SOURCES } from './home-profile-demo.component';

describe('HomeProfileDemoComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeProfileDemoComponent],
      providers: [provideAeris()],
    });
  });

  it('keeps pristine fields neutral and presents submitted validation', async () => {
    const fixture = TestBed.createComponent(HomeProfileDemoComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Alex Morgan');
    expect(input.getAttribute('aria-invalid')).not.toBe('true');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).not.toBe('true');
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Enter your name before saving.');
    input.value = 'Sam Taylor';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).not.toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Settings saved for Sam Taylor.');
  });

  it('supports distinct accessible names and ships complete copyable files', () => {
    const fixture = TestBed.createComponent(HomeProfileDemoComponent);
    fixture.componentRef.setInput('idPrefix', 'theme-profile');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').id).toBe('theme-profile-name');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe('theme-profile-name');
    expect(HOME_PROFILE_SOURCES.map(({ label }) => label)).toEqual([
      'profile.component.ts',
      'profile.component.html',
      'profile.component.css',
    ]);
    expect(HOME_PROFILE_SOURCES[0].code).toContain('protected async save');
    expect(HOME_PROFILE_SOURCES[1].code).toContain('[formField]="profileForm.name"');
    expect(HOME_PROFILE_SOURCES[2].code).toContain('display: grid');
  });
});
