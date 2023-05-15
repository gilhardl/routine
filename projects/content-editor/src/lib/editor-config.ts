import EditorJS, { EditorConfig, OutputBlockData } from '@editorjs/editorjs';

/**
 * The default holder ID for `EditorJS` containers
 */
export const DEFAULT_HOLDER_ID = 'content-editor';

/**
 * Creates an `EditorJS` configuration
 */
export function createEditorConfig(config?: EditorConfig, blocks?: OutputBlockData[]): EditorConfig {
  const defaultConfig: EditorConfig = {
    holder: DEFAULT_HOLDER_ID,
    data: blocks && blocks.length > 0 ? {
      time: Date.now(),
      version: EditorJS.version || '',
      blocks: blocks
    } : undefined,
  };

  return {
    ...defaultConfig,
    ...config
  };
}