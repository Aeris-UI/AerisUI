import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisFileUploadModule,
  type AerisFileUploadEvent,
  type AerisFileUploadRejectedFile,
  type AerisFileUploadSelectEvent,
} from '@aeris-ui/core/file-upload';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-file-upload-page',
  imports: [
    AerisButton,
    AerisFileUploadModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './file-upload.page.html',
  styleUrl: './file-upload.page.scss',
})
export class FileUploadPage {
  protected readonly selectedSummary = signal('No selection yet.');
  protected readonly validationSummary = signal('No validation errors.');
  protected readonly uploadSummary = signal('Waiting for upload.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'file-upload-basic', label: 'Basic' },
    { id: 'file-upload-auto', label: 'Auto' },
    { id: 'file-upload-advanced', label: 'Advanced' },
    { id: 'file-upload-validation', label: 'Validation' },
    { id: 'file-upload-custom', label: 'Custom upload' },
    { id: 'file-upload-preview', label: 'Image preview' },
    { id: 'file-upload-template', label: 'Templates' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'file-upload-api-inputs', label: 'Inputs' },
    { id: 'file-upload-api-models', label: 'Models' },
    { id: 'file-upload-api-outputs', label: 'Outputs' },
    { id: 'file-upload-api-templates', label: 'Templates' },
    { id: 'file-upload-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisFileUploadModule } from '@aeris-ui/core/file-upload';`;

  protected readonly sharedCssCode = `.demo-status {
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}`;

  protected readonly templateCssCode = `.upload-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}

.upload-file strong {
  display: block;
  color: var(--text);
}

.upload-file span {
  color: var(--text-3);
  font-size: 0.8125rem;
}

.upload-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}`;

  protected readonly selectTsCode = `import { signal } from '@angular/core';
import { type AerisFileUploadSelectEvent } from '@aeris-ui/core/file-upload';

protected readonly selectedSummary = signal('No selection yet.');

protected recordSelection(event: AerisFileUploadSelectEvent): void {
  this.selectedSummary.set(
    \`\${event.acceptedFiles.length} accepted, \${event.rejectedFiles.length} rejected.\`,
  );
}`;

  protected readonly validationTsCode = `import { signal } from '@angular/core';
import { type AerisFileUploadRejectedFile } from '@aeris-ui/core/file-upload';

protected readonly validationSummary = signal('No validation errors.');

protected recordValidation(rejections: readonly AerisFileUploadRejectedFile[]): void {
  this.validationSummary.set(
    rejections.length === 0
      ? 'No validation errors.'
      : rejections.map((item) => item.message).join(' '),
  );
}`;

  protected readonly customUploadTsCode = `import { signal } from '@angular/core';
import { type AerisFileUploadEvent } from '@aeris-ui/core/file-upload';

protected readonly uploadSummary = signal('Waiting for upload.');

protected uploadFiles(event: AerisFileUploadEvent): void {
  const file = event.files[0];
  if (!file) return;

  this.uploadSummary.set(\`Uploading \${file.name}...\`);
  let progress = 0;
  const timer = globalThis.setInterval(() => {
    progress += 20;
    event.setProgress(file, progress);
    if (progress < 100) return;

    globalThis.clearInterval(timer);
    event.complete([file]);
    this.uploadSummary.set(\`\${file.name} uploaded.\`);
  }, 250);
}`;

  protected readonly interfacesCode = `type AerisFileUploadMode = 'basic' | 'advanced';
type AerisFileUploadStatus = 'ready' | 'uploading' | 'uploaded' | 'error';
type AerisFileUploadValidationReason = 'type' | 'size-min' | 'size-max' | 'limit';
type AerisFileUploadClearReason = 'api' | 'clear-button';

interface AerisFileUploadItem {
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

interface AerisFileUploadRejectedFile {
  readonly file: File;
  readonly reason: AerisFileUploadValidationReason;
  readonly message: string;
}

interface AerisFileUploadSelectEvent {
  readonly originalEvent: Event | null;
  readonly files: readonly File[];
  readonly acceptedFiles: readonly File[];
  readonly rejectedFiles: readonly AerisFileUploadRejectedFile[];
}

interface AerisFileUploadEvent {
  readonly originalEvent: Event | null;
  readonly files: readonly File[];
  readonly items: readonly AerisFileUploadItem[];
  readonly setProgress: (file: File, progress: number) => void;
  readonly complete: (files?: readonly File[]) => void;
  readonly error: (message?: string, files?: readonly File[]) => void;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'mode', type: 'AerisFileUploadMode', defaultValue: "'advanced'", description: 'Renders compact basic controls or the full queue surface.' },
    { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allows selecting more than one file.' },
    { name: 'accept', type: 'string', defaultValue: "''", description: 'Native accept filter and validation rule.' },
    { name: 'minFileSize', type: 'number', defaultValue: '0', description: 'Minimum file size in bytes. Zero disables the rule.' },
    { name: 'maxFileSize', type: 'number', defaultValue: '0', description: 'Maximum file size in bytes. Zero disables the rule.' },
    { name: 'maxPreviewFileSize', type: 'number', defaultValue: '10485760', description: 'Maximum size for a generated raster image preview. Zero disables the preview size limit.' },
    { name: 'maxFiles', type: 'number', defaultValue: '0', description: 'Maximum selected file count. Zero disables the rule.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables selection, drop, upload, remove, and clear controls.' },
    { name: 'autoUpload', type: 'boolean', defaultValue: 'false', description: 'Calls upload after accepted files are selected.' },
    { name: 'customUpload', type: 'boolean', defaultValue: 'false', description: 'When true, the upload event handler controls progress, completion, and errors.' },
    { name: 'dragDrop', type: 'boolean', defaultValue: 'true', description: 'Enables the dropzone button and drag/drop handlers.' },
    { name: 'imagePreview', type: 'boolean', defaultValue: 'false', description: 'Creates object URL thumbnails for allowlisted raster image formats. Active formats such as SVG are not previewed.' },
    { name: 'showFileList', type: 'boolean', defaultValue: 'true', description: 'Shows the selected file queue.' },
    { name: 'showProgress', type: 'boolean', defaultValue: 'true', description: 'Shows progress bars for uploading files.' },
    { name: 'showSize', type: 'boolean', defaultValue: 'true', description: 'Shows formatted file sizes.' },
    { name: 'showUploadButton', type: 'boolean', defaultValue: 'true', description: 'Shows the default upload action.' },
    { name: 'showClearButton', type: 'boolean', defaultValue: 'true', description: 'Shows the default clear action.' },
    { name: 'chooseLabel', type: 'string', defaultValue: "'Choose'", description: 'Choose button text.' },
    { name: 'uploadLabel', type: 'string', defaultValue: "'Upload'", description: 'Upload button text.' },
    { name: 'clearLabel', type: 'string', defaultValue: "'Clear'", description: 'Clear button text.' },
    { name: 'dropLabel', type: 'string', defaultValue: "'Drop files or click to browse'", description: 'Dropzone title.' },
    { name: 'emptyLabel', type: 'string', defaultValue: "'No files selected.'", description: 'Default empty queue text.' },
    { name: 'helperText', type: 'string', defaultValue: "''", description: 'Dropzone helper text. Defaults to derived validation guidance.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Native file input name attribute.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated id', description: 'Native file input id.' },
    { name: 'inputAriaLabel', type: 'string', defaultValue: "'Choose files'", description: 'Accessible name for the native file input.' },
    { name: 'fileListAriaLabel', type: 'string', defaultValue: "'Selected files'", description: 'Accessible name for the selected file list.' },
    { name: 'removeAriaLabel', type: 'string', defaultValue: "'Remove file'", description: 'Prefix for remove button labels.' },
    { name: 'invalidFileTypeMessage', type: 'string', defaultValue: "'File type is not allowed.'", description: 'Validation message for type mismatch.' },
    { name: 'invalidMinFileSizeMessage', type: 'string', defaultValue: "'File is smaller than the minimum size.'", description: 'Validation message for files below minFileSize.' },
    { name: 'invalidMaxFileSizeMessage', type: 'string', defaultValue: "'File exceeds the maximum size.'", description: 'Validation message for files above maxFileSize.' },
    { name: 'invalidFileLimitMessage', type: 'string', defaultValue: "'Too many files selected.'", description: 'Validation message for maxFiles overflow.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'files', type: 'readonly File[]', defaultValue: '[]', description: 'Controlled selected files model.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'filesChange', type: 'readonly File[]', defaultValue: '-', description: 'Emitted by the files model.' },
    { name: 'selected', type: 'AerisFileUploadSelectEvent', defaultValue: '-', description: 'Emitted after file selection or drop.' },
    { name: 'removed', type: 'AerisFileUploadRemoveEvent', defaultValue: '-', description: 'Emitted after a file is removed.' },
    { name: 'cleared', type: 'AerisFileUploadClearEvent', defaultValue: '-', description: 'Emitted after the queue is cleared.' },
    { name: 'uploadRequested', type: 'AerisFileUploadEvent', defaultValue: '-', description: 'Emitted when upload is requested.' },
    { name: 'validationFailed', type: 'readonly AerisFileUploadRejectedFile[]', defaultValue: '-', description: 'Emitted when selected files fail validation.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisFileUploadToolbar', type: 'AerisFileUploadTemplateContext', defaultValue: 'default toolbar', description: 'Custom toolbar content.' },
    { name: 'aerisFileUploadContent', type: 'AerisFileUploadTemplateContext', defaultValue: 'dropzone and file list', description: 'Replaces the default content region.' },
    { name: 'aerisFileUploadFile', type: 'AerisFileUploadFileTemplateContext', defaultValue: 'default file row', description: 'Custom selected file row.' },
    { name: 'aerisFileUploadEmpty', type: 'AerisFileUploadTemplateContext', defaultValue: 'emptyLabel', description: 'Custom empty queue content.' },
    { name: 'aerisFileUploadChooseIcon', type: 'AerisFileUploadTemplateContext', defaultValue: 'built-in choose icon', description: 'Custom decorative choose icon.' },
    { name: 'aerisFileUploadUploadIcon', type: 'AerisFileUploadTemplateContext', defaultValue: 'built-in upload icon', description: 'Custom decorative upload icon.' },
    { name: 'aerisFileUploadClearIcon', type: 'AerisFileUploadTemplateContext', defaultValue: 'built-in clear icon', description: 'Custom decorative clear icon.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'choose(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Opens the native file picker.' },
    { name: 'upload(event?)', type: '(Event | null) => void', defaultValue: '-', description: 'Requests upload for ready files.' },
    { name: 'clear(event?, reason?)', type: '(Event | null, AerisFileUploadClearReason) => void', defaultValue: "reason: 'api'", description: 'Clears the queue.' },
    { name: 'remove(file, event?)', type: '(File, Event | null) => void', defaultValue: '-', description: 'Removes one selected file.' },
    { name: 'setProgress(file, progress)', type: '(File, number) => void', defaultValue: '-', description: 'Marks a file as uploading and updates progress.' },
    { name: 'markUploaded(files?)', type: '(readonly File[]) => void', defaultValue: 'all files', description: 'Marks files as uploaded.' },
    { name: 'markError(files?, message?)', type: '(readonly File[], string) => void', defaultValue: 'all files', description: 'Marks files as failed with an error message.' },
  ];

  protected recordSelection(event: AerisFileUploadSelectEvent): void {
    this.selectedSummary.set(
      `${event.acceptedFiles.length} accepted, ${event.rejectedFiles.length} rejected.`,
    );
  }

  protected recordValidation(rejections: readonly AerisFileUploadRejectedFile[]): void {
    this.validationSummary.set(
      rejections.length === 0
        ? 'No validation errors.'
        : rejections.map((item) => item.message).join(' '),
    );
  }

  protected uploadFiles(event: AerisFileUploadEvent): void {
    const file = event.files[0];
    if (!file) return;

    this.uploadSummary.set(`Uploading ${file.name}...`);
    let progress = 0;
    const timer = globalThis.setInterval(() => {
      progress += 20;
      event.setProgress(file, progress);
      if (progress < 100) return;

      globalThis.clearInterval(timer);
      event.complete([file]);
      this.uploadSummary.set(`${file.name} uploaded.`);
    }, 250);
  }
}
