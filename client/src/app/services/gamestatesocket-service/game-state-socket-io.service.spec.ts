import { TestBed } from '@angular/core/testing';

import { GameStateSocketIoService } from './game-state-socket-io.service';

describe('GameStateSocketIoService', () => {
  let service: GameStateSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
