import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

export type AerisClassNamesMap = Readonly<Record<string, boolean | null | undefined>>;
export type AerisClassNamesValue =
  | string
  | AerisClassNamesMap
  | readonly AerisClassNamesValue[]
  | false
  | null
  | undefined;

@Directive({
  selector: '[aerisClassNames]',
  exportAs: 'aerisClassNames',
})
export class AerisClassNamesDirective {
  readonly value = input<AerisClassNamesValue>(null, { alias: 'aerisClassNames' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly initialClasses = new Set(
    this.tokenize(this.element.getAttribute('class') ?? ''),
  );
  private appliedClasses = new Set<string>();

  constructor() {
    effect(() => this.apply(this.resolve(this.value())));
  }

  private apply(nextClasses: ReadonlySet<string>): void {
    for (const className of this.appliedClasses) {
      if (!nextClasses.has(className) && !this.initialClasses.has(className)) {
        this.renderer.removeClass(this.element, className);
      }
    }

    for (const className of nextClasses) {
      if (!this.appliedClasses.has(className)) {
        this.renderer.addClass(this.element, className);
      }
    }

    this.appliedClasses = new Set(nextClasses);
  }

  private resolve(value: AerisClassNamesValue, classes = new Set<string>()): Set<string> {
    if (!value) return classes;

    if (typeof value === 'string') {
      for (const className of this.tokenize(value)) classes.add(className);
      return classes;
    }

    if (Array.isArray(value)) {
      for (const entry of value) this.resolve(entry, classes);
      return classes;
    }

    for (const [classNames, enabled] of Object.entries(value as AerisClassNamesMap)) {
      if (!enabled) continue;
      for (const className of this.tokenize(classNames)) classes.add(className);
    }

    return classes;
  }

  private tokenize(value: string): readonly string[] {
    return value.split(/\s+/u).filter(Boolean);
  }
}

export const AerisClassNamesModule = [AerisClassNamesDirective] as const;
