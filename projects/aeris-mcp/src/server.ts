import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult, ResourceLink } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import type {
  AerisComponentDocumentation,
  AerisDocumentation,
  AerisGuideDocumentation,
} from './documentation.types.js';
import { AerisDocumentationIndex, type AerisSearchResultKind } from './search.js';

const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

export function createAerisMcpServer(documentation: AerisDocumentation): McpServer {
  const index = new AerisDocumentationIndex(documentation);
  const server = new McpServer(
    {
      name: '@aeris-ui/mcp',
      version: documentation.library.version,
    },
    {
      instructions:
        'Use search_aeris_docs to discover relevant Aeris components and guides, then call get_aeris_component or get_aeris_guide for exact APIs and examples. All capabilities are read-only. Aeris is alpha software and is not production ready.',
    },
  );

  registerResources(server, documentation, index);
  registerTools(server, documentation, index);
  return server;
}

function registerResources(
  server: McpServer,
  documentation: AerisDocumentation,
  index: AerisDocumentationIndex,
): void {
  server.registerResource(
    'aeris-overview',
    'aeris://docs/overview',
    {
      title: 'Aeris UI overview',
      description: 'Package status, compatibility, global styles, and implementation principles.',
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text: renderOverview(documentation),
        },
      ],
    }),
  );

  server.registerResource(
    'aeris-canonical-documentation',
    'aeris://docs/canonical',
    {
      title: 'Canonical Aeris documentation',
      description: 'Complete versioned Aeris documentation corpus as JSON.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(documentation),
        },
      ],
    }),
  );

  server.registerResource(
    'aeris-components',
    'aeris://components',
    {
      title: 'Aeris component catalog',
      description: 'Compact index of every documented Aeris component.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ components: componentSummaries(documentation) }),
        },
      ],
    }),
  );

  server.registerResource(
    'aeris-component',
    new ResourceTemplate('aeris://components/{slug}', {
      list: async () => ({
        resources: documentation.components.map((component) => ({
          uri: `aeris://components/${component.slug}`,
          name: component.name,
          title: component.name,
          description: component.description,
          mimeType: 'application/json',
        })),
      }),
      complete: {
        slug: (value) =>
          documentation.components
            .map((component) => component.slug)
            .filter((slug) => slug.startsWith(value))
            .slice(0, 20),
      },
    }),
    {
      title: 'Aeris component documentation',
      description: 'Complete API, examples, tokens, and accessibility guidance for one component.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const component = index.component(variableValue(variables['slug']));
      if (!component)
        throw new Error(`Unknown Aeris component: ${variableValue(variables['slug'])}`);
      return jsonResource(uri.href, component);
    },
  );

  server.registerResource(
    'aeris-guides',
    'aeris://guides',
    {
      title: 'Aeris developer guides',
      description: 'Compact index of installation, theming, accessibility, and integration guides.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ guides: guideSummaries(documentation) }),
        },
      ],
    }),
  );

  server.registerResource(
    'aeris-guide',
    new ResourceTemplate('aeris://guides/{id}', {
      list: async () => ({
        resources: documentation.guides.map((guide) => ({
          uri: `aeris://guides/${guide.id}`,
          name: guide.title,
          title: guide.title,
          description: guide.description,
          mimeType: 'application/json',
        })),
      }),
      complete: {
        id: (value) =>
          documentation.guides
            .map((guide) => guide.id)
            .filter((id) => id.startsWith(value))
            .slice(0, 20),
      },
    }),
    {
      title: 'Aeris guide',
      description: 'Complete content for one Aeris developer guide.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const guide = index.guide(variableValue(variables['id']));
      if (!guide) throw new Error(`Unknown Aeris guide: ${variableValue(variables['id'])}`);
      return jsonResource(uri.href, guide);
    },
  );
}

function registerTools(
  server: McpServer,
  documentation: AerisDocumentation,
  index: AerisDocumentationIndex,
): void {
  server.registerTool(
    'list_aeris_components',
    {
      title: 'List Aeris components',
      description:
        'List the Aeris component catalog, optionally filtered by category. Returns compact summaries and resource URIs.',
      inputSchema: {
        category: z.string().trim().min(1).optional(),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ category }) => {
      const normalizedCategory = category?.toLowerCase();
      const components = componentSummaries(documentation).filter(
        (component) =>
          !normalizedCategory || component.category.toLowerCase() === normalizedCategory,
      );
      if (category && !components.length) {
        return toolError(
          `Unknown or empty category "${category}". Available categories: ${documentation.categories.join(', ')}.`,
        );
      }
      return jsonToolResult({ components }, components.map(componentLink));
    },
  );

  server.registerTool(
    'search_aeris_docs',
    {
      title: 'Search Aeris documentation',
      description:
        'Search components, guides, APIs, accessibility guidance, and examples. Use returned resource URIs with focused retrieval tools.',
      inputSchema: {
        query: z.string().trim().min(1).max(200),
        category: z.string().trim().min(1).optional(),
        kinds: z
          .array(z.enum(['component', 'guide', 'example']))
          .max(3)
          .optional(),
        limit: z.number().int().min(1).max(20).default(10),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ query, category, kinds, limit }) => {
      const results = index.search(query, {
        category,
        kinds: kinds as readonly AerisSearchResultKind[] | undefined,
        limit,
      });
      return jsonToolResult(
        { query, results },
        uniqueLinks(
          results.map((result) => ({
            type: 'resource_link' as const,
            uri: result.uri,
            name: result.title,
            description: result.description,
            mimeType: 'application/json',
          })),
        ),
      );
    },
  );

  server.registerTool(
    'get_aeris_component',
    {
      title: 'Get Aeris component',
      description:
        'Return exact imports, API, interfaces, tokens, accessibility behavior, and optionally complete examples for one Aeris component.',
      inputSchema: {
        component: z.string().trim().min(1).max(100),
        includeExamples: z.boolean().default(true),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ component: value, includeExamples }) => {
      const component = index.component(value);
      if (!component) return unknownComponent(value, index);
      const payload = includeExamples ? component : withoutExamples(component);
      return jsonToolResult(payload, [componentLink(component)]);
    },
  );

  server.registerTool(
    'get_aeris_guide',
    {
      title: 'Get Aeris guide',
      description:
        'Return one complete Aeris guide, including code, tables, notes, and related guides.',
      inputSchema: {
        guide: z.string().trim().min(1).max(100),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ guide: value }) => {
      const guide = index.guide(value);
      if (!guide) {
        return toolError(
          `Unknown Aeris guide "${value}". Available guides: ${documentation.guides.map((item) => item.id).join(', ')}.`,
        );
      }
      return jsonToolResult(guide, [guideLink(guide)]);
    },
  );

  server.registerTool(
    'find_aeris_examples',
    {
      title: 'Find Aeris examples',
      description:
        'Find complete, copy-ready Angular examples by feature or component. Provide a query, a component, or both.',
      inputSchema: {
        query: z.string().trim().min(1).max(200).optional(),
        component: z.string().trim().min(1).max(100).optional(),
        limit: z.number().int().min(1).max(20).default(5),
      },
      annotations: readOnlyAnnotations,
    },
    async ({ query, component, limit }) => {
      if (!query && !component) return toolError('Provide query, component, or both.');
      if (component && !index.component(component)) return unknownComponent(component, index);
      const examples = index.examples(query, component, limit);
      return jsonToolResult(
        { query, component, examples },
        uniqueLinks(
          examples.flatMap(({ component: slug }) => {
            const item = index.component(slug);
            return item ? [componentLink(item)] : [];
          }),
        ),
      );
    },
  );
}

function renderOverview(documentation: AerisDocumentation): string {
  const library = documentation.library;
  return `# Aeris UI ${library.version}

> Aeris is ${library.status} software and is not production ready.

- Package: \`${library.name}\`
- Angular peer range: \`${library.angularPeerRange}\`
- Components: ${documentation.components.length}
- Guides: ${documentation.guides.length}
- Documentation: ${library.documentationUrl}

## Global styles

\`\`\`css
${library.styleImports.join('\n')}
\`\`\`

## Principles

${library.principles.map((principle) => `- ${principle}`).join('\n')}
`;
}

function componentSummaries(documentation: AerisDocumentation) {
  return documentation.components.map(({ name, slug, category, description, entryPoint }) => ({
    name,
    slug,
    category,
    description,
    entryPoint,
    uri: `aeris://components/${slug}`,
  }));
}

function guideSummaries(documentation: AerisDocumentation) {
  return documentation.guides.map(({ id, group, title, description }) => ({
    id,
    group,
    title,
    description,
    uri: `aeris://guides/${id}`,
  }));
}

function withoutExamples(component: AerisComponentDocumentation) {
  const { examples: _examples, ...documentation } = component;
  return documentation;
}

function jsonResource(uri: string, value: unknown) {
  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(value),
      },
    ],
  };
}

function jsonToolResult(value: unknown, links: readonly ResourceLink[] = []): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(value, null, 2),
      },
      ...links,
    ],
    ...(isRecord(value) ? { structuredContent: value } : {}),
  };
}

function toolError(message: string): CallToolResult {
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
  };
}

function unknownComponent(value: string, index: AerisDocumentationIndex): CallToolResult {
  const suggestions = index
    .search(value, { kinds: ['component'], limit: 5 })
    .map((result) => result.id);
  return toolError(
    `Unknown Aeris component "${value}".${suggestions.length ? ` Similar components: ${suggestions.join(', ')}.` : ''}`,
  );
}

function componentLink(component: {
  readonly name: string;
  readonly slug: string;
  readonly description: string;
}): ResourceLink {
  return {
    type: 'resource_link',
    uri: `aeris://components/${component.slug}`,
    name: component.name,
    description: component.description,
    mimeType: 'application/json',
  };
}

function guideLink(guide: AerisGuideDocumentation): ResourceLink {
  return {
    type: 'resource_link',
    uri: `aeris://guides/${guide.id}`,
    name: guide.title,
    description: guide.description,
    mimeType: 'application/json',
  };
}

function uniqueLinks(links: readonly ResourceLink[]): readonly ResourceLink[] {
  return [...new Map(links.map((link) => [link.uri, link])).values()];
}

function variableValue(value: string | string[]): string {
  return Array.isArray(value) ? (value[0] ?? '') : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
