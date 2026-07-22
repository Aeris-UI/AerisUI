import { DOCUMENT, NgComponentOutlet } from '@angular/common';
import {
  ApplicationRef,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  InjectionToken,
  Injector,
  Service,
  Type,
  computed,
  createComponent,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';

import {
  AerisDialog,
  type AerisDialogCloseReason,
  type AerisDialogPosition,
  type AerisDialogSize,
  type AerisDialogVisibilityChangeEvent,
} from '@aeris-ui/core/dialog';

export interface AerisDynamicDialogConfig<TData = unknown> {
  readonly header?: string;
  readonly data?: TData;
  readonly inputValues?: Record<string, unknown>;
  readonly modal?: boolean;
  readonly backdrop?: boolean;
  readonly backdropBlur?: boolean;
  readonly backdropBlurAmount?: string;
  readonly dismissibleMask?: boolean;
  readonly closeOnEscape?: boolean;
  readonly closable?: boolean;
  readonly maximizable?: boolean;
  readonly maximized?: boolean;
  readonly draggable?: boolean;
  readonly resizable?: boolean;
  readonly blockScroll?: boolean;
  readonly focusTrap?: boolean;
  readonly restoreFocus?: boolean;
  readonly autoFocus?: boolean;
  readonly initialFocus?: string;
  readonly position?: AerisDialogPosition;
  readonly size?: AerisDialogSize;
  readonly width?: string;
  readonly minWidth?: string;
  readonly maxWidth?: string;
  readonly height?: string;
  readonly maxHeight?: string;
  readonly mobileWidth?: string;
  readonly closeAriaLabel?: string;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
  readonly ariaDescribedBy?: string;
}

export interface AerisDynamicDialogResolvedConfig<TData = unknown> {
  readonly header: string;
  readonly data: TData | undefined;
  readonly inputValues: Record<string, unknown>;
  readonly modal: boolean;
  readonly backdrop: boolean;
  readonly backdropBlur: boolean;
  readonly backdropBlurAmount: string;
  readonly dismissibleMask: boolean;
  readonly closeOnEscape: boolean;
  readonly closable: boolean;
  readonly maximizable: boolean;
  readonly maximized: boolean;
  readonly draggable: boolean;
  readonly resizable: boolean;
  readonly blockScroll: boolean;
  readonly focusTrap: boolean;
  readonly restoreFocus: boolean;
  readonly autoFocus: boolean;
  readonly initialFocus: string;
  readonly position: AerisDialogPosition;
  readonly size: AerisDialogSize;
  readonly width: string;
  readonly minWidth: string;
  readonly maxWidth: string;
  readonly height: string;
  readonly maxHeight: string;
  readonly mobileWidth: string;
  readonly closeAriaLabel: string;
  readonly ariaLabel: string;
  readonly ariaLabelledBy: string;
  readonly ariaDescribedBy: string;
}

export interface AerisDynamicDialogShowEvent {
  readonly originalEvent: Event | null;
}

export interface AerisDynamicDialogCloseEvent<TResult = unknown> {
  readonly originalEvent: Event | null;
  readonly reason: AerisDialogCloseReason;
  readonly result: TResult | undefined;
}

export interface AerisDynamicDialogSubscription {
  unsubscribe(): void;
}

export interface AerisDynamicDialogSubscribable<T> {
  subscribe(next: (event: T) => void): AerisDynamicDialogSubscription;
}

export const AERIS_DYNAMIC_DIALOG_CONFIG = new InjectionToken<
  AerisDynamicDialogResolvedConfig
>('AERIS_DYNAMIC_DIALOG_CONFIG');

export const AERIS_DYNAMIC_DIALOG_DATA = new InjectionToken<unknown>(
  'AERIS_DYNAMIC_DIALOG_DATA',
);

interface AerisDynamicDialogRefController<TResult> {
  readonly close: (result: TResult | undefined, originalEvent: Event | null) => void;
  readonly destroy: () => void;
  readonly focus: (options?: FocusOptions) => void;
  readonly maximize: () => void;
  readonly restore: () => void;
  readonly toggleMaximized: () => void;
}

class AerisDynamicDialogEventStream<T> implements AerisDynamicDialogSubscribable<T> {
  private readonly listeners = new Set<(event: T) => void>();
  private completed = false;

  subscribe(next: (event: T) => void): AerisDynamicDialogSubscription {
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

export class AerisDynamicDialogRef<TResult = unknown> {
  private readonly closedStream = new AerisDynamicDialogEventStream<
    AerisDynamicDialogCloseEvent<TResult>
  >();
  private readonly shownStream = new AerisDynamicDialogEventStream<AerisDynamicDialogShowEvent>();
  private controller: AerisDynamicDialogRefController<TResult> | null = null;
  private closedOnce = false;

  readonly closed: AerisDynamicDialogSubscribable<AerisDynamicDialogCloseEvent<TResult>> =
    this.closedStream;
  readonly shown: AerisDynamicDialogSubscribable<AerisDynamicDialogShowEvent> = this.shownStream;

  close(result?: TResult, originalEvent: Event | null = null): void {
    if (this.closedOnce) return;
    this.controller?.close(result, originalEvent);
  }

  destroy(): void {
    if (this.closedOnce) return;
    this.closedOnce = true;
    this.controller?.destroy();
    this.closedStream.complete();
    this.shownStream.complete();
    this.controller = null;
  }

  focus(options?: FocusOptions): void {
    this.controller?.focus(options);
  }

  maximize(): void {
    this.controller?.maximize();
  }

  restore(): void {
    this.controller?.restore();
  }

  toggleMaximized(): void {
    this.controller?.toggleMaximized();
  }

  attach(controller: AerisDynamicDialogRefController<TResult>): void {
    this.controller = controller;
  }

  notifyShown(event: AerisDynamicDialogShowEvent): void {
    if (this.closedOnce) return;
    this.shownStream.next(event);
  }

  notifyClosed(event: AerisDynamicDialogCloseEvent<TResult>): void {
    if (this.closedOnce) return;
    this.closedOnce = true;
    this.closedStream.next(event);
    this.closedStream.complete();
    this.shownStream.complete();
    this.controller = null;
  }
}

@Component({
  selector: 'aeris-dynamic-dialog-host',
  imports: [AerisDialog, NgComponentOutlet],
  template: `
    <aeris-dialog
      #dialog
      [header]="settings().header"
      [modal]="settings().modal"
      [backdrop]="settings().backdrop"
      [backdropBlur]="settings().backdropBlur"
      [backdropBlurAmount]="settings().backdropBlurAmount"
      [dismissibleMask]="settings().dismissibleMask"
      [closeOnEscape]="settings().closeOnEscape"
      [closable]="settings().closable"
      [maximizable]="settings().maximizable"
      [(maximized)]="maximized"
      [draggable]="settings().draggable"
      [resizable]="settings().resizable"
      [blockScroll]="settings().blockScroll"
      [focusTrap]="settings().focusTrap"
      [restoreFocus]="settings().restoreFocus"
      [autoFocus]="settings().autoFocus"
      [initialFocus]="settings().initialFocus"
      [position]="settings().position"
      [size]="settings().size"
      [width]="settings().width"
      [minWidth]="settings().minWidth"
      [maxWidth]="settings().maxWidth"
      [height]="settings().height"
      [maxHeight]="settings().maxHeight"
      [mobileWidth]="settings().mobileWidth"
      [closeAriaLabel]="settings().closeAriaLabel"
      [ariaLabel]="settings().ariaLabel"
      [ariaLabelledBy]="settings().ariaLabelledBy"
      [ariaDescribedBy]="settings().ariaDescribedBy"
      [visible]="visible()"
      (shown)="handleShown($event)"
      (hidden)="handleHidden($event)"
    >
      <ng-container
        [ngComponentOutlet]="componentType()"
        [ngComponentOutletInputs]="settings().inputValues"
        [ngComponentOutletInjector]="contentInjector()"
      />
    </aeris-dialog>
  `,
  host: {
    class: 'aeris-dynamic-dialog-host',
  },
})
export class AerisDynamicDialogHost {
  readonly componentType = input.required<Type<unknown>>();
  readonly contentInjector = input.required<Injector>();
  readonly config = input.required<AerisDynamicDialogResolvedConfig>();
  readonly dialogRef = input.required<AerisDynamicDialogRef>();

  protected readonly dialog = viewChild<AerisDialog>('dialog');
  protected readonly visible = signal(true);
  protected readonly settings = computed(() => this.config());
  protected readonly maximized = linkedSignal(() => this.settings().maximized);
  private closeResult: unknown;

  closeWithResult(result: unknown, originalEvent: Event | null): void {
    this.closeResult = result;
    this.dialog()?.hide(originalEvent, 'api');
  }

  focus(options?: FocusOptions): void {
    this.dialog()?.focus(options);
  }

  maximize(): void {
    this.dialog()?.maximize();
  }

  restore(): void {
    this.dialog()?.restore();
  }

  toggleMaximized(): void {
    this.dialog()?.toggleMaximized();
  }

  protected handleShown(event: AerisDialogVisibilityChangeEvent): void {
    queueMicrotask(() => this.dialogRef().notifyShown({ originalEvent: event.originalEvent }));
  }

  protected handleHidden(event: AerisDialogVisibilityChangeEvent): void {
    this.visible.set(false);
    this.dialogRef().notifyClosed({
      originalEvent: event.originalEvent,
      reason: event.reason,
      result: this.closeResult,
    });
  }
}

@Service()
export class AerisDynamicDialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly activeRefs = new Set<AerisDynamicDialogRef<unknown>>();

  open<TComponent, TData = unknown, TResult = unknown>(
    componentType: Type<TComponent>,
    config: AerisDynamicDialogConfig<TData> = {},
  ): AerisDynamicDialogRef<TResult> {
    const resolvedConfig = this.resolveConfig(config);
    const ref = new AerisDynamicDialogRef<TResult>();
    const contentInjector = Injector.create({
      parent: this.environmentInjector,
      providers: [
        { provide: AerisDynamicDialogRef, useValue: ref },
        { provide: AERIS_DYNAMIC_DIALOG_CONFIG, useValue: resolvedConfig },
        { provide: AERIS_DYNAMIC_DIALOG_DATA, useValue: resolvedConfig.data },
      ],
    });
    const hostRef = createComponent(AerisDynamicDialogHost, {
      environmentInjector: this.environmentInjector,
    });
    const cleanup = (): void => {
      if (!this.activeRefs.delete(ref as AerisDynamicDialogRef<unknown>)) return;
      this.appRef.detachView(hostRef.hostView);
      hostRef.destroy();
    };

    ref.attach({
      close: (result, originalEvent) => {
        hostRef.instance.closeWithResult(result, originalEvent);
        hostRef.changeDetectorRef.detectChanges();
      },
      destroy: cleanup,
      focus: (options) => hostRef.instance.focus(options),
      maximize: () => hostRef.instance.maximize(),
      restore: () => hostRef.instance.restore(),
      toggleMaximized: () => hostRef.instance.toggleMaximized(),
    });
    ref.closed.subscribe(() => queueMicrotask(cleanup));
    this.activeRefs.add(ref as AerisDynamicDialogRef<unknown>);

    hostRef.setInput('componentType', componentType);
    hostRef.setInput('contentInjector', contentInjector);
    hostRef.setInput('config', resolvedConfig);
    hostRef.setInput('dialogRef', ref);
    this.appRef.attachView(hostRef.hostView);
    this.document.body.appendChild(this.rootNode(hostRef));
    hostRef.changeDetectorRef.detectChanges();

    return ref;
  }

  closeAll(): void {
    for (const ref of [...this.activeRefs].reverse()) ref.close();
  }

  destroyAll(): void {
    for (const ref of [...this.activeRefs].reverse()) ref.destroy();
  }

  private resolveConfig<TData>(
    config: AerisDynamicDialogConfig<TData>,
  ): AerisDynamicDialogResolvedConfig<TData> {
    return {
      header: config.header ?? '',
      data: config.data,
      inputValues: config.inputValues ?? {},
      modal: config.modal ?? true,
      backdrop: config.backdrop ?? true,
      backdropBlur: config.backdropBlur ?? true,
      backdropBlurAmount: config.backdropBlurAmount ?? '',
      dismissibleMask: config.dismissibleMask ?? false,
      closeOnEscape: config.closeOnEscape ?? true,
      closable: config.closable ?? true,
      maximizable: config.maximizable ?? false,
      maximized: config.maximized ?? false,
      draggable: config.draggable ?? false,
      resizable: config.resizable ?? false,
      blockScroll: config.blockScroll ?? true,
      focusTrap: config.focusTrap ?? true,
      restoreFocus: config.restoreFocus ?? true,
      autoFocus: config.autoFocus ?? true,
      initialFocus: config.initialFocus ?? '',
      position: config.position ?? 'center',
      size: config.size ?? 'md',
      width: config.width ?? '',
      minWidth: config.minWidth ?? '',
      maxWidth: config.maxWidth ?? '',
      height: config.height ?? '',
      maxHeight: config.maxHeight ?? '',
      mobileWidth: config.mobileWidth ?? '',
      closeAriaLabel: config.closeAriaLabel ?? 'Close dialog',
      ariaLabel: config.ariaLabel ?? '',
      ariaLabelledBy: config.ariaLabelledBy ?? '',
      ariaDescribedBy: config.ariaDescribedBy ?? '',
    };
  }

  private rootNode(hostRef: ComponentRef<AerisDynamicDialogHost>): Node {
    const [node] = (hostRef.hostView as EmbeddedViewRef<unknown>).rootNodes;
    return node instanceof Node ? node : this.document.createTextNode('');
  }
}

export const AerisDynamicDialogModule = [AerisDynamicDialogHost] as const;
