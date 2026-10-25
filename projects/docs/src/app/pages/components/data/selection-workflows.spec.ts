import { TestBed } from '@angular/core/testing';
import { TablePage } from './table/table.page';
import { TreeTablePage } from './tree-table/tree-table.page';

describe('Table selection workflow', () => {
  beforeEach(() => {
    TestBed.overrideComponent(TablePage, { set: { template: '', imports: [] } });
  });

  afterEach(() => vi.useRealTimers());

  it('clears off-page selections and recovers focus without changing data or columns', () => {
    const page = TestBed.createComponent(TablePage).componentInstance;
    const fallback = document.createElement('button');
    const focus = vi.spyOn(fallback, 'focus');
    page['workflowSelected'].set(['1', '5']);
    page['workflowQuery'].set('Maya');
    const members = page['workflowMembers']();
    page['clearWorkflowSelection'](fallback);
    expect(page['workflowSelected']()).toEqual([]);
    expect(page['workflowMembers']()).toBe(members);
    expect(page['workflowQuery']()).toBe('Maya');
    expect(focus).toHaveBeenCalledOnce();
  });

  it('drops hidden filters and sorts, preserves selection, and merges visible column order', () => {
    const page = TestBed.createComponent(TablePage).componentInstance;
    page['workflowSelected'].set(['1']);
    page['workflowFilters'].set({ team: 'Design', status: 'Active' });
    page['workflowSort'].set({ field: 'team', direction: 'asc' });
    page['workflowFirst'].set(4);
    page['toggleWorkflowColumn']('team');
    expect(page['workflowColumns']().map((column) => column.field)).toEqual(['name', 'status']);
    expect(page['workflowFilters']()).toEqual({ status: 'Active' });
    expect(page['workflowSort']()).toBeNull();
    expect(page['workflowFirst']()).toBe(0);
    expect(page['workflowSelected']()).toEqual(['1']);
    page['orderWorkflowColumns']([...page['workflowColumns']()].reverse());
    page['toggleWorkflowColumn']('team');
    expect(page['workflowColumns']().map((column) => column.field)).toEqual([
      'status',
      'team',
      'name',
    ]);
    page['toggleWorkflowColumn']('name');
    expect(page['workflowColumns']().some((column) => column.field === 'name')).toBe(true);
    expect(
      page['workflowColumnItems']().find((item) => item.label === 'Name (required)')?.disabled,
    ).toBe(true);
  });

  it('keeps selection during a request, removes all selected keys once, and restores the example', async () => {
    vi.useFakeTimers();
    const page = TestBed.createComponent(TablePage).componentInstance;
    const fallback = document.createElement('button');
    const focus = vi.spyOn(fallback, 'focus');
    page['workflowSelected'].set(['1', '5']);
    page['workflowQuery'].set('Maya');
    const request = page['removeWorkflowMembers'](fallback);
    await page['removeWorkflowMembers'](fallback);
    expect(page['workflowBusy']()).toBe(true);
    expect(page['workflowSelected']()).toEqual(['1', '5']);
    expect(page['workflowStatus']()).toContain('Removing 2');
    expect(page['workflowColumnItems']().every((item) => item.disabled)).toBe(true);
    await vi.advanceTimersByTimeAsync(300);
    await request;
    expect(page['workflowMembers']().map((member) => member['id'])).toEqual(['2', '3', '4']);
    expect(page['workflowSelected']()).toEqual([]);
    expect(page['workflowBusy']()).toBe(false);
    expect(focus).toHaveBeenCalledOnce();
    page['restoreWorkflowMembers']();
    expect(page['workflowMembers']()).toHaveLength(5);
    expect(page['workflowQuery']()).toBe('');
  });

  it('does not update a destroyed page or attempt focus after a pending request', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(TablePage);
    const page = fixture.componentInstance;
    const fallback = document.createElement('button');
    const focus = vi.spyOn(fallback, 'focus');
    page['workflowSelected'].set(['1']);
    const request = page['removeWorkflowMembers'](fallback);
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(300);
    await request;
    expect(page['workflowMembers']()).toHaveLength(5);
    expect(focus).not.toHaveBeenCalled();
  });
});

describe('TreeTable selection workflow', () => {
  beforeEach(() => {
    TestBed.overrideComponent(TreeTablePage, { set: { template: '', imports: [] } });
  });

  afterEach(() => vi.useRealTimers());

  it('clears file keys from collapsed branches without changing expansion', () => {
    const page = TestBed.createComponent(TreeTablePage).componentInstance;
    page['workflowSelection'].set(['brief', 'component']);
    page['workflowExpanded'].set([]);
    page['clearWorkflowSelection'](document.createElement('button'));
    expect(page['workflowSelection']()).toEqual([]);
    expect(page['workflowExpanded']()).toEqual([]);
  });

  it('keeps the tree field visible and clears hidden-column filters and sorts', () => {
    const page = TestBed.createComponent(TreeTablePage).componentInstance;
    page['workflowFilters'].set({ owner: 'Maya', type: 'Document' });
    page['workflowSorts'].set([{ field: 'owner', direction: 'asc' }]);
    page['workflowSelection'].set(['brief']);
    page['toggleWorkflowColumn']('owner');
    expect(page['workflowFilters']()).toEqual({ type: 'Document' });
    expect(page['workflowSorts']()).toEqual([]);
    page['orderWorkflowColumns']([...page['workflowColumns']()].reverse());
    page['toggleWorkflowColumn']('owner');
    expect(page['workflowColumns']().map((column) => column.field)).toEqual([
      'type',
      'name',
      'owner',
    ]);
    page['toggleWorkflowColumn']('name');
    expect(page['workflowColumns']().some((column) => column.field === 'name')).toBe(true);
    expect(page['workflowSelection']()).toEqual(['brief']);
  });

  it('removes selected leaves across roots and recovers focus after the asynchronous action', async () => {
    vi.useFakeTimers();
    const page = TestBed.createComponent(TreeTablePage).componentInstance;
    const fallback = document.createElement('button');
    const focus = vi.spyOn(fallback, 'focus');
    page['workflowSelection'].set(['brief', 'component', 'release-notes']);
    page['workflowExpanded'].set([]);
    const request = page['removeWorkflowFiles'](fallback);
    await page['removeWorkflowFiles'](fallback);
    expect(page['workflowBusy']()).toBe(true);
    expect(page['workflowSelection']()).toHaveLength(3);
    await vi.advanceTimersByTimeAsync(300);
    await request;
    expect(page['workflowFiles']().map((node) => node.key)).toEqual([
      'design-files',
      'engineering-files',
    ]);
    expect(
      page['workflowFiles']().flatMap((node) => node.children?.map((child) => child.key) ?? []),
    ).toEqual(['palette', 'spec']);
    expect(page['workflowSelection']()).toEqual([]);
    expect(page['workflowBusy']()).toBe(false);
    expect(focus).toHaveBeenCalledOnce();
    page['restoreWorkflowFiles']();
    expect(page['workflowFiles']()).toHaveLength(3);
    expect(page['workflowExpanded']()).toEqual(['design-files', 'engineering-files']);
  });
});
