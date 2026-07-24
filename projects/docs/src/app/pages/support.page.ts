import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { LucideDynamicIcon } from '@lucide/angular';

import { DOC_ICONS } from '../shared/documentation/doc-icons';

@Component({
  selector: 'app-support-page',
  imports: [RouterLink, AerisButton, AerisCardModule, LucideDynamicIcon],
  templateUrl: './support.page.html',
  styleUrl: './support.page.scss',
})
export class SupportPage {
  protected readonly icons = DOC_ICONS;
}
