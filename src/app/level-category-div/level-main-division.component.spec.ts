import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelMainDivisionComponent } from './level-main-division.component';

describe('LevelCategoryDivComponent', () => {
  let component: LevelMainDivisionComponent;
  let fixture: ComponentFixture<LevelMainDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelMainDivisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelMainDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
