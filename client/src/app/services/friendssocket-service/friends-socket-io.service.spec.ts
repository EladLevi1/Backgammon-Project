import { TestBed } from '@angular/core/testing';

import { FriendsSocketIoService } from './friends-socket-io.service';

describe('FriendsSocketIoService', () => {
  let service: FriendsSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendsSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
