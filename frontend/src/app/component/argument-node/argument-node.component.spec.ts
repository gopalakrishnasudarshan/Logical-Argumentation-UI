import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgumentNodeComponent } from './argument-node.component';

describe('ArgumentNodeComponent', () => {
  let component: ArgumentNodeComponent;
  let fixture: ComponentFixture<ArgumentNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgumentNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgumentNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
