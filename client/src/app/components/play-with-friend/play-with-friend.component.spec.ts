import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayWithFriendComponent } from './play-with-friend.component';

describe('PlayWithFriendComponent', () => {
  let component: PlayWithFriendComponent;
  let fixture: ComponentFixture<PlayWithFriendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayWithFriendComponent]
    });
    fixture = TestBed.createComponent(PlayWithFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
