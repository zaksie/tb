import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpClanRunsComponent } from './cp-clan-runs.component';

describe('CpClanRunsComponent', () => {
  let component: CpClanRunsComponent;
  let fixture: ComponentFixture<CpClanRunsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpClanRunsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpClanRunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
