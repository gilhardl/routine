import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorConfig } from '@editorjs/editorjs';

import { createEditorConfig } from './editor-config';
import { EDITOR_CONFIG } from './content-editor.token';
import { ContentEditorComponent } from './content-editor.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ContentEditorComponent
  ],
  providers: [
    {
      provide: EDITOR_CONFIG,
      useValue: createEditorConfig(),
    },
  ],
  exports: [
    ContentEditorComponent
  ]
})
export class ContentEditorModule {
  static forChild(@Optional() config?: EditorConfig): ModuleWithProviders<ContentEditorModule> {
    return {
      ngModule: ContentEditorModule,
      providers: [
        {
          provide: EDITOR_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
