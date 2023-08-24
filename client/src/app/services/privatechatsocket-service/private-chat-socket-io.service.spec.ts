import { TestBed } from '@angular/core/testing';

import { PrivateChatSocketIoService } from './private-chat-socket-io.service';

describe('PrivateChatSocketIoService', () => {
  let service: PrivateChatSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateChatSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
