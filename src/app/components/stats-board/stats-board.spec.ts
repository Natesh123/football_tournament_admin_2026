import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsBoard } from './stats-board';

describe('StatsBoard', () => {
  let component: StatsBoard;
  let fixture: ComponentFixture<StatsBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
