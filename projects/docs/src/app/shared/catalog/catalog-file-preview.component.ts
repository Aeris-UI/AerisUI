import { Component } from '@angular/core';
import { AerisFileUploadModule } from '@aeris-ui/core/file-upload';
@Component({
  selector: 'app-catalog-file-preview',
  imports: [AerisFileUploadModule],
  template: `<aeris-file-upload
    mode="basic"
    chooseLabel="Choose files"
    helperText="Images, documents, and more."
    [multiple]="true"
    [showUploadButton]="false"
  />`,
  styleUrl: './catalog-scene.scss',
})
export class CatalogFilePreviewComponent {}
