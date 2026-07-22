import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { $getRoot, $isElementNode } from 'lexical';

import {
  AERIS_EDITOR_ALL_FORMATS,
  AerisEditor,
  AerisEditorComponent,
  type AerisEditorExtension,
} from '../../../editor/aeris-editor';

@Component({
  imports: [AerisEditor, ReactiveFormsModule],
  template: `
    <label for="article-body">Article body</label>
    <aeris-editor
      inputId="article-body"
      [formControl]="body"
      required
      ariaDescribedby="article-help"
      name="articleBody"
    />
    <small id="article-help">Use headings and short paragraphs.</small>
  `,
})
class EditorTestHost {
  readonly body = new FormControl('<p>Hello editor.</p>');
}

describe('AerisEditor', () => {
  it('renders an accessible multiline textbox with form value', async () => {
    const fixture = TestBed.createComponent(EditorTestHost);
    await fixture.whenStable();
    await nextFrame();

    const textbox = fixture.nativeElement.querySelector('[role="textbox"]') as HTMLElement;
    const hidden = fixture.nativeElement.querySelector('input[type="hidden"]') as HTMLInputElement;

    expect(textbox.id).toBe('article-body');
    expect(textbox.getAttribute('aria-multiline')).toBe('true');
    expect(textbox.getAttribute('aria-required')).toBe('true');
    expect(textbox.getAttribute('aria-describedby')).toBe('article-help');
    expect(textbox.textContent).toContain('Hello editor.');
    expect(hidden.name).toBe('articleBody');
  });

  it('shows a labeled toolbar by default', async () => {
    const fixture = TestBed.createComponent(AerisEditorComponent);
    fixture.componentRef.setInput('toolbarAriaLabel', 'Article formatting');
    fixture.detectChanges();
    await fixture.whenStable();

    const toolbar = fixture.nativeElement.querySelector('[role="toolbar"]') as HTMLElement;
    const buttons = [...toolbar.querySelectorAll('button')] as HTMLButtonElement[];

    expect(toolbar.getAttribute('aria-label')).toBe('Article formatting');
    expect(buttons.some((button) => button.getAttribute('aria-label') === 'Bold')).toBe(true);
    expect(buttons.some((button) => button.getAttribute('aria-label') === 'Bulleted list')).toBe(
      true,
    );
  });

  it('can hide or limit toolbar actions', async () => {
    const fixture = TestBed.createComponent(AerisEditorComponent);
    fixture.componentRef.setInput('formats', ['bold', 'italic']);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[aria-label="Bold"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="Heading"]')).toBeNull();

    fixture.componentRef.setInput('showToolbar', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="toolbar"]')).toBeNull();
  });

  it('renders every built-in toolbar action when requested', async () => {
    const fixture = TestBed.createComponent(AerisEditorComponent);
    fixture.componentRef.setInput('formats', AERIS_EDITOR_ALL_FORMATS);
    fixture.detectChanges();
    await fixture.whenStable();

    const labels = [...fixture.nativeElement.querySelectorAll('[role="toolbar"] button')].map(
      (button) => button.getAttribute('aria-label'),
    );

    expect(labels).toEqual(
      expect.arrayContaining([
        'Strikethrough',
        'Inline code',
        'Highlight',
        'Subscript',
        'Superscript',
        'Heading 1',
        'Heading 2',
        'Heading 3',
        'Heading 4',
        'Heading 5',
        'Heading 6',
        'Checklist',
        'Align left',
        'Align start',
        'Align center',
        'Align right',
        'Align end',
        'Justify',
        'Decrease indent',
        'Increase indent',
        'Clear formatting',
      ]),
    );
  });

  it('registers consumer Lexical extensions and disposes their cleanup', async () => {
    let setupEditor: unknown;
    let cleanupCalls = 0;
    const extensions: readonly AerisEditorExtension[] = [
      {
        setup: (editor) => {
          setupEditor = editor;
          return () => cleanupCalls++;
        },
      },
    ];
    const fixture = TestBed.createComponent(AerisEditorComponent);
    fixture.componentRef.setInput('extensions', extensions);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(setupEditor).toBe(fixture.componentInstance.getLexicalEditor());

    fixture.destroy();
    expect(cleanupCalls).toBe(1);
  });

  it('creates an interactive checklist through the public API', async () => {
    const fixture = TestBed.createComponent(AerisEditorComponent);
    fixture.componentRef.setInput('value', '<p>Review the release.</p>');
    fixture.detectChanges();
    await fixture.whenStable();
    await nextFrame();

    fixture.componentInstance.getLexicalEditor()?.update(
      () => {
        const firstChild = $getRoot().getFirstChild();
        if ($isElementNode(firstChild)) firstChild.selectEnd();
      },
      { discrete: true },
    );
    fixture.componentInstance.toggleCheckList();
    await nextFrame();

    const checklistItem = fixture.nativeElement.querySelector('[role="checkbox"]') as HTMLElement;
    expect(checklistItem).not.toBeNull();
    expect(checklistItem.getAttribute('aria-checked')).toBe('false');
  });

  it('honors disabled form state', async () => {
    const fixture = TestBed.createComponent(EditorTestHost);
    await fixture.whenStable();

    fixture.componentInstance.body.disable();
    fixture.detectChanges();
    await fixture.whenStable();

    const textbox = fixture.nativeElement.querySelector('[role="textbox"]') as HTMLElement;
    const toolbarButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(textbox.getAttribute('contenteditable')).toBe('false');
    expect(textbox.getAttribute('tabindex')).toBe('-1');
    expect(toolbarButton.disabled).toBe(true);
  });

  it('clears editable content through the component API', async () => {
    const fixture = TestBed.createComponent(AerisEditorComponent);
    fixture.componentRef.setInput('value', '<p>Draft content.</p>');
    fixture.detectChanges();
    await fixture.whenStable();
    await nextFrame();

    fixture.componentInstance.clear();
    fixture.detectChanges();
    await nextFrame();

    expect(fixture.componentInstance.value()).toBe('');
    expect(
      (fixture.nativeElement.querySelector('[role="textbox"]') as HTMLElement).textContent?.trim(),
    ).toBe('');
  });

  it('sanitizes externally supplied HTML before importing editor nodes', async () => {
    const fixture = TestBed.createComponent(AerisEditorComponent);
    fixture.componentRef.setInput(
      'value',
      '<p>Safe text</p><img src="x" onerror="globalThis.__aerisXss = true"><script>globalThis.__aerisXss = true</script>',
    );
    fixture.detectChanges();
    await fixture.whenStable();
    await nextFrame();

    const textbox = fixture.nativeElement.querySelector('[role="textbox"]') as HTMLElement;
    expect(textbox.textContent).toContain('Safe text');
    expect(textbox.querySelector('script')).toBeNull();
    expect(textbox.querySelector('[onerror]')).toBeNull();
    expect(fixture.componentInstance.value()).not.toContain('<script');
    expect(fixture.componentInstance.value()).not.toContain('onerror');
  });
});

function nextFrame(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve));
}
