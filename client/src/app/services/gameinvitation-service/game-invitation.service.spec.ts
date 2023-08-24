import { TestBed } from '@angular/core/testing';

import { GameInvitationService } from './game-invitation.service';

describe('GameInvitationService', () => {
  let service: GameInvitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameInvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
