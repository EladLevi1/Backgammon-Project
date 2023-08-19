import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logregGuard } from './logreg.guard';

describe('logregGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logregGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
