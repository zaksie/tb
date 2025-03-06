import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChestCounterComponent } from './chest-counter.component';

describe('ChestCounterComponent', () => {
  let component: ChestCounterComponent;
  let fixture: ComponentFixture<ChestCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChestCounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChestCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
