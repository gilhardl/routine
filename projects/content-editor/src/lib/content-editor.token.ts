import { InjectionToken } from '@angular/core';
import { EditorConfig } from '@editorjs/editorjs';

export const EDITOR_CONFIG = new InjectionToken<EditorConfig>('EDITOR_CONFIG');