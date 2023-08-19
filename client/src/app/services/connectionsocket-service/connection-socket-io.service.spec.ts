import { TestBed } from '@angular/core/testing';

import { ConnectionSocketIoService } from './connection-socket-io.service';

describe('ConnectionSocketIoService', () => {
  let service: ConnectionSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
