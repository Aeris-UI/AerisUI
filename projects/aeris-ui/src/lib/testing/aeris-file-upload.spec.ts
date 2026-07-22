import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AerisFileUpload,
  AerisFileUploadModule,
  type AerisFileUploadEvent,
  type AerisFileUploadRejectedFile,
  type AerisFileUploadSelectEvent,
} from '../../../file-upload/aeris-file-upload';

const file = (name: string, size: number, type: string): File =>
  new File(['x'.repeat(size)], name, { type });

function setInputFiles(input: HTMLInputElement, files: readonly File[]): void {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: files,
  });
}

function dropEvent(files: readonly File[]): DragEvent {
  const event = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
  Object.defineProperty(event, 'dataTransfer', {
    configurable: true,
    value: { files, items: files.map(() => ({ kind: 'file' })), dropEffect: 'none' },
  });
  return event;
}

@Component({
  imports: [AerisFileUploadModule],
  template: `
    <aeris-file-upload
      accept="image/*,.pdf"
      multiple
      [maxFileSize]="1024"
      [maxFiles]="2"
      helperText="Images or PDF files only."
      (selected)="selectedEvent.set($event)"
      (validationFailed)="validationEvent.set($event)"
      (removed)="removedCount.update((count) => count + 1)"
      (cleared)="clearedCount.update((count) => count + 1)"
    />
  `,
})
class FileUploadHost {
  readonly selectedEvent = signal<AerisFileUploadSelectEvent | null>(null);
  readonly validationEvent = signal<readonly AerisFileUploadRejectedFile[] | null>(null);
  readonly removedCount = signal(0);
  readonly clearedCount = signal(0);
}

@Component({
  imports: [AerisFileUploadModule],
  template: `
    <aeris-file-upload
      customUpload
      autoUpload
      [showUploadButton]="false"
      (uploadRequested)="handleUpload($event)"
    />
  `,
})
class CustomUploadHost {
  readonly uploadCount = signal(0);
  readonly lastEvent = signal<AerisFileUploadEvent | null>(null);

  handleUpload(event: AerisFileUploadEvent): void {
    this.uploadCount.update((count) => count + 1);
    this.lastEvent.set(event);
    event.setProgress(event.files[0]!, 42);
  }
}

@Component({
  imports: [AerisFileUploadModule],
  template: `
    <aeris-file-upload>
      <ng-template aerisFileUploadToolbar let-files let-choose="choose" let-clear="clear">
        <button class="custom-choose" type="button" (click)="choose($event)">Add {{ files.length }}</button>
        <button class="custom-clear" type="button" (click)="clear($event)">Reset</button>
      </ng-template>
      <ng-template aerisFileUploadFile let-file let-remove="remove">
        <article class="custom-file" role="listitem">
          <span>{{ file.name }}</span>
          <button type="button" (click)="remove($event)">Remove</button>
        </article>
      </ng-template>
      <ng-template aerisFileUploadEmpty>
        <p class="custom-empty">Nothing queued.</p>
      </ng-template>
    </aeris-file-upload>
  `,
})
class TemplateUploadHost {}

describe('AerisFileUpload', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:preview'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders an accessible advanced uploader with native file input and controls', () => {
    const fixture = TestBed.createComponent(FileUploadHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    const dropzone = fixture.nativeElement.querySelector('.aeris-file-upload__dropzone') as HTMLButtonElement;

    expect(input).toBeTruthy();
    expect(input.accept).toBe('image/*,.pdf');
    expect(input.multiple).toBe(true);
    expect(input.getAttribute('aria-label')).toBe('Choose files');
    expect(dropzone.tagName).toBe('BUTTON');
    expect(dropzone.textContent).toContain('Images or PDF files only.');
  });

  it('selects valid files, rejects invalid files, and enforces max file count', () => {
    const fixture = TestBed.createComponent(FileUploadHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    const accepted = file('photo.png', 128, 'image/png');
    const tooLarge = file('large.png', 2048, 'image/png');
    const wrongType = file('notes.txt', 64, 'text/plain');

    setInputFiles(input, [accepted, tooLarge, wrongType]);
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedEvent()?.acceptedFiles).toEqual([accepted]);
    expect(fixture.componentInstance.validationEvent()?.map((item) => item.reason)).toEqual([
      'size-max',
      'type',
    ]);
    expect(fixture.nativeElement.textContent).toContain('photo.png');
    expect(fixture.nativeElement.textContent).toContain('large.png: File exceeds the maximum size.');

    const second = file('diagram.pdf', 256, 'application/pdf');
    const third = file('extra.pdf', 256, 'application/pdf');
    setInputFiles(input, [second, third]);
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.validationEvent()?.[0]?.reason).toBe('limit');
    expect(fixture.nativeElement.textContent).toContain('diagram.pdf');
    expect(fixture.nativeElement.textContent).toContain('extra.pdf: Too many files selected.');
  });

  it('supports remove, clear, and default upload completion', () => {
    const fixture = TestBed.createComponent(FileUploadHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    const selected = file('photo.png', 128, 'image/png');
    setInputFiles(input, [selected]);
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const uploadButton = [...fixture.nativeElement.querySelectorAll('button')]
      .find((button: HTMLButtonElement) => button.textContent?.includes('Upload')) as HTMLButtonElement;
    uploadButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-status="uploaded"]')).toBeTruthy();

    const removeButton = fixture.nativeElement.querySelector('.aeris-file-upload__remove') as HTMLButtonElement;
    removeButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.removedCount()).toBe(1);
    expect(fixture.nativeElement.textContent).not.toContain('photo.png');

    setInputFiles(input, [selected]);
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const clearButton = [...fixture.nativeElement.querySelectorAll('button')]
      .find((button: HTMLButtonElement) => button.textContent?.includes('Clear')) as HTMLButtonElement;
    clearButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clearedCount()).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('No files selected.');
  });

  it('accepts files from drag and drop', () => {
    const fixture = TestBed.createComponent(FileUploadHost);
    fixture.detectChanges();

    const dropzone = fixture.nativeElement.querySelector('.aeris-file-upload__dropzone') as HTMLButtonElement;
    const dropped = file('drop.pdf', 100, 'application/pdf');
    dropzone.dispatchEvent(dropEvent([dropped]));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedEvent()?.acceptedFiles).toEqual([dropped]);
    expect(fixture.nativeElement.textContent).toContain('drop.pdf');
  });

  it('supports auto custom upload progress and completion helpers', async () => {
    const fixture = TestBed.createComponent(CustomUploadHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    const selected = file('report.pdf', 100, 'application/pdf');
    setInputFiles(input, [selected]);
    input.dispatchEvent(new Event('change'));
    await Promise.resolve();
    fixture.detectChanges();

    expect(fixture.componentInstance.uploadCount()).toBe(1);
    expect(fixture.nativeElement.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('42');

    fixture.componentInstance.lastEvent()?.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-status="uploaded"]')).toBeTruthy();
  });

  it('renders toolbar, file, and empty templates', () => {
    const fixture = TestBed.createComponent(TemplateUploadHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.custom-choose')?.textContent).toContain('Add 0');
    expect(fixture.nativeElement.querySelector('.custom-empty')?.textContent).toContain('Nothing queued.');

    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    setInputFiles(input, [file('custom.pdf', 100, 'application/pdf')]);
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.custom-file')?.textContent).toContain('custom.pdf');
  });

  it('does not create previews for active or oversized image formats', () => {
    const fixture = TestBed.createComponent(AerisFileUpload);
    fixture.componentRef.setInput('imagePreview', true);
    fixture.componentRef.setInput('maxPreviewFileSize', 8);
    fixture.detectChanges();

    const svg = file('active.svg', 4, 'image/svg+xml');
    const oversizedPng = file('large.png', 16, 'image/png');
    fixture.componentInstance.files.set([svg, oversizedPng]);
    fixture.detectChanges();

    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.aeris-file-upload__preview')).toBeNull();
  });

  it('exposes public methods for controlled usage', () => {
    const fixture = TestBed.createComponent(FileUploadHost);
    fixture.detectChanges();

    const component = fixture.debugElement.children[0].componentInstance as AerisFileUpload;
    const selected = file('manual.pdf', 100, 'application/pdf');

    component.files.set([selected]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('manual.pdf');

    component.setProgress(selected, 55);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('55');

    component.markError([selected], 'Network error.');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Network error.');

    component.clear();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No files selected.');
  });
});
