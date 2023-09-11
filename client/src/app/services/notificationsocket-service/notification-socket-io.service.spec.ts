import { TestBed } from '@angular/core/testing';

import { NotificationSocketIoService } from './notification-socket-io.service';

describe('NotificationSocketIoService', () => {
  let service: NotificationSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
