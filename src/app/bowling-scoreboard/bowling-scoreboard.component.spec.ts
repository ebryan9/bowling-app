import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BowlingScoreboardComponent } from './bowling-scoreboard.component';

describe('BowlingScoreboardComponent', () => {
  let component: BowlingScoreboardComponent;
  let fixture: ComponentFixture<BowlingScoreboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BowlingScoreboardComponent]
    });
    fixture = TestBed.createComponent(BowlingScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
