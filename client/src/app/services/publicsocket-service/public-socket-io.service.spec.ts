import { TestBed } from '@angular/core/testing';

import { PublicSocketIoService } from './public-socket-io.service';

describe('PublicSocketIoService', () => {
  let service: PublicSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
