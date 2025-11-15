import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentViewArgsmeComponent } from './argument-view-argsme.component';

describe('ArgumentViewArgsmeComponent', () => {
  let component: ArgumentViewArgsmeComponent;
  let fixture: ComponentFixture<ArgumentViewArgsmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgumentViewArgsmeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArgumentViewArgsmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
