export interface AerisDocumentation {
  readonly schemaVersion: number;
  readonly library: AerisLibraryDocumentation;
  readonly categories: readonly string[];
  readonly guides: readonly AerisGuideDocumentation[];
  readonly components: readonly AerisComponentDocumentation[];
}

export interface AerisLibraryDocumentation {
  readonly name: string;
  readonly version: string;
  readonly status: 'alpha' | 'beta' | 'stable';
  readonly angularPeerRange: string;
  readonly documentationUrl: string;
  readonly repositoryUrl: string;
  readonly license: string;
  readonly styleImports: readonly string[];
  readonly principles: readonly string[];
}

export interface AerisGuideDocumentation {
  readonly id: string;
  readonly path: string;
  readonly group: string;
  readonly title: string;
  readonly description: string;
  readonly summary: string;
  readonly sections: readonly AerisGuideSection[];
  readonly related: readonly string[];
}

export interface AerisGuideSection {
  readonly id: string;
  readonly title: string;
  readonly advanced?: boolean;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly string[];
  readonly code?: readonly AerisCodeSource[];
  readonly note?: string;
  readonly table?: AerisReferenceTable;
  readonly themePresets?: readonly {
    readonly id: string;
    readonly name: string;
    readonly description: string;
  }[];
  readonly links?: readonly {
    readonly label: string;
    readonly href: string;
    readonly external?: boolean;
  }[];
}

export interface AerisComponentDocumentation {
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly description: string;
  readonly entryPoint: string;
  readonly documentationUrl: string;
  readonly imports: readonly string[];
  readonly importCode: string;
  readonly api: readonly AerisApiGroup[];
  readonly referenceTables: readonly AerisReferenceTable[];
  readonly interfaces: readonly {
    readonly name: string;
    readonly code: string;
  }[];
  readonly designTokens: readonly AerisApiEntry[];
  readonly examples: readonly AerisExampleDocumentation[];
  readonly accessibility: {
    readonly guidance: readonly string[];
    readonly keyboard: readonly {
      readonly keys: string;
      readonly behavior: string;
    }[];
  };
}

export interface AerisApiGroup {
  readonly name: string;
  readonly kind:
    'input' | 'model' | 'output' | 'template' | 'method' | 'property' | 'service' | 'other';
  readonly entries: readonly AerisApiEntry[];
}

export interface AerisApiEntry {
  readonly name: string;
  readonly type: string;
  readonly defaultValue?: string;
  readonly description: string;
}

export interface AerisReferenceTable {
  readonly caption: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

export interface AerisExampleDocumentation {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly sources: readonly AerisCodeSource[];
}

export interface AerisCodeSource {
  readonly language: string;
  readonly label: string;
  readonly code: string;
}
