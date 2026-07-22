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
import {
  AerisDialog,
  AerisDialogFooterTemplate,
  AerisDialogHeadlessTemplate,
  type AerisDialogCloseReason,
  type AerisDialogPosition,
  type AerisDialogSize,
  type AerisDialogVisibilityChangeEvent,
} from '@aeris-ui/core/dialog';
import { AerisButtonDirective, type AerisButtonSeverity } from '@aeris-ui/core/button';

export type AerisConfirmDialogSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral';
export type AerisConfirmDialogIcon =
  | 'question'
  | 'info'
  | 'warning'
  | 'danger'
  | 'success'
  | 'none';
export type AerisConfirmDialogDefaultFocus = 'accept' | 'reject' | 'close' | 'dialog' | 'none';
export type AerisConfirmDialogResult = 'accept' | 'reject' | 'dismiss';

export interface AerisConfirmDialogConfig<TData = unknown> {
  readonly key?: string;
  readonly header?: string;
  readonly message?: string;
  readonly data?: TData;
  readonly icon?: AerisConfirmDialogIcon;
  readonly severity?: AerisConfirmDialogSeverity;
  readonly acceptLabel?: string;
  readonly rejectLabel?: string;
  readonly acceptVisible?: boolean;
  readonly rejectVisible?: boolean;
  readonly acceptDisabled?: boolean;
  readonly rejectDisabled?: boolean;
  readonly acceptAriaLabel?: string;
  readonly rejectAriaLabel?: string;
  readonly defaultFocus?: AerisConfirmDialogDefaultFocus;
  readonly modal?: boolean;
  readonly backdrop?: boolean;
  readonly backdropBlur?: boolean;
  readonly backdropBlurAmount?: string;
  readonly dismissibleMask?: boolean;
  readonly closeOnEscape?: boolean;
  readonly closable?: boolean;
  readonly blockScroll?: boolean;
  readonly focusTrap?: boolean;
  readonly restoreFocus?: boolean;
  readonly autoFocus?: boolean;
  readonly initialFocus?: string;
  readonly position?: AerisDialogPosition;
  readonly size?: AerisDialogSize;
  readonly width?: string;
  readonly maxWidth?: string;
  readonly mobileWidth?: string;
  readonly closeAriaLabel?: string;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
  readonly ariaDescribedBy?: string;
  readonly accept?: (event: AerisConfirmDialogActionEvent<TData>) => void;
  readonly reject?: (event: AerisConfirmDialogActionEvent<TData>) => void;
}

export interface AerisConfirmDialogResolvedConfig<TData = unknown> {
  readonly key: string;
  readonly header: string;
  readonly message: string;
  readonly data: TData | undefined;
  readonly icon: AerisConfirmDialogIcon;
  readonly severity: AerisConfirmDialogSeverity;
  readonly acceptLabel: string;
  readonly rejectLabel: string;
  readonly acceptVisible: boolean;
  readonly rejectVisible: boolean;
  readonly acceptDisabled: boolean;
  readonly rejectDisabled: boolean;
  readonly acceptAriaLabel: string;
  readonly rejectAriaLabel: string;
  readonly defaultFocus: AerisConfirmDialogDefaultFocus;
  readonly modal: boolean;
  readonly backdrop: boolean;
  readonly backdropBlur: boolean;
  readonly backdropBlurAmount: string;
  readonly dismissibleMask: boolean;
  readonly closeOnEscape: boolean;
  readonly closable: boolean;
  readonly blockScroll: boolean;
  readonly focusTrap: boolean;
  readonly restoreFocus: boolean;
  readonly autoFocus: boolean;
  readonly initialFocus: string;
  readonly position: AerisDialogPosition;
  readonly size: AerisDialogSize;
  readonly width: string;
  readonly maxWidth: string;
  readonly mobileWidth: string;
  readonly closeAriaLabel: string;
  readonly ariaLabel: string;
  readonly ariaLabelledBy: string;
  readonly ariaDescribedBy: string;
  readonly accept?: (event: AerisConfirmDialogActionEvent<TData>) => void;
  readonly reject?: (event: AerisConfirmDialogActionEvent<TData>) => void;
}

export interface AerisConfirmDialogActionEvent<TData = unknown> {
  readonly originalEvent: Event | null;
  readonly data: TData | undefined;
  readonly config: AerisConfirmDialogResolvedConfig<TData>;
}

export interface AerisConfirmDialogCloseEvent<TData = unknown>
  extends AerisConfirmDialogActionEvent<TData> {
  readonly result: AerisConfirmDialogResult;
  readonly reason: AerisDialogCloseReason | 'accept' | 'reject';
}

export interface AerisConfirmDialogSubscription {
  unsubscribe(): void;
}

export interface AerisConfirmDialogSubscribable<T> {
  subscribe(next: (event: T) => void): AerisConfirmDialogSubscription;
}

export interface AerisConfirmDialogTemplateContext<TData = unknown> {
  readonly $implicit: AerisConfirmDialog;
  readonly config: AerisConfirmDialogResolvedConfig<TData>;
  readonly data: TData | undefined;
  readonly accept: (event?: Event) => void;
  readonly reject: (event?: Event) => void;
  readonly close: (event?: Event) => void;
}

interface AerisConfirmDialogRequest<TData = unknown> {
  readonly id: number;
  readonly config: AerisConfirmDialogResolvedConfig<TData>;
  readonly ref: AerisConfirmDialogRef<TData>;
}

interface AerisConfirmDialogRefController {
  readonly accept: (originalEvent: Event | null) => void;
  readonly reject: (originalEvent: Event | null) => void;
  readonly close: (originalEvent: Event | null) => void;
  readonly focus: (options?: FocusOptions) => void;
}

class AerisConfirmDialogEventStream<T> implements AerisConfirmDialogSubscribable<T> {
  private readonly listeners = new Set<(event: T) => void>();
  private completed = false;

  subscribe(next: (event: T) => void): AerisConfirmDialogSubscription {
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

@Directive({ selector: 'ng-template[aerisConfirmDialogIcon]' })
export class AerisConfirmDialogIconTemplate {
  readonly template = inject<TemplateRef<AerisConfirmDialogTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisConfirmDialogMessage]' })
export class AerisConfirmDialogMessageTemplate {
  readonly template = inject<TemplateRef<AerisConfirmDialogTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisConfirmDialogFooter]' })
export class AerisConfirmDialogFooterTemplate {
  readonly template = inject<TemplateRef<AerisConfirmDialogTemplateContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisConfirmDialogHeadless]' })
export class AerisConfirmDialogHeadlessTemplate {
  readonly template = inject<TemplateRef<AerisConfirmDialogTemplateContext>>(TemplateRef);
}

export class AerisConfirmDialogRef<TData = unknown> {
  private readonly acceptedStream =
    new AerisConfirmDialogEventStream<AerisConfirmDialogActionEvent<TData>>();
  private readonly rejectedStream =
    new AerisConfirmDialogEventStream<AerisConfirmDialogActionEvent<TData>>();
  private readonly closedStream =
    new AerisConfirmDialogEventStream<AerisConfirmDialogCloseEvent<TData>>();
  private readonly shownStream =
    new AerisConfirmDialogEventStream<AerisConfirmDialogActionEvent<TData>>();
  private controller: AerisConfirmDialogRefController | null = null;
  private closedOnce = false;

  readonly accepted: AerisConfirmDialogSubscribable<AerisConfirmDialogActionEvent<TData>> =
    this.acceptedStream;
  readonly rejected: AerisConfirmDialogSubscribable<AerisConfirmDialogActionEvent<TData>> =
    this.rejectedStream;
  readonly closed: AerisConfirmDialogSubscribable<AerisConfirmDialogCloseEvent<TData>> =
    this.closedStream;
  readonly shown: AerisConfirmDialogSubscribable<AerisConfirmDialogActionEvent<TData>> =
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

  attach(controller: AerisConfirmDialogRefController): void {
    this.controller = controller;
  }

  notifyShown(event: AerisConfirmDialogActionEvent<TData>): void {
    if (this.closedOnce) return;
    this.shownStream.next(event);
  }

  notifyAccepted(event: AerisConfirmDialogActionEvent<TData>): void {
    if (this.closedOnce) return;
    this.acceptedStream.next(event);
  }

  notifyRejected(event: AerisConfirmDialogActionEvent<TData>): void {
    if (this.closedOnce) return;
    this.rejectedStream.next(event);
  }

  notifyClosed(event: AerisConfirmDialogCloseEvent<TData>): void {
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
export class AerisConfirmDialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly requestState = signal<AerisConfirmDialogRequest | null>(null);
  private readonly closeState = signal(0);
  private readonly activeRefs = new Set<AerisConfirmDialogRef>();
  private readonly dynamicHosts = new Map<AerisConfirmDialogRef, ComponentRef<AerisConfirmDialog>>();
  private nextId = 0;

  readonly request = this.requestState.asReadonly();
  readonly closeSignal = this.closeState.asReadonly();

  confirm<TData = unknown>(
    config: AerisConfirmDialogConfig<TData>,
  ): AerisConfirmDialogRef<TData> {
    const ref = new AerisConfirmDialogRef<TData>();
    const resolvedConfig = this.resolveConfig(config);

    if (!resolvedConfig.key) {
      this.openDynamicHost(resolvedConfig, ref);
      return ref;
    }

    const request: AerisConfirmDialogRequest<TData> = {
      id: ++this.nextId,
      config: resolvedConfig,
      ref,
    };
    this.activeRefs.add(ref as AerisConfirmDialogRef);
    ref.closed.subscribe(() => this.activeRefs.delete(ref as AerisConfirmDialogRef));
    this.requestState.set(request as AerisConfirmDialogRequest);
    return ref;
  }

  closeAll(): void {
    for (const ref of [...this.activeRefs]) ref.close();
    this.closeState.update((value) => value + 1);
  }

  private openDynamicHost<TData>(
    config: AerisConfirmDialogResolvedConfig<TData>,
    ref: AerisConfirmDialogRef<TData>,
  ): void {
    const hostRef = createComponent(AerisConfirmDialog, {
      environmentInjector: this.environmentInjector,
    });
    const cleanup = (): void => {
      if (!this.activeRefs.delete(ref as AerisConfirmDialogRef)) return;
      this.dynamicHosts.delete(ref as AerisConfirmDialogRef);
      this.appRef.detachView(hostRef.hostView);
      hostRef.destroy();
    };

    this.activeRefs.add(ref as AerisConfirmDialogRef);
    this.dynamicHosts.set(ref as AerisConfirmDialogRef, hostRef);
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
    });
    hostRef.changeDetectorRef.detectChanges();
  }

  private rootNode(hostRef: ComponentRef<AerisConfirmDialog>): Node {
    const [node] = (hostRef.hostView as EmbeddedViewRef<unknown>).rootNodes;
    return node instanceof Node ? node : this.document.createTextNode('');
  }

  private resolveConfig<TData>(
    config: AerisConfirmDialogConfig<TData>,
  ): AerisConfirmDialogResolvedConfig<TData> {
    return {
      key: config.key ?? '',
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
      modal: config.modal ?? true,
      backdrop: config.backdrop ?? true,
      backdropBlur: config.backdropBlur ?? true,
      backdropBlurAmount: config.backdropBlurAmount ?? '',
      dismissibleMask: config.dismissibleMask ?? false,
      closeOnEscape: config.closeOnEscape ?? true,
      closable: config.closable ?? true,
      blockScroll: config.blockScroll ?? true,
      focusTrap: config.focusTrap ?? true,
      restoreFocus: config.restoreFocus ?? true,
      autoFocus: config.autoFocus ?? true,
      initialFocus: config.initialFocus ?? '',
      position: config.position ?? 'center',
      size: config.size ?? 'sm',
      width: config.width ?? '',
      maxWidth: config.maxWidth ?? '',
      mobileWidth: config.mobileWidth ?? '',
      closeAriaLabel: config.closeAriaLabel ?? 'Close confirmation dialog',
      ariaLabel: config.ariaLabel ?? '',
      ariaLabelledBy: config.ariaLabelledBy ?? '',
      ariaDescribedBy: config.ariaDescribedBy ?? '',
      accept: config.accept,
      reject: config.reject,
    };
  }
}

@Component({
  selector: 'aeris-confirm-dialog',
  imports: [
    AerisButtonDirective,
    AerisDialog,
    AerisDialogFooterTemplate,
    AerisDialogHeadlessTemplate,
    NgTemplateOutlet,
  ],
  template: `
    <aeris-dialog
      #dialog
      [role]="'alertdialog'"
      [header]="settings().header"
      [modal]="settings().modal"
      [backdrop]="settings().backdrop"
      [backdropBlur]="settings().backdropBlur"
      [backdropBlurAmount]="settings().backdropBlurAmount"
      [dismissibleMask]="settings().dismissibleMask"
      [closeOnEscape]="settings().closeOnEscape"
      [closable]="settings().closable"
      [blockScroll]="settings().blockScroll"
      [focusTrap]="settings().focusTrap"
      [restoreFocus]="settings().restoreFocus"
      [autoFocus]="autoFocusTarget()"
      [initialFocus]="initialFocusTarget()"
      [position]="settings().position"
      [size]="settings().size"
      [width]="settings().width"
      [maxWidth]="settings().maxWidth"
      [mobileWidth]="settings().mobileWidth"
      [closeAriaLabel]="settings().closeAriaLabel"
      [ariaLabel]="settings().ariaLabel"
      [ariaLabelledBy]="settings().ariaLabelledBy"
      [ariaDescribedBy]="computedAriaDescribedBy()"
      [visible]="visible()"
      (shown)="handleShown($event)"
      (hidden)="handleHidden($event)"
    >
      @if (headlessTemplate(); as headlessTemplateRef) {
        <ng-template aerisDialogHeadless>
          <ng-container
            [ngTemplateOutlet]="headlessTemplateRef.template"
            [ngTemplateOutletContext]="templateContext()"
          />
        </ng-template>
      } @else {
        <div class="aeris-confirm-dialog__content" [attr.data-severity]="settings().severity">
          @if (iconTemplate(); as iconTemplateRef) {
            <div class="aeris-confirm-dialog__icon" aria-hidden="true">
              <ng-container
                [ngTemplateOutlet]="iconTemplateRef.template"
                [ngTemplateOutletContext]="templateContext()"
              />
            </div>
          } @else if (settings().icon !== 'none') {
            <span
              class="aeris-confirm-dialog__icon"
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

          <div class="aeris-confirm-dialog__message" [id]="messageId">
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

        <ng-template aerisDialogFooter>
          @if (footerTemplate(); as footerTemplateRef) {
            <ng-container
              [ngTemplateOutlet]="footerTemplateRef.template"
              [ngTemplateOutletContext]="templateContext()"
            />
          } @else {
            <div class="aeris-confirm-dialog__actions">
              @if (settings().rejectVisible) {
                <button
                  aerisButton
                  type="button"
                  variant="secondary"
                  class="aeris-confirm-dialog__button aeris-confirm-dialog__reject"
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
                  class="aeris-confirm-dialog__button aeris-confirm-dialog__accept"
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
        </ng-template>
      }
    </aeris-dialog>
  `,
  styleUrl: './aeris-confirm-dialog.scss',
  host: {
    class: 'aeris-confirm-dialog',
    '[attr.data-open]': 'visible() || null',
  },
})
export class AerisConfirmDialog {
  private readonly service = inject(AerisConfirmDialogService);
  private readonly activeRequest = signal<AerisConfirmDialogRequest | null>(null);
  private readonly localConfig = computed<AerisConfirmDialogResolvedConfig>(() => ({
    key: this.key(),
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
    modal: this.modal(),
    backdrop: this.backdrop(),
    backdropBlur: this.backdropBlur(),
    backdropBlurAmount: this.backdropBlurAmount(),
    dismissibleMask: this.dismissibleMask(),
    closeOnEscape: this.closeOnEscape(),
    closable: this.closable(),
    blockScroll: this.blockScroll(),
    focusTrap: this.focusTrap(),
    restoreFocus: this.restoreFocus(),
    autoFocus: this.autoFocus(),
    initialFocus: this.initialFocus(),
    position: this.position(),
    size: this.size(),
    width: this.width(),
    maxWidth: this.maxWidth(),
    mobileWidth: this.mobileWidth(),
    closeAriaLabel: this.closeAriaLabel(),
    ariaLabel: this.ariaLabel(),
    ariaLabelledBy: this.ariaLabelledBy(),
    ariaDescribedBy: this.ariaDescribedBy(),
  }));
  private lastRequestId = 0;
  private lastCloseSignal = 0;
  private pendingResult: AerisConfirmDialogResult | null = null;
  private pendingReason: AerisDialogCloseReason | 'accept' | 'reject' = 'api';
  private pendingOriginalEvent: Event | null = null;

  protected readonly dialog = viewChild<AerisDialog>('dialog');
  protected readonly iconTemplate = contentChild(AerisConfirmDialogIconTemplate);
  protected readonly messageTemplate = contentChild(AerisConfirmDialogMessageTemplate);
  protected readonly footerTemplate = contentChild(AerisConfirmDialogFooterTemplate);
  protected readonly headlessTemplate = contentChild(AerisConfirmDialogHeadlessTemplate);
  protected readonly settings = computed(() => this.activeRequest()?.config ?? this.localConfig());
  protected readonly acceptButtonSeverity = computed<AerisButtonSeverity>(() => {
    const severity = this.settings().severity;
    return severity === 'neutral' ? 'secondary' : severity;
  });
  protected readonly templateContext = computed<AerisConfirmDialogTemplateContext>(() => ({
    $implicit: this,
    config: this.settings(),
    data: this.settings().data,
    accept: (event?: Event) => this.accept(event ?? null),
    reject: (event?: Event) => this.reject(event ?? null),
    close: (event?: Event) => this.close(event ?? null),
  }));
  protected readonly computedAriaDescribedBy = computed(() => {
    const describedBy = this.settings().ariaDescribedBy;
    if (describedBy) return describedBy;
    return this.settings().message || this.messageTemplate() ? this.messageId : '';
  });
  protected readonly initialFocusTarget = computed(() => {
    const settings = this.settings();
    if (settings.initialFocus) return settings.initialFocus;
    switch (settings.defaultFocus) {
      case 'accept':
        return '.aeris-confirm-dialog__accept';
      case 'reject':
        return '.aeris-confirm-dialog__reject';
      case 'close':
        return '.aeris-dialog__action';
      case 'dialog':
        return '.aeris-dialog__panel';
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
  readonly icon = input<AerisConfirmDialogIcon>('question');
  readonly severity = input<AerisConfirmDialogSeverity>('primary');
  readonly acceptLabel = input('Confirm');
  readonly rejectLabel = input('Cancel');
  readonly acceptVisible = input(true, { transform: booleanAttribute });
  readonly rejectVisible = input(true, { transform: booleanAttribute });
  readonly acceptDisabled = input(false, { transform: booleanAttribute });
  readonly rejectDisabled = input(false, { transform: booleanAttribute });
  readonly acceptAriaLabel = input('');
  readonly rejectAriaLabel = input('');
  readonly defaultFocus = input<AerisConfirmDialogDefaultFocus>('accept');
  readonly modal = input(true, { transform: booleanAttribute });
  readonly backdrop = input(true, { transform: booleanAttribute });
  readonly backdropBlur = input(true, { transform: booleanAttribute });
  readonly backdropBlurAmount = input('');
  readonly dismissibleMask = input(false, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly closable = input(true, { transform: booleanAttribute });
  readonly blockScroll = input(true, { transform: booleanAttribute });
  readonly focusTrap = input(true, { transform: booleanAttribute });
  readonly restoreFocus = input(true, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly initialFocus = input('');
  readonly position = input<AerisDialogPosition>('center');
  readonly size = input<AerisDialogSize>('sm');
  readonly width = input('');
  readonly maxWidth = input('');
  readonly mobileWidth = input('');
  readonly closeAriaLabel = input('Close confirmation dialog');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  readonly shown = output<AerisConfirmDialogActionEvent>();
  readonly accepted = output<AerisConfirmDialogActionEvent>();
  readonly rejected = output<AerisConfirmDialogActionEvent>();
  readonly closed = output<AerisConfirmDialogCloseEvent>();

  readonly messageId = `aeris-confirm-dialog-${Math.random().toString(36).slice(2)}-message`;

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
  }

  openWithConfig<TData>(
    config: AerisConfirmDialogResolvedConfig<TData>,
    ref: AerisConfirmDialogRef<TData>,
  ): void {
    this.openRequest({
      id: ++this.lastRequestId,
      config,
      ref,
    } as unknown as AerisConfirmDialogRequest);
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
    this.dialog()?.focus(options);
  }

  protected handleShown(event: AerisDialogVisibilityChangeEvent): void {
    const shownEvent = this.actionEvent(event.originalEvent);
    this.shown.emit(shownEvent);
    this.activeRequest()?.ref.notifyShown(shownEvent);
  }

  protected handleHidden(event: AerisDialogVisibilityChangeEvent): void {
    const result = this.pendingResult ?? 'dismiss';
    const reason = this.pendingReason === 'api' ? event.reason : this.pendingReason;
    const originalEvent = this.pendingOriginalEvent ?? event.originalEvent;
    const closeEvent: AerisConfirmDialogCloseEvent = {
      ...this.actionEvent(originalEvent),
      result,
      reason,
    };
    const ref = this.activeRequest()?.ref;

    this.visible.set(false);
    this.pendingResult = null;
    this.pendingReason = 'api';
    this.pendingOriginalEvent = null;
    this.activeRequest.set(null);
    this.closed.emit(closeEvent);
    ref?.notifyClosed(closeEvent);
  }

  private openRequest(request: AerisConfirmDialogRequest): void {
    this.pendingResult = null;
    this.pendingReason = 'api';
    this.pendingOriginalEvent = null;
    this.activeRequest.set(request);
    request.ref.attach({
      accept: (originalEvent) => this.accept(originalEvent),
      reject: (originalEvent) => this.reject(originalEvent),
      close: (originalEvent) => this.close(originalEvent),
      focus: (options) => this.focus(options),
    });
    this.visible.set(true);
  }

  private closeWithResult(
    result: AerisConfirmDialogResult,
    reason: AerisDialogCloseReason | 'accept' | 'reject',
    originalEvent: Event | null,
  ): void {
    this.pendingResult = result;
    this.pendingReason = reason;
    this.pendingOriginalEvent = originalEvent;
    this.dialog()?.hide(originalEvent, reason === 'accept' || reason === 'reject' ? 'api' : reason);
  }

  private actionEvent(originalEvent: Event | null): AerisConfirmDialogActionEvent {
    const settings = this.settings();
    return {
      originalEvent,
      data: settings.data,
      config: settings,
    };
  }
}

export const AerisConfirmDialogModule = [
  AerisConfirmDialog,
  AerisConfirmDialogIconTemplate,
  AerisConfirmDialogMessageTemplate,
  AerisConfirmDialogFooterTemplate,
  AerisConfirmDialogHeadlessTemplate,
] as const;
