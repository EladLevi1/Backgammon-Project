import { TestBed } from '@angular/core/testing';

import { GlobalChatSocketIoService } from './global-chat-socket-io.service';

describe('GlobalChatSocketIoService', () => {
  let service: GlobalChatSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalChatSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
