import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  DestroyRef,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type AerisFileUploadMode = 'basic' | 'advanced';
export type AerisFileUploadStatus = 'ready' | 'uploading' | 'uploaded' | 'error';
export type AerisFileUploadValidationReason = 'type' | 'size-min' | 'size-max' | 'limit';
export type AerisFileUploadClearReason = 'api' | 'clear-button';

export interface AerisFileUploadItem {
  readonly id: string;
  readonly file: File;
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly displaySize: string;
  readonly status: AerisFileUploadStatus;
  readonly progress: number;
  readonly previewUrl: string;
  readonly error: string;
  readonly image: boolean;
}

export interface AerisFileUploadSelectEvent {
  readonly originalEvent: Event | null;
  readonly files: readonly File[];
  readonly acceptedFiles: readonly File[];
  readonly rejectedFiles: readonly AerisFileUploadRejectedFile[];
}

export interface AerisFileUploadRejectedFile {
  readonly file: File;
  readonly reason: AerisFileUploadValidationReason;
  readonly message: string;
}

export interface AerisFileUploadRemoveEvent {
  readonly originalEvent: Event | null;
  readonly file: File;
  readonly item: AerisFileUploadItem;
}

export interface AerisFileUploadClearEvent {
  readonly originalEvent: Event | null;
  readonly files: readonly File[];
  readonly reason: AerisFileUploadClearReason;
}

export interface AerisFileUploadEvent {
  readonly originalEvent: Event | null;
  readonly files: readonly File[];
  readonly items: readonly AerisFileUploadItem[];
  readonly setProgress: (file: File, progress: number) => void;
  readonly complete: (files?: readonly File[]) => void;
  readonly error: (message?: string, files?: readonly File[]) => void;
}

export interface AerisFileUploadTemplateContext {
  readonly $implicit: readonly AerisFileUploadItem[];
  readonly files: readonly AerisFileUploadItem[];
  readonly component: AerisFileUpload;
  readonly choose: (event?: Event) => void;
  readonly upload: (event?: Event) => void;
  readonly clear: (event?: Event) => void;
}

export interface AerisFileUploadFileTemplateContext {
  readonly $implicit: AerisFileUploadItem;
  readonly file: AerisFileUploadItem;
  readonly component: AerisFileUpload;
  readonly remove: (event?: Event) => void;
}

@Directive({ selector: 'ng-template[aerisFileUploadToolbar]' })
export class AerisFileUploadToolbarTemplate {
  readonly template = inject<TemplateRef<AerisFileUploadTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisFileUploadContent]' })
export class AerisFileUploadContentTemplate {
  readonly template = inject<TemplateRef<AerisFileUploadTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisFileUploadFile]' })
export class AerisFileUploadFileTemplate {
  readonly template = inject<TemplateRef<AerisFileUploadFileTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisFileUploadEmpty]' })
export class AerisFileUploadEmptyTemplate {
  readonly template = inject<TemplateRef<AerisFileUploadTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisFileUploadChooseIcon]' })
export class AerisFileUploadChooseIconTemplate {
  readonly template = inject<TemplateRef<AerisFileUploadTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisFileUploadUploadIcon]' })
export class AerisFileUploadUploadIconTemplate {
  readonly template = inject<TemplateRef<AerisFileUploadTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisFileUploadClearIcon]' })
export class AerisFileUploadClearIconTemplate {
  readonly template = inject<TemplateRef<AerisFileUploadTemplateContext>>(TemplateRef);
}

interface AerisFileUploadItemState extends AerisFileUploadItem {
  readonly objectUrlCreated: boolean;
}

const SAFE_IMAGE_PREVIEW_TYPES = new Set([
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/vnd.microsoft.icon',
  'image/webp',
  'image/x-icon',
]);
const DEFAULT_MAX_PREVIEW_FILE_SIZE = 10 * 1024 * 1024;

let nextFileUploadId = 0;

@Component({
  selector: 'aeris-file-upload',
  imports: [NgTemplateOutlet],
  template: `
    <input
      #fileInput
      class="aeris-file-upload__input"
      type="file"
      [id]="inputId()"
      [attr.name]="name() || null"
      [attr.accept]="accept() || null"
      [attr.multiple]="multiple() ? '' : null"
      [disabled]="disabled()"
      [attr.aria-label]="inputAriaLabel()"
      (change)="handleFileInput($event)"
    />

    @if (mode() === 'basic') {
      <div class="aeris-file-upload__basic">
        <button
          type="button"
          class="aeris-file-upload__button aeris-file-upload__button--primary"
          [disabled]="disabled()"
          (click)="choose($event)"
        >
          <span class="aeris-file-upload__button-icon" aria-hidden="true">
            @if (chooseIconTemplate(); as icon) {
              <ng-container
                [ngTemplateOutlet]="icon.template"
                [ngTemplateOutletContext]="templateContext()"
              />
            } @else {
              <span class="aeris-file-upload__icon aeris-file-upload__icon--choose"></span>
            }
          </span>
          {{ chooseLabel() }}
        </button>
        <span class="aeris-file-upload__summary" aria-live="polite">{{ summaryText() }}</span>
        @if (showUploadButton()) {
          <button
            type="button"
            class="aeris-file-upload__button"
            [disabled]="!canUpload()"
            (click)="upload($event)"
          >
            {{ uploadLabel() }}
          </button>
        }
      </div>
    } @else {
      <section
        class="aeris-file-upload__surface"
        [attr.aria-labelledby]="labelId()"
        [attr.aria-describedby]="descriptionIds()"
      >
        <div class="aeris-file-upload__toolbar">
          @if (toolbarTemplate(); as toolbar) {
            <ng-container
              [ngTemplateOutlet]="toolbar.template"
              [ngTemplateOutletContext]="templateContext()"
            />
          } @else {
            <div class="aeris-file-upload__actions">
              <button
                type="button"
                class="aeris-file-upload__button aeris-file-upload__button--primary"
                [disabled]="disabled()"
                (click)="choose($event)"
              >
                <span class="aeris-file-upload__button-icon" aria-hidden="true">
                  @if (chooseIconTemplate(); as icon) {
                    <ng-container
                      [ngTemplateOutlet]="icon.template"
                      [ngTemplateOutletContext]="templateContext()"
                    />
                  } @else {
                    <span class="aeris-file-upload__icon aeris-file-upload__icon--choose"></span>
                  }
                </span>
                {{ chooseLabel() }}
              </button>

              @if (showUploadButton()) {
                <button
                  type="button"
                  class="aeris-file-upload__button"
                  [disabled]="!canUpload()"
                  (click)="upload($event)"
                >
                  <span class="aeris-file-upload__button-icon" aria-hidden="true">
                    @if (uploadIconTemplate(); as icon) {
                      <ng-container
                        [ngTemplateOutlet]="icon.template"
                        [ngTemplateOutletContext]="templateContext()"
                      />
                    } @else {
                      <span class="aeris-file-upload__icon aeris-file-upload__icon--upload"></span>
                    }
                  </span>
                  {{ uploadLabel() }}
                </button>
              }

              @if (showClearButton()) {
                <button
                  type="button"
                  class="aeris-file-upload__button"
                  [disabled]="!canClear()"
                  (click)="clear($event, 'clear-button')"
                >
                  <span class="aeris-file-upload__button-icon" aria-hidden="true">
                    @if (clearIconTemplate(); as icon) {
                      <ng-container
                        [ngTemplateOutlet]="icon.template"
                        [ngTemplateOutletContext]="templateContext()"
                      />
                    } @else {
                      <span class="aeris-file-upload__icon aeris-file-upload__icon--clear"></span>
                    }
                  </span>
                  {{ clearLabel() }}
                </button>
              }
            </div>
          }
          <span class="aeris-file-upload__summary" aria-live="polite">{{ summaryText() }}</span>
        </div>

        @if (contentTemplate(); as content) {
          <div class="aeris-file-upload__content">
            <ng-container
              [ngTemplateOutlet]="content.template"
              [ngTemplateOutletContext]="templateContext()"
            />
          </div>
        } @else {
          <button
            type="button"
            class="aeris-file-upload__dropzone"
            [disabled]="disabled() || !dragDrop()"
            [attr.data-active]="dragActive() || null"
            [attr.data-reject]="dragRejected() || null"
            (click)="choose($event)"
            (dragenter)="handleDragEnter($event)"
            (dragover)="handleDragOver($event)"
            (dragleave)="handleDragLeave($event)"
            (drop)="handleDrop($event)"
          >
            <span class="aeris-file-upload__drop-icon" aria-hidden="true"></span>
            <span [id]="labelId()" class="aeris-file-upload__drop-title">{{ dropLabel() }}</span>
            <span [id]="helpId()" class="aeris-file-upload__drop-help">{{ resolvedHelpText() }}</span>
          </button>

          @if (showFileList()) {
            <div class="aeris-file-upload__list" role="list" [attr.aria-label]="fileListAriaLabel()">
              @for (item of items(); track item.id) {
                @if (fileTemplate(); as fileTemplateRef) {
                  <ng-container
                    [ngTemplateOutlet]="fileTemplateRef.template"
                    [ngTemplateOutletContext]="fileContexts()[item.id]"
                  />
                } @else {
                  <article class="aeris-file-upload__file" role="listitem" [attr.data-status]="item.status">
                    @if (imagePreview() && item.image && item.previewUrl) {
                      <img class="aeris-file-upload__preview" [src]="item.previewUrl" [alt]="'Preview of ' + item.name" />
                    } @else {
                      <span class="aeris-file-upload__file-icon" aria-hidden="true"></span>
                    }

                    <div class="aeris-file-upload__file-body">
                      <div class="aeris-file-upload__file-heading">
                        <span class="aeris-file-upload__file-name">{{ item.name }}</span>
                        @if (showSize()) {
                          <span class="aeris-file-upload__file-size">{{ item.displaySize }}</span>
                        }
                      </div>
                      @if (item.error) {
                        <p class="aeris-file-upload__file-error">{{ item.error }}</p>
                      }
                      @if (showProgress() && item.status === 'uploading') {
                        <div
                          class="aeris-file-upload__progress"
                          role="progressbar"
                          [attr.aria-label]="'Upload progress for ' + item.name"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          [attr.aria-valuenow]="item.progress"
                        >
                          <span [style.width.%]="item.progress"></span>
                        </div>
                      }
                    </div>

                    <button
                      type="button"
                      class="aeris-file-upload__remove"
                      [attr.aria-label]="removeAriaLabel() + ' ' + item.name"
                      [disabled]="disabled() || item.status === 'uploading'"
                      (click)="remove(item.file, $event)"
                    >
                      <span aria-hidden="true"></span>
                    </button>
                  </article>
                }
              } @empty {
                <div class="aeris-file-upload__empty">
                  @if (emptyTemplate(); as emptyTemplateRef) {
                    <ng-container
                      [ngTemplateOutlet]="emptyTemplateRef.template"
                      [ngTemplateOutletContext]="templateContext()"
                    />
                  } @else {
                    {{ emptyLabel() }}
                  }
                </div>
              }
            </div>
          }
        }

        @if (rejections().length > 0) {
          <div class="aeris-file-upload__errors" role="alert" aria-live="assertive">
            @for (rejection of rejections(); track rejection.file.name + rejection.reason) {
              <p>{{ rejection.message }}</p>
            }
          </div>
        }
      </section>
    }
  `,
  styleUrl: './aeris-file-upload.scss',
  host: {
    class: 'aeris-file-upload',
    '[attr.data-mode]': 'mode()',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-drag-active]': 'dragActive() || null',
  },
})
export class AerisFileUpload {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private readonly destroyRef = inject(DestroyRef);
  protected readonly toolbarTemplate = contentChild(AerisFileUploadToolbarTemplate);
  protected readonly contentTemplate = contentChild(AerisFileUploadContentTemplate);
  protected readonly fileTemplate = contentChild(AerisFileUploadFileTemplate);
  protected readonly emptyTemplate = contentChild(AerisFileUploadEmptyTemplate);
  protected readonly chooseIconTemplate = contentChild(AerisFileUploadChooseIconTemplate);
  protected readonly uploadIconTemplate = contentChild(AerisFileUploadUploadIconTemplate);
  protected readonly clearIconTemplate = contentChild(AerisFileUploadClearIconTemplate);
  private readonly generatedId = `aeris-file-upload-${++nextFileUploadId}`;
  private dragDepth = 0;

  protected readonly items = signal<readonly AerisFileUploadItemState[]>([]);
  protected readonly rejections = signal<readonly AerisFileUploadRejectedFile[]>([]);
  protected readonly dragActive = signal(false);
  protected readonly dragRejected = signal(false);

  readonly files = model<readonly File[]>([]);
  readonly mode = input<AerisFileUploadMode>('advanced');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly accept = input('');
  readonly minFileSize = input(0, { transform: numberAttribute });
  readonly maxFileSize = input(0, { transform: numberAttribute });
  readonly maxPreviewFileSize = input(DEFAULT_MAX_PREVIEW_FILE_SIZE, {
    transform: numberAttribute,
  });
  readonly maxFiles = input(0, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly autoUpload = input(false, { transform: booleanAttribute });
  readonly customUpload = input(false, { transform: booleanAttribute });
  readonly dragDrop = input(true, { transform: booleanAttribute });
  readonly imagePreview = input(false, { transform: booleanAttribute });
  readonly showFileList = input(true, { transform: booleanAttribute });
  readonly showProgress = input(true, { transform: booleanAttribute });
  readonly showSize = input(true, { transform: booleanAttribute });
  readonly showUploadButton = input(true, { transform: booleanAttribute });
  readonly showClearButton = input(true, { transform: booleanAttribute });
  readonly chooseLabel = input('Choose');
  readonly uploadLabel = input('Upload');
  readonly clearLabel = input('Clear');
  readonly dropLabel = input('Drop files or click to browse');
  readonly emptyLabel = input('No files selected.');
  readonly helperText = input('');
  readonly name = input('');
  readonly inputId = input(`${this.generatedId}-input`);
  readonly inputAriaLabel = input('Choose files');
  readonly fileListAriaLabel = input('Selected files');
  readonly removeAriaLabel = input('Remove file');
  readonly invalidFileTypeMessage = input('File type is not allowed.');
  readonly invalidMinFileSizeMessage = input('File is smaller than the minimum size.');
  readonly invalidMaxFileSizeMessage = input('File exceeds the maximum size.');
  readonly invalidFileLimitMessage = input('Too many files selected.');

  readonly selected = output<AerisFileUploadSelectEvent>();
  readonly removed = output<AerisFileUploadRemoveEvent>();
  readonly cleared = output<AerisFileUploadClearEvent>();
  readonly uploadRequested = output<AerisFileUploadEvent>();
  readonly validationFailed = output<readonly AerisFileUploadRejectedFile[]>();

  protected readonly labelId = computed(() => `${this.generatedId}-label`);
  protected readonly helpId = computed(() => `${this.generatedId}-help`);
  protected readonly descriptionIds = computed(() => this.resolvedHelpText() ? this.helpId() : null);
  protected readonly canClear = computed(() => !this.disabled() && this.items().length > 0);
  protected readonly canUpload = computed(() =>
    !this.disabled() && this.items().some((item) => item.status === 'ready'),
  );
  protected readonly summaryText = computed(() => {
    const count = this.items().length;
    if (count === 0) return 'No file chosen';
    if (count === 1) return this.items()[0]?.name ?? '1 file selected';
    return `${count} files selected`;
  });
  protected readonly resolvedHelpText = computed(() => {
    const custom = this.helperText();
    if (custom) return custom;

    const parts: string[] = [];
    if (this.accept()) parts.push(`Accepted: ${this.accept()}`);
    if (this.maxFileSize() > 0) parts.push(`Up to ${this.formatSize(this.maxFileSize())} each`);
    if (this.maxFiles() > 0) parts.push(`Maximum ${this.maxFiles()} files`);
    return parts.join(' · ') || 'Use the choose button or drop files here.';
  });
  protected readonly templateContext = computed<AerisFileUploadTemplateContext>(() => ({
    $implicit: this.items(),
    files: this.items(),
    component: this,
    choose: (event?: Event) => this.choose(event ?? null),
    upload: (event?: Event) => this.upload(event ?? null),
    clear: (event?: Event) => this.clear(event ?? null),
  }));
  protected readonly fileContexts = computed(() => {
    const contexts: Record<string, AerisFileUploadFileTemplateContext> = {};
    for (const item of this.items()) {
      contexts[item.id] = {
        $implicit: item,
        file: item,
        component: this,
        remove: (event?: Event) => this.remove(item.file, event ?? null),
      };
    }
    return contexts;
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.revokeItems(this.items()));

    effect(() => {
      const nextFiles = this.files();
      this.items.update((current) => this.reconcileItems(current, nextFiles));
    });

    effect(() => {
      if (!this.disabled()) return;
      this.dragActive.set(false);
      this.dragRejected.set(false);
      this.dragDepth = 0;
    });
  }

  choose(originalEvent: Event | null = null): void {
    if (this.disabled()) return;
    originalEvent?.preventDefault();
    const input = this.fileInput()?.nativeElement;
    if (!input) return;
    input.value = '';
    input.click();
  }

  upload(originalEvent: Event | null = null): void {
    if (!this.canUpload()) return;

    const uploadItems = this.items().filter((item) => item.status === 'ready');
    const uploadFiles = uploadItems.map((item) => item.file);
    this.updateItems(uploadFiles, { status: 'uploading', progress: 0, error: '' });

    const event: AerisFileUploadEvent = {
      originalEvent,
      files: uploadFiles,
      items: uploadItems,
      setProgress: (file, progress) => this.setProgress(file, progress),
      complete: (files = uploadFiles) => this.markUploaded(files),
      error: (message = 'Upload failed.', files = uploadFiles) => this.markError(files, message),
    };
    this.uploadRequested.emit(event);

    if (!this.customUpload()) {
      this.markUploaded(uploadFiles);
    }
  }

  clear(
    originalEvent: Event | null = null,
    reason: AerisFileUploadClearReason = 'api',
  ): void {
    const current = this.items();
    if (current.length === 0) return;

    this.revokeItems(current);
    this.items.set([]);
    this.files.set([]);
    this.rejections.set([]);
    this.resetInput();
    this.cleared.emit({ originalEvent, files: current.map((item) => item.file), reason });
  }

  remove(file: File, originalEvent: Event | null = null): void {
    const item = this.items().find((candidate) => candidate.file === file);
    if (!item) return;

    this.revokeItems([item]);
    this.items.update((items) => items.filter((candidate) => candidate.file !== file));
    this.files.update((files) => files.filter((candidate) => candidate !== file));
    this.removed.emit({ originalEvent, file, item });
  }

  setProgress(file: File, progress: number): void {
    this.updateItems([file], {
      status: 'uploading',
      progress: this.clampProgress(progress),
      error: '',
    });
  }

  markUploaded(files: readonly File[] = this.files()): void {
    this.updateItems(files, { status: 'uploaded', progress: 100, error: '' });
  }

  markError(files: readonly File[] = this.files(), message = 'Upload failed.'): void {
    this.updateItems(files, { status: 'error', error: message });
  }

  protected handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.addFiles(input?.files, event);
  }

  protected handleDragEnter(event: DragEvent): void {
    if (!this.canReceiveDrop()) return;
    event.preventDefault();
    this.dragDepth += 1;
    this.dragActive.set(true);
    this.dragRejected.set(!this.hasAllowedDragItems(event.dataTransfer));
  }

  protected handleDragOver(event: DragEvent): void {
    if (!this.canReceiveDrop()) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    this.dragActive.set(true);
    this.dragRejected.set(!this.hasAllowedDragItems(event.dataTransfer));
  }

  protected handleDragLeave(event: DragEvent): void {
    if (!this.canReceiveDrop()) return;
    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth > 0) return;
    this.dragActive.set(false);
    this.dragRejected.set(false);
  }

  protected handleDrop(event: DragEvent): void {
    if (!this.canReceiveDrop()) return;
    event.preventDefault();
    this.dragDepth = 0;
    this.dragActive.set(false);
    this.dragRejected.set(false);
    this.addFiles(event.dataTransfer?.files, event);
  }

  private canReceiveDrop(): boolean {
    return !this.disabled() && this.dragDrop();
  }

  private addFiles(fileList: FileList | readonly File[] | null | undefined, originalEvent: Event): void {
    if (this.disabled() || !fileList) return;

    const incoming = Array.from(fileList);
    const accepted: File[] = [];
    const rejected: AerisFileUploadRejectedFile[] = [];
    const existingCount = this.multiple() ? this.files().length : 0;
    const maxFiles = this.maxFiles();

    for (const file of incoming) {
      const rejection = this.validateFile(file, existingCount + accepted.length, maxFiles);
      if (rejection) {
        rejected.push(rejection);
      } else {
        accepted.push(file);
      }
    }

    const nextAccepted = this.multiple() ? accepted : accepted.slice(0, 1);
    const nextFiles = this.multiple() ? [...this.files(), ...nextAccepted] : nextAccepted;
    this.files.set(nextFiles);
    this.items.update((current) => this.reconcileItems(current, nextFiles));
    this.rejections.set(rejected);
    this.selected.emit({
      originalEvent,
      files: incoming,
      acceptedFiles: nextAccepted,
      rejectedFiles: rejected,
    });
    if (rejected.length > 0) this.validationFailed.emit(rejected);
    this.resetInput();

    if (this.autoUpload() && nextAccepted.length > 0) {
      queueMicrotask(() => this.upload(originalEvent));
    }
  }

  private validateFile(
    file: File,
    nextIndex: number,
    maxFiles: number,
  ): AerisFileUploadRejectedFile | null {
    if (maxFiles > 0 && nextIndex >= maxFiles) {
      return this.reject(file, 'limit', this.invalidFileLimitMessage());
    }

    if (!this.acceptsType(file)) {
      return this.reject(file, 'type', this.invalidFileTypeMessage());
    }

    if (this.minFileSize() > 0 && file.size < this.minFileSize()) {
      return this.reject(file, 'size-min', this.invalidMinFileSizeMessage());
    }

    if (this.maxFileSize() > 0 && file.size > this.maxFileSize()) {
      return this.reject(file, 'size-max', this.invalidMaxFileSizeMessage());
    }

    return null;
  }

  private reject(
    file: File,
    reason: AerisFileUploadValidationReason,
    message: string,
  ): AerisFileUploadRejectedFile {
    return { file, reason, message: `${file.name}: ${message}` };
  }

  private acceptsType(file: File): boolean {
    const accept = this.accept()
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    if (accept.length === 0) return true;

    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    return accept.some((entry) => {
      if (entry.startsWith('.')) return name.endsWith(entry);
      if (entry.endsWith('/*')) return type.startsWith(entry.slice(0, -1));
      return type === entry;
    });
  }

  private hasAllowedDragItems(dataTransfer: DataTransfer | null): boolean {
    const items = Array.from(dataTransfer?.items ?? []);
    if (items.length === 0) return true;
    return items.some((item) => item.kind === 'file');
  }

  private reconcileItems(
    current: readonly AerisFileUploadItemState[],
    files: readonly File[],
  ): readonly AerisFileUploadItemState[] {
    const next = files.map((file) => {
      const existing = current.find((item) => item.file === file);
      return existing ?? this.createItem(file);
    });
    this.revokeItems(current.filter((item) => !files.includes(item.file)));
    return next;
  }

  private createItem(file: File): AerisFileUploadItemState {
    const image = this.isSafePreviewImage(file);
    const preview = image && this.imagePreview()
      ? this.createObjectUrl(file)
      : { url: '', created: false };
    return {
      id: `${this.generatedId}-file-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      displaySize: this.formatSize(file.size),
      status: 'ready',
      progress: 0,
      previewUrl: preview.url,
      objectUrlCreated: preview.created,
      error: '',
      image,
    };
  }

  private createObjectUrl(file: File): { readonly url: string; readonly created: boolean } {
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      return { url: '', created: false };
    }
    return { url: URL.createObjectURL(file), created: true };
  }

  private isSafePreviewImage(file: File): boolean {
    if (!SAFE_IMAGE_PREVIEW_TYPES.has(file.type.toLowerCase())) return false;
    const limit = this.maxPreviewFileSize();
    return limit <= 0 || file.size <= limit;
  }

  private revokeItems(items: readonly AerisFileUploadItemState[]): void {
    if (typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') return;
    for (const item of items) {
      if (item.objectUrlCreated && item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }
  }

  private updateItems(
    files: readonly File[],
    patch: Partial<Pick<AerisFileUploadItemState, 'status' | 'progress' | 'error'>>,
  ): void {
    const targets = new Set(files);
    this.items.update((items) =>
      items.map((item) => targets.has(item.file) ? { ...item, ...patch } : item),
    );
  }

  private clampProgress(progress: number): number {
    if (!Number.isFinite(progress)) return 0;
    return Math.min(100, Math.max(0, Math.round(progress)));
  }

  private resetInput(): void {
    const input = this.fileInput()?.nativeElement;
    if (input) input.value = '';
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const kilobytes = bytes / 1024;
    if (kilobytes < 1024) return `${kilobytes.toFixed(kilobytes >= 10 ? 0 : 1)} KB`;
    const megabytes = kilobytes / 1024;
    return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
  }
}

export const AerisFileUploadModule = [
  AerisFileUpload,
  AerisFileUploadToolbarTemplate,
  AerisFileUploadContentTemplate,
  AerisFileUploadFileTemplate,
  AerisFileUploadEmptyTemplate,
  AerisFileUploadChooseIconTemplate,
  AerisFileUploadUploadIconTemplate,
  AerisFileUploadClearIconTemplate,
] as const;
