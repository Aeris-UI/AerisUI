import { TestBed } from '@angular/core/testing';
import { PageTocComponent, type PageTocLink } from './page-toc.component';

describe('PageTocComponent', () => {
  const sections: HTMLElement[] = [];
  let frames: FrameRequestCallback[];

  beforeEach(() => {
    frames = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(10000);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    for (const section of sections.splice(0)) section.remove();
    vi.restoreAllMocks();
  });

  function section(id: string, top: number, visible = true): HTMLElement {
    const element = document.createElement('section');
    element.id = id;
    const rect = new DOMRect(0, top, 400, 200);
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(rect);
    vi.spyOn(element, 'getClientRects').mockReturnValue(
      Object.assign(visible ? [rect] : [], { item: () => (visible ? rect : null) }),
    );
    document.body.append(element);
    sections.push(element);
    return element;
  }

  async function create(links: readonly PageTocLink[], showTopLink = true) {
    const fixture = TestBed.createComponent(PageTocComponent);
    fixture.componentRef.setInput('title', 'On this page');
    fixture.componentRef.setInput('ariaLabel', 'Quick links');
    fixture.componentRef.setInput('links', links);
    fixture.componentRef.setInput('showTopLink', showTopLink);
    fixture.detectChanges();
    await fixture.whenStable();
    const update = () => {
      window.dispatchEvent(new Event('scroll'));
      for (const frame of frames.splice(0)) frame(0);
      fixture.detectChanges();
    };
    update();
    const current = () =>
      (fixture.nativeElement as HTMLElement)
        .querySelector('a[aria-current="location"]')
        ?.getAttribute('href');
    return { fixture, update, current };
  }

  it('tracks actual section positions even when links are out of document order', async () => {
    section('editors', -500);
    const scrolling = section('scrolling', 900);
    const sticky = section('sticky', 24);
    const { current, update } = await create([
      { id: 'editors', label: 'Custom editors' },
      { id: 'scrolling', label: 'Scrolling' },
      { id: 'sticky', label: 'Sticky headers' },
    ]);
    expect(current()).toBe('#sticky');
    vi.spyOn(scrolling, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 24, 400, 200));
    vi.spyOn(sticky, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, -800, 400, 200));
    update();
    expect(current()).toBe('#scrolling');
  });

  it('selects the last rendered section at the page end, not the last link', async () => {
    section('last', 600);
    section('first', -500);
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(window.innerHeight);
    const { current } = await create([
      { id: 'last', label: 'Last' },
      { id: 'first', label: 'First' },
    ]);
    expect(current()).toBe('#last');
  });

  it('ignores hidden and absent sections when tracking the active tab', async () => {
    section('visible', 24);
    section('hidden', 30, false);
    const { current } = await create([
      { id: 'absent', label: 'Absent' },
      { id: 'hidden', label: 'Hidden' },
      { id: 'visible', label: 'Visible' },
    ]);
    expect(current()).toBe('#visible');
  });

  it('keeps Import active before the first section', async () => {
    section('later', 900);
    const { current } = await create([{ id: 'later', label: 'Later' }]);
    expect(current()).toBe('#');
  });

  it('uses the first rendered section before content when the top link is disabled', async () => {
    section('later', 900);
    section('first', 400);
    const { current } = await create(
      [
        { id: 'later', label: 'Later' },
        { id: 'first', label: 'First' },
      ],
      false,
    );
    expect(current()).toBe('#first');
  });
});
