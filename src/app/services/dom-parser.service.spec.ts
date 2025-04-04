import { TestBed } from '@angular/core/testing';

import { DomParserService } from './dom-parser.service';

describe('DomParserService', () => {
  let service: DomParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
