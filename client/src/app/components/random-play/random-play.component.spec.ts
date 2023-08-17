import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomPlayComponent } from './random-play.component';

describe('RandomPlayComponent', () => {
  let component: RandomPlayComponent;
  let fixture: ComponentFixture<RandomPlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RandomPlayComponent]
    });
    fixture = TestBed.createComponent(RandomPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
