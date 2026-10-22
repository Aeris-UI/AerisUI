import { describe, expect, it } from 'vitest';
import { GUIDE_ARTICLES } from './guide-data';

describe('Consumer control selection guidance', () => {
  it('distinguishes value selection from commands and preserves native form grouping', () => {
    const forms = GUIDE_ARTICLES.find(({ id }) => id === 'forms');
    const text = forms?.sections
      .find(({ id }) => id === 'component-support')
      ?.paragraphs?.join(' ');
    expect(text).toContain('Select for choosing a value');
    expect(text).toContain('AutoComplete for text entry');
    expect(text).toContain('Menu for actions or navigation');
    expect(text).toContain('fieldset with legend');
    expect(text).toContain('does not replace form or fieldset semantics');
    expect(text).toContain('@aeris-ui/core/select/native');
    expect(text).toContain('typed date/time entry');
    expect(text).toContain('optional opacity');
  });

  it('distinguishes navigation and command overlays without adding installation requirements', () => {
    const section = GUIDE_ARTICLES.find(({ id }) => id === 'overlays')?.sections.find(
      ({ id }) => id === 'choose-overlay',
    );
    expect(section?.table?.rows).toContainEqual([
      'Searchable application commands with a launcher',
      'CommandPalette',
    ]);
    expect(section?.paragraphs?.join(' ')).toContain('not ARIA command menus');
    expect(section?.paragraphs?.join(' ')).toContain('hover and keyboard focus');
  });
});
