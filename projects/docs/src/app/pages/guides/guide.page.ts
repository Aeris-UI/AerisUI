import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AerisCardModule } from '@aeris-ui/core/card';

import { CodeBlockComponent } from '../../shared/code-block.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../shared/documentation/page-toc/page-toc.component';
import { GUIDE_ARTICLE_BY_ID, GUIDE_ARTICLES } from './guide-data';
import type { GuideId } from './guide-navigation';

@Component({
  selector: 'app-guide-page',
  imports: [RouterLink, AerisCardModule, CodeBlockComponent, PageTocComponent],
  templateUrl: './guide.page.html',
  styleUrl: './guide.page.scss',
})
export class GuidePage {
  readonly guideId = input.required<GuideId>();

  protected readonly article = computed(
    () => GUIDE_ARTICLE_BY_ID.get(this.guideId()) ?? GUIDE_ARTICLES[0],
  );
  protected readonly sections = computed(() => {
    const sections = this.article().sections;
    return [
      ...sections.filter((section) => !section.advanced),
      ...sections.filter((section) => section.advanced),
    ];
  });
  protected readonly advancedStartIndex = computed(() =>
    this.sections().findIndex((section) => section.advanced),
  );
  protected readonly sectionLinks = computed<readonly PageTocLink[]>(() =>
    this.sections().map(({ id, title }) => ({ id, label: title })),
  );
  protected readonly related = computed(() =>
    this.article()
      .related.map((id) => GUIDE_ARTICLE_BY_ID.get(id))
      .filter((article) => article !== undefined),
  );
  protected readonly adjacent = computed(() => {
    const index = GUIDE_ARTICLES.findIndex((article) => article.id === this.article().id);
    return {
      previous: index > 0 ? GUIDE_ARTICLES[index - 1] : undefined,
      next: index < GUIDE_ARTICLES.length - 1 ? GUIDE_ARTICLES[index + 1] : undefined,
    };
  });
}
