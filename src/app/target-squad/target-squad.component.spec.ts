import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSquadComponent } from './target-squad.component';

describe('TargetSquadComponent', () => {
  let component: TargetSquadComponent;
  let fixture: ComponentFixture<TargetSquadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetSquadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetSquadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
