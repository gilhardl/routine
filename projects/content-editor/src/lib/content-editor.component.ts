import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, map, take, takeUntil } from 'rxjs';
import { EditorConfig, OutputBlockData, OutputData, SanitizerConfig } from '@editorjs/editorjs';

import { DEFAULT_HOLDER_ID, createEditorConfig } from './editor-config';
import { ContentEditorService } from './content-editor.service';
import { EDITOR_CONFIG } from './content-editor.token';
import { Content } from './content.interface';

@Component({
  selector: 'content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ContentEditorComponent),
    multi: true
  }]
})
export class ContentEditorComponent implements OnDestroy, AfterContentInit, ControlValueAccessor {

  /**
   * The HTML element reference to the `EditorJS` container
   */
  @ViewChild('contentEditor', { read: ElementRef, static: true }) private elementRef!: ElementRef<HTMLDivElement>;

  /**
   * Initial set of block data to render inside the component
   */
  @Input() content?: Content;

  /**
   * ID of the element where `EditorJS` will be appended
   */
  @Input() holder: string;

  /**
   * If true, set caret at the first Block after Editor is ready
   */
  @Input() autofocus?: boolean;

  /**
   * Type of the block used as default. If not specified, Paragraph Tool will be used.
   * This needs to match a name of a provided Tool.
   */
  @Input() defaultBlock?: string;

  /**
   * First Block placeholder
   */
  @Input() placeholder?: string | false;

  /**
   * The configuration for the HTML sanitizer
   */
  @Input() sanitizer?: SanitizerConfig;

  /**
   * If true, toolbar won't be shown
   */
  @Input() hideToolbar?: boolean;

  /**
   * Height of Editor's bottom area that allows to set focus on the last Block
   */
  @Input() minHeight?: number;;

  /**
   * Emits if the `EditorJS` component is ready
   */
  @Output() isReady = new EventEmitter<boolean>();

  /**
   * Emits if the component is focused
   */
  @Output() isFocused = new EventEmitter<boolean>();

  /**
   * Emits if the component has been touched
   */
  @Output() touch = new EventEmitter();

  /**
   * Emits if the `EditorJS` content has changed when `save` is called
   */
  @Output() change = new EventEmitter<Content>();

  /**
   * Emits if the content from the `EditorJS` instance has been saved to the component value
   */
  @Output() save = new EventEmitter<boolean>();

  /**
   * Form field value if used as a field component
   */
  private _value: OutputData | undefined;

  /**
   * Component Destroy subject, in your component `ngOnDestroy` method call `.next(true)`
   * and then `.complete()` on the `this.onDestroy$` subject
   */
  private readonly onDestroy$ = new Subject<boolean>();

  constructor(
    @Inject(EDITOR_CONFIG) private defaultConfig: EditorConfig,
    private service: ContentEditorService,
    private focusMonitor: FocusMonitor,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.holder ??= this.defaultConfig.holder as string || DEFAULT_HOLDER_ID;
    this.autofocus ??= this.defaultConfig.autofocus;
    this.defaultBlock ??= this.defaultConfig.defaultBlock;
    this.placeholder ??= this.defaultConfig.placeholder;
    this.sanitizer ??= this.defaultConfig.sanitizer;
    this.hideToolbar ??= this.defaultConfig.hideToolbar;
    this.minHeight ??= this.defaultConfig.minHeight;
  }

  /**
   * Create the `EditorJS` instance, set up the focus monitor and subscriptions to editor service observables
   */
  async ngAfterContentInit(): Promise<void> {
    await this.service.createInstance(
      createEditorConfig({
        holder: this.holder,
        autofocus: this.autofocus,
        defaultBlock: this.defaultBlock,
        placeholder: this.placeholder,
        sanitizer: this.sanitizer,
        hideToolbar: this.hideToolbar,
        minHeight: this.minHeight,
      }, this.content?.blocks)
    );
    this.changeDetectorRef.markForCheck();

    this.service
      .isReady(this.holder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isReady => {
        this.isReady.emit(isReady);
      });

    this.service
      .hasChanged(this.holder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(change => {
        this.change.emit({
          blocks: change.blocks
        });
      });

    this.service
      .hasSaved(this.holder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(saved => {
        this.save.emit(saved);
      });

    this.focusMonitor.monitor(this.elementRef.nativeElement, true).pipe(
      map(origin => !!origin),
      takeUntil(this.onDestroy$)
    ).subscribe((focused) => {
      this.isFocused.emit(focused);
      this.onTouch();
    });
  }

  /**
   * Angular Form onTouch method, this is a default method that updates
   * the touch status on the component
   */
  onTouch(event?: MouseEvent): void {
    this.touch.emit();
  }

  /**
   * Angular Form onChange method, this is a default method that updates the
   * editor instance with blocks on change
   */
  onChange(data: Content): void {
    this.writeValue(data);
  }

  /**
   * Angular Forms value writer, updates the editor
   * @param data The data to write
   */
  writeValue(data: Content): void {
    this._value = data;
    this.service
      .update(this.holder, data)
      .pipe(take(1))
      .subscribe();
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Angular Forms registerOnChange
   */
  registerOnChange(fn: (change: Content) => void): void {
    this.onChange = fn;
  }

  /**
   * Angular Forms registerOnTouched
   */
  registerOnTouched(fn: (event?: MouseEvent) => void): void {
    this.onTouch = fn;
  }

  /**
   * Stop monitoring the element, stop service subscriptions by completing the onDestroy$ subject, complete component Outputs then destroy `EditorJS` instance
   */
  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    if (!this.onDestroy$.closed) {
      this.onDestroy$.next(true);
      this.onDestroy$.complete();
    }
    this.isReady.complete();
    this.isFocused.complete();
    this.touch.complete();
    this.change.complete();
    this.save.complete();
    this.service.destroyInstance(this.holder);
  }
}
