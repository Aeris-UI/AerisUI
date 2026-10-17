import { Component, signal } from '@angular/core';
import { AerisColorPicker } from '@aeris-ui/core/color-picker';

@Component({
  selector: 'app-color-picker-alpha-fixture',
  imports: [AerisColorPicker],
  template: `
    <section data-fixture="color-picker-alpha" aria-labelledby="alpha-title">
      <h2 id="alpha-title">Color opacity</h2>
      <aeris-color-picker
        alpha
        appendTo="body"
        inputId="alpha-color"
        ariaLabel="Overlay color"
        [(value)]="color"
        format="rgb"
        [presets]="['#336699', '#33669940', '#336699ff', 'transparent']"
      />
      <output aria-label="Overlay color value">{{ color() }}</output>
    </section>
    <section aria-label="Color picker scroll positioning">
      @for (mount of mounts; track mount) {
        <div class="scroll-container" [attr.data-color-scroll]="mount">
          <div class="scroll-content">
            <aeris-color-picker
              alpha
              [appendTo]="mount"
              [ariaLabel]="mount + ' scroll color'"
              value="#33669980"
            />
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    .scroll-container {
      height: 15rem;
      overflow: auto;
      margin-block: 1rem;
    }
    .scroll-content {
      min-height: 45rem;
      padding: 6rem 1rem;
    }
  `,
})
export class ColorPickerAlphaFixture {
  protected readonly mounts = ['self', 'body'] as const;
  protected readonly color = signal('rgba(51, 102, 153, 0.5)');
}
