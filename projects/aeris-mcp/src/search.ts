import type {
  AerisComponentDocumentation,
  AerisDocumentation,
  AerisExampleDocumentation,
  AerisGuideDocumentation,
} from './documentation.types.js';

export type AerisSearchResultKind = 'component' | 'guide' | 'example';

export interface AerisSearchResult {
  readonly kind: AerisSearchResultKind;
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category?: string;
  readonly component?: string;
  readonly uri: string;
  readonly score: number;
}

export interface AerisSearchOptions {
  readonly category?: string;
  readonly kinds?: readonly AerisSearchResultKind[];
  readonly limit?: number;
}

interface IndexedRecord extends Omit<AerisSearchResult, 'score'> {
  readonly normalizedId: string;
  readonly normalizedTitle: string;
  readonly searchable: string;
}

export class AerisDocumentationIndex {
  private readonly records: readonly IndexedRecord[];

  constructor(readonly documentation: AerisDocumentation) {
    this.records = buildRecords(documentation);
  }

  search(query: string, options: AerisSearchOptions = {}): readonly AerisSearchResult[] {
    const normalizedQuery = normalize(query);
    const tokens = tokenize(normalizedQuery);
    if (!normalizedQuery || !tokens.length) return [];

    const category = options.category ? normalize(options.category) : undefined;
    const kinds = options.kinds ? new Set(options.kinds) : undefined;
    const limit = clampLimit(options.limit);

    return this.records
      .filter((record) => !kinds || kinds.has(record.kind))
      .filter((record) => !category || normalize(record.category ?? '') === category)
      .map((record) => ({ ...record, score: scoreRecord(record, normalizedQuery, tokens) }))
      .filter((record) => record.score > 0)
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
      .slice(0, limit)
      .map(
        ({
          normalizedId: _normalizedId,
          normalizedTitle: _normalizedTitle,
          searchable: _searchable,
          ...result
        }) => result,
      );
  }

  component(value: string): AerisComponentDocumentation | undefined {
    const normalized = normalize(value);
    return this.documentation.components.find(
      (component) =>
        normalize(component.slug) === normalized || normalize(component.name) === normalized,
    );
  }

  guide(value: string): AerisGuideDocumentation | undefined {
    const normalized = normalize(value);
    return this.documentation.guides.find(
      (guide) => normalize(guide.id) === normalized || normalize(guide.title) === normalized,
    );
  }

  examples(
    query: string | undefined,
    componentValue: string | undefined,
    limit = 5,
  ): readonly { readonly component: string; readonly example: AerisExampleDocumentation }[] {
    const component = componentValue ? this.component(componentValue) : undefined;
    if (componentValue && !component) return [];
    const components = component ? [component] : this.documentation.components;
    const normalizedQuery = normalize(query ?? '');
    const tokens = tokenize(normalizedQuery);

    return components
      .flatMap((item) =>
        item.examples.map((example) => ({
          component: item.slug,
          example,
          score: normalizedQuery ? scoreExample(example, normalizedQuery, tokens) : 1,
        })),
      )
      .filter((result) => result.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score || left.example.title.localeCompare(right.example.title),
      )
      .slice(0, clampLimit(limit))
      .map(({ component: componentSlug, example }) => ({ component: componentSlug, example }));
  }
}

function buildRecords(documentation: AerisDocumentation): readonly IndexedRecord[] {
  const components = documentation.components.map((component) =>
    record({
      kind: 'component',
      id: component.slug,
      title: component.name,
      description: component.description,
      category: component.category,
      uri: `aeris://components/${component.slug}`,
      body: [
        component.entryPoint,
        component.imports.join(' '),
        ...component.api.flatMap((group) =>
          group.entries.flatMap((entry) => [entry.name, entry.type, entry.description]),
        ),
        ...component.designTokens.flatMap((token) => [token.name, token.description]),
        ...component.examples.flatMap((example) => [example.title, example.description]),
        ...component.accessibility.guidance,
      ].join(' '),
    }),
  );
  const guides = documentation.guides.map((guide) =>
    record({
      kind: 'guide',
      id: guide.id,
      title: guide.title,
      description: guide.description,
      category: guide.group,
      uri: `aeris://guides/${guide.id}`,
      body: [
        guide.summary,
        ...guide.sections.flatMap((section) => [
          section.title,
          ...(section.paragraphs ?? []),
          ...(section.bullets ?? []),
          section.note ?? '',
        ]),
      ].join(' '),
    }),
  );
  const examples = documentation.components.flatMap((component) =>
    component.examples.map((example) =>
      record({
        kind: 'example',
        id: `${component.slug}/${example.id}`,
        title: `${component.name}: ${example.title}`,
        description: example.description,
        category: component.category,
        component: component.slug,
        uri: `aeris://components/${component.slug}`,
        body: example.sources.map((source) => source.code).join(' '),
      }),
    ),
  );
  return [...components, ...guides, ...examples];
}

function record(
  value: Omit<IndexedRecord, 'normalizedId' | 'normalizedTitle' | 'searchable'> & {
    readonly body: string;
  },
): IndexedRecord {
  const { body, ...result } = value;
  return {
    ...result,
    normalizedId: normalize(value.id),
    normalizedTitle: normalize(value.title),
    searchable: normalize(`${value.id} ${value.title} ${value.description} ${body}`),
  };
}

function scoreRecord(recordValue: IndexedRecord, query: string, tokens: readonly string[]): number {
  let score = 0;
  if (recordValue.normalizedId === query) score += 120;
  if (recordValue.normalizedTitle === query) score += 100;
  if (recordValue.normalizedId.startsWith(query)) score += 50;
  if (recordValue.normalizedTitle.startsWith(query)) score += 40;
  if (recordValue.searchable.includes(query)) score += 25;
  for (const token of tokens) {
    if (recordValue.normalizedId.includes(token)) score += 12;
    if (recordValue.normalizedTitle.includes(token)) score += 10;
    if (recordValue.searchable.includes(token)) score += 3;
    else return 0;
  }
  if (recordValue.kind === 'component') score += 2;
  return score;
}

function scoreExample(
  example: AerisExampleDocumentation,
  query: string,
  tokens: readonly string[],
): number {
  const title = normalize(example.title);
  const searchable = normalize(
    `${example.id} ${example.title} ${example.description} ${example.sources.map((source) => source.code).join(' ')}`,
  );
  let score =
    title === query ? 80 : title.includes(query) ? 35 : searchable.includes(query) ? 20 : 0;
  for (const token of tokens) {
    if (title.includes(token)) score += 8;
    else if (searchable.includes(token)) score += 2;
    else return 0;
  }
  return score;
}

function tokenize(value: string): readonly string[] {
  return [...new Set(value.split(/[^a-z0-9]+/).filter((token) => token.length > 1))];
}

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function clampLimit(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 10;
  return Math.min(20, Math.max(1, Math.trunc(value)));
}
