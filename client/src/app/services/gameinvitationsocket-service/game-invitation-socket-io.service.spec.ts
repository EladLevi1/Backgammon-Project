import { TestBed } from '@angular/core/testing';

import { GameInvitationSocketIoService } from './game-invitation-socket-io.service';

describe('GameInvitationSocketIoService', () => {
  let service: GameInvitationSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameInvitationSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
