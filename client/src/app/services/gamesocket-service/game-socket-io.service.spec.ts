import { TestBed } from '@angular/core/testing';

import { GameSocketIoService } from './game-socket-io.service';

describe('GameSocketIoService', () => {
  let service: GameSocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
