import { TestBed } from '@angular/core/testing';

import { ContentEditorService } from './content-editor.service';

describe('ContentEditorService', () => {
  let service: ContentEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
