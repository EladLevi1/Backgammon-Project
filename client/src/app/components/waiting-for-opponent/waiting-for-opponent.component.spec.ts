import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingForOpponentComponent } from './waiting-for-opponent.component';

describe('WaitingForOpponentComponent', () => {
  let component: WaitingForOpponentComponent;
  let fixture: ComponentFixture<WaitingForOpponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingForOpponentComponent]
    });
    fixture = TestBed.createComponent(WaitingForOpponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
