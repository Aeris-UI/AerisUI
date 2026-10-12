import type { HighlighterCore } from 'shiki/core';

export interface AerisCodeToken {
  readonly text: string;
  readonly light?: string;
  readonly dark?: string;
  readonly italic?: string;
  readonly weight?: string;
  readonly decoration?: string;
}
export interface AerisCodeLine {
  readonly number: number;
  readonly tokens: readonly AerisCodeToken[];
  readonly ending: string;
}

// Fine-grained imports keep unrelated grammars, themes, and WASM out of browser builds.
const grammars = {
  html: () => import('shiki/langs/html.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  shell: () => import('shiki/langs/shellscript.mjs'),
};
const aliases: Readonly<Record<string, string>> = {
  ts: 'typescript',
  js: 'javascript',
  angular: 'html',
  xml: 'html',
  bash: 'shell',
  sh: 'shell',
  shellscript: 'shell',
};
let highlighter: Promise<HighlighterCore> | undefined;
const pendingLanguages = new Map<string, Promise<void>>();
// GitHub light colors that need stronger contrast on Aeris's soft neutral surfaces.
const lightColors: Readonly<Record<string, string>> = {
  '#22863A': '#17692D',
  '#D73A49': '#B52634',
  '#6A737D': '#57606A',
  '#E36209': '#934307',
  '#B08800': '#775C00',
  '#F6F8FA': '#24292E',
};

export function normalizeAerisCodeLanguage(language: string): string {
  const normalized = language.trim().toLowerCase();
  return aliases[normalized] ?? normalized;
}
export function supportsAerisCodeLanguage(language: string): boolean {
  return Object.hasOwn(grammars, normalizeAerisCodeLanguage(language));
}
export function plainAerisCode(code: string): readonly AerisCodeLine[] {
  const endings = code.match(/\r\n|\r|\n/g) ?? [];
  return code.split(/\r\n|\r|\n/).map((text, index) => ({
    number: index + 1,
    tokens: [{ text }],
    ending: endings[index] ?? '',
  }));
}

function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/themes/github-light.mjs'),
    import('shiki/themes/github-dark.mjs'),
  ])
    .then(([core, engine, light, dark]) =>
      core.createHighlighterCore({
        themes: [light.default, dark.default],
        langs: [],
        engine: engine.createJavaScriptRegexEngine(),
      }),
    )
    .catch((error: unknown) => {
      highlighter = undefined;
      throw error;
    });
  return highlighter;
}

export async function highlightAerisCode(
  code: string,
  language: string,
): Promise<readonly AerisCodeLine[]> {
  const normalized = normalizeAerisCodeLanguage(language);
  if (!supportsAerisCodeLanguage(normalized) || code.length > 100_000) return plainAerisCode(code);
  const engine = await getHighlighter();
  const key = normalized as keyof typeof grammars;
  let pending = pendingLanguages.get(key);
  if (!pending) {
    pending = engine.loadLanguage(grammars[key]()).catch((error: unknown) => {
      pendingLanguages.delete(key);
      throw error;
    });
    pendingLanguages.set(key, pending);
  }
  await pending;
  const endings = code.match(/\r\n|\r|\n/g) ?? [];
  const tokens = engine.codeToTokensWithThemes(code.replace(/\r\n|\r/g, '\n'), {
    lang: key === 'shell' ? 'shellscript' : key,
    themes: { light: 'github-light', dark: 'github-dark' },
  });
  return tokens.map((line, index) => ({
    number: index + 1,
    ending: endings[index] ?? '',
    tokens: line.map((token) => {
      const light = token.variants['light'];
      const dark = token.variants['dark'];
      const style = light.fontStyle ?? 0;
      return {
        text: token.content,
        light: light.color ? (lightColors[light.color.toUpperCase()] ?? light.color) : undefined,
        dark: dark.color,
        italic: style & 1 ? 'italic' : undefined,
        weight: style & 2 ? '700' : undefined,
        decoration: style & 4 ? 'underline' : undefined,
      };
    }),
  }));
}
