import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: 'pre[code]',
})
export class ProjectedCode {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  text(): string {
    return this.element.nativeElement.textContent?.trim() ?? '';
  }
}
