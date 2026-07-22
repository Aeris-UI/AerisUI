# FileUpload

> Accessible file queue with drag-and-drop, validation, templates, previews, and event-driven upload progress.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/file-upload`
- Human-readable documentation: [https://aeris-ui.dev/components/file-upload](https://aeris-ui.dev/components/file-upload)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisFileUploadModule } from '@aeris-ui/core/file-upload';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `AerisFileUploadMode` | `'advanced'` | Renders compact basic controls or the full queue surface. |
| `multiple` | `boolean` | `false` | Allows selecting more than one file. |
| `accept` | `string` | `''` | Native accept filter and validation rule. |
| `minFileSize` | `number` | `0` | Minimum file size in bytes. Zero disables the rule. |
| `maxFileSize` | `number` | `0` | Maximum file size in bytes. Zero disables the rule. |
| `maxPreviewFileSize` | `number` | `10485760` | Maximum size for a generated raster image preview. Zero disables the preview size limit. |
| `maxFiles` | `number` | `0` | Maximum selected file count. Zero disables the rule. |
| `disabled` | `boolean` | `false` | Disables selection, drop, upload, remove, and clear controls. |
| `autoUpload` | `boolean` | `false` | Calls upload after accepted files are selected. |
| `customUpload` | `boolean` | `false` | When true, the upload event handler controls progress, completion, and errors. |
| `dragDrop` | `boolean` | `true` | Enables the dropzone button and drag/drop handlers. |
| `imagePreview` | `boolean` | `false` | Creates object URL thumbnails for allowlisted raster image formats. Active formats such as SVG are not previewed. |
| `showFileList` | `boolean` | `true` | Shows the selected file queue. |
| `showProgress` | `boolean` | `true` | Shows progress bars for uploading files. |
| `showSize` | `boolean` | `true` | Shows formatted file sizes. |
| `showUploadButton` | `boolean` | `true` | Shows the default upload action. |
| `showClearButton` | `boolean` | `true` | Shows the default clear action. |
| `chooseLabel` | `string` | `'Choose'` | Choose button text. |
| `uploadLabel` | `string` | `'Upload'` | Upload button text. |
| `clearLabel` | `string` | `'Clear'` | Clear button text. |
| `dropLabel` | `string` | `'Drop files or click to browse'` | Dropzone title. |
| `emptyLabel` | `string` | `'No files selected.'` | Default empty queue text. |
| `helperText` | `string` | `''` | Dropzone helper text. Defaults to derived validation guidance. |
| `name` | `string` | `''` | Native file input name attribute. |
| `inputId` | `string` | `generated id` | Native file input id. |
| `inputAriaLabel` | `string` | `'Choose files'` | Accessible name for the native file input. |
| `fileListAriaLabel` | `string` | `'Selected files'` | Accessible name for the selected file list. |
| `removeAriaLabel` | `string` | `'Remove file'` | Prefix for remove button labels. |
| `invalidFileTypeMessage` | `string` | `'File type is not allowed.'` | Validation message for type mismatch. |
| `invalidMinFileSizeMessage` | `string` | `'File is smaller than the minimum size.'` | Validation message for files below minFileSize. |
| `invalidMaxFileSizeMessage` | `string` | `'File exceeds the maximum size.'` | Validation message for files above maxFileSize. |
| `invalidFileLimitMessage` | `string` | `'Too many files selected.'` | Validation message for maxFiles overflow. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `files` | `readonly File[]` | `[]` | Controlled selected files model. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `filesChange` | `readonly File[]` | `-` | Emitted by the files model. |
| `selected` | `AerisFileUploadSelectEvent` | `-` | Emitted after file selection or drop. |
| `removed` | `AerisFileUploadRemoveEvent` | `-` | Emitted after a file is removed. |
| `cleared` | `AerisFileUploadClearEvent` | `-` | Emitted after the queue is cleared. |
| `uploadRequested` | `AerisFileUploadEvent` | `-` | Emitted when upload is requested. |
| `validationFailed` | `readonly AerisFileUploadRejectedFile[]` | `-` | Emitted when selected files fail validation. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisFileUploadToolbar` | `AerisFileUploadTemplateContext` | `default toolbar` | Custom toolbar content. |
| `aerisFileUploadContent` | `AerisFileUploadTemplateContext` | `dropzone and file list` | Replaces the default content region. |
| `aerisFileUploadFile` | `AerisFileUploadFileTemplateContext` | `default file row` | Custom selected file row. |
| `aerisFileUploadEmpty` | `AerisFileUploadTemplateContext` | `emptyLabel` | Custom empty queue content. |
| `aerisFileUploadChooseIcon` | `AerisFileUploadTemplateContext` | `built-in choose icon` | Custom decorative choose icon. |
| `aerisFileUploadUploadIcon` | `AerisFileUploadTemplateContext` | `built-in upload icon` | Custom decorative upload icon. |
| `aerisFileUploadClearIcon` | `AerisFileUploadTemplateContext` | `built-in clear icon` | Custom decorative clear icon. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `choose(event?)` | `(Event &#124; null) =&gt; void` | `-` | Opens the native file picker. |
| `upload(event?)` | `(Event &#124; null) =&gt; void` | `-` | Requests upload for ready files. |
| `clear(event?, reason?)` | `(Event &#124; null, AerisFileUploadClearReason) =&gt; void` | `reason: 'api'` | Clears the queue. |
| `remove(file, event?)` | `(File, Event &#124; null) =&gt; void` | `-` | Removes one selected file. |
| `setProgress(file, progress)` | `(File, number) =&gt; void` | `-` | Marks a file as uploading and updates progress. |
| `markUploaded(files?)` | `(readonly File[]) =&gt; void` | `all files` | Marks files as uploaded. |
| `markError(files?, message?)` | `(readonly File[], string) =&gt; void` | `all files` | Marks files as failed with an error message. |

## Interfaces and types

### Interfaces

```ts
type AerisFileUploadMode = 'basic' | 'advanced';
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
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-file-upload-background` | `CSS custom property` | `var(--aeris-surface)` | Uploader surface. |
| `--aeris-file-upload-text` | `CSS custom property` | `var(--aeris-text)` | Primary text. |
| `--aeris-file-upload-muted-text` | `CSS custom property` | `var(--aeris-text-3)` | Secondary text. |
| `--aeris-file-upload-border` | `CSS custom property` | `var(--aeris-border)` | Surface and file borders. |
| `--aeris-file-upload-radius` | `CSS custom property` | `var(--aeris-radius-lg)` | Surface radius. |
| `--aeris-file-upload-shadow` | `CSS custom property` | `component shadow` | Surface elevation. |
| `--aeris-file-upload-toolbar-padding` | `CSS custom property` | `0.875rem` | Toolbar padding. |
| `--aeris-file-upload-dropzone-min-height` | `CSS custom property` | `10rem` | Dropzone minimum height. |
| `--aeris-file-upload-primary-background` | `CSS custom property` | `var(--aeris-primary)` | Primary choose button background. |
| `--aeris-file-upload-progress-background` | `CSS custom property` | `var(--aeris-primary)` | Progress fill. |
| `--aeris-file-upload-focus` | `CSS custom property` | `var(--aeris-focus)` | Visible focus ring. |

## Examples

### Basic

Use basic mode when the upload action belongs beside a compact file picker.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisFileUploadModule, type AerisFileUploadSelectEvent } from '@aeris-ui/core/file-upload';

@Component({
  selector: 'app-file-upload-basic-demo',
  imports: [AerisFileUploadModule],
  template: `
    <div>
      <aeris-file-upload
        mode="basic"
        accept=".pdf"
        chooseLabel="Choose PDF"
        (selected)="recordSelection($event)"
      />
      <p class="demo-status" aria-live="polite">{{ selectedSummary() }}</p>
    </div>
  `,
  styles: `
    .demo-status {
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class FileUploadBasicBasicDemo {
  protected readonly selectedSummary = signal('No selection yet.');

  protected recordSelection(event: AerisFileUploadSelectEvent): void {
    this.selectedSummary.set(
      `${event.acceptedFiles.length} accepted, ${event.rejectedFiles.length} rejected.`,
    );
  }
}
```

### Auto

Auto upload requests upload immediately after accepted files are selected.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisFileUploadModule } from '@aeris-ui/core/file-upload';

@Component({
  selector: 'app-file-upload-auto-demo',
  imports: [AerisFileUploadModule],
  template: `
    <div>
      <aeris-file-upload
        mode="basic"
        accept="image/*"
        chooseLabel="Browse image"
        autoUpload
        [showUploadButton]="false"
      />
    </div>
  `,
  styles: `
    .demo-status {
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class FileUploadAutoAutoDemo {
}
```

### Advanced

Advanced mode combines toolbar actions, drag-and-drop, guidance, a queue, and clear controls.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisFileUploadModule } from '@aeris-ui/core/file-upload';

@Component({
  selector: 'app-file-upload-advanced-demo',
  imports: [AerisFileUploadModule],
  template: `
    <div>
      <aeris-file-upload
        multiple
        accept="image/*,.pdf"
        [maxFileSize]="5242880"
        [maxFiles]="5"
        helperText="Images or PDF files up to 5 MB each."
      />
    </div>
  `
})
export class FileUploadAdvancedAdvancedDemo {
}
```

### Validation

Type, size, and count errors are announced and exposed through validationFailed.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisFileUploadModule, type AerisFileUploadRejectedFile } from '@aeris-ui/core/file-upload';

@Component({
  selector: 'app-file-upload-validation-demo',
  imports: [AerisFileUploadModule],
  template: `
    <div>
      <aeris-file-upload
        accept="image/*"
        [maxFileSize]="102400"
        [maxFiles]="2"
        multiple
        helperText="Only images under 100 KB."
        (validationFailed)="recordValidation($event)"
      />
      <p class="demo-status" aria-live="polite">{{ validationSummary() }}</p>
    </div>
  `,
  styles: `
    .demo-status {
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class FileUploadValidationValidationDemo {
  protected readonly validationSummary = signal('No validation errors.');

  protected recordValidation(rejections: readonly AerisFileUploadRejectedFile[]): void {
    this.validationSummary.set(
      rejections.length === 0
        ? 'No validation errors.'
        : rejections.map((item) => item.message).join(' '),
    );
  }
}
```

### Custom upload

Enable customUpload when the application owns transport and progress updates.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisFileUploadModule, type AerisFileUploadEvent } from '@aeris-ui/core/file-upload';

@Component({
  selector: 'app-file-upload-custom-demo',
  imports: [AerisFileUploadModule],
  template: `
    <div>
      <aeris-file-upload
        accept=".pdf"
        customUpload
        autoUpload
        chooseLabel="Upload PDF"
        [showUploadButton]="false"
        (uploadRequested)="uploadFiles($event)"
      />
      <p class="demo-status" aria-live="polite">{{ uploadSummary() }}</p>
    </div>
  `,
  styles: `
    .demo-status {
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class FileUploadCustomCustomUploadDemo {
  protected readonly uploadSummary = signal('Waiting for upload.');

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
```

### Image preview

Enable imagePreview to show thumbnails for queued image files.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisFileUploadModule } from '@aeris-ui/core/file-upload';

@Component({
  selector: 'app-file-upload-preview-demo',
  imports: [AerisFileUploadModule],
  template: `
    <div>
      <aeris-file-upload
        accept="image/*"
        multiple
        imagePreview
        chooseLabel="Add images"
        emptyLabel="No images selected. Choose or drop images to begin."
      />
    </div>
  `
})
export class FileUploadPreviewImagePreviewDemo {
}
```

### Templates

Customize toolbar, file rows, empty content, and icons while keeping queue behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFileUploadModule } from '@aeris-ui/core/file-upload';

@Component({
  selector: 'app-file-upload-template-demo',
  imports: [AerisButton, AerisFileUploadModule],
  templateUrl: './file-upload-template.demo.html',
  styleUrl: './file-upload-template.demo.scss'
})
export class FileUploadTemplateTemplatesDemo {
}
```

#### HTML

```html
<div>
  <aeris-file-upload multiple>
    <ng-template
      aerisFileUploadToolbar
      let-files
      let-choose="choose"
      let-upload="upload"
      let-clear="clear"
    >
      <div class="upload-toolbar">
        <button aerisButton type="button" (click)="choose($event)">Add files</button>
        <button aerisButton type="button" (click)="upload($event)">
          Upload {{ files.length }}
        </button>
        <button aerisButton type="button" (click)="clear($event)">Reset</button>
      </div>
    </ng-template>
    <ng-template aerisFileUploadFile let-file let-remove="remove">
      <article class="upload-file" role="listitem">
        <div>
          <strong>{{ file.name }}</strong>
          <span>{{ file.displaySize }} · {{ file.status }}</span>
        </div>
        <button aerisButton type="button" (click)="remove($event)">Remove</button>
      </article>
    </ng-template>
    <ng-template aerisFileUploadEmpty>
      <p class="demo-status">No files in the custom queue.</p>
    </ng-template>
  </aeris-file-upload>
</div>
```

#### CSS

```css
.demo-status {
  margin: 0.875rem 0 0;
  color: var(--aeris-text-3);
  font-size: 0.8125rem;
}

.upload-file {
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
}
```

## Accessibility

- The component keeps a native input type="file" in the DOM for screen readers and browser file picker behavior.
- Default visible controls are native buttons with visible focus styles.
- The dropzone is a native button, so keyboard users can open the file picker without custom ARIA button behavior.
- Validation errors are rendered in an assertive alert region.
- Upload progress uses role="progressbar" with numeric values while files are uploading.
- accept, size, and count checks improve client-side feedback but are not a security boundary. Validate file signatures, size, names, authorization, and content again on the server before storage or processing.
- Built-in previews allowlist raster image MIME types, exclude SVG, cap preview size at 10 MB by default, and revoke generated object URLs.
- Templates should preserve native buttons or links for custom actions.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus through choose, upload, clear, dropzone, and remove controls. |
| `Shift + Tab` | Moves focus to the previous interactive control. |
| `Enter` | Activates the focused button, including opening the native file picker from choose or dropzone. |
| `Space` | Activates the focused button. |
