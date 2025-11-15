import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentInfoBoxComponent } from './argument-info-box.component';

describe('ArgumentInfoBoxComponent', () => {
  let component: ArgumentInfoBoxComponent;
  let fixture: ComponentFixture<ArgumentInfoBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgumentInfoBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArgumentInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
