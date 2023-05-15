import { ApplicationRef, Inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, filter, of, switchMap, take, tap } from 'rxjs';
import EditorJS, { API, EditorConfig, OutputData } from '@editorjs/editorjs';

import { EDITOR_CONFIG } from '../content-editor.token';

@Injectable({
  providedIn: 'root'
})
export class ContentEditorService {
  /**
   * Internal map used to store `BehaviorSubjects` of `EditorJS` instances and their readiness and save states and last changes
   */
  private readonly subjects: {
    editors: {
      [key: string]: BehaviorSubject<EditorJS | undefined>;
    },
    readyStates: {
      [key: string]: BehaviorSubject<boolean>;
    },
    savedStates: {
      [key: string]: BehaviorSubject<boolean>;
    },
    lastChanges: {
      [key: string]: BehaviorSubject<OutputData>;
    };
  } = {
      editors: {},
      readyStates: {},
      savedStates: {},
      lastChanges: {}
    };

  constructor(
    @Inject(EDITOR_CONFIG) private config: EditorConfig,
    private zone: NgZone,
    private appRef: ApplicationRef
  ) { }

  /**
   * Creates a new `EditorJS` instance outside of the Angular zone and then adds it to the editor instances map.
   */
  async createInstance(config: EditorConfig): Promise<void> {
    const editorConfig: EditorConfig = {
      ...this.config,
      ...config,
    };

    // Bind the editor onChange method from the config, otherwise use the local createOnChange method
    editorConfig.onChange =
      editorConfig.onChange && typeof editorConfig.onChange === 'function'
        ? editorConfig.onChange
        : this.createOnChange.call(this, editorConfig.holder as string);

    // Bind the editor onReady method from the config, otherwise use the local createOnReady method
    editorConfig.onReady =
      editorConfig.onReady && typeof editorConfig.onReady === 'function'
        ? editorConfig.onReady
        : this.createOnReady.call(this, editorConfig.holder as string);

    await this.zone.runOutsideAngular(async () => {
      const editor = new EditorJS(editorConfig);
      const holder = editorConfig.holder as string;

      await editor.isReady;
      await this.zone.run(async () => {
        if (!this.subjects.readyStates[holder]) this.subjects.readyStates[holder] = new BehaviorSubject<boolean>(false);
        else this.subjects.readyStates[holder].next(false);

        if (!this.subjects.savedStates[holder]) this.subjects.savedStates[holder] = new BehaviorSubject<boolean>(false);
        else this.subjects.savedStates[holder].next(false);

        const defaultOutputData = { time: 0, version: EditorJS.version ?? '', blocks: [] };
        if (!this.subjects.lastChanges[holder]) this.subjects.lastChanges[holder] = new BehaviorSubject<OutputData>(editorConfig.data ?? defaultOutputData);
        else this.subjects.lastChanges[holder].next(editorConfig.data ?? defaultOutputData);

        if (!this.subjects.editors[holder]) this.subjects.editors[holder] = new BehaviorSubject<EditorJS | undefined>(editor);
        else this.subjects.editors[holder].next(editor);

        this.subjects.readyStates[holder].next(true);
        this.appRef.tick();
      });
    });
  }

  /**
   * Calls the `save` method on the `EditorJS` instance with given holder and sets the result as current value of the service
   */
  save(holder: string): Observable<{
    holder: string;
    method: string;
    namespace?: string;
    result: OutputData;
  }> {
    return this.apiCall(holder, 'saver', 'save').pipe(
      tap((response: {
        holder: string;
        method: string;
        namespace?: string;
        result: OutputData;
      }) => {
        this.subjects.savedStates[holder].next(true);
        this.subjects.lastChanges[holder].next(response.result);
      })
    );
  }

  /**
   * Calls the `clear` method on the `EditorJS` instance with given holder.
   */
  clear(holder: string, skipSave = false): Observable<{
    holder: string;
    method: string;
    namespace?: string;
    result: OutputData;
  }> {
    return this.apiCall<OutputData>(holder, 'blocks', 'clear').pipe(
      switchMap(response => (skipSave ? of(response) : this.save(holder)))
    );
  }

  /**
   * Gets the `EditorJS` instance for the given holder and calls the render method if blocks
   * are passed.
   */
  update(holder: string, data?: OutputData, skipSave = false): Observable<{
    holder: string;
    method: string;
    namespace?: string;
    result: OutputData;
  }> {
    return this.apiCall(holder, 'blocks', 'render', {
      time: (data && data.time) || Date.now(),
      version: (data && data.version) ?? EditorJS.version ?? '',
      blocks: [...(data?.blocks ?? [])]
    }).pipe(
      switchMap(response => (skipSave ? of(response) : this.save(holder)))
    );
  }

  /**
   * Subscribe to the `isReady` state change for the `EditorJS` instance with given holder
   */
  isReady(holder: string): Observable<boolean> {
    if (!this.subjects.readyStates[holder]) {
      this.subjects.readyStates[holder] = new BehaviorSubject<boolean>(false);
    }
    return this.subjects.readyStates[holder].asObservable();
  }

  /**
   * Subscribe to the `lastChange` state change for the `EditorJS` instance with given holder
   */
  lastChange(holder: string): Observable<OutputData> {
    if (!this.subjects.lastChanges[holder]) {
      this.subjects.lastChanges[holder] = new BehaviorSubject<OutputData>({
        time: 0,
        blocks: [],
        version: EditorJS.version ?? ''
      });
    }
    return this.subjects.lastChanges[holder].pipe(
      distinctUntilChanged((a, b) => (b != undefined && b.time != undefined && b.time === 0) || (a != undefined && b && a.time != undefined && a.time === b.time)),
      filter(change => typeof change !== 'undefined')
    ) as Observable<OutputData>;
  }

  /**
   * Subscribe to the `hasSaved` state change for the `EditorJS` instance with given holder
   */
  hasSaved(holder: string): Observable<boolean> {
    if (!this.subjects.savedStates[holder]) {
      this.subjects.savedStates[holder] = new BehaviorSubject<boolean>(false);
    }
    return this.subjects.savedStates[holder].asObservable();
  }

  /**
   * Destroys a single instance of `EditorJS` and all the subject values created for them
   */
  destroyInstance(holder: string): void {
    this.getEditor(holder)
      .pipe(take(1))
      .subscribe(editor => {
        this.zone.runOutsideAngular(() => {
          editor.destroy();
          this.zone.run(() => {
            this.cleanupSubjects(holder);
            this.appRef.tick();
          });
        });
      });
  }

  /**
   * Returns the underlying `EditorJS` instance
   */
  private getEditor(holder: string): Observable<EditorJS> {
    if (!this.subjects.editors[holder]) {
      this.subjects.editors[holder] = new BehaviorSubject<EditorJS | undefined>(undefined);
    }
    return this.subjects.editors[holder].pipe(filter(editor => typeof editor !== 'undefined')) as Observable<EditorJS>;
  }

  /**
   * A helper method to make calls to the `EditorJS`API } of any instance.
   * The first argument is an object that you must pass the `method` name, and the `holder` ID of the container.
   * An optional `namespace` can be added for API calls such as `blocks`, `caret`, etc.
   *
   * The second argument is any additional arguments as required by the API.
   *
   * @remarks
   * Unlike other methods an API call be made with a `.subscribe`, the result will be an observable value.
   * If the value is a Promise it will be resolved first
   */
  private apiCall<T = any>(holder: string, namespace: string | undefined, method: string, ...args: any[]): Observable<{
    holder: string;
    method: string;
    namespace?: string;
    result: T;
  }> {
    return this.getEditor(holder).pipe(
      switchMap(async editor => {
        let result = { holder, method, namespace, result: {} as T };

        await this.zone.runOutsideAngular(async () => {
          let handler: any;
          if (!namespace) {
            //@ts-ignore
            handler = editor[method];
          } else {
            //@ts-ignore
            handler = editor[namespace][method];
          }
          if (!handler) {
            throw new Error(`No method ${method} ${namespace ? 'in ' + namespace : ''}`);
          }

          const methodCall = handler.call(editor, ...args);
          await this.zone.run(async () => {
            if (!methodCall || (methodCall && !methodCall.then)) {
              result = {
                ...result,
                result: typeof methodCall === 'undefined' ? {} : methodCall
              };
            } else {
              const r = await methodCall;
              result = { ...result, result: r };
            }
          });
        });

        return result;
      })
    );
  }

  /**
   * Internal method to create an default onChange method for `EditorJS`
   */
  private createOnChange(holder: string): (api: API, event: CustomEvent<any>) => void {
    if (!this.subjects.lastChanges[holder]) {
      this.subjects.lastChanges[holder] = new BehaviorSubject<OutputData>({ blocks: [] });
    }

    return async (api: API, event: CustomEvent<any>) => {
      const data = await api.saver.save();
      if (data) {
        this.subjects.lastChanges[holder].next(data);
      }
    };
  }

  /**
   * Internal method to create an default onReady method for `EditorJS`
   */
  private createOnReady(holder: string): () => void {
    if (!this.subjects.readyStates[holder]) {
      this.subjects.readyStates[holder] = new BehaviorSubject<boolean>(false);
    }

    return () => {
      if (!this.subjects.readyStates[holder].value) {
        this.subjects.readyStates[holder].next(true);
      }
    };
  }

  /**
   * Sets up the `BehaviorSubject` values when an `EditorJS` instance is created.  All the subjects are first created and set
   * to default values.
   * Once an `EditorJS` instance is ready these values can provide change and save state information
   */
  private async setupSubjects(holder: string): Promise<void> {

  }

  /**
   * Handles cleaning up all the `BehaviorSubject` values once an `EditorJS` instance has been destroyed
  */
  private cleanupSubjects(holder: string) {
    if (this.subjects.readyStates[holder]) {
      this.subjects.readyStates[holder].complete();
      delete this.subjects.readyStates[holder];
    }

    if (this.subjects.savedStates[holder]) {
      this.subjects.savedStates[holder].complete();
      delete this.subjects.savedStates[holder];
    }

    if (this.subjects.lastChanges[holder]) {
      this.subjects.lastChanges[holder].complete();
      delete this.subjects.lastChanges[holder];
    }

    if (this.subjects.editors[holder]) {
      this.subjects.editors[holder].complete();
      delete this.subjects.editors[holder];
    }
  }
}
