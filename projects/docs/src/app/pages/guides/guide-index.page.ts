import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisMessageModule } from '@aeris-ui/core/message';

import { GUIDE_GROUPS, GUIDE_SUMMARIES, GUIDE_SUMMARY_BY_ID } from './guide-navigation';

@Component({
  selector: 'app-guide-index-page',
  imports: [RouterLink, AerisButton, AerisCardModule, AerisMessageModule],
  templateUrl: './guide-index.page.html',
  styleUrl: './guide-index.page.scss',
})
export class GuideIndexPage {
  protected readonly groups = GUIDE_GROUPS;
  protected readonly featured = GUIDE_SUMMARIES.slice(0, 3);
  protected readonly articleById = GUIDE_SUMMARY_BY_ID;
}
