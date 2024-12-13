import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackerComponent } from './stacker.component';

describe('StackerComponent', () => {
  let component: StackerComponent;
  let fixture: ComponentFixture<StackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
