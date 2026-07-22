import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  ApplicationRef,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  TemplateRef,
  booleanAttribute,
  computed,
  createComponent,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  Service,
} from '@angular/core';
import { AerisButtonDirective, type AerisButtonSeverity } from '@aeris-ui/core/button';
import {
  aerisInternalFocusInitialElement,
  aerisInternalCreateFrameScheduler,
  aerisInternalPositionAnchoredOverlay,
  aerisInternalTrapTabFocus,
} from '@aeris-ui/core';

export type AerisConfirmPopupSeverity =
  'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral';
export type AerisConfirmPopupIcon = 'question' | 'info' | 'warning' | 'danger' | 'success' | 'none';
export type AerisConfirmPopupPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left';
export type AerisConfirmPopupAlignment = 'start' | 'center' | 'end';
export type AerisConfirmPopupDefaultFocus = 'accept' | 'reject' | 'popup' | 'none';
export type AerisConfirmPopupResult = 'accept' | 'reject' | 'dismiss';
export type AerisConfirmPopupCloseReason = 'api' | 'accept' | 'reject' | 'escape' | 'outside';
export type AerisConfirmPopupTarget = Element | EventTarget | Event | null | undefined;

export interface AerisConfirmPopupConfig<TData = unknown> {
  readonly key?: string;
  readonly target: AerisConfirmPopupTarget;
  readonly header?: string;
  readonly message?: string;
  readonly data?: TData;
  readonly icon?: AerisConfirmPopupIcon;
  readonly severity?: AerisConfirmPopupSeverity;
  readonly acceptLabel?: string;
  readonly rejectLabel?: string;
  readonly acceptVisible?: boolean;
  readonly rejectVisible?: boolean;
  readonly acceptDisabled?: boolean;
  readonly rejectDisabled?: boolean;
  readonly acceptAriaLabel?: string;
  readonly rejectAriaLabel?: string;
  readonly defaultFocus?: AerisConfirmPopupDefaultFocus;
  readonly placement?: AerisConfirmPopupPlacement;
  readonly alignment?: AerisConfirmPopupAlignment;
  readonly width?: string;
  readonly maxWidth?: string;
  readonly offset?: number;
  readonly viewportMargin?: number;
  readonly dismissible?: boolean;
  readonly closeOnEscape?: boolean;
  readonly focusTrap?: boolean;
  readonly restoreFocus?: boolean;
  readonly autoFocus?: boolean;
  readonly initialFocus?: string;
  readonly showArrow?: boolean;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
  readonly ariaDescribedBy?: string;
  readonly accept?: (event: AerisConfirmPopupActionEvent<TData>) => void;
  readonly reject?: (event: AerisConfirmPopupActionEvent<TData>) => void;
}

export interface AerisConfirmPopupResolvedConfig<TData = unknown> {
  readonly key: string;
  readonly target: Element;
  readonly header: string;
  readonly message: string;
  readonly data: TData | undefined;
  readonly icon: AerisConfirmPopupIcon;
  readonly severity: AerisConfirmPopupSeverity;
  readonly acceptLabel: string;
  readonly rejectLabel: string;
  readonly acceptVisible: boolean;
  readonly rejectVisible: boolean;
  readonly acceptDisabled: boolean;
  readonly rejectDisabled: boolean;
  readonly acceptAriaLabel: string;
  readonly rejectAriaLabel: string;
  readonly defaultFocus: AerisConfirmPopupDefaultFocus;
  readonly placement: AerisConfirmPopupPlacement;
  readonly alignment: AerisConfirmPopupAlignment;
  readonly width: string;
  readonly maxWidth: string;
  readonly offset: number;
  readonly viewportMargin: number;
  readonly dismissible: boolean;
  readonly closeOnEscape: boolean;
  readonly focusTrap: boolean;
  readonly restoreFocus: boolean;
  readonly autoFocus: boolean;
  readonly initialFocus: string;
  readonly showArrow: boolean;
  readonly ariaLabel: string;
  readonly ariaLabelledBy: string;
  readonly ariaDescribedBy: string;
  readonly accept?: (event: AerisConfirmPopupActionEvent<TData>) => void;
  readonly reject?: (event: AerisConfirmPopupActionEvent<TData>) => void;
}

export interface AerisConfirmPopupActionEvent<TData = unknown> {
  readonly originalEvent: Event | null;
  readonly data: TData | undefined;
  readonly config: AerisConfirmPopupResolvedConfig<TData>;
}

export interface AerisConfirmPopupCloseEvent<
  TData = unknown,
> extends AerisConfirmPopupActionEvent<TData> {
  readonly result: AerisConfirmPopupResult;
  readonly reason: AerisConfirmPopupCloseReason;
}

export interface AerisConfirmPopupSubscription {
  unsubscribe(): void;
}

export interface AerisConfirmPopupSubscribable<T> {
  subscribe(next: (event: T) => void): AerisConfirmPopupSubscription;
}

export interface AerisConfirmPopupTemplateContext<TData = unknown> {
  readonly $implicit: AerisConfirmPopup;
  readonly config: AerisConfirmPopupResolvedConfig<TData>;
  readonly data: TData | undefined;
  readonly accept: (event?: Event) => void;
  readonly reject: (event?: Event) => void;
  readonly close: (event?: Event) => void;
}

interface AerisConfirmPopupRequest<TData = unknown> {
  readonly id: number;
  readonly config: AerisConfirmPopupResolvedConfig<TData>;
  readonly ref: AerisConfirmPopupRef<TData>;
}

interface AerisConfirmPopupRefController {
  readonly accept: (originalEvent: Event | null) => void;
  readonly reject: (originalEvent: Event | null) => void;
  readonly close: (originalEvent: Event | null) => void;
  readonly focus: (options?: FocusOptions) => void;
  readonly reposition: () => void;
}

class AerisConfirmPopupEventStream<T> implements AerisConfirmPopupSubscribable<T> {
  private readonly listeners = new Set<(event: T) => void>();
  private completed = false;

  subscribe(next: (event: T) => void): AerisConfirmPopupSubscription {
    if (this.completed) return { unsubscribe: () => undefined };
    this.listeners.add(next);
    return {
      unsubscribe: () => {
        this.listeners.delete(next);
      },
    };
  }

  next(event: T): void {
    if (this.completed) return;
    for (const listener of [...this.listeners]) listener(event);
  }

  complete(): void {
    this.completed = true;
    this.listeners.clear();
  }
}

@Directive({ selector: 'ng-template[aerisConfirmPopupIcon]' })
export class AerisConfirmPopupIconTemplate {
  readonly template = inject<TemplateRef<AerisConfirmPopupTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisConfirmPopupMessage]' })
export class AerisConfirmPopupMessageTemplate {
  readonly template = inject<TemplateRef<AerisConfirmPopupTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisConfirmPopupFooter]' })
export class AerisConfirmPopupFooterTemplate {
  readonly template = inject<TemplateRef<AerisConfirmPopupTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisConfirmPopupHeadless]' })
export class AerisConfirmPopupHeadlessTemplate {
  readonly template = inject<TemplateRef<AerisConfirmPopupTemplateContext>>(TemplateRef);
}

export class AerisConfirmPopupRef<TData = unknown> {
  private readonly acceptedStream = new AerisConfirmPopupEventStream<
    AerisConfirmPopupActionEvent<TData>
  >();
  private readonly rejectedStream = new AerisConfirmPopupEventStream<
    AerisConfirmPopupActionEvent<TData>
  >();
  private readonly closedStream = new AerisConfirmPopupEventStream<
    AerisConfirmPopupCloseEvent<TData>
  >();
  private readonly shownStream = new AerisConfirmPopupEventStream<
    AerisConfirmPopupActionEvent<TData>
  >();
  private controller: AerisConfirmPopupRefController | null = null;
  private closedOnce = false;

  readonly accepted: AerisConfirmPopupSubscribable<AerisConfirmPopupActionEvent<TData>> =
    this.acceptedStream;
  readonly rejected: AerisConfirmPopupSubscribable<AerisConfirmPopupActionEvent<TData>> =
    this.rejectedStream;
  readonly closed: AerisConfirmPopupSubscribable<AerisConfirmPopupCloseEvent<TData>> =
    this.closedStream;
  readonly shown: AerisConfirmPopupSubscribable<AerisConfirmPopupActionEvent<TData>> =
    this.shownStream;

  accept(originalEvent: Event | null = null): void {
    if (this.closedOnce) return;
    this.controller?.accept(originalEvent);
  }

  reject(originalEvent: Event | null = null): void {
    if (this.closedOnce) return;
    this.controller?.reject(originalEvent);
  }

  close(originalEvent: Event | null = null): void {
    if (this.closedOnce) return;
    this.controller?.close(originalEvent);
  }

  focus(options?: FocusOptions): void {
    this.controller?.focus(options);
  }

  reposition(): void {
    this.controller?.reposition();
  }

  attach(controller: AerisConfirmPopupRefController): void {
    this.controller = controller;
  }

  notifyShown(event: AerisConfirmPopupActionEvent<TData>): void {
    if (this.closedOnce) return;
    this.shownStream.next(event);
  }

  notifyAccepted(event: AerisConfirmPopupActionEvent<TData>): void {
    if (this.closedOnce) return;
    this.acceptedStream.next(event);
  }

  notifyRejected(event: AerisConfirmPopupActionEvent<TData>): void {
    if (this.closedOnce) return;
    this.rejectedStream.next(event);
  }

  notifyClosed(event: AerisConfirmPopupCloseEvent<TData>): void {
    if (this.closedOnce) return;
    this.closedOnce = true;
    this.closedStream.next(event);
    this.acceptedStream.complete();
    this.rejectedStream.complete();
    this.closedStream.complete();
    this.shownStream.complete();
    this.controller = null;
  }
}

@Service()
export class AerisConfirmPopupService {
  private readonly appRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly requestState = signal<AerisConfirmPopupRequest | null>(null);
  private readonly closeState = signal(0);
  private readonly activeRefs = new Set<AerisConfirmPopupRef>();
  private readonly dynamicHosts = new Map<AerisConfirmPopupRef, ComponentRef<AerisConfirmPopup>>();
  private nextId = 0;

  readonly request = this.requestState.asReadonly();
  readonly closeSignal = this.closeState.asReadonly();

  confirm<TData = unknown>(config: AerisConfirmPopupConfig<TData>): AerisConfirmPopupRef<TData> {
    const ref = new AerisConfirmPopupRef<TData>();
    const resolvedConfig = this.resolveConfig(config);

    if (!resolvedConfig.key) {
      this.openDynamicHost(resolvedConfig, ref);
      return ref;
    }

    const request: AerisConfirmPopupRequest<TData> = {
      id: ++this.nextId,
      config: resolvedConfig,
      ref,
    };
    this.activeRefs.add(ref as AerisConfirmPopupRef);
    ref.closed.subscribe(() => this.activeRefs.delete(ref as AerisConfirmPopupRef));
    this.requestState.set(request as AerisConfirmPopupRequest);
    return ref;
  }

  closeAll(): void {
    for (const ref of [...this.activeRefs]) ref.close();
    this.closeState.update((value) => value + 1);
  }

  private openDynamicHost<TData>(
    config: AerisConfirmPopupResolvedConfig<TData>,
    ref: AerisConfirmPopupRef<TData>,
  ): void {
    const hostRef = createComponent(AerisConfirmPopup, {
      environmentInjector: this.environmentInjector,
    });
    const cleanup = (): void => {
      if (!this.activeRefs.delete(ref as AerisConfirmPopupRef)) return;
      this.dynamicHosts.delete(ref as AerisConfirmPopupRef);
      this.appRef.detachView(hostRef.hostView);
      hostRef.destroy();
    };

    this.activeRefs.add(ref as AerisConfirmPopupRef);
    this.dynamicHosts.set(ref as AerisConfirmPopupRef, hostRef);
    ref.closed.subscribe(() => queueMicrotask(cleanup));
    this.appRef.attachView(hostRef.hostView);
    this.document.body.appendChild(this.rootNode(hostRef));
    hostRef.changeDetectorRef.detectChanges();
    hostRef.instance.openWithConfig(config, ref);
    ref.attach({
      accept: (originalEvent) => {
        hostRef.instance.accept(originalEvent);
        hostRef.changeDetectorRef.detectChanges();
      },
      reject: (originalEvent) => {
        hostRef.instance.reject(originalEvent);
        hostRef.changeDetectorRef.detectChanges();
      },
      close: (originalEvent) => {
        hostRef.instance.close(originalEvent);
        hostRef.changeDetectorRef.detectChanges();
      },
      focus: (options) => hostRef.instance.focus(options),
      reposition: () => hostRef.instance.reposition(),
    });
    hostRef.changeDetectorRef.detectChanges();
  }

  private rootNode(hostRef: ComponentRef<AerisConfirmPopup>): Node {
    const [node] = (hostRef.hostView as EmbeddedViewRef<unknown>).rootNodes;
    return node instanceof Node ? node : this.document.createTextNode('');
  }

  private resolveConfig<TData>(
    config: AerisConfirmPopupConfig<TData>,
  ): AerisConfirmPopupResolvedConfig<TData> {
    return {
      key: config.key ?? '',
      target: this.resolveTarget(config.target),
      header: config.header ?? 'Confirm action',
      message: config.message ?? '',
      data: config.data,
      icon: config.icon ?? 'question',
      severity: config.severity ?? 'primary',
      acceptLabel: config.acceptLabel ?? 'Confirm',
      rejectLabel: config.rejectLabel ?? 'Cancel',
      acceptVisible: config.acceptVisible ?? true,
      rejectVisible: config.rejectVisible ?? true,
      acceptDisabled: config.acceptDisabled ?? false,
      rejectDisabled: config.rejectDisabled ?? false,
      acceptAriaLabel: config.acceptAriaLabel ?? config.acceptLabel ?? 'Confirm',
      rejectAriaLabel: config.rejectAriaLabel ?? config.rejectLabel ?? 'Cancel',
      defaultFocus: config.defaultFocus ?? 'accept',
      placement: config.placement ?? 'auto',
      alignment: config.alignment ?? 'center',
      width: config.width ?? '',
      maxWidth: config.maxWidth ?? '',
      offset: config.offset ?? 10,
      viewportMargin: config.viewportMargin ?? 8,
      dismissible: config.dismissible ?? true,
      closeOnEscape: config.closeOnEscape ?? true,
      focusTrap: config.focusTrap ?? true,
      restoreFocus: config.restoreFocus ?? true,
      autoFocus: config.autoFocus ?? true,
      initialFocus: config.initialFocus ?? '',
      showArrow: config.showArrow ?? true,
      ariaLabel: config.ariaLabel ?? '',
      ariaLabelledBy: config.ariaLabelledBy ?? '',
      ariaDescribedBy: config.ariaDescribedBy ?? '',
      accept: config.accept,
      reject: config.reject,
    };
  }

  private resolveTarget(target: AerisConfirmPopupTarget): Element {
    const element = this.targetElement(target);
    if (!element) {
      throw new Error('AerisConfirmPopup requires a target Element or trigger Event.');
    }
    return element;
  }

  private targetElement(target: AerisConfirmPopupTarget): Element | null {
    if (target instanceof Element) return target;
    if (target instanceof Event) {
      return this.targetElement(target.currentTarget ?? target.target);
    }
    return target instanceof Element ? target : null;
  }
}

let nextPopupId = 0;

@Component({
  selector: 'aeris-confirm-popup',
  imports: [AerisButtonDirective, NgTemplateOutlet],
  template: `
    @if (visible()) {
      <div class="aeris-confirm-popup__layer" [attr.data-positioned]="positioned() || null">
        <section
          #popupPanel
          class="aeris-confirm-popup__panel"
          role="alertdialog"
          tabindex="-1"
          [id]="popupId"
          [attr.aria-modal]="true"
          [attr.aria-label]="settings().ariaLabel || null"
          [attr.aria-labelledby]="computedAriaLabelledBy()"
          [attr.aria-describedby]="computedAriaDescribedBy()"
          [attr.data-placement]="actualPlacement()"
          [attr.data-severity]="settings().severity"
          [attr.data-headless]="headlessTemplate() ? true : null"
          [style.left.px]="coordinates().x"
          [style.top.px]="coordinates().y"
          [style.--aeris-confirm-popup-width]="settings().width || null"
          [style.--aeris-confirm-popup-max-width]="settings().maxWidth || null"
          (keydown)="handlePanelKeydown($event)"
        >
          @if (settings().showArrow) {
            <span class="aeris-confirm-popup__arrow" aria-hidden="true"></span>
          }

          @if (headlessTemplate(); as headlessTemplateRef) {
            <ng-container
              [ngTemplateOutlet]="headlessTemplateRef.template"
              [ngTemplateOutletContext]="templateContext()"
            />
          } @else {
            <div class="aeris-confirm-popup__body">
              @if (iconTemplate(); as iconTemplateRef) {
                <div class="aeris-confirm-popup__icon" aria-hidden="true">
                  <ng-container
                    [ngTemplateOutlet]="iconTemplateRef.template"
                    [ngTemplateOutletContext]="templateContext()"
                  />
                </div>
              } @else if (settings().icon !== 'none') {
                <span
                  class="aeris-confirm-popup__icon"
                  [attr.data-icon]="settings().icon"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" focusable="false">
                    @switch (settings().icon) {
                      @case ('info') {
                        <path d="M12 17v-6" />
                        <path d="M12 7.5h.01" />
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                      }
                      @case ('warning') {
                        <path d="M12 4.5 21 19H3L12 4.5Z" />
                        <path d="M12 10v4" />
                        <path d="M12 17h.01" />
                      }
                      @case ('danger') {
                        <path d="M12 4.5 21 19H3L12 4.5Z" />
                        <path d="M12 10v4" />
                        <path d="M12 17h.01" />
                      }
                      @case ('success') {
                        <path d="M20 7 10 17l-5-5" />
                      }
                      @default {
                        <path d="M9.75 9a2.25 2.25 0 1 1 3.15 2.07c-.61.28-.9.82-.9 1.43v.5" />
                        <path d="M12 17h.01" />
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                      }
                    }
                  </svg>
                </span>
              }

              <div class="aeris-confirm-popup__copy">
                @if (settings().header) {
                  <div class="aeris-confirm-popup__title" [id]="titleId">
                    {{ settings().header }}
                  </div>
                }
                <div class="aeris-confirm-popup__message" [id]="messageId">
                  @if (messageTemplate(); as messageTemplateRef) {
                    <ng-container
                      [ngTemplateOutlet]="messageTemplateRef.template"
                      [ngTemplateOutletContext]="templateContext()"
                    />
                  } @else {
                    {{ settings().message }}
                  }
                </div>
              </div>
            </div>

            @if (footerTemplate(); as footerTemplateRef) {
              <ng-container
                [ngTemplateOutlet]="footerTemplateRef.template"
                [ngTemplateOutletContext]="templateContext()"
              />
            } @else {
              <div class="aeris-confirm-popup__actions">
                @if (settings().rejectVisible) {
                  <button
                    aerisButton
                    type="button"
                    variant="secondary"
                    class="aeris-confirm-popup__button aeris-confirm-popup__reject"
                    [disabled]="settings().rejectDisabled"
                    [attr.aria-label]="settings().rejectAriaLabel"
                    (click)="reject($event)"
                  >
                    {{ settings().rejectLabel }}
                  </button>
                }

                @if (settings().acceptVisible) {
                  <button
                    aerisButton
                    type="button"
                    class="aeris-confirm-popup__button aeris-confirm-popup__accept"
                    [severity]="acceptButtonSeverity()"
                    [attr.data-severity]="settings().severity"
                    [disabled]="settings().acceptDisabled"
                    [attr.aria-label]="settings().acceptAriaLabel"
                    (click)="accept($event)"
                  >
                    {{ settings().acceptLabel }}
                  </button>
                }
              </div>
            }
          }
        </section>
      </div>
    }
  `,
  styleUrl: './aeris-confirm-popup.scss',
  host: {
    class: 'aeris-confirm-popup',
    '[attr.data-open]': 'visible() || null',
  },
})
export class AerisConfirmPopup {
  private readonly service = inject(AerisConfirmPopupService);
  private readonly document = inject(DOCUMENT);
  private readonly repositionFrame = aerisInternalCreateFrameScheduler(() => this.reposition());
  private readonly activeRequest = signal<AerisConfirmPopupRequest | null>(null);
  readonly target = input<AerisConfirmPopupTarget>(null);
  private readonly localConfig = computed<AerisConfirmPopupResolvedConfig>(() => ({
    key: this.key(),
    target: this.localTarget(),
    header: this.header(),
    message: this.message(),
    data: this.data(),
    icon: this.icon(),
    severity: this.severity(),
    acceptLabel: this.acceptLabel(),
    rejectLabel: this.rejectLabel(),
    acceptVisible: this.acceptVisible(),
    rejectVisible: this.rejectVisible(),
    acceptDisabled: this.acceptDisabled(),
    rejectDisabled: this.rejectDisabled(),
    acceptAriaLabel: this.acceptAriaLabel() || this.acceptLabel(),
    rejectAriaLabel: this.rejectAriaLabel() || this.rejectLabel(),
    defaultFocus: this.defaultFocus(),
    placement: this.placement(),
    alignment: this.alignment(),
    width: this.width(),
    maxWidth: this.maxWidth(),
    offset: this.offset(),
    viewportMargin: this.viewportMargin(),
    dismissible: this.dismissible(),
    closeOnEscape: this.closeOnEscape(),
    focusTrap: this.focusTrap(),
    restoreFocus: this.restoreFocus(),
    autoFocus: this.autoFocus(),
    initialFocus: this.initialFocus(),
    showArrow: this.showArrow(),
    ariaLabel: this.ariaLabel(),
    ariaLabelledBy: this.ariaLabelledBy(),
    ariaDescribedBy: this.ariaDescribedBy(),
  }));
  private readonly triggerAttributes = signal<{
    readonly target: Element;
    readonly expanded: string | null;
    readonly controls: string | null;
    readonly haspopup: string | null;
  } | null>(null);
  private lastRequestId = 0;
  private lastCloseSignal = 0;
  private previousVisible = false;
  private pendingResult: AerisConfirmPopupResult | null = null;
  private pendingReason: AerisConfirmPopupCloseReason = 'api';
  private pendingOriginalEvent: Event | null = null;

  protected readonly popupPanel = viewChild<ElementRef<HTMLElement>>('popupPanel');
  protected readonly iconTemplate = contentChild(AerisConfirmPopupIconTemplate);
  protected readonly messageTemplate = contentChild(AerisConfirmPopupMessageTemplate);
  protected readonly footerTemplate = contentChild(AerisConfirmPopupFooterTemplate);
  protected readonly headlessTemplate = contentChild(AerisConfirmPopupHeadlessTemplate);
  protected readonly positioned = signal(false);
  protected readonly actualPlacement =
    signal<Exclude<AerisConfirmPopupPlacement, 'auto'>>('bottom');
  protected readonly coordinates = signal({ x: 0, y: 0 });
  protected readonly settings = computed(() => this.activeRequest()?.config ?? this.localConfig());
  protected readonly acceptButtonSeverity = computed<AerisButtonSeverity>(() => {
    const severity = this.settings().severity;
    return severity === 'neutral' ? 'secondary' : severity;
  });
  protected readonly templateContext = computed<AerisConfirmPopupTemplateContext>(() => ({
    $implicit: this,
    config: this.settings(),
    data: this.settings().data,
    accept: (event?: Event) => this.accept(event ?? null),
    reject: (event?: Event) => this.reject(event ?? null),
    close: (event?: Event) => this.close(event ?? null),
  }));
  protected readonly computedAriaLabelledBy = computed(() => {
    const labelledBy = this.settings().ariaLabelledBy;
    if (labelledBy) return labelledBy;
    if (this.settings().ariaLabel) return null;
    return this.settings().header && !this.headlessTemplate() ? this.titleId : null;
  });
  protected readonly computedAriaDescribedBy = computed(() => {
    const describedBy = this.settings().ariaDescribedBy;
    if (describedBy) return describedBy;
    return this.settings().message || this.messageTemplate() ? this.messageId : null;
  });
  protected readonly initialFocusTarget = computed(() => {
    const settings = this.settings();
    if (settings.initialFocus) return settings.initialFocus;
    switch (settings.defaultFocus) {
      case 'accept':
        return '.aeris-confirm-popup__accept';
      case 'reject':
        return '.aeris-confirm-popup__reject';
      case 'popup':
        return '.aeris-confirm-popup__panel';
      case 'none':
        return '';
      default:
        return '';
    }
  });
  protected readonly autoFocusTarget = computed(
    () => this.settings().autoFocus && this.settings().defaultFocus !== 'none',
  );

  readonly visible = model(false);

  readonly key = input('');
  readonly header = input('Confirm action');
  readonly message = input('');
  readonly data = input<unknown>();
  readonly icon = input<AerisConfirmPopupIcon>('question');
  readonly severity = input<AerisConfirmPopupSeverity>('primary');
  readonly acceptLabel = input('Confirm');
  readonly rejectLabel = input('Cancel');
  readonly acceptVisible = input(true, { transform: booleanAttribute });
  readonly rejectVisible = input(true, { transform: booleanAttribute });
  readonly acceptDisabled = input(false, { transform: booleanAttribute });
  readonly rejectDisabled = input(false, { transform: booleanAttribute });
  readonly acceptAriaLabel = input('');
  readonly rejectAriaLabel = input('');
  readonly defaultFocus = input<AerisConfirmPopupDefaultFocus>('accept');
  readonly placement = input<AerisConfirmPopupPlacement>('auto');
  readonly alignment = input<AerisConfirmPopupAlignment>('center');
  readonly width = input('');
  readonly maxWidth = input('');
  readonly offset = input(10);
  readonly viewportMargin = input(8);
  readonly dismissible = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly focusTrap = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly initialFocus = input('');
  readonly showArrow = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  readonly shown = output<AerisConfirmPopupActionEvent>();
  readonly accepted = output<AerisConfirmPopupActionEvent>();
  readonly rejected = output<AerisConfirmPopupActionEvent>();
  readonly closed = output<AerisConfirmPopupCloseEvent>();

  readonly popupId = `aeris-confirm-popup-${nextPopupId++}`;
  readonly titleId = `${this.popupId}-title`;
  readonly messageId = `${this.popupId}-message`;

  constructor() {
    effect(() => {
      const request = this.service.request();
      if (!request || request.id === this.lastRequestId) return;
      if (request.config.key !== this.key()) return;
      this.lastRequestId = request.id;
      this.openRequest(request);
    });

    effect(() => {
      const closeSignal = this.service.closeSignal();
      if (closeSignal === this.lastCloseSignal) return;
      this.lastCloseSignal = closeSignal;
      this.close();
    });

    effect(() => {
      const visible = this.visible();
      if (visible === this.previousVisible) return;
      if (visible) {
        this.handleShown();
      } else {
        this.handleHidden();
      }
      this.previousVisible = visible;
    });

    effect((onCleanup) => {
      if (!this.visible()) return;
      const keydown = (event: KeyboardEvent) => this.handleDocumentKeydown(event);
      const pointerdown = (event: PointerEvent) => this.handleDocumentPointerdown(event);
      const reposition = this.repositionFrame.schedule;
      const view = this.document.defaultView;
      this.document.addEventListener('keydown', keydown);
      this.document.addEventListener('pointerdown', pointerdown);
      view?.addEventListener('resize', reposition);
      view?.addEventListener('scroll', reposition);
      onCleanup(() => {
        this.document.removeEventListener('keydown', keydown);
        this.document.removeEventListener('pointerdown', pointerdown);
        view?.removeEventListener('resize', reposition);
        view?.removeEventListener('scroll', reposition);
        this.repositionFrame.cancel();
      });
    });
  }

  openWithConfig<TData>(
    config: AerisConfirmPopupResolvedConfig<TData>,
    ref: AerisConfirmPopupRef<TData>,
  ): void {
    this.openRequest({
      id: ++this.lastRequestId,
      config,
      ref,
    } as unknown as AerisConfirmPopupRequest);
  }

  accept(originalEvent: Event | null = null): void {
    const settings = this.settings();
    if (!this.visible() || settings.acceptDisabled || !settings.acceptVisible) return;
    const event = this.actionEvent(originalEvent);
    settings.accept?.(event);
    this.accepted.emit(event);
    this.activeRequest()?.ref.notifyAccepted(event);
    this.closeWithResult('accept', 'accept', originalEvent);
  }

  reject(originalEvent: Event | null = null): void {
    const settings = this.settings();
    if (!this.visible() || settings.rejectDisabled || !settings.rejectVisible) return;
    const event = this.actionEvent(originalEvent);
    settings.reject?.(event);
    this.rejected.emit(event);
    this.activeRequest()?.ref.notifyRejected(event);
    this.closeWithResult('reject', 'reject', originalEvent);
  }

  close(originalEvent: Event | null = null): void {
    if (!this.visible()) return;
    this.closeWithResult('dismiss', 'api', originalEvent);
  }

  focus(options?: FocusOptions): void {
    this.focusInitial(options);
  }

  reposition(): void {
    if (!this.visible()) return;
    const panel = this.popupPanel()?.nativeElement;
    const target = this.settings().target;
    const view = target.ownerDocument.defaultView;
    if (!panel || !view) return;

    const targetRect = target.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const width = panelRect.width || panel.offsetWidth || 320;
    const height = panelRect.height || panel.offsetHeight || 160;
    const settings = this.settings();
    const { placement, x, y } = aerisInternalPositionAnchoredOverlay({
      target: targetRect,
      width,
      height,
      placement: settings.placement,
      alignment: settings.alignment,
      offset: settings.offset,
      margin: settings.viewportMargin,
      viewportWidth: view.innerWidth,
      viewportHeight: view.innerHeight,
    });

    this.actualPlacement.set(placement);
    this.coordinates.set({ x, y });
    this.positioned.set(true);
    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.setAttribute('data-placement', placement);
    panel.parentElement?.setAttribute('data-positioned', 'true');
  }

  protected handlePanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.settings().focusTrap) return;
    this.trapTab(event);
  }

  protected handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.visible() || event.key !== 'Escape' || !this.settings().closeOnEscape) return;
    event.preventDefault();
    this.closeWithResult('dismiss', 'escape', event);
  }

  protected handleDocumentPointerdown(event: PointerEvent): void {
    if (!this.visible() || !this.settings().dismissible) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    const panel = this.popupPanel()?.nativeElement;
    if (panel?.contains(target) || this.settings().target.contains(target)) return;
    this.closeWithResult('dismiss', 'outside', event);
  }

  private handleShown(): void {
    this.positioned.set(false);
    this.updateTriggerAttributes(true);
    const event = this.actionEvent(null);
    this.shown.emit(event);
    this.activeRequest()?.ref.notifyShown(event);
    queueMicrotask(() => {
      this.reposition();
      if (this.autoFocusTarget()) this.focusInitial();
    });
  }

  private handleHidden(): void {
    const restoreFocus = this.settings().restoreFocus;
    const focusTarget = this.settings().target;
    const result = this.pendingResult ?? 'dismiss';
    const reason = this.pendingReason;
    const originalEvent = this.pendingOriginalEvent;
    const closeEvent: AerisConfirmPopupCloseEvent = {
      ...this.actionEvent(originalEvent),
      result,
      reason,
    };
    const ref = this.activeRequest()?.ref;

    this.updateTriggerAttributes(false);
    this.visible.set(false);
    this.positioned.set(false);
    this.pendingResult = null;
    this.pendingReason = 'api';
    this.pendingOriginalEvent = null;
    this.activeRequest.set(null);
    this.closed.emit(closeEvent);
    ref?.notifyClosed(closeEvent);

    if (restoreFocus) {
      queueMicrotask(() => this.focusTarget(focusTarget));
    }
  }

  private openRequest(request: AerisConfirmPopupRequest): void {
    this.pendingResult = null;
    this.pendingReason = 'api';
    this.pendingOriginalEvent = null;
    this.activeRequest.set(request);
    request.ref.attach({
      accept: (originalEvent) => this.accept(originalEvent),
      reject: (originalEvent) => this.reject(originalEvent),
      close: (originalEvent) => this.close(originalEvent),
      focus: (options) => this.focus(options),
      reposition: () => this.reposition(),
    });
    this.visible.set(true);
  }

  private closeWithResult(
    result: AerisConfirmPopupResult,
    reason: AerisConfirmPopupCloseReason,
    originalEvent: Event | null,
  ): void {
    this.pendingResult = result;
    this.pendingReason = reason;
    this.pendingOriginalEvent = originalEvent;
    this.visible.set(false);
  }

  private actionEvent(originalEvent: Event | null): AerisConfirmPopupActionEvent {
    const settings = this.settings();
    return {
      originalEvent,
      data: settings.data,
      config: settings,
    };
  }

  private updateTriggerAttributes(open: boolean): void {
    const target = this.settings().target;
    if (open) {
      this.triggerAttributes.set({
        target,
        expanded: target.getAttribute('aria-expanded'),
        controls: target.getAttribute('aria-controls'),
        haspopup: target.getAttribute('aria-haspopup'),
      });
      target.setAttribute('aria-haspopup', 'dialog');
      target.setAttribute('aria-expanded', 'true');
      target.setAttribute('aria-controls', this.popupId);
      return;
    }

    const previous = this.triggerAttributes();
    if (!previous) return;
    if (previous.expanded === null) {
      previous.target.removeAttribute('aria-expanded');
    } else {
      previous.target.setAttribute('aria-expanded', previous.expanded);
    }
    if (previous.controls === null) {
      previous.target.removeAttribute('aria-controls');
    } else {
      previous.target.setAttribute('aria-controls', previous.controls);
    }
    if (previous.haspopup === null) {
      previous.target.removeAttribute('aria-haspopup');
    } else {
      previous.target.setAttribute('aria-haspopup', previous.haspopup);
    }
    this.triggerAttributes.set(null);
  }

  private focusInitial(options?: FocusOptions): void {
    const panel = this.popupPanel()?.nativeElement;
    if (!panel) return;
    aerisInternalFocusInitialElement(panel, this.initialFocusTarget(), options);
  }

  private trapTab(event: KeyboardEvent): void {
    const panel = this.popupPanel()?.nativeElement;
    if (!panel) return;
    aerisInternalTrapTabFocus(event, panel, this.activeHtmlElement());
  }

  private activeHtmlElement(): HTMLElement | null {
    const active = this.settings().target.ownerDocument.activeElement;
    return active instanceof HTMLElement ? active : null;
  }

  private focusTarget(target: Element): void {
    if (target instanceof HTMLElement) target.focus();
  }

  private localTarget(): Element {
    const target = this.target();
    if (target instanceof Element) return target;
    if (target instanceof Event) {
      const eventTarget = target.currentTarget ?? target.target;
      if (eventTarget instanceof Element) return eventTarget;
    }
    throw new Error('AerisConfirmPopup requires a target Element or trigger Event.');
  }
}

export const AerisConfirmPopupModule = [
  AerisConfirmPopup,
  AerisConfirmPopupIconTemplate,
  AerisConfirmPopupMessageTemplate,
  AerisConfirmPopupFooterTemplate,
  AerisConfirmPopupHeadlessTemplate,
] as const;
